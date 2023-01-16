import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
require("dotenv").config({ path: "../../.env" });

import { pool } from "../../core/database/pool";
import { comparePassword } from "../../core/bcrypt/bcrypt";
import { DeleteUser } from "../../core/data/types";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { deleteUserEmail } from "../../core/email/html/deleteUserEmail";

const router = express.Router();

router.delete("/", async (req: Request, res: Response) => {
  let arrOfItems = [req.body.username, req.body.password];

  if (!verifyArray(arrOfItems))
    return res.status(400).send({ detail: "Provide all items" });

  const user: DeleteUser = {
    username: req.body.username,
    password: req.body.password,
  };

  let query = {
    text: "SELECT password, email FROM public.users WHERE username=$1",
    values: [user.username],
  };

  let sqlRes;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sqlRes.rowCount === 0)
    return res.status(400).send({ detail: "You do not exist" });

  if (!(await comparePassword(user.password, sqlRes.rows[0].password)))
    return res.status(400).send({ detail: "Incorrect password" });

  // Update Query
  query = {
    text: "DELETE FROM public.users WHERE username=$1;",
    values: [user.username],
  };

  try {
    await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let details = {
    from: process.env.EMAIL,
    to: sqlRes.rows[0].email,
    subject: "We're sorry to see you go",
    html: deleteUserEmail.replace("user.name", user.username),
  };

  transporter.sendMail(details, (err: any) => {
    if (err) return res.status(500).send({ details: err });
    else
      return res.status(201).send({
        detail: `Successfully sent email, and deleated user: ${user.username}`,
      });
  });
});

module.exports = router;
