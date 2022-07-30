const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const morgan = require("morgan");

// Auth Route
const login = require("./middleware/auth/login");
const auth = require("./middleware/auth/auth");

// POST user Route
const postUser = require("./routes/Post/postUser");
const authUserLogin = require("./routes/Post/userLoginAuth");

// GET
const getAllUsers = require("./routes/Get/getAllUsers");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

pool.connect();

// Auth
app.use("/users/login", login);

// POST
app.use("/postUser", postUser);
app.use("/authUserLogin", authUserLogin);

// GET
app.use("/getAllUsers", getAllUsers);

app.get("/", auth.authenticateToken, (req, res) => {
  res.send({ detail: "Please pick an endpoint, refer to the docs" });
});

app.listen(3000, () => {
  console.log("API listening on port " + 3000);
});
