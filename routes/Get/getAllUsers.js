// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const pool = require("../../database/pool"); // Pooling the connections to one pool
const auth = require("../../middleware/auth/auth"); // Authentication

// This is the endpoint to delete a user, it takes 0 Parameters
// instead it takes only a token.
router.get("/", auth.authenticateToken, (req, res) => {
  // querying the database for all users
  pool.query('SELECT * FROM "public"."users" LIMIT 100', (err, sqlRes) => {
    // If err, then throw an error, else we just send back the array
    if (err) {
      res.status(500).send({ detail: err.stack });
    } else {
      res.send(sqlRes.rows);
    }
  });
});

// Exporting the module so we can use it from the main file
module.exports = router;
