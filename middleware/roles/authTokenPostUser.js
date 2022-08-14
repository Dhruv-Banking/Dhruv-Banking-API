// JSW as an import
const jwt = require("jsonwebtoken");

function returnUserName(token) {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.name;
}

// ------------------- POST ------------------- //
function authUserPostUsername(req, res, next) {
    var authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    // Saving the returned role to the var role
    let tokenUsername = returnUserName(token);

    const queryUsername = req.query.username;
    if (tokenUsername === queryUsername) {
        next();
    } else {
        res.status(400);
        return res.send({
            detail: "Please get a token with the same username as the user you are trying to update",
        });
    }
}

module.exports = {
    authUserPostUsername,
};
