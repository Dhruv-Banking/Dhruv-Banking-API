import express, { Request, Response } from "express";
require("dotenv").config({ path: "../../../.env" });

import { decryptToken } from "../../../core/jwt/jsonwebtoken";
import { pool } from "../../../core/database/pool";
import { authToken } from "../../../core/auth/auth";
import { forgotPasswordFromTokenMiddleware } from "../../../core/middleware/putMiddleware";
import { hashPassword } from "../../../core/bcrypt/bcrypt";

const router = express.Router();

router.put(
  "/",
  authToken,
  forgotPasswordFromTokenMiddleware,
  async (req: Request, res: Response) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    let payload;

    if (req.body.newPassword === undefined || req.body.newPassword === "")
      return res.status(400).send({ detail: "Provide all items" });

    let hashedPassword = await hashPassword(req.body.newPassword);

    try {
      payload = decryptToken(token!);
    } catch (err: any) {
      return res.send({ detail: err });
    }

    const query = {
      text: "UPDATE public.users SET password=$1 WHERE username=$2",
      values: [hashedPassword, payload.username],
    };

    let sqlRes;

    try {
      sqlRes = await pool.query(query);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    return res.status(201).send({
      detail: `Successfully updated password`,
    });
  }
);

module.exports = router;
