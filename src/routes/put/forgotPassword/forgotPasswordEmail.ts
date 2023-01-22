import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
require("dotenv").config({ path: "../../../.env" });

import { UserResetPassword } from "../../../core/data/types";
import { roles } from "../../../core/data/roles";
import { resetPasswordEmailHtml } from "../../../core/email/html/resetPasswordEmailHtml";
import { createToken } from "../../../core/jwt/jsonwebtoken";
import { pool } from "../../../core/database/pool";

const router = express.Router();

router.put("/", async (req: Request, res: Response) => {
  if (req.body.username === undefined || req.body.username === "")
    return res.status(400).send({ detail: "Provide all items" });

  const user: UserResetPassword = {
    username: req.body.username,
    role: roles.resetPassword,
  };

  let sqlRes;

  const query = {
    text: "SELECT email FROM public.users WHERE username=$1",
    values: [user.username],
  };

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sqlRes.rowCount === 0)
    return res.status(400).send({ detail: "You do not exist" });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const token = createToken(user);

  let details = {
    from: process.env.EMAIL,
    to: sqlRes.rows[0].email,
    subject: "Reset Password Email",
    html: resetPasswordEmailHtml
      .replace("user.token", token)
      .replace("host.name", `${req.protocol}://${req.headers.host}`),
  };

  transporter.sendMail(details, (err: any) => {
    if (err) return res.status(500).send({ details: err });
    else return res.send({ detail: "Email sent" });
  });
});

module.exports = router;
