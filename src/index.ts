import express, { Application, Request, Response } from "express";

import { createTables } from "./core/database/tables";

const app: Application = express();
app.use(express.json());
const port = 3000;

// Routes -- GET
const getSpecificUser = require("./routes/get/getSpecificUser");
const getAllUsers = require("./routes/get/getAllUsers");

// Routes -- POST
const postUserNoVerification = require("./routes/post/postUserNoVerification");
const verifyEmail = require("./routes/post/postUser/verifyEmail");
const postUserFromToken = require("./routes/post/postUser/postUserFromToken");
const authUserLogin = require("./routes/post/authUserLogin");

// Routes -- PUT
const forgotPasswordEmail = require("./routes/put/forgotPassword/forgotPasswordEmail");
const forgotPasswordFromToken = require("./routes/put/forgotPassword/forgotPasswordFromToken");
const savingsToCheckings = require("./routes/put/transferMoney/savingsToCheckings");
const checkingsToSavings = require("./routes/put/transferMoney/checkingsToSavings");
const toAnotherUser = require("./routes/put/transferMoney/toAnotherUser");

// Routes -- Delete
const deleteUser = require("./routes/delete/deleteUser");

// ------------------------------- //

// Use Routes -- GET
app.use("/dhruvbanking/get/getSpecificUser", getSpecificUser);
app.use("/dhruvbanking/get/getAllUsers", getAllUsers);

// Use Routes -- POST
app.use("/dhruvbanking/post/postUserNoVerification", postUserNoVerification);
app.use("/dhruvbanking/post/verifyEmail", verifyEmail);
app.use("/dhruvbanking/post/postUserFromToken", postUserFromToken);
app.use("/dhruvbanking/post/authUserLogin", authUserLogin);

// Use Routes -- PUT
app.use("/dhruvbanking/put/forgotPasswordEmail", forgotPasswordEmail);
app.use("/dhruvbanking/put/forgotPasswordFromToken", forgotPasswordFromToken);
app.use("/dhruvbanking/put/savingsToCheckings", savingsToCheckings);
app.use("/dhruvbanking/put/checkingsToSavings", checkingsToSavings);
app.use("/dhruvbanking/put/toAnotherUser", toAnotherUser);

// Use Routes -- Delete
app.use("/dhruvbanking/delete/deleteUser", deleteUser);

// ------------------------------- //

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
