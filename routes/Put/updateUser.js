const express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const auth = require("../../middleware/auth/auth");
require("dotenv").config({ path: "../../.env" });

router.use(express.json());

const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

router.put("/", auth.authenticateToken, (req, res) => {
  let correctBody = true;

  const username = req.query.username;
  const changeRecord = req.body.change;
  const changeTo = req.body.changeTo;

  if (username === undefined || username === "") {
    correctBody = false;
  }

  const values = [changeTo, username];

  for (let i = 0; i < values.length; i++) {
    if (values[i] === undefined || values[i] === "") correctBody = false;
  }

  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [username];

  pool.query(existsQuery, existsValues, async (err, sqlRes) => {
    if (err) {
      res.status(500).send({ detail: err.stack });
    } else if (sqlRes.rows[0].exists === false) {
      res.status(400).send({ detail: "User does not exist" });
    } else {
      if (correctBody) {
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
        } else if (changeRecord === "firstname") {
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
        } else if (changeRecord === "lastname") {
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
        } else if (changeRecord === "email") {
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
        } else if (changeRecord === "password") {
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
          res.status(400).send({ detail: "Please provide record to change" });
        }
      } else {
        res.status(400).send({ detail: "Some values not povided" });
      }
    }
  });
});

module.exports = router;
