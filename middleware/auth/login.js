const express = require("express");
const bcrypt = require("bcrypt");
let router = express.Router();
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

router.post("/", async (req, res) => {
  const query = "SELECT * FROM supercoolbois WHERE username=$1";
  const values = [req.body.name];

  try {
    pool.query(query, values, async (err, sqlRes) => {
      if (err) {
        res.status(500).send();
      } else {
        const user = {
          name: sqlRes.rows[0].username,
          password: sqlRes.rows[0].password,
        };

        if (await bcrypt.compare(req.body.password, user.password)) {
          const userObj = { name: user.name };

          const accessToken = jwt.sign(
            userObj,
            process.env.ACCESS_TOKEN_SECRET
          );
          res.send({ accessToken: accessToken });
        } else {
          res.send("Not allowed");
        }
      }
    });
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
