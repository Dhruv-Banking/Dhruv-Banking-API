const express = require("express");
let router = express.Router();
const { Pool } = require("pg");
require("dotenv").config({ path: "../../.env" });
const auth = require("../../middleware/auth/auth");

const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

router.get("/", auth.authenticateToken, (req, res) => {
  let realUser = true;
  const username = req.query.username;

  if (username === "" || username === undefined) {
    realUser = false;
  }

  const query =
    "SELECT uuid, username, firstname, lastname, email, savings, checkings FROM users WHERE username=$1";
  const values = [username];

  if (realUser) {
    pool.query(query, values, (err, sqlRes) => {
      if (err) {
        res.status(500).send({ detail: err.stack });
      } else if (sqlRes.rowCount === 0) {
        res.status(400).send({ detail: "User does not exist" });
      } else {
        res.send(sqlRes.rows);
      }
    });
  } else {
    res.status(400).send({ detail: "Please provide user." });
  }
});

module.exports = router;
