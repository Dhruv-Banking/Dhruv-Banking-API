import express, { Request, Response } from "express";
require("dotenv").config({ path: "../../../.env" });

import { SendMoneyToAnotherUser } from "../../../core/data/types";
import { pool } from "../../../core/database/pool";
import { comparePassword } from "../../../core/bcrypt/bcrypt";
import { verifyArray } from "../../../core/verifyArray/verifyArray";

const router = express.Router();

router.put("/", async (req: Request, res: Response) => {
  if (typeof req.body.amount === "string" || req.body.amount === undefined)
    return res
      .status(400)
      .send({ detail: "Amount must be of type int, and not empty" });

  const arrOfItems = [
    req.body.userFrom,
    req.body.userTo,
    req.body.amount.toString(),
    req.body.password,
  ];

  if (!verifyArray(arrOfItems))
    return res.status(400).send({ detail: "Provide all items" });

  if (req.body.amount <= 0)
    return res
      .status(400)
      .send({ detail: "Can not accept money if it's less than 0" });

  const user: SendMoneyToAnotherUser = {
    userFrom: req.body.userFrom,
    userTo: req.body.userTo,
    amount: req.body.amount,
    password: req.body.password,
  };

  if (user.userFrom === user.userTo)
    return res
      .status(400)
      .send({ detail: "You can not send money to yourself" });

  let sqlRes;

  const queryGetPassCheckings = {
    text: "SELECT checkings, password FROM users WHERE username=$1",
    values: [user.userFrom],
  };

  try {
    sqlRes = await pool.query(queryGetPassCheckings);
  } catch (err: any) {
    return res.status(500).send({ detail: "Unknown Server Error" });
  }

  if (sqlRes.rowCount === 0)
    return res
      .status(400)
      .send({ detail: "User sending money does not exist." });

  if (!(await comparePassword(user.password, sqlRes.rows[0].password)))
    return res.status(400).send({ detail: "Password incorrect." });

  if (user.amount > sqlRes.rows[0].checkings)
    return res.status(400).send({ detail: "Insufficent Funds." });

  const queryAddMoney = {
    text: "UPDATE users SET checkings=checkings+$1 WHERE username=$2",
    values: [user.amount, user.userTo],
  };

  try {
    sqlRes = await pool.query(queryAddMoney);
  } catch (err: any) {
    return res.status(500).send({ detail: "Unknown Server Error" });
  }

  if (sqlRes.rowCount === 0)
    return res
      .status(400)
      .send({ detail: "User to send money to does not exist." });

  const queryRemoveMoney = {
    text: "UPDATE users SET checkings=checkings-$1 WHERE username=$2",
    values: [user.amount, user.userFrom],
  };

  try {
    sqlRes = await pool.query(queryRemoveMoney);
  } catch (err: any) {
    return res.status(500).send({ detail: "Unknown Server Error" });
  }

  return res.status(201).send({
    detail: `Successfully transferred ${user.amount} from '${user.userFrom}' to '${user.userTo}'`,
  });
});

module.exports = router;
