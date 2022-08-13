const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
  windowMs: 30 * 60 * 1000, // 30 Minutes
  max: 300, // Max of 300 every 30 minutes
  message: { detail: "You are being rate limited." },
});

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
const checkingsToSavings = require("./routes/Put/TransferMoney/checkingsToSavings");
const savingsToCheckings = require("./routes/Put/TransferMoney/savingsToCheckings");

const transferToAnotherUser = require("./routes/Put/TransferMoney/toAnotherUser");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(limiter);

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
