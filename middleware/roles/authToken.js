// JSW as an import
const jwt = require("jsonwebtoken");
const roleData = require("./roleData"); // Importing the secret role data

function returnRole(token) {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.role;
}

// ------------------- GET ------------------- //
function authRoleGetAllUsers(req, res, next) {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    // Saving the returned role to the var role
    let role = returnRole(token);

    // Verifying the role to make sure
    if (role !== roleData.admin && role !== roleData.god && role !== roleData.dhruv) {
        res.status(401);
        return res.send({detail: "You don't have the right role"});
    }

    next();
}

function authGetRoleSpecificUsers(req, res, next) {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    // Saving the returned err role to the var role
    let username = req.query.username;
    let tokenName = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).name;
    let role = returnRole(token);


    // Check if token username is equal to the username in the query.
    if (role !== roleData.basic && role !== roleData.admin && role !== roleData.god && role !== roleData.dhruv) {
        res.status(401);
        return res.send({detail: "You don't have the right role"})
    }

    if (username !== tokenName) {
        res.status(400);
        return res.send({detail: "Please use the same token as the user"});
    }

    next();
}

// ------------------- DELETE ------------------- //
function authGetRoleDeletUser(req, res, next) {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    let username = req.query.username;
    let tokenName = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).name;
    let role = returnRole(token);


    if (role !== roleData.basic && role !== roleData.admin && role !== roleData.god && role !== roleData.god) {
        res.status(401);
        return res.send({detail: "You are not allowed to do this."});
    }

    if (username !== tokenName) {
        res.status(400);
        return res.send({detail: "Please use the same token as the user"});
    }

    next();
}

// ------------------- PUT ------------------- //
function updateUser(req, res, next) {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    let username = req.query.username;
    let tokenName = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).name;
    let role = returnRole(token);


    if (role !== roleData.basic && role !== roleData.admin && role !== roleData.god && role !== roleData.god) {
        res.status(401);
        return res.send({detail: "You are not allowed to do this."});
    }

    if (username !== tokenName) {
        res.status(400);
        return res.send({detail: "Please use the same token as the user"});
    }

    next();
}

function transferMoney(req, res, next) {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    let username = req.query.username;
    let tokenName = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).name;
    let role = returnRole(token);


    if (role !== roleData.basic && role !== roleData.admin && role !== roleData.god && role !== roleData.god) {
        res.status(401);
        return res.send({detail: "You are not allowed to do this."});
    }

    if (username !== tokenName) {
        res.status(400);
        return res.send({detail: "Please use the same token as the user"});
    }

    next();
}

// Exporting so we can use it from other files.
module.exports = {
    authRoleGetAllUsers, authGetRoleSpecificUsers, authGetRoleDeletUser, updateUser, transferMoney,
};
