// This file is in case I hit the database with a good ol' `sudo rm -rf /` or forget the ssh keys :skull:
import express, { Request, Response } from "express";

import { authToken } from "../../core/auth/auth";
import { createTables } from "../../core/database/tables";
import { allDhruvEndpointMiddleware } from "../../core/middleware/dhruvMiddleware";

const router = express.Router();

router.post(
  "/",
  authToken,
  allDhruvEndpointMiddleware,
  async (req: Request, res: Response) => {
    await createTables();
    return res.send({ detail: "Success!" });
  }
);

module.exports = router;
