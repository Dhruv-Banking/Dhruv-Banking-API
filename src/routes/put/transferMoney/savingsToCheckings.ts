import express, { Request, Response } from "express";
require("dotenv").config({ path: "../../../.env" });

import { SendMoneyToMyself } from "../../../core/data/types";
import { pool } from "../../../core/database/pool";
import { verifyArray } from "../../../core/verifyArray/verifyArray";
import { updateSavingsToCheckings } from "../../../core/transactions/transactions";
import { transferMoneyMiddleware } from "../../../core/middleware/putMiddleware";
import { authToken } from "../../../core/auth/auth";

const router = express.Router();

router.put(
  "/",
  authToken,
  transferMoneyMiddleware,
  async (req: Request, res: Response) => {
    if (typeof req.body.amount === "string" || req.body.amount === undefined)
      return res
        .status(400)
        .send({ detail: "Amount must be of type int, and not empty" });

    const arrOfItems = [req.body.username, req.body.amount.toString()];

    if (req.body.amount <= 0)
      return res
        .status(400)
        .send({ detail: "Can not accept money if it's less than 0" });

    const user: SendMoneyToMyself = {
      username: req.body.username,
      amount: req.body.amount,
    };

    if (!verifyArray(arrOfItems))
      return res.status(400).send({ detail: "Provide all items" });

    let sqlResGetPassSavings;

    const queryGetPassSavings = {
      text: "SELECT savings FROM public.users WHERE username=$1",
      values: [user.username],
    };

    try {
      sqlResGetPassSavings = await pool.query(queryGetPassSavings);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    if (sqlResGetPassSavings.rowCount === 0)
      return res.status(400).send({ detail: "You do not exist" });

    if (user.amount > sqlResGetPassSavings.rows[0].savings)
      return res.status(400).send({ detail: "Insufficient funds" });

    const queryUpdateMoney = {
      text: "UPDATE users SET savings=savings-$1, checkings=checkings+$2 WHERE username=$3",
      values: [user.amount, user.amount, user.username],
    };

    try {
      await pool.query(queryUpdateMoney);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    await updateSavingsToCheckings(user.username, user.amount, new Date());

    return res.status(201).send({
      detail: `Successfully transered ${user.amount} from savings to checkings`,
    });
  }
);

module.exports = router;
