import express, { Request, Response } from "express";
require("dotenv").config({ path: "../../../.env" });

import { decryptToken } from "../../../core/jwt/jsonwebtoken";
import { pool } from "../../../core/database/pool";
import { authToken } from "../../../core/auth/auth";
import { forgotPasswordFromTokenMiddleware } from "../../../core/middleware/putMiddleware";

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

    try {
      payload = decryptToken(token!);
    } catch (err: any) {
      return res.send({ detail: err });
    }

    const query = {
      text: "UPDATE public.users SET password=$1 WHERE username=$2",
      values: [payload.newPassword, payload.username],
    };

    let sqlRes;

    try {
      sqlRes = await pool.query(query);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    return res.status(201).send({
      detail: `Successfully updated the password of ${payload.username}`,
    });
  }
);

module.exports = router;
