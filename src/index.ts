import express, { Application, Request, Response } from "express";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import fs from "fs";
import https from "https";
import path from "path";

const limiter = rateLimiter({
  windowMs: 60 * 1000, // 1 Minutes
  max: 300, // Max of 300 every 1 minutes
  message: { detail: "You are being rate limited." },
});

const app: Application = express();
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(cors());
app.use(limiter);
const port = 3000;

// Routes -- Auth
const login = require("./core/auth/login");

// Routes -- GET
const getSpecificUser = require("./routes/get/getSpecificUser");
const getAllUsers = require("./routes/get/getAllUsers");

// Routes -- POST
const postUserNoVerification = require("./routes/post/postUserNoVerification");
const verifyEmail = require("./routes/post/postUser/verifyEmail");
const postUserFromToken = require("./routes/post/postUser/postUserFromToken");

// Routes -- PUT
const forgotPasswordEmail = require("./routes/put/forgotPassword/forgotPasswordEmail");
const forgotPasswordFromToken = require("./routes/put/forgotPassword/forgotPasswordFromToken");
const savingsToCheckings = require("./routes/put/transferMoney/savingsToCheckings");
const checkingsToSavings = require("./routes/put/transferMoney/checkingsToSavings");
const toAnotherUser = require("./routes/put/transferMoney/toAnotherUser");

// Routes -- Delete
const deleteUser = require("./routes/delete/deleteUser");

// Routes -- DHRUV
const createTables = require("./routes/dhruv/createTables");

// Routes -- GET HTML
const verifyEmailHtml = require("./routes/post/postUser/verifyEmailHtmlPage");
const forgotPasswordHtml = require("./routes/put/forgotPassword/forgotPasswordHtmlPage");

// ------------------------------- //

// Use Routes -- Auth
app.use("/dhruvbanking/login", login);

// Use Routes -- GET
app.use("/dhruvbanking/get/getSpecificUser", getSpecificUser);
app.use("/dhruvbanking/get/getAllUsers", getAllUsers);

// Use Routes -- POST
app.use("/dhruvbanking/post/postUserNoVerification", postUserNoVerification);
app.use("/dhruvbanking/post/verifyEmail", verifyEmail);
app.use("/dhruvbanking/post/postUserFromToken", postUserFromToken);

// Use Routes -- PUT
app.use("/dhruvbanking/put/forgotPasswordEmail", forgotPasswordEmail);
app.use("/dhruvbanking/put/forgotPasswordFromToken", forgotPasswordFromToken);
app.use("/dhruvbanking/put/savingsToCheckings", savingsToCheckings);
app.use("/dhruvbanking/put/checkingsToSavings", checkingsToSavings);
app.use("/dhruvbanking/put/toAnotherUser", toAnotherUser);

// Use Routes -- Delete
app.use("/dhruvbanking/delete/deleteUser", deleteUser);

// Use Routes -- DHRUV
app.use("/dhruvbanking/dhruv/createTables", createTables);

// Use Routes -- GET HTML
app.use("/dhruvbanking/secure/verifyEmailHtml", verifyEmailHtml);
app.use("/dhruvbanking/secure/forgotPasswordHtml", forgotPasswordHtml);

// ------------------------------- //

app.get("/", async (req: Request, res: Response) => {
  return res.send({ detail: "Welcome to the Dhruv Banking API 2.0" });
});

app.get("/test", async (req: Request, res: Response) => {
  let domain = `${req.protocol}://${req.headers.host}`;
  return res.send(domain);
});

// Fallback
app.all("*", async (req: Request, res: Response) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

var certificate = fs.readFileSync(`${__dirname}/cert.pem`, "utf8");
var privateKey = fs.readFileSync(`${__dirname}/key.pem`, "utf8");

var credentials = { key: privateKey, cert: certificate };

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
