// Imports
const express = require("express"); // express as API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../database/pool"); // Pooling the connections to one pool
const auth = require("../../middleware/auth/auth"); // Authentication
require("dotenv").config({path: "../../.env"}); // Dotenv, to read the .env file
const verRole = require("../../middleware/roles/authToken");
const authTokenAndUsername = require("../../middleware/roles/authTokenPostUser");

// Allowing hte app to use json in the request body
router.use(express.json());

// This is the request body to update a user
// It takes 3 parameters:
// @request.query.username
// @request.body.change
// @request.body.changeTo
router.put("/", auth.authenticateToken, verRole.updateUser, authTokenAndUsername.authUserPostUsername, (req, res) => {
    // Var so we don't have to type req.body every time
    const body = req.body;

    const userDetails = {
        username: req.query.username, changeRecord: body.changeRecord, changeTo: body.changeTo,
    }

    // This is a for loop were we are checking if any of the values are null, if so we just yell at the user.
    for (let item in userDetails) {
        if (userDetails[item] === "" || userDetails[item] === undefined) {
            res.status(500).send({detail: "Please provide all the details."})
            return;
        }
    }

    // Here is the query to check whether the user does exist
    const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
    const existsValues = [userDetails.username];

    // This is the callback function to query the database to know if the user exists
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
        // If error, then we throw an error
        if (err) {
            res.status(500).send({detail: err.stack});
            return;
        }
        // else if the json returned is false, then we know the user does not exist
        else if (sqlRes.rows[0].exists === false) {
            res.status(400).send({detail: "User does not exist"});
            return;
        }

        // This is the values from the request body for the query
        const values = [userDetails.changeTo, userDetails.username];


        // here we are checking if the changeRecord equal to username, then we change the username
        if (userDetails.changeRecord === "username") {
            const query = "UPDATE users SET username=$1 WHERE username=$2";

            pool.query(query, values, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    res.status(500).send({detail: sqlErr.stack});
                    return;
                }
                res.status(201).send({detail: `Successfully updated ${userDetails.username}`});
            });
        }
        // else if the record is equal to firstname, then we know to update the firstname
        else if (userDetails.changeRecord === "firstname") {
            const query = "UPDATE users SET firstname=$1 WHERE username=$2";

            pool.query(query, values, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    res.status(500).send({detail: sqlErr.stack});
                    return;
                }
                res.status(201).send({detail: `Successfully updated ${userDetails.username}`});
            });
        }
        // else if the record is lastname, then we know to update the lastname
        else if (userDetails.changeRecord === "lastname") {
            const query = "UPDATE users SET lastname=$1 WHERE username=$2";

            pool.query(query, values, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    res.status(500).send({detail: sqlErr.stack});
                    return;
                }
                res.status(201).send({detail: `Successfully updated ${userDetails.username}`});
            });
        }
        // else if the record is email, then we know to update the email.
        else if (userDetails.changeRecord === "email") {
            const query = "UPDATE users SET email=$1 WHERE username=$2";

            pool.query(query, values, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    res.status(500).send({detail: sqlErr.stack});
                    return;
                }
                res.status(201).send({detail: `Successfully updated ${userDetails.username}`});
            });
        }
        // else if the record is password, then we know to update the password
        else if (userDetails.changeRecord === "password") {
            const query = "UPDATE users SET password=$1 WHERE username=$2";

            // Hashing the password
            try {
                values[0] = await bcrypt.hash(values[0], 12);
            } catch {
                res.status(500).send({detail: "Error hashing password."});
                return;
            }

            pool.query(query, values, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    res.status(500).send({detail: sqlErr.stack});
                    return;
                }
                res.status(201).send({detail: `Successfully updated ${userDetails.username}`});
            });
        }
    });
});

// Exporting the module, so we can use it from the main file
module.exports = router;