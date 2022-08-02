// Imports 
const express = require("express"); // express as API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const { Pool } = require("pg"); // Query the database
const auth = require("../../middleware/auth/auth"); // Authentication
require("dotenv").config({ path: "../../.env" }); // Dotenv, to read the .env file

// Allowing hte app to use json in the request body
router.use(express.json());

// Connection string from the dotenv file
const connectionString = process.env.CONNECTIONSTRING;

// Creating a connection pool
const pool = new Pool({
  connectionString,
});

// This is the request body to update a user
// It takes 3 parameters:
// @request.query.username
// @request.body.change
// @request.body.changeTo
router.put("/", auth.authenticateToken, (req, res) => {
  // var to determine if we are ready to update the user
  let correctBody = true;

  // Variables from the request body/query
  const username = req.query.username;
  const changeRecord = req.body.change;
  const changeTo = req.body.changeTo;

  // Here we are chcecking if the username is null, or equal to nothing
  if (username === undefined || username === "") {
    correctBody = false;
  }

  // This is the vakues from the request body for the query
  const values = [changeTo, username];

  // This is a for loop were we are checking if any of the values are null, if so, we set the variable to false
  for (let i = 0; i < values.length; i++) {
    if (values[i] === undefined || values[i] === "") correctBody = false;
  }

  // Here is the query to check wheather the user does exist
  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [username];
  
  // This is the callback function to query the database to know if the user exists
  pool.query(existsQuery, existsValues, async (err, sqlRes) => {
    // If error, then we throw an error
    if (err) {
      res.status(500).send({ detail: err.stack });
    } 
    // else if the json returned is false, then we know the user does not exist
    else if (sqlRes.rows[0].exists === false) {
      res.status(400).send({ detail: "User does not exist" });
    }
    // else we know the user exists. 
    else {
      // If the correctBody variable is true, then we know that the request body is correct
      if (correctBody) {
        // here we are checking if the changeRecord equal to username, then we change the username
        if (changeRecord === "username") {
          const query = "UPDATE users SET username=$1 WHERE username=$2";

          pool.query(query, values, (sqlErr, sqlRes) => {
            if (sqlErr) {
              res.status(500).send({ detail: sqlErr.stack });
            } else {
              res
                .status(201)
                .send({ detail: `Successfully updated ${username}` });
            }
            const values = [changeTo, username];
          });
        } 
        // else if the record is equal to firstname, then we know to update the firstname
        else if (changeRecord === "firstname") {
          const query = "UPDATE users SET firstname=$1 WHERE username=$2";

          pool.query(query, values, (sqlErr, sqlRes) => {
            if (sqlErr) {
              res.status(500).send({ detail: sqlErr.stack });
            } else {
              res
                .status(201)
                .send({ detail: `Successfully updated ${username}` });
            }
          });
        } 
        // else if the record is lastname, then we know to update the lastname
        else if (changeRecord === "lastname") {
          const query = "UPDATE users SET lastname=$1 WHERE username=$2";

          pool.query(query, values, (sqlErr, sqlRes) => {
            if (sqlErr) {
              res.status(500).send({ detail: sqlErr.stack });
            } else {
              res
                .status(201)
                .send({ detail: `Successfully updated ${username}` });
            }
          });
        } 
        // else if the record is email, then we know to update the email.
        else if (changeRecord === "email") {
          const query = "UPDATE users SET email=$1 WHERE username=$2";

          pool.query(query, values, (sqlErr, sqlRes) => {
            if (sqlErr) {
              res.status(500).send({ detail: sqlErr.stack });
            } else {
              res
                .status(201)
                .send({ detail: `Successfully updated ${username}` });
            }
          });
        } 
        // else if the record is password, then we know to update the password
        else if (changeRecord === "password") {
          const query = "UPDATE users SET password=$1 WHERE username=$2";

          let hashedPassword = "";

          try {
            hashedPassword = await bcrypt.hash(values[0], 12);
            values[0] = hashedPassword;
          } catch {
            res.status(500).send({ detail: "Error hashing password." });
          }

          pool.query(query, values, (sqlErr, sqlRes) => {
            if (sqlErr) {
              res.status(500).send({ detail: sqlErr.stack });
            } else {
              res
                .status(201)
                .send({ detail: `Successfully updated ${username}` });
            }
          });
        } else {
          // else we know that the user did not provided a valid input
          res.status(400).send({ detail: "Please provide record to change" });
        }
      } else {
        // else we know the user did not provide a valid request body
        res.status(400).send({ detail: "Some values not povided" });
      }
    }
  });
});

// Exporting the module so we can use it from the main file
module.exports = router;
