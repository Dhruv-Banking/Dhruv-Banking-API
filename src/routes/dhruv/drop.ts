// this file is to `sudo rm -rf / --no-preserve-root` the database
import express, { Request, Response } from "express";

import { authToken } from "../../core/auth/auth";
import { pool } from "../../core/database/pool";
import { allDhruvEndpointMiddleware } from "../../core/middleware/dhruvMiddleware";

const router = express.Router();

router.delete(
  "/",
  authToken,
  allDhruvEndpointMiddleware,
  async (req: Request, res: Response) => {
    let dropUsers = "DROP TABLE public.users";
    let dropIps = "DROP TABLE public.flagip";

    try {
      await pool.query(dropUsers);
      await pool.query(dropIps);
    } catch (err: any) {
      return res.send({ detail: err.stack });
    }

    return res.send({ detail: "It has been done." });
  }
);

module.exports = router;
