// JSW as an import
const jwt = require("jsonwebtoken");
const roleData = require("./roleData"); // Importing the secret role data

function returnRole(token) {
  let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded.role;
}

// ------------------- GET ------------------- //
function authRolePostUser(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  // Saving the returned role to the var role
  let role = returnRole(token);

  // Veryifying the role to make sure
  if (
    role === roleData.viewer ||
    role === roleData.basic ||
    role === roleData.admin ||
    role === roleData.god
  ) {
    next();
  } else {
    res.status(500);
    return res.send({ detail: "You do not have the right role." });
  }
}

module.exports = {
  authRolePostUser,
};
