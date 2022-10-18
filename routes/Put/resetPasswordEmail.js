// Imports
const express = require("express"); // express as API
let router = express.Router(); // Router
const pool = require("../../database/pool"); // Pooling the connections to one pool
const nodemailer = require("nodemailer");
const resetHtml = require("../../html/resetHtml");
const jwt = require("jsonwebtoken");
const roleData = require("../../middleware/roles/roleData");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.use(express.json());

class User {
  constructor(username, role) {
    this.username = username;
    this.role = role;
  }

  get returnUser() {
    return {
      username: this.username,
      role: this.role,
    };
  }
}

router.put("/", async (req, res) => {
  // Create user const's.
  const username = req.query.username;
  let user1 = new User(username, roleData.reset);

  // Check all items in user obj
  for (let item in user1) {
    if (user1[item] === "" || user1[item] === undefined) {
      res.status(500).send({ detail: "Please provide all the details." });
      return;
    }
  }

  const token = generateTokenReset(user1.returnUser);

  const query = "SELECT email FROM users WHERE username=$1";
  const values = [user1.username];

  pool.query(query, values, async (err, sqlRes) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    } else if (sqlRes.rowCount === 0) {
      res.status(400).send({ detail: "You do not exist." });
      return;
    }

    const email = sqlRes.rows[0].email;

    // Send email to user
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: resetHtml.replace("user.token", token).replace("user.token", token),
    };

    transporter.sendMail(mailOptions, (err, success) => {
      if (err) {
        return res
          .status(500)
          .send({
            detail: "Unable to send email.",
            error: { get: "good nlg" },
          });
      } else {
        return res
          .status(200)
          .send({ detail: "successfully sent the reset token!" });
      }
    });
  });
});

// Generate a reset token
function generateTokenReset(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

module.exports = router;
