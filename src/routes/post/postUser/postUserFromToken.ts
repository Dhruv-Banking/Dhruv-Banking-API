import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
require("dotenv").config({ path: "../../../.env" });

import { User } from "../../../core/data/types";
import { roles } from "../../../core/data/roles";
import { welcomeEmailHtml } from "../../../core/email/html/welcomeEmailHtml";
import { decryptToken } from "../../../core/jwt/jsonwebtoken";
import { pool } from "../../../core/database/pool";
import { authToken } from "../../../core/auth/auth";
import { postUserFromTokenMiddleware } from "../../../core/middleware/postMiddleware";
import { loggingMiddleware } from "../../../core/ipLogging/logging";

const router = express.Router();

router.post(
  "/",
  authToken,
  postUserFromTokenMiddleware,
  loggingMiddleware,
  async (req: Request, res: Response) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    let payload;

    try {
      payload = decryptToken(token!);
    } catch (err: any) {
      return res.send({ detail: err });
    }

    const user: User = {
      uuid: payload.uuid,
      username: payload.username,
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      password: payload.password,
      phonenumber: payload.phonenumber,
      checkings: payload.checkings,
      savings: payload.savings,
      role: roles.basic,
      transactions: {},
    };

    const query = {
      text: "INSERT INTO public.users (uuid, username, firstname, lastname, email, password, phonenumber, checkings, savings, role, transactions) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);",
      values: [
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
      ],
    };

    let sqlRes;

    try {
      sqlRes = await pool.query(query);
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
          detail: `Successfully sent email, and created user`,
        });
    });
  }
);

module.exports = router;
