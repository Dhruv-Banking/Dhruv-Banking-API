import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config({ path: "../../.env" });

import { comparePassword } from "../bcrypt/bcrypt";
import { roles } from "../data/roles";
import { pool } from "../database/pool";
import { createToken, decryptTokenRefresh } from "../jwt/jsonwebtoken";
import { verifyArray } from "../verifyArray/verifyArray";
import { PostUserToken, NormalUserToken } from "../data/types";
import { client } from "../database/redis";

let router = express.Router();

// only a refresh token can call this
router.post("/refreshToken", async (req: Request, res: Response) => {
  const token = req.body.token;
  let tokenData;

  try {
    tokenData = decryptTokenRefresh(token);
  } catch (err: any) {
    return res.status(400).send({ detail: "How dare you give me a bad token" });
  }

  let query = {
    text: "SELECT role FROM public.users WHERE username=$1",
    values: [tokenData.username],
  };

  let sqlRes: any;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  let redisRes = await client.get(`${tokenData.username}`);

  if (token === null)
    return res.status(400).send({ detail: "Provide a token" });

  if (redisRes === null)
    return res.status(400).send({ detail: "You do not exist in the database" });

  if (redisRes !== token)
    return res
      .status(400)
      .send({ detail: "You must only use a new your latest refresh token" });

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, user: any) => {
      if (err) return res.status(403).json({ result: "Forbidden" });

      const accessToken = createToken({
        username: user.username,
        password: user.password,
        role: sqlRes.rows[0].role,
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
  user.role = roles.refreshToken;
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);
  client.set(user.username, refreshToken);

  return res.send({ accessToken: token, refreshToken: refreshToken });
});

module.exports = router;
