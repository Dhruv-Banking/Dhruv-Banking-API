const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");

// Auth Route
const login = require("./middleware/auth/login");
const auth = require("./middleware/auth/auth");

// POST user Route
const postUser = require("./routes/Post/postUser");
const authUserLogin = require("./routes/Post/userLoginAuth");

// GET
const getAllUsers = require("./routes/Get/getAllUsers");
const specificUser = require("./routes/Get/specificUser");

// Delete
const deleteUser = require("./routes/Delete/deleteUser");

// PUT
const updateUser = require("./routes/Put/updateUser");

// PUT (Transfer Money)
const checkingsToSavings = require("./routes/Put/PutMoney/TransferMoney/checkingsToSavings");
const savingsToCheckings = require("./routes/Put/PutMoney/TransferMoney/savingsToCheckings");

const transferToAnotherUser = require("./routes/Put/PutMoney/TransferMoney/toAnotherUser");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

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
app.use("/specificUser", specificUser);

// Delete
app.use("/deleteUser", deleteUser);

// PUT
app.use("/updateUser", updateUser);

// PUT (Transfer Money)
app.use("/checkingsToSavings", checkingsToSavings);
app.use("/savingsToCheckings", savingsToCheckings);

app.use("/transferToAnotherUser", transferToAnotherUser);

app.get("/", auth.authenticateToken, (req, res) => {
  res.send({ detail: "Please pick an endpoint, refer to the docs" });
});

app.listen(3000, () => {
  console.log("API listening on port " + 3000);
});
