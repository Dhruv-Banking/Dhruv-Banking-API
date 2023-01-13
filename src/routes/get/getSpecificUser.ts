import express, { Request, Response, Router } from "express";

import { pool } from "../../core/database/pool";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const username = req.query.username;

  if (username === undefined || username === "")
    return res.status(400).send({ detail: "Please provide user." });

  const query = {
    text: "SELECT uuid, username, firstname, lastname, email, phonenumber, checkings, savings, role, transactions from public.users WHERE username=$1",
    values: [username],
  };

  let sqlRes = await pool.query(query);

  return res.send(sqlRes.rows[0]);
});

module.exports = router;
