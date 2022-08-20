// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../database/pool"); // Pooling the connections to one pool
require("dotenv").config({path: "../../.env"}); // Dotenv, to read the .env file
const auth = require("../../middleware/auth/auth"); // Authentication

// Allowing out app to use json in the request body
router.use(express.json());

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

// This is the endpoint to authenticate a user that has logged in
// It takes 2 parameters:
// @request.body.username
// @request.body.password
router.post("/", auth.authenticateToken, async (req, res) => {
    // Var to make the user body easier to read
    const body = req.body;

    // USer object
    const user = new User(body.username, body.password)

    // Queries to select
    const query = "SELECT username, password FROM users WHERE username=$1";
    const values = [user.username];

    for (let item in user) {
        if (user[item] === "" || user[item] === undefined) {
            res.status(400).send({detail: "Please provide all items."});
            return;
        }
    }

    // else we know the caller is not messing with us
    // Querying the database to get the username, and password
    pool.query(query, values, async (err, sqlRes) => {
        // If err, then we send an error, and the error
        if (err) {
            res.status(500).send({detail: err.stack});
            return;
        }
        // else if the database returns nothing
        else if (sqlRes.rowCount === 0) {
            res.status(400).send({detail: "User does not exist."});
            return;
        }
        // We will compare the hashed password and the password that the user provided
        if (!(await bcrypt.compare(user.password, sqlRes.rows[0].password))) {
            res.status(400).send({detail: "Failure"});
            return;
        }

        res.status(200).send({detail: "Success"});
    });
});

// Exporting the module so we can use it from the main file
module.exports = router;
