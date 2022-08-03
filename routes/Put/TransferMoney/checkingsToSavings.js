// Imports
const express = require("express"); //  Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../../database/pool"); // Pooling the connections to one pool
const auth = require("../../../middleware/auth/auth"); // Authentication

// Allowing our app to use json in the request body
router.use(express.json());

// This is the endpoint to send money from Checkings to Savings
// It takes 3 parameters:
// @request.query.username
// @request.body.amount
// @request.body.password
router.put("/", auth.authenticateToken, async (req, res) => {
  // These are the variables from the request body/query
  const username = req.query.username;
  const amount = req.body.amount;
  const password = req.body.password;

  // This is the variable to determine if we are ready to send the money
  let correctBody = true;

  // Here we are checking if the type is null (not provided) or string (user provided string)
  if (typeof amount === "string" || amount === undefined) {
    correctBody = false;
    res.status(400).send({ detail: "Can not accept string as a valid input" });
  }

  // If the amount is negative, then we can not send money, so we send back an error
  if (amount <= 0) {
    correctBody = false;
    res
      .status(400)
      .send({ detail: "Can not accept money if it's less than 0" });
  }

  // If the body is of correct format, then we know to continue to send the momey
  if (correctBody) {
    // check if the user exists query/values
    const existsQuery =
      "SELECT checkings, password FROM users WHERE username=$1";
    const existsValues = [username];

    // Variable to check if the user even exists
    let userExists = true;

    // Queying the database to check if the user exists
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
      // If err, then we send back an error
      if (err) {
        res.status(500).send({ detail: err.stack });
      } else if (sqlRes.rowCount === 0) {
        // else if it retruns nothing, then we know the user does not exist.
        userExists = false;
        res.status(400).send({ detail: "Can not find user" });
      }

      // Var to check if the user is logged: Which is set to true by default
      let loggedIn = true;

      // Here we are checking for the inverse of the password, so if it returns false, then we  knoe the user exists
      if (!(await bcrypt.compare(password, sqlRes.rows[0].password))) {
        loggedIn = false;
        res.status(400).send({ detail: "User not authenticated" });
      }

      // Here we are checking if the user exists, and if logged in,
      if (userExists && loggedIn) {
        // Here we are saving the amount of money in out checkings account to a var
        const checkingsAmount = sqlRes.rows[0].checkings;

        // checking is the amount is more than what we have in out checkings account
        if (amount > checkingsAmount) {
          res.status(400).send({ detail: "Insufficent funds" });
        }
        // else we know we have enough money
        else {
          // Queried to increase from savings, and to decrease it from checkings
          const moneyQuery =
            "UPDATE users SET checkings=checkings-$1, savings=savings+$2 WHERE username=$3";
          const moneyValues = [amount, amount, username];

          // Querying the database with the values the user provided
          pool.query(moneyQuery, moneyValues, (sqlErr, sqlResponse) => {
            // If error, then we send back an error
            if (sqlErr) {
              res
                .status(500)
                .send({ detail: "Unknows error with transfering money" });
            }
            // else we know that the query succeded and sent the money
            else {
              res.status(201).send({
                detail: `Successfully transered ${amount} from checkings to savings`,
              });
            }
          });
        }
      }
    });
  }
});

// Exporting the module so we can use it from the main file
module.exports = router;
