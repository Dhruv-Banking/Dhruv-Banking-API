// Imports
const jwt = require("jsonwebtoken");
const roleData = require("./roleData");
require("dotenv").config({path: "../"})

function returnRoletoken(token) {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.role;
}

function authRoleAndUsername(req, res, next) {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    // Verify Function.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({result: "Forbidden"});


        // Get role and check if it's correct.
        let role = returnRoletoken(token);

        if (role !== roleData.reset && role !== roleData.dhruv && role !== roleData.god) {
            return res.status(403).send({detail: "You do not have the right role."});
        }

        next();
    });
}

module.exports = {
    authRoleAndUsername,
}