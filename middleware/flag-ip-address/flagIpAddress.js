const pool = require("../../database/pool"); // Pooling the connections to one pool
const roleData = require("../roles/roleData");
const jwt = require("jsonwebtoken");

function flagIpAddress(req, res, next) {
    const ip = req.ip;
    const query = "SELECT * FROM flagged_ips WHERE ip=$1";
    const values = [ip];

    // check to see if the ip exists.
    pool.query(query, values, (err, sqlres) => {
        if (err) {
            res.status(500);
            return res.send({detail: "Internal Server Error"});
        } else if (sqlres.rowCount === 0) {
            // else if they don't exist, then we just add them
            const addUserQuery = "INSERT INTO flagged_ips (ip) VALUES ($1)";
            const addUserValues = values;
            pool.query(addUserQuery, addUserValues, (error, sqlResTwo) => {
                if (error) {
                    res.staus(500);
                    return res.send({detail: "Internal Server Error"});
                } else {
                    next();
                }
            });
        } else {
            // IF they are god, then we let them make the account
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
            let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            let role = decoded.role;

            if (role === roleData.god || role === roleData.admin) {
                next();
            } else {
                res.status(400);
                return res.send({
                    detail: "You already exist, please use your previous account",
                });
            }
        }
    });
}

module.exports = {
    flagIpAddress,
};
