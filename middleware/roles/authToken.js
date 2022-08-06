// JSW as an import
const jwt = require("jsonwebtoken");

function authRoleGetAllUsers(req, res, next) {
  var authHeader = req.headers["authorization"],
    decoded;
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  role = decoded.role;
  console.log(role);

  if (role === "ADMIN" || role === "GOD") {
    next();
  } else {
    res.status(401);
    return res.send({ detail: "You are not allowed to do this." });
  }
}

module.exports = {
  authRoleGetAllUsers,
};
