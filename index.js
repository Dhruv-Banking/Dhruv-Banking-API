// Imports
const express = require("express"); // Express API
require("dotenv").config(); // Dotenv load all the vars
const morgan = require("morgan"); // Dev dependencies (Shows all the requests)
const cors = require("cors"); // Cors so we can use it from the front-end js
const rateLimiter = require("express-rate-limit"); // Rate limiter

// limiter object
const limiter = rateLimiter({
  windowMs: 60 * 1000, // 1 Minutes
  max: 300, // Max of 300 every 30 minutes// Max of 300 every 30 minutes
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

// D H R U V  endpoint
const dhruv = require("./routes/DhruvEndpoints/sqlEndpoint")

// Express as an app var
const app = express();
app.use(express.json()); // Lets us use json in the request body
app.use(morgan("dev")); // Dev dependencies
app.use(cors()); // All the endpoints have cors enabled
app.use(limiter); // Limiter for all endpoints

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

// D H R U V  endpoint
app.use("/dhruv", dhruv);

// Base Url
app.get("/", auth.authenticateToken, (req, res) => {
  res.send({ detail: "Please pick an endpoint, refer to the docs" });
});

// Make the app listen on Port 3000
app.listen(3000, () => {
  console.log("API listening on port " + 3000);
});
