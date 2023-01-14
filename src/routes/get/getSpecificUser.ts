import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
import { verifyArray } from "../../core/verifyArray/verifyArray";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  let sqlRes;
  const username = req.query.username;
  const arrOfItems = [req.body.username];

  if (!verifyArray(arrOfItems))
    return res.status(400).send({ detail: "Please provide user." });

  const query = {
    text: "SELECT uuid, username, firstname, lastname, email, phonenumber, checkings, savings, role, transactions from public.users WHERE username=$1",
    values: [username],
  };

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.send(sqlRes.rows[0]);
});

module.exports = router;
