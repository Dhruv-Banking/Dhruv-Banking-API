import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  let sqlRes;

  try {
    sqlRes = await pool.query("SELECT * FROM public.users");
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.send(sqlRes.rows);
});

module.exports = router;
