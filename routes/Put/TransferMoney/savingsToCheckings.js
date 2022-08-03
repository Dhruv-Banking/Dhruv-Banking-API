// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../../database/pool"); // Pooling the connections to one pool
const auth = require("../../../middleware/auth/auth"); // Authenticaton

// Alowing router to accept json in the request body
router.use(express.json());

// This is the query to send money from Savings to Checkings
// It takes 3 parameters:
// @request.query.username,
// @request.body.amount,
// @request.body.password
router.put("/", auth.authenticateToken, async (req, res) => {
  // These are the variables from the request body.query
  const username = req.query.username;
  const amount = req.body.amount;
  const password = req.body.password;

  // This is the variable  to determine if we are ready to send the money
  let correctBody = true;

  // Here we are checking if the type is null (not provided) or string (user provided string)
  if (typeof amount === "string" || amount === undefined) {
    correctBody = false;
    res.status(400).send({ detail: "Can not accept string as a valid input" });
  }

  // If the amout is negative, then we can not send money, so we send bakck an error
  if (amount <= 0) {
    correctBody = false;
    res
      .status(400)
      .send({ detail: "Can not accept money if it's less than 0" });
  }

  // If the body is of correct format, then we knwo to continue to send money
  if (correctBody) {
    // check if the user exists query/values
    const existsQuery = "SELECT savings, password FROM users WHERE username=$1";
    const existsValues = [username];

    // Variable to check of the user even exists
    let userExists = true;

    // Querying the databse to check if the user exists
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
      // If err, then we send back an error
      if (err) {
        res.status(500).send({ detail: err.stack });
      } else if (sqlRes.rowCount === 0) {
        // else if it returns norhing, then we know the user does not exist.
        userExists = false;
        res.status(400).send({ detail: "Can not find user" });
      }

      // var to check if the user is logged in: Which is set to true by default
      let loggedIn = true;

      // here we are checking if !true as the retruned for 'bcrypt.compare', then we know the user is not, or logged in the reason for this:
      // is so we don't need an else statement, and we can just have a If, f
      if (!(await bcrypt.compare(password, sqlRes.rows[0].password))) {
        loggedIn = false;
        res.status(400).send({ detail: "User not authenticated" });
      }

      // Here we are checking if the user exists, and is logged in, then we know the user is ready to send money
      if (userExists && loggedIn) {
        // Var for readability
        const savingsAmount = sqlRes.rows[0].savings;

        // here we are checking if the amount the user sent is more than the total amonut in their savings
        if (amount > savingsAmount) {
          res.status(400).send({ detail: "Insufficent funds" });
        }
        // else, we know there is enough money in the account
        else {
          // Money queries to add, and subtract the money
          const moneyQuery =
            "UPDATE users SET savings=savings-$1, checkings=checkings+$2 WHERE username=$3";
          const moneyValues = [amount, amount, username];
          // Querying the database to add money to checkings, and remove the rest trom savings
          pool.query(moneyQuery, moneyValues, (sqlErr, sqlResponse) => {
            // If error, then we send back the error
            if (sqlErr) {
              res
                .status(500)
                .send({ detail: "Unknows error with transfering money" });
            }
            // else we know the query succedded.
            else {
              res.status(201).send({
                detail: `Successfully transered ${amount} from savings to checkings`,
              });
            }
          });
        }
      }
    });
  }
});

// Exporting the module so we can access it and use it from the main file
module.exports = router;
