// JSW as an import
const jwt = require("jsonwebtoken");

// Middleware function to authenticate the token that was sent in the request headers
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // If error, then we sent an error.
        if (err) return res.status(403).json({result: "Forbidden"});
        // else we know the token is right.
        req.user = user;
        next(); // call the next function since it's a middleware.
    });
}

// Exporting this, so we can use it in any file.
module.exports = {authenticateToken};
