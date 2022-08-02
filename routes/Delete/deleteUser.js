// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const { Pool } = require("pg"); // Query the database
const auth = require("../../middleware/auth/auth"); // Authentication
const bcrypt = require("bcrypt"); // Encryption
require("dotenv").config({ path: "../../.env" }); // Dotenv, to read a .env file

// Connection string from the dotenv file
const connectionString = process.env.CONNECTIONSTRING;

// Allowing our app to use json in the request body
router.use(express.json());

// Creating a connection pool
const pool = new Pool({
  connectionString,
});

// This is the endpoint to delete a user, it takes 2 Parameters:
// @request.body.username, and the
// @request.body.password so we can authenticate if a user even wants to delete their account
router.delete("/", auth.authenticateToken, async (req, res) => {
  // Var to determin is a user is ready to delete.
  let readyToDelete = false;

  // This is the user object that was sent with the request body.
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  // Here we are checking if the username or password was sent empty, if so: retrun an error
  if (user.username === "" || user.username === undefined) {
    res.status(400).send({ detail: "Provide Username" });
  } else if (user.password === "" || user.password === undefined) {
    res.status(400).send({ detail: "Provide Password" });
  }

  // Query to select username, and password from the database (password is hashed) to authenticate user deletion
  const query = "SELECT username, password FROM users WHERE username=$1";
  const values = [user.username];

  // This is the query to authenticate user deletion
  pool.query(query, values, async (err, sqlRes) => {
    // If error, then we send back the error
    if (err) {
      res.status(500).send({ detail: err.stack });
    }
    // If the server returns nothing, then we know the user does not exist
    else if (sqlRes.rowCount === 0) {
      res.status(400).send({ detail: "User does not User does not exist" });
    }
    // else we know the user exists, then we start to authenticate them
    else {
      // Here we are comparing the hased passwords to check if they match, if they do, then we know we are ready to delete the user.
      if (await bcrypt.compare(user.password, sqlRes.rows[0].password)) {
        readyToDelete = true;
      }
      // else we know the password they entered was incorrect
      else {
        res.status(400).send({ detail: "Password Incorrect." });
      }

      // Then we check if readyToDelete == true
      if (readyToDelete) {
        // These are the deletion queries
        const deletQuery = "DELETE FROM users WHERE username=$1";
        const deleteValues = [user.username];

        // Here we are querying the databse to delete the user, if error: then we just send back an error
        pool.query(deletQuery, deleteValues, (errDelete, sqlResDelete) => {
          if (errDelete) {
            res.status(500).send({ detail: errDelete.stack });
          } else {
            // If no error, then we just send back a successfull message
            res.status(201).send({
              detail: `'${user.username}' has been succesfully deleted`,
            });
          }
        });
      }
    }
  });
});

// Exporting the module so we can use it from the main file
module.exports = router;
