import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
import { authToken } from "../../core/auth/auth";
import { getAllUsersMiddleware } from "../../core/middleware/getMiddleware";

const router = express.Router();

router.get(
  "/",
  authToken,
  getAllUsersMiddleware,
  async (req: Request, res: Response) => {
    let sqlRes;

    try {
      sqlRes = await pool.query("SELECT * FROM public.users");
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    return res.send(sqlRes.rows);
  }
);

module.exports = router;
