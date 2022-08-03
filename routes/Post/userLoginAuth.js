// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../database/pool"); // Pooling the connections to one pool
require("dotenv").config({ path: "../../.env" }); // Dotenv, to read the .env file
const auth = require("../../middleware/auth/auth"); // Authentication

// Allowing out app to use json in the request body
router.use(express.json());

// This is the endpoint to authenticate a user that has logged in
// It takes 2 parameters:
// @request.body.username
// @request.body.password
router.post("/", auth.authenticateToken, async (req, res) => {
  // Var to make the user body easier to read
  const body = req.body;

  // USer object
  const user = {
    username: body.username, // Username
    password: body.password, // Password
  };

  // Queries to select
  const query = "SELECT username, password FROM users WHERE username=$1";
  const values = [user.username];

  // checking if the username is null, or undefinded
  if (user.username === undefined || user.username === null) {
    // if so, then we send an error
    res.status(400).send({ detail: "Provide Username" });
  }
  // else we know the caller is not messing with us
  else {
    // Querying the database to get the username, and password
    pool.query(query, values, async (err, sqlRes) => {
      // If err, then we send an error, and the error
      if (err) {
        res.status(500).send({ detail: err.stack });
      }
      // else if the databse returns nothing
      else if (sqlRes.rowCount === 0) {
        res.status(400).send({ detail: "Incorrect username." });
      }
      // else we know the user does exist,
      else {
        // We will compare the hased password and the password that the user provided
        if (await bcrypt.compare(user.password, sqlRes.rows[0].password)) {
          // If true then we send back success
          res.status(200).send({ detail: "Success" });
        } else {
          // else we know the passwords do not match
          res.status(400).send({ detail: "Failiure" });
        }
      }
    });
  }
});

// Exporting the module so we can use it from the main file
module.exports = router;
