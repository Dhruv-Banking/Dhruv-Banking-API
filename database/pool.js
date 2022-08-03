// Imports
const { Pool } = require("pg"); // Pooling the requests to THIS and THIS ONLY connection
require("dotenv").config({ path: "../.env" }); // read .env files

// Connection string
const connectionString = process.env.CONNECTIONSTRING;

// Creating the pool:
const pool = new Pool({
  connectionString,
});

// Then we are exporting it for other files to use.
module.exports = pool;
