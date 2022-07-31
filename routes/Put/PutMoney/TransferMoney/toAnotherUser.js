const express = require("express");
let router = express.Router();
const { Pool } = require("pg");
const auth = require("../../../../middleware/auth/auth");
require("dotenv").config({ path: "../../../../.env" });

const connectionString = process.env.CONNECTIONSTRING;

router.use(express.json());

const pool = new Pool({
  connectionString,
});

router.put("/", auth.authenticateToken, (req, res) => {
  const userFrom = req.query.userFrom;
  const userTo = req.body.userTo;
  const amount = req.body.amount;

  let correctUsers = true;
  let correctMoneyType = true;
  let noLessThan0Money = true;

  if (userFrom === userTo) {
    correctUsers = false;
    res.status(400).send({ detail: "You can not send money to yourself" });
  } else if (
    userTo === undefined ||
    userTo === "" ||
    userFrom === undefined ||
    userFrom === ""
  ) {
    correctUsers = false;
    res.status(400).send({ detail: "Provide a user." });
  }

  if (typeof amount === "string" || amount === undefined) {
    correctMoneyType = false;
    res.status(400).send({ detail: "Can not accept string as a valid input" });
  }

  if (amount <= 0) {
    noLessThan0Money = false;
    res.status(400).send({
      detail: "Can not accept money if it's negative",
    });
  }

  if (correctUsers && correctMoneyType && noLessThan0Money) {
    const existsQuery = "SELECT checkings FROM users WHERE username=$1";
    const existsValues = [userFrom];

    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
      if (err) {
        res.status(500).send({ detail: "Unknown Server Error" });
      } else if (sqlRes.rowCount === 0) {
        res.status(400).send({ detail: "User to send money does not exist." });
      } else {
        const checkingsAmount = sqlRes.rows[0].checkings;

        if (amount > checkingsAmount) {
          res.status(400).send({ detail: "Insufficent Funds." });
        } else {
          const addMoneyQuery =
            "UPDATE users SET checkings=checkings+$1 WHERE username=$2";
          const addMoneyValues = [amount, userTo];

          pool.query(addMoneyQuery, addMoneyValues, (sqlErr, sqlResponse) => {
            if (sqlErr) {
              res.status(500).send({ detail: "Unknown Server Error" });
            } else {
              if (sqlResponse.rowCount === 0) {
                res
                  .status(400)
                  .send({ detail: "User to send money to does not exist." });
              } else {
                const removeMoneyQuery =
                  "UPDATE users SET checkings=checkings-$1 WHERE username=$2";
                const removeMoneyValues = [amount, userFrom];

                pool.query(
                  removeMoneyQuery,
                  removeMoneyValues,
                  (sqlErrTwo, sqlResponseTwo) => {
                    if (sqlErrTwo) {
                      res.status(500).send({ detail: "Unknown Server Error" });
                    } else {
                      res.status(201).send({
                        detail: `Successfully transfered ${amount} from '${userFrom}' to '${userTo}'`,
                      });
                    }
                  }
                );
              }
            }
          });
        }
      }
    });
  }
});

module.exports = router;
