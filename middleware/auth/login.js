// Imports
const express = require("express"); // Express API
const bcrypt = require("bcrypt"); // Encryption
let router = express.Router(); // Router
const {Pool} = require("pg"); // Querying the database
const jwt = require("jsonwebtoken"); // Json Web Token
require("dotenv").config({path: "../../.env"}); // Dotenv
const roles = require("../roles/roleData");

// Connection string from the dotenv file
const connectionString = process.env.CONNECTIONSTRING;

// Creating a new connection pool
const pool = new Pool({
    connectionString,
});

// User class
class UserToken {
    constructor(name, role, password) {
        this.name = name;
        this.role = role;
        this.password = password;
    }

    get returnObject() {
        return {
            name: this.name,
            role: this.role,
            password: this.password,
        }
    }
}


// This is the post endpoint to get a token.
// It takes 2 parameters:
// @request.body.name
// @request.body.password
router.post("/", async (req, res) => {
    // Querying the database
    const query = "SELECT * FROM users WHERE username=$1";
    const values = [req.body.name];

    // Here we are querying the database to get the use data
    pool.query(query, values, async (err, sqlRes) => {
        if (err) {
            res.status(500).send({detail: err.stack});
            return;
        } else if (sqlRes.rowCount === 0) {
            // Post user class.
            let postUser = new UserToken(req.body.name, roles.viewer, req.body.password);
            const accessToken = generateAccessTokenViewer(postUser.returnObject);

            return res.send({postUserToken: accessToken});
        }

        const sql = sqlRes.rows[0];

        // OOP
        let user = new UserToken(sql.username, sql.role, sql.password);

        // If the hashed password, and the password requested are the same, then we return true
        if (!(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).send({detail: "Incorrect password"});
        }

        // Generate the access token
        const accessToken = generateAccessToken(user.returnObject);

        // Then we send back the access token.
        res.send({accessToken: accessToken});
    });
});

// Function to generate the access token.
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"});
}

function generateAccessTokenViewer(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
}

module.exports = router;
