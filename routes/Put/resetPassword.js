// Imports
const express = require("express"); // express as API
let router = express.Router(); // Router
const pool = require("../../database/pool"); // Pooling the connections to one pool
const bcrypt = require("bcrypt");
const authTokenAndName = require("../../middleware/roles/resetPasswordMiddleware")

router.use(express.json());

class User {
    constructor(username, newPassword) {
        this.username = username;
        this.newPassword = newPassword;
    }
}

router.put("/", authTokenAndName.authRoleAndUsername, async (req, res) => {
    const username = req.query.username;
    const newPassword = req.body.newPassword;

    const resetUserPass = new User(username, newPassword);

    // Checking is any item in the user object is null, or empty
    for (let item in resetUserPass) {
        if ((resetUserPass[item] === "" || resetUserPass[item] === undefined)) {
            res.status(400).send({detail: "Please provide all items."});
            return;
        }
    }

    resetUserPass.newPassword = await bcrypt.hash(newPassword, 12);

    const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
    const existsValues = [resetUserPass.username];

    pool.query(existsQuery, existsValues, (err, sqlRes) => {
        if (err) {
            res.status(500).send({detail: err.stack});
            return;
        } else if (sqlRes.rows[0].exists === false) {
            res.status(400).send({detail: 'You do not exist'});
            return;
        }

        const resetQuery = "UPDATE users SET password=$1 WHERE username=$2";
        const resetValues = [resetUserPass.newPassword, resetUserPass.username];

        pool.query(resetQuery, resetValues, (error, sqlResponse) => {
            if (error) {
                res.status(500).send({detail: err.stack});
                return;
            }

            res.status(201).send({ detail: `Successfully updated the password of ${resetUserPass.username}`})
        });
    });
});

module.exports = router;
