// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const pool = require("../../database/pool"); // Pooling the connections to one pool
const flagIP = require("../../middleware/flag-ip-address/flagIpAddress"); // Flagging the IP
const auth = require("../../middleware/auth/auth"); // Authentication
const authTokenPost = require("../../middleware/roles/postUserToken");
const userClass = require("../../BaseClass/UserClass"); // User class
const nodemailer = require("nodemailer");
const html = require("../../html/welcomeHtml");
const jwt = require("jsonwebtoken");
const roleData = require("../../middleware/roles/roleData");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Allowing out app to use json in the request body
router.use(express.json());

// This is the endpoint to post a user to the database
// It takes 5 parameters:
// @request.body.username
// @request.body.firstname
// @request.body.lastname
// @request.body.email
// @request.body.password
// which are all provided in the request body.
router.post(
  "/",
  auth.authenticateToken,
  authTokenPost.authRolePostUser,
  (req, res) => {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    let data = decryptToken(token);

    // User object
    let user = new userClass(
      data.uuid,
      data.username,
      data.firstname,
      data.lastname,
      data.email,
      data.password,
      roleData.basic,
      data.checkings,
      data.savings
    );

    let mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Welcome to Dhruv Banking!",
      html: html.replace("user.name", user.username),
    };

    // Checking is any item in the user object is null, or empty
    for (let item in user) {
      if (user[item] === "" || user[item] === undefined) {
        res.status(400).send({ detail: "Please provide all items." });
        return;
      }
    }

    // Query to check if a user with that username exists
    const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
    const existsValues = [user.username];

    // Querying the database
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
      // If err, then we send an error
      if (err) {
        res.status(500).send({ detail: err.stack });
        return;
      }
      // else if user already exists, then we send an error
      else if (sqlRes.rows[0].exists === true) {
        res
          .status(400)
          .send({ detail: `User with name '${user.username}' already exists` });
        return;
      }

      // Query, and values to post the user to the database
      const query =
        "INSERT INTO users (uuid, username, firstname, lastname, email, password, savings, checkings, role) VALUES($1, $2, $3, $4, $5, $6, $7, $8 , $9)";
      const values = [
        user.uuid,
        user.username,
        user.firstname,
        user.lastname,
        user.email,
        user.password,
        user.savings,
        user.checkings,
        user.role,
      ];

      // Here we are just posting the user to the database
      pool.query(query, values, (err, sqlRes) => {
        // If error, then we send back the error
        if (err) {
          res.status(500).send({ detail: err.stack });
          return;
        }

        transporter.sendMail(mailOptions, (err, success) => {
          if (err) {
            res.status(500).send({
              detail: "User successfully created",
              error: { get: "good nlg" },
            });
          }
        });

        // else we know the user does exist
        res.status(201).send({
          detail: `user has been successfully created!`,
        });
      });
    });
  }
);

function decryptToken(token) {
  let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded;
}

// Exporting the module, so we can use it from the main file
module.exports = router;
