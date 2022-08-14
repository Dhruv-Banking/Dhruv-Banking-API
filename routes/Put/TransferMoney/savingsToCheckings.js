// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../../database/pool"); // Pooling the connections to one pool
const auth = require("../../../middleware/auth/auth"); // Authenticaton
const verRole = require("../../../middleware/roles/authToken");

// Allowing router to accept json in the request body
router.use(express.json());

// This is the query to send money from Savings to Checkings
// It takes 3 parameters:
// @request.query.username,
// @request.body.amount,
// @request.body.password
router.put("/", auth.authenticateToken, verRole.savingsToChecking, async (req, res) => {
    // These are the variables from the request body.query
    const username = req.query.username;
    const amount = req.body.amount;
    const password = req.body.password;

    // Here we are checking if the type is null (not provided) or string (user provided string)
    if (typeof amount === "string" || amount === undefined) {
        res.status(400).send({detail: "Can not accept string as a valid input"});
        return;
    }

    // If the amount is negative, then we can not send money, so we send back an error
    if (amount <= 0) {
        res.status(400).send({detail: "Can not accept money if it's less than 0"});
        return;
    }

    // check if the user exists query/values
    const existsQuery = "SELECT savings, password FROM users WHERE username=$1";
    const existsValues = [username];

    // Querying the databse to check if the user exists
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
        // If err, then we send back an error
        if (err) {
            res.status(500).send({detail: err.stack});
            return;
        } else if (sqlRes.rowCount === 0) {
            // else if it returns nothing, then we know the user does not exist.
            res.status(400).send({detail: "Can not find user"});
            return;
        }

        // here we are checking if !true as the returned for 'bcrypt.compare', then we know the user is not, or logged in the reason for this:
        if (!(await bcrypt.compare(password, sqlRes.rows[0].password))) {
            res.status(400).send({detail: "User not authenticated"});
            return;
        }

        const savingsAmount = sqlRes.rows[0].savings;

        // here we are checking if the amount the user sent is more than the total amount in their savings
        if (amount > savingsAmount) {
            res.status(400).send({detail: "Insufficient funds"});
            return;
        }

        // Money queries to add, and subtract the money
        const moneyQuery = "UPDATE users SET savings=savings-$1, checkings=checkings+$2 WHERE username=$3";
        const moneyValues = [amount, amount, username];

        // Querying the database to add money to checkings, and remove the rest trom savings
        pool.query(moneyQuery, moneyValues, (sqlErr, sqlResponse) => {
            // If error, then we send back the error
            if (sqlErr) {
                res.status(500).send({detail: "Unknows error with transfering money"});
                return;
            }
            res.status(201).send({
                detail: `Successfully transered ${amount} from savings to checkings`,
            });
        });
    });
});

// Exporting the module, so we can access it and use it from the main file
module.exports = router;
