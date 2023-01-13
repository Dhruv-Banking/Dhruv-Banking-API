import express, { Application, Request, Response } from "express";

import { createTables } from "./core/database/tables";

const app: Application = express();
const port = 3000;

app.get("/", async (req: Request, res: Response) => {
  return res.send({ detail: "Welcome to the Dhruv Banking API 2.0" });
});

app.get("/createTables", async (req: Request, res: Response) => {
  let result = await createTables();

  if (result) return res.send({ detail: "Success making tables" });

  return res.send({ detail: result });
});

// Fallback
app.all("*", async (req: Request, res: Response) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
