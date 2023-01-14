import express, { Request, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
require("dotenv").config({ path: "../../../.env" });

import { verifyArray } from "../../../core/verifyArray/verifyArray";
import { User } from "../../../core/data/types";
import { hashPassword } from "../../../core/bcrypt/bcrypt";
import { roles } from "../../../core/data/roles";
import { verifyEmailHtml } from "../../../core/email/html/verifyEmaiHtml";
import { createToken } from "../../../core/jwt/jsonwebtoken";

const router = express.Router();

// make a loop to check if the generated UUID already exists, if it does, generate a new one, if not, then break and continue with the program
// also do the same for the username.

router.post("/", async (req: Request, res: Response) => {
  const arrOfItems = [
    req.body.username,
    req.body.firstname,
    req.body.lastname,
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
    role: roles.verifyEmail,
    transactions: {},
  };

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
    subject: "Email Verification",
    html: verifyEmailHtml.replace("user.token", createToken(user)),
  };

  transporter.sendMail(details, (err: any) => {
    if (err) return res.status(500).send({ details: err });
    else return res.send({ detail: "Email sent" });
  });
});

module.exports = router;
