// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const { Pool } = require("pg"); // Query the database
const { v4: uuid4 } = require("uuid"); // UUID maker
require("dotenv").config({ path: "../../.env" }); // Dotenv, to read a .env file
const auth = require("../../middleware/auth/auth"); // Authentication

// Connection string from the dotenv file
const connectionString = process.env.CONNECTIONSTRING;

// Allowing out app to use json in the request body
router.use(express.json());

// Creating a connection pool
const pool = new Pool({
  connectionString,
});

// This is the endpoint to post a user to the databse
// It takes 5 parameters:
// @request.body.username
// @request.body.firstname
// @request.body.lastname
// @request.body.email
// @request.body.password
// which are al provided in the request body.
router.post("/", auth.authenticateToken, async (req, res) => {
  // var to make the user body easier to read.
  const body = req.body;

  // Variable to check if the body is correct.
  let correctBody = true;

  // User object
  let user = {
    uuid: uuid4(), // Generate a completly random uuid
    username: body.username,
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    password: body.password,
    checkings: 0, // New user checkings
    savings: 0, // New user savings
  };

  // Here we are checking if the password is empty, if so
  if (body.password === undefined || body.password === null) {
    res.status(400); // if so, we send an error
  } else {
    // else we will hash the password
    try {
      const hashedPassword = await bcrypt.hash(user.password, 12); // Hashing the password 12 times
      user.password = hashedPassword; // saving it to the user object
    } catch {
      // else, we catch the error
      res.status(500).send({ detail: "Unknown Error" });
    }
  }

  // Checking is any item in the user object is null, or empty
  if (
    user.username === undefined ||
    user.username === null ||
    user.username === ""
  ) {
    correctBody = false;
    res.status(400).send({ detail: "Please provide username." });
  }
  if (
    user.firstname === undefined ||
    user.firstname === null ||
    user.firstname === ""
  ) {
    correctBody = false;
    res.status(400).send({ detail: "Please provide firstname." });
  }
  if (
    user.lastname === undefined ||
    user.lastname === null ||
    user.lastname === ""
  ) {
    correctBody = false;
    res.status(400).send({ detail: "Please provide lastname." });
  }
  if (user.email === undefined || user.email === null || user.email === "") {
    correctBody = false;
    res.status(400).send({ detail: "Please provide email." });
  }
  if (
    user.password === undefined ||
    user.password === null ||
    user.password === ""
  ) {
    correctBody = false;
    res.status(400).send({ detail: "Please provide password." });
  }

  // Query to check if a user with that username exists
  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [user.username];

  // Querying the database
  pool.query(existsQuery, existsValues, (err, sqlRes) => {
    // If err, then we send an error
    if (err) {
      res.status(500).send({ detail: err.stack });
    }
    // else if user already exists, then we send an error
    else if (sqlRes.rows[0].exists === true) {
      res
        .status(400)
        .send({ detail: `User with name '${user.username}' already exists` });
    }
    // else we knwo the user does not exist
    else {
      // If there were no previous errors, then we continue
      if (correctBody) {
        // Query, and values to post the user to the database
        const query =
          "INSERT INTO users (uuid, username, firstname, lastname, email, password, savings, checkings) VALUES($1, $2, $3, $4, $5, $6, $7, $8 )";
        const values = [
          user.uuid,
          user.username,
          user.firstname,
          user.lastname,
          user.email,
          user.password,
          user.savings,
          user.checkings,
        ];

        // Here we are just posting the user to the database
        pool.query(query, values, (err, sqlRes) => {
          // If error, then we send back the error
          if (err) {
            res.status(500).send({ detail: err.stack });
          }
          // else we know the user does exist
          else {
            res.status(201).send({
              detail: `${user.username} has been succesfully created!`,
            });
          }
        });
      }
    }
  });
});

// Exporting the module so we can use it from the main file
module.exports = router;
