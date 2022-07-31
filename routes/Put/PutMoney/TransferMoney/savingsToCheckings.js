const express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const auth = require("../../../../middleware/auth/auth");
require("dotenv").config({ path: "../../../../.env" });

const connectionString = process.env.CONNECTIONSTRING;

router.use(express.json());

const pool = new Pool({
  connectionString,
});

router.put("/", auth.authenticateToken, async (req, res) => {
  const username = req.query.username;
  const amount = req.body.amount;
  const password = req.body.password;

  let correctBody = true;

  if (typeof amount === "string" || amount === undefined) {
    correctBody = false;
    res.status(400).send({ detail: "Can not accept string as a valid input" });
  }

  if (amount <= 0) {
    correctBody = false;
    res
      .status(400)
      .send({ detail: "Can not accept money if it's less than 0" });
  }

  if (correctBody) {
    // check if the user exists.
    const existsQuery =
      "SELECT checkings, password FROM users WHERE username=$1";
    const existsValues = [username];
    let userExists = true;

    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
      if (err) {
        res.status(500).send({ detail: err.stack });
      } else if (sqlRes.rowCount === 0) {
        userExists = false;
        res.status(400).send({ detail: "Can not find user" });
      }

      let loggedIn = true;

      if (!(await bcrypt.compare(password, sqlRes.rows[0].password))) {
        loggedIn = false;
        res.status(400).send({ detail: "User not authenticated" });
      }

      if (userExists && loggedIn) {
        const savingsAmount = sqlRes.rows[0].checkings;
        if (amount > savingsAmount) {
          res.status(400).send({ detail: "Insufficent funds" });
        } else {
          const moneyQuery =
            "UPDATE users SET savings=savings-$1, checkings=checkings+$2 WHERE username=$3";
          const moneyValues = [amount, amount, username];
          pool.query(moneyQuery, moneyValues, (sqlErr, sqlResponse) => {
            if (sqlErr) {
              res
                .status(500)
                .send({ detail: "Unknows error with transfering money" });
            } else {
              res.status(201).send({
                detail: `Successfully transered ${amount} from savings to checkings`,
              });
            }
          });
        }
      }
    });
  }
});

module.exports = router;
