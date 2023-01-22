import { Request, Response, NextFunction } from "express";

import { pool } from "../database/pool";

const MAX_NUMBER_OF_REQUESTS = 15;

export async function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let ip = req.ip;

  let query: any = {
    text: "SELECT queries FROM public.flagip WHERE ip=$1;",
    values: [ip],
  };

  let sqlRes;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sqlRes.rowCount === 0) {
    query = {
      text: "INSERT INTO public.flagip (ip, queries) VALUES($1, $2);",
      values: [ip, 1],
    };

    try {
      sqlRes = await pool.query(query);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    return next();
  }

  let queries: any = parseInt(sqlRes.rows[0].queries) + 1;
  console.log(queries);

  if (queries - 1 === MAX_NUMBER_OF_REQUESTS)
    return res.send({ detail: "You've reached your maximi" });

  query = {
    text: "UPDATE public.flagip SET queries=$1 WHERE ip=$2;",
    values: [queries, ip],
  };

  try {
    await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  next();
}
