// Imports
const express = require("express"); // Express API
const bcrypt = require("bcrypt"); // Encryption
let router = express.Router(); // Router
const { Pool } = require("pg"); // Querying the database
const jwt = require("jsonwebtoken"); // Json Web Token
require("dotenv").config({ path: "../../.env" }); // Dotenv

// Connection string from the dotenv file
const connectionString = process.env.CONNECTIONSTRING;

// Creating a new connection pool
const pool = new Pool({
  connectionString,
});

// This is the post endpoint to get a token.
// It takes 2 parameters:
// @request.body.name
// @request.body.password
router.post("/", async (req, res) => {
  // Querying the database
  const query = "SELECT * FROM users WHERE username=$1";
  const values = [req.body.name];

  try {
    // Here we are querying the database to get the use data
    pool.query(query, values, async (err, sqlRes) => {
      if (err) res.status(500).send();
      else if (sqlRes.rowCount === 0) {
        // Since a user that returns nothing means they don't exist.
        res.status(400).send({ detail: "You do not exist." });
      }
      // Else we know the user does exist, therefore we continue
      else {
        // User from the SQL data
        const user = {
          name: sqlRes.rows[0].username,
          password: sqlRes.rows[0].password,
          role: sqlRes.rows[0].role,
        };

        // If the hased password, and the password requested are the same, then we return true
        if (await bcrypt.compare(req.body.password, user.password)) {
          // Generate the access token
          const accessToken = generateAccessToken(user);

          // Then we send back the access token.
          res.send({ accessToken: accessToken });
        } else {
          res.status(400).send({ detail: "Incorrect password" });
        }
      }
    });
  } catch {
    res.status(500).send();
  }
});

// Function to generate the access token.
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

module.exports = router;
