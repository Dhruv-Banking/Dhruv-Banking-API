// I call this endpoint the `uno reverse card no drip`
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
    let query = "DELETE FROM public.flagip";

    try {
      await pool.query(query);
    } catch (err: any) {
      return res.send({ detail: err.stack });
    }

    return res.send({ detail: "It has been done." });
  }
);

module.exports = router;
