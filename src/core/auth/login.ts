import express, { Request, Response } from "express";

import { comparePassword } from "../bcrypt/bcrypt";
import { roles } from "../data/roles";
import { pool } from "../database/pool";
import { createToken } from "../jwt/jsonwebtoken";
import { verifyArray } from "../verifyArray/verifyArray";
import { PostUserToken, NormalUserToken } from "../data/types";

let router = express.Router();

router.post("/user", async (req: Request, res: Response) => {
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

  let token = createToken(user);

  return res.send({ accessToken: token });
});

module.exports = router;
