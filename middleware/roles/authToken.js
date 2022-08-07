// JSW as an import
const jwt = require("jsonwebtoken");
const roleData = require("./roleData"); // Importing the secret role data

function returnRole(token) {
  let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded.role;
}

// ------------------- GET ------------------- //

function authRoleGetAllUsers(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  // Saving the returned role to the var role
  let role = returnRole(token);

  // Veryifying the role to make sure
  if (role === roleData.admin || role === roleData.god) {
    next();
  } else {
    res.status(401);
    return res.send({ detail: "You don't have the right role" });
  }
}

function authGetRoleSpecificUsers(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  // Saving the returned role to the var role
  let role = returnRole(token);

  // Checking if the role in the token is any of these
  if (
    role === roleData.admin ||
    role === roleData.basic ||
    role === roleData.god
  ) {
    next();
  } else {
    // If not, then we know the user is bad.
    res.status(401);
    return res.send({ detail: "You are not allowed to do this." });
  }
}

// ------------------- DELETE ------------------- //
function authGetRoleDeletUser(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  let role = returnRole(token);

  if (
    role === roleData.admin ||
    role === roleData.basic ||
    role === roleData.god
  ) {
    next();
  } else {
    // If not, then we know the user is bad.
    res.status(401);
    return res.send({ detail: "You are not allowed to do this." });
  }
}

// ------------------- PUT ------------------- //
function updateUser(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  let role = returnRole(token);

  if (
    role === roleData.basic ||
    role === roleData.admin ||
    role === roleData.god
  ) {
    next();
  } else {
    // If not, then we know the user is bad.
    res.status(401);
    return res.send({ detail: "You are not allowed to do this." });
  }
}

function checkingToSavings(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  let role = returnRole(token);

  if (role === roleData.basic || role === roleData.god) {
    next();
  } else {
    // If not, then we know the user is bad.
    res.status(401);
    return res.send({ detail: "You are not allowed to do this." });
  }
}

function savingsToChecking(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  let role = returnRole(token);

  if (role === roleData.basic || role === roleData.god) {
    next();
  } else {
    // If not, then we know the user is bad.
    res.status(401);
    return res.send({ detail: "You are not allowed to do this." });
  }
}

function toAnotherUser(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  let role = returnRole(token);

  if (role === roleData.basic || role === roleData.god) {
    next();
  } else {
    // If not, then we know the user is bad.
    res.status(401);
    return res.send({ detail: "You are not allowed to do this." });
  }
}

// Exporting so we can use it from other files.
module.exports = {
  // Get
  authRoleGetAllUsers,
  authGetRoleSpecificUsers,
  // Delete
  authGetRoleDeletUser,
  // Post
  updateUser,
  checkingToSavings,
  savingsToChecking,
  toAnotherUser,
};
