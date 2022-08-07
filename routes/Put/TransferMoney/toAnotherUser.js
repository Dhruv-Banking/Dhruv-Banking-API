// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const pool = require("../../../database/pool"); // Pooling the connections to one pool
const auth = require("../../../middleware/auth/auth"); // Authentication
const bcrypt = require("bcrypt"); // Encryption
const verRole = require("../../../middleware/roles/authToken");

// Allowing out app to use json in the request body
router.use(express.json());

// This is the endpoint to send money from one user to another
// It takes 4 parameters:
// @request.query.userFrom
// @request.body.userTo
// @request.body.amount
// @request.body.password
router.put("/", auth.authenticateToken, verRole.toAnotherUser, (req, res) => {
  const userFrom = req.query.userFrom;
  const userTo = req.body.userTo;
  const amount = req.body.amount;
  const password = req.body.password;

  // Var to check if we are ready to send the money.
  let readyToSendMoney = true;

  // Checking if the user from decided to send money to themselves
  if (userFrom === userTo) {
    readyToSendMoney = false;
    res.status(400).send({ detail: "You can not send money to yourself" });
  }
  // Here we are checking if the userTo or userFrom var is equal to undefined, or an empty string.
  else if (
    userTo === undefined ||
    userTo === "" ||
    userFrom === undefined ||
    userFrom === ""
  ) {
    correctUsers = false;
    res.status(400).send({ detail: "Provide a user." });
  }

  // If the type the user is trying to send is a string, then we know to send an error
  if (typeof amount === "string" || amount === undefined) {
    readyToSendMoney = false;
    res.status(400).send({ detail: "Can not accept string as a valid input" });
  }

  if (amount <= 0) {
    readyToSendMoney = false;
    res.status(400).send({
      detail: "Can not accept money if it's negative",
    });
  }

  // Once we are ready to send the money, we continue
  if (readyToSendMoney) {
    // Exists query, which gets checkings balance, and password:
    const existsQuery =
      "SELECT checkings, password FROM users WHERE username=$1";
    const existsValues = [userFrom];

    // This is the query to get the data we are requesting from the database
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
      // If error, then we send an error.
      if (err) {
        res.status(500).send({ detail: "Unknown Server Error" });
      }
      // else if the database returns nothing, then we know the user does not exist.
      else if (sqlRes.rowCount === 0) {
        res.status(400).send({ detail: "User to send money does not exist." });
      }
      // Else we knwo the user does exist, and we are ready to send the money
      else {
        const checkingsAmount = sqlRes.rows[0].checkings;
        const passwordUserFrom = sqlRes.rows[0].password;

        // Here we are comparing if the user provided the correct password to authenticate that they are the ones sending the money
        if (await bcrypt.compare(password, passwordUserFrom)) {
          // Here we are checking to make sure the user has enough money to send to the other user (In my bank we don't believe in *overdraft*)
          if (amount > checkingsAmount) {
            res.status(400).send({ detail: "Insufficent Funds." });
          }
          // else we know we have enough money to continue
          else {
            // Qury to add checking to the user that the user sent.
            const addMoneyQuery =
              "UPDATE users SET checkings=checkings+$1 WHERE username=$2";
            const addMoneyValues = [amount, userTo];

            // Querying the database
            pool.query(addMoneyQuery, addMoneyValues, (sqlErr, sqlResponse) => {
              // If error, then we set the status to 500, and send back an error.
              if (sqlErr) {
                res.status(500).send({ detail: "Unknown Server Error" });
              } else {
                // If what was returned was 0 rows, then we know who the user is trying to send money to does not exist.
                if (sqlResponse.rowCount === 0) {
                  res
                    .status(400)
                    .send({ detail: "User to send money to does not exist." });
                } else {
                  // Remove the money from the user who is sending the money
                  const removeMoneyQuery =
                    "UPDATE users SET checkings=checkings-$1 WHERE username=$2";
                  const removeMoneyValues = [amount, userFrom];

                  // Querying the database to remove the money from the database
                  pool.query(
                    removeMoneyQuery,
                    removeMoneyValues,
                    (sqlErrTwo, sqlResponseTwo) => {
                      // If error, then we set status to 500, and send back an error
                      if (sqlErrTwo) {
                        res
                          .status(500)
                          .send({ detail: "Unknown Server Error" });
                      } else {
                        // Else we know the transaction happened successfully
                        res.status(201).send({
                          detail: `Successfully transfered ${amount} from '${userFrom}' to '${userTo}'`,
                        });
                      }
                    }
                  );
                }
              }
            });
          }
        } else {
          res.status(400).send({ detail: "Password incorrect." });
        }
      }
    });
  }
});

// Exporting the module so we can use it from the main file
module.exports = router;
