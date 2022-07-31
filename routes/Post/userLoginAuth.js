const express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config({ path: "../../.env" });
const auth = require("../../middleware/auth/auth");

router.use(express.json());

const connectionString = process.env.CONNECTIONSTRING;
const pool = new Pool({
  connectionString,
});

router.post("/", auth.authenticateToken, async (req, res) => {
  const body = req.body;

  const user = {
    username: body.username,
    password: body.password,
  };

  const query = "SELECT * FROM users WHERE username=$1";
  const values = [user.username];

  if (user.username === undefined || user.username === null) {
    res.status(500).send({ detail: "Provide Username" });
  } else {
    pool.query(query, values, async (err, sqlRes) => {
      if (err) {
        res.status(500).send({ detail: err.stack });
      } else if (sqlRes.rowCount === 0) {
        res.status(400).send({ detail: "Incorrect username." });
      } else {
        if (await bcrypt.compare(user.password, sqlRes.rows[0].password)) {
          res.status(200).send({ detail: "Success" });
        } else {
          res.status(400).send({ detail: "Failiure" });
        }
      }
    });
  }
});

module.exports = router;
