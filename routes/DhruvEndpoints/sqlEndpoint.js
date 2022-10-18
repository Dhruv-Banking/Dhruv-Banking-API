// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const pool = require("../../database/pool"); // Pooling the connections to one pool
const auth = require("../../middleware/auth/auth"); // Authentication
const verRole = require("../../middleware/roles/authToken");

// Allowing our app to use json in the request body
router.use(express.json());

// This is the endpoint to delete a user, it takes 2 Parameters:
// @request.body.username, and the
// @request.body.password, so we can authenticate if a user even wants to delete their account
router.post(
  "/",
  auth.authenticateToken,
  verRole.authDhruvEndpoint,
  async (req, res) => {
    // Get data
    const query = req.body.query;

    if (query === "" || query === undefined) {
      return res.status(400).send({ detail: "Please provide a query. loser" });
    }

    // If the query contains the word "drop", then we yell at the user.
    if (query.toLowerCase().includes("drop")) {
      return res
        .status(400)
        .send({
          detail: "Dhruv, I am try -- so hard to stop you from being an idiot",
        });
    }

    // Querying the database with the query.
    pool.query(query, async (err, sqlRes) => {
      // If error, then we return the error
      if (err) {
        res.status(500).send({ detail: err.stack });
        return;
      }

      // Since nothing is returned, then we just say nothing is returned
      if (sqlRes.rowCount === 0) {
        res.status(418).send({ detail: "Nothing to return" });
        return;
      }

      // else we just send the response
      res.send(sqlRes);
    });
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
