import express, { Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
require("dotenv").config({ path: "../../.env" });

import { comparePassword } from "../bcrypt/bcrypt";
import { roles } from "../data/roles";
import { pool } from "../database/pool";
import { createToken } from "../jwt/jsonwebtoken";
import { verifyArray } from "../verifyArray/verifyArray";
import { PostUserToken, NormalUserToken } from "../data/types";

let router = express.Router();

let tokens: any[] = [];

router.post("/refreshToken", async (req: Request, res: Response) => {
  const token = req.body.token;

  if (token == null) return res.sendStatus(401);
  if (!tokens.includes(token)) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, user: any) => {
      if (err) return res.status(403).json({ result: "Forbidden" });

      const accessToken = createToken({
        username: user.username,
        password: user.password,
        role: user.role,
      });

      return res.send({ accessToken: accessToken });
    }
  );
});

router.post("/", async (req: Request, res: Response) => {
  let arrOfItems = [req.body.username, req.body.password];

  if (!verifyArray(arrOfItems))
    return res.status(400).send({ detail: "Provide all items" });

  let query = {
    text: "SELECT password, role FROM public.users WHERE username=$1",
    values: [req.body.username],
  };

  let sqlRes;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sqlRes.rowCount === 0) {
    let user: PostUserToken = {
      username: req.body.username,
      role: roles.postUser,
    };

    let token = createToken(user);

    console.log("created user with token: " + user.role);

    return res.status(201).send({ postUserToken: token });
  }

  if (!(await comparePassword(req.body.password, sqlRes.rows[0].password)))
    return res.status(400).send({ detail: "Incorrect password" });

  let user: NormalUserToken = {
    username: req.body.username,
    password: sqlRes.rows[0].password,
    role: sqlRes.rows[0].role,
  };

  console.log("created user with token: " + user.role);

  const token = createToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);
  tokens.push(refreshToken);

  return res.send({ accessToken: token, refreshToken: refreshToken });
});

module.exports = router;
