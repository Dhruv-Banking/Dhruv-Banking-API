import express, { Request, Response } from "express";
require("dotenv").config({ path: "../../.env" });

import { verifyArray } from "../../core/verifyArray/verifyArray";
import { UserLogin } from "../../core/data/types";
import { comparePassword } from "../../core/bcrypt/bcrypt";
import { pool } from "../../core/database/pool";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const arrOfItems = [req.body.username, req.body.password];
  let sqlRes;
  const user: UserLogin = {
    username: req.body.username,
    password: req.body.password,
  };

  if (!verifyArray(arrOfItems))
    return res.send({ detail: "Provide all items" });

  const query = {
    text: "SELECT username, password FROM users WHERE username=$1",
    values: [user.username],
  };

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sqlRes.rowCount === 0)
    return res.status(400).send({ detail: "User does not exist" });

  if (!(await comparePassword(user.password, sqlRes.rows[0].password)))
    return res.status(401).send({ detail: "Incorrect password" });

  return res.status(200).send({ detail: "Success" });
});

module.exports = router;
