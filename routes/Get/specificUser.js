// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const pool = require("../../database/pool"); // Pooling the connections to one pool
const auth = require("../../middleware/auth/auth"); // Authentication
const verRole = require("../../middleware/roles/authToken");

// Allowing out app to use json in the request body
router.use(express.json());

// This is the endpoint to get a specific user
// It takes one query parameter:
// @request.query.username
router.get(
  "/",
  auth.authenticateToken,
  verRole.authGetRoleSpecificUsers,
  (req, res) => {
    // This is a variable to check if the user is real
    let realUser = true;
    const username = req.query.username; // username from the query

    // Checking if user is null, or not provided
    if (username === "" || username === undefined) {
      realUser = false;
    }

    // This is the query to get everything, but the password (for security reasons)
    const query =
      "SELECT uuid, username, firstname, lastname, email, savings, checkings, role FROM users WHERE username=$1";
    const values = [username];

    // If the user is real, then we execute the program
    if (realUser) {
      // Querying the databse
      pool.query(query, values, (err, sqlRes) => {
        // If err, then we throw an error
        if (err) {
          res.status(500).send({ detail: err.stack });
        }
        // If the returned rows is negative, then we know the user does not exist
        else if (sqlRes.rowCount === 0) {
          res.status(400).send({ detail: "User does not exist" });
        }
        // else we send back the data
        else {
          res.send(sqlRes.rows);
        }
      });
    }
    // else we know the api caller did not specify a user
    else {
      res.status(400).send({ detail: "Please provide user." });
    }
  }
);

// Exporting the module so we can use it from the main file
module.exports = router;
