// Imports
const express = require("express"); //  Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../../database/pool"); // Pooling the connections to one pool
const auth = require("../../../middleware/auth/auth"); // Authentication
const verRole = require("../../../middleware/roles/authToken");

// Allowing our app to use json in the request body
router.use(express.json());

// This is the endpoint to send money from Checkings to Savings
// It takes 3 parameters:
// @request.query.username
// @request.body.amount
// @request.body.password
router.put("/", auth.authenticateToken, verRole.transferMoney, async (req, res) => {
    // These are the variables from the request body/query
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
    const existsQuery = "SELECT checkings, password FROM users WHERE username=$1";
    const existsValues = [username];

    // Querying the database to check if the user exists
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

        // Here we are checking for the inverse of the password, so if it returns false, then we know the user exists
        if (!(await bcrypt.compare(password, sqlRes.rows[0].password))) {
            res.status(400).send({detail: "User not authenticated"});
            return;
        }

        const checkingsAmount = sqlRes.rows[0].checkings;

        // checking is the amount is more than what we have in out checkings account
        if (amount > checkingsAmount) {
            res.status(400).send({detail: "Insufficent funds"});
            return;
        }

        // Queried to increase from savings, and to decrease it from checkings
        const moneyQuery = "UPDATE users SET checkings=checkings-$1, savings=savings+$2 WHERE username=$3";
        const moneyValues = [amount, amount, username];

        // Querying the database with the values the user provided
        pool.query(moneyQuery, moneyValues, (sqlErr, sqlResponse) => {
            // If error, then we send back an error
            if (sqlErr) {
                res.status(500).send({detail: "Unknown error with transferring money"});
                return;
            }
            res.status(201).send({
                detail: `Successfully transferred ${amount} from checkings to savings`,
            });
        });
    });
});

// Exporting the module so we can use it from the main file
module.exports = router;
