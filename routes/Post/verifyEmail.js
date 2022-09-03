// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const auth = require("../../middleware/auth/auth"); // Authentication
const authTokenPost = require("../../middleware/roles/postUserToken");
const userClass = require("../../BaseClass/UserClass"); // User class
const nodemailer = require("nodemailer");
const html = require("../../html/welcomeHtml")
const {v4: uuid4} = require("uuid");
const jwt = require("jsonwebtoken");
const roleData = require("../../middleware/roles/roleData");
const verifyEmailHtml = require("../../html/verifyHtml");
const bcrypt = require("bcrypt"); // Encryption

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

// Allowing out app to use json in the request body
router.use(express.json());

// This is the endpoint to Verify an email
// It takes 5 parameters:
// @request.body.username
// @request.body.firstname
// @request.body.lastname
// @request.body.email
// @request.body.password
// which are all provided in the request body.
router.post("/", async (req, res) => {
    // var to make the user body easier to read.
    const body = req.body;

    // User object
    let hashedPassword = await bcrypt.hash(body.password, 12);

    let user = new userClass(uuid4(undefined, undefined, undefined), body.username, body.firstname, body.lastname, body.email, hashedPassword, roleData.verifyEmail, 0, 0);

    // Checking is any item in the user object is null, or empty
    for (let item in user) {
        if ((user[item] === "" || user[item] === undefined)) {
            res.status(400).send({detail: "Please provide all items."});
            return;
        }
    }

    // Token Var
    let token = createNewPostUserToken(user.returnJson);

    let mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Verify email",
        html: verifyEmailHtml.replace("user.token", token),
    };

    transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
            res.status(500).send({detail: "Error sending email. Please try again later."});
        }
    })

    res.send({detail: "Successfully sent email, please check your inbox to verify your email."})
});

function createNewPostUserToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
}

// Exporting the module, so we can use it from the main file
module.exports = router;
