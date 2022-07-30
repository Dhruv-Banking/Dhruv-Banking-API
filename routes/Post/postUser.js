const express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const { v4: uuid4 } = require("uuid");
require("dotenv").config({ path: "../../.env" });

router.use(express.json());

const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

router.post("/", async (req, res) => {
  const body = req.body;

  let correctBody = true;

  let user = {
    uuid: uuid4(),
    username: body.username,
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    password: body.password,
    checkings: 0, // New user checkings
    savings: 0, // New user savings
  };

  if (body.password === undefined || body.password === null) {
    res.status(400);
  } else {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 12);

      user.password = hashedPassword;
    } catch {
      res.status(500).send({ detail: "Unknown Error" });
    }
  }

  if (user.username === undefined || user.username === null) {
    correctBody = false;
    res.status(400).send();
  }
  if (user.firstname === undefined || user.firstname === null) {
    correctBody = false;
    res.status(400).send();
  }
  if (user.lastname === undefined || user.lastname === null) {
    correctBody = false;
    res.status(400).send();
  }
  if (user.email === undefined || user.email === null) {
    correctBody = false;
    res.status(400).send();
  }
  if (user.password === undefined || user.password === null) {
    correctBody = false;
    res.status(400).send();
  }

  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [user.username];

  pool.query(existsQuery, existsValues, (err, sqlRes) => {
    if (err) {
      res.status(500).send({ detail: err.stack });
    } else if (sqlRes.rows[0].exists === true) {
      res
        .status(400)
        .send({ detail: `User with name '${user.username}' already exists` });
    } else {
      if (correctBody) {
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
        pool.query(query, values, (err, sqlRes) => {
          if (err) {
            res.status(500).send({ detail: err.stack });
          } else {
            res.status(201).send({
              detail: `${user.username} has been succesfully created!`,
            });
          }
        });
      }
    }
  });
});

module.exports = router;
