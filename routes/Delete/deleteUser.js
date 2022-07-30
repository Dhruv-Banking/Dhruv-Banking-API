const express = require("express");
let router = express.Router();
const { Pool } = require("pg");
const auth = require("../../middleware/auth/auth");
const bcrypt = require("bcrypt");

const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

router.delete("/", auth.authenticateToken, async (req, res) => {
  let readyToDelete = false;
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  if (user.username === "" || user.username === undefined) {
    res.status(400).send({ detail: "Provide Username" });
  } else if (user.password === "" || user.password === undefined) {
    res.status(400).send({ detail: "Provide Password" });
  }

  const query = "SELECT username, password FROM users WHERE username=$1";
  const values = [user.username];

  pool.query(query, values, async (err, sqlRes) => {
    if (err) {
      res.status(500).send({ detail: err.stack });
    } else if (sqlRes.rowCount === 0) {
      res.status(400).send({ detail: "User does not exist" });
    } else {
      if (await bcrypt.compare(user.password, sqlRes.rows[0].password)) {
        readyToDelete = true;
      } else {
        res.status(400).send({ detail: "Password Incorrect." });
      }

      if (readyToDelete) {
        const deletQuery = "DELETE FROM users WHERE username=$1";
        const deleteValues = [user.username];

        pool.query(deletQuery, deleteValues, (errDelete, sqlResDelete) => {
          if (err) {
            res.status(500).send({ detail: errDelete.stack });
          } else {
            res.status(201).send({
              detail: `'${user.username}' has been succesfully deleted`,
            });
          }
        });
      }
    }
  });
});

module.exports = router;
