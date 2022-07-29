const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

// Auth Route
const login = require("./middleware/auth/login");
const auth = require("./middleware/auth/auth");

// Post user Route
const postUser = require("./routes/Post/postUser");

const app = express();
app.use(express.json());

const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

pool.connect();

app.use("/users/login", login);
app.use("/postUser", postUser);

app.get("/", auth.authenticateToken, (req, res) => {
  pool.query('SELECT * FROM "public"."supercoolbois"', (err, sqlRes) => {
    res.json(sqlRes.rows);
  });
});

app.listen(3000, () => {
  console.log("API listening on port " + 3000);
});
