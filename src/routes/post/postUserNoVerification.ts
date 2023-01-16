import express, { Request, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
require("dotenv").config({ path: "../../.env" });

import { User } from "../../core/data/types";
import { roles } from "../../core/data/roles";
import { welcomeEmailHtml } from "../../core/email/html/welcomeEmailHtml";
import { pool } from "../../core/database/pool";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { hashPassword } from "../../core/bcrypt/bcrypt";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const arrOfItems = [
    req.body.username,
    req.body.firstname,
    req.body.lastname,
    req.body.password,
    req.body.email,
    req.body.phonenumber,
  ];

  if (!verifyArray(arrOfItems))
    return res.send({ detail: "Provide all items" });

  const user: User = {
    uuid: crypto.randomUUID(),
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    phonenumber: req.body.phonenumber,
    checkings: 0,
    savings: 0,
    role: roles.basic,
    transactions: {},
  };

  // Using 2 variables an I was running into issues with types :(
  let query = "SELECT * FROM public.users WHERE username=$1";
  let values: any[] = [user.username];

  let sqlRes;

  try {
    sqlRes = await pool.query(query, values);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sqlRes.rowCount !== 0)
    return res
      .status(400)
      .send({ detail: "User with that name already exists" });

  query =
    "INSERT INTO public.users (uuid, username, firstname, lastname, email, password, phonenumber, checkings, savings, role, transactions) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);";
  values = [
    user.uuid,
    user.username,
    user.firstname,
    user.lastname,
    user.email,
    user.password,
    user.phonenumber,
    user.checkings,
    user.savings,
    user.role,
    user.transactions,
  ];

  try {
    await pool.query(query, values);
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
    to: user.email,
    subject: "Welcome to Dhruv Banking™️",
    html: welcomeEmailHtml.replace("user.name", user.username),
  };

  transporter.sendMail(details, (err: any) => {
    if (err) return res.status(500).send({ details: err });
    else
      return res.status(201).send({
        detail: `Successfully sent email, and created user: ${user.username}`,
      });
  });
});

module.exports = router;
