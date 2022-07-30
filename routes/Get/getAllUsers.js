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
  pool.query('SELECT * FROM "public"."users" LIMIT 100', (err, sqlRes) => {
    if (err) {
      res.status(500).send({ detail: err.stack });
    } else {
      res.send(sqlRes.rows);
    }
  });
});

module.exports = router;
