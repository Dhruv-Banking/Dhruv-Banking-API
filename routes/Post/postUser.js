// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../database/pool"); // Pooling the connections to one pool
const {v4: uuid4} = require("uuid"); // UUID maker
const auth = require("../../middleware/auth/auth"); // Authentication
const flagIP = require("../../middleware/flag-ip-address/flagIpAddress"); // Flagging the IP
const authTokenPost = require("../../middleware/roles/postUserToken");

// Allowing out app to use json in the request body
router.use(express.json());

class User {
    constructor(username, firstname, lastname, email, password, role) {
        this.uuid = uuid4(undefined, undefined, undefined);
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.checkings = 0;
        this.savings = 0;
        this.role = role;
    }
}

// This is the endpoint to post a user to the database
// It takes 5 parameters:
// @request.body.username
// @request.body.firstname
// @request.body.lastname
// @request.body.email
// @request.body.password
// which are al provided in the request body.
router.post("/", auth.authenticateToken, authTokenPost.authRolePostUser, flagIP.flagIpAddress, async (req, res) => {
    // var to make the user body easier to read.
    const body = req.body;

    // Variable to check if the body is correct.
    let correctBody = true;

    // User object
    let user = new User(body.username, body.firstname, body.lastname, body.email, body.password, "BASIC");

    // Checking is any item in the user object is null, or empty
    for (let item in user) {
        if ((user[item] === "" || user[item] === undefined)) {
            res.status(400).send({detail: "Please provide all items."});
            return;
        }
    }


    // Query to check if a user with that username exists
    const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
    const existsValues = [user.username];

    // Querying the database
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
        // If err, then we send an error
        if (err) {
            res.status(500).send({detail: err.stack});
        }
        // else if user already exists, then we send an error
        else if (sqlRes.rows[0].exists === true) {
            res
                .status(400)
                .send({detail: `User with name '${user.username}' already exists`});
        }
        // else we know the user does not exist
        else {
            // If there were no previous errors, then we continue
            if (correctBody) {
                // Hash password since we know everything is fine
                user.password = await bcrypt.hash(user.password, 12);

                // Query, and values to post the user to the database
                const query = "INSERT INTO users (uuid, username, firstname, lastname, email, password, savings, checkings, role) VALUES($1, $2, $3, $4, $5, $6, $7, $8 , $9)";
                const values = [user.uuid, user.username, user.firstname, user.lastname, user.email, user.password, user.savings, user.checkings, user.role,];

                // Here we are just posting the user to the database
                pool.query(query, values, (err, sqlRes) => {
                    // If error, then we send back the error
                    if (err) {
                        res.status(500).send({detail: err.stack});
                    }
                    // else we know the user does exist
                    else {
                        res.status(201).send({
                            detail: `${user.username} has been succesfully created!`,
                        });
                    }
                });
            }
        }
    });
});

// Exporting the module, so we can use it from the main file
module.exports = router;
