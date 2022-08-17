// Imports
const express = require("express"); // Express as an API
let router = express.Router(); // Router
const bcrypt = require("bcrypt"); // Encryption
const pool = require("../../database/pool"); // Pooling the connections to one pool
const auth = require("../../middleware/auth/auth"); // Authentication
const flagIP = require("../../middleware/flag-ip-address/flagIpAddress"); // Flagging the IP
const authTokenPost = require("../../middleware/roles/postUserToken");
const userClass = require("../../BaseClass/UserClass"); // User class
const nodemailer = require("nodemailer");

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

// This is the endpoint to post a user to the database
// It takes 5 parameters:
// @request.body.username
// @request.body.firstname
// @request.body.lastname
// @request.body.email
// @request.body.password
// which are all provided in the request body.
router.post("/", auth.authenticateToken, authTokenPost.authRolePostUser, flagIP.flagIpAddress, async (req, res) => {
    // var to make the user body easier to read.
    const body = req.body;

    // User object
    let user = new userClass(body.username, body.firstname, body.lastname, body.email, body.password, "BASIC", 0, 0);

    let mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Welcome to Dhruv Banking!",
        html: `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <title>Welcome Email</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style type="text/css">
        /**
     * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
     */
        @media screen {
          @font-face {
            font-family: "Source Sans Pro";
            font-style: normal;
            font-weight: 400;
            src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
              url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                format("woff");
          }
  
          @font-face {
            font-family: "Source Sans Pro";
            font-style: normal;
            font-weight: 700;
            src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
              url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                format("woff");
          }
        }
  
        /**
     * Avoid browser level font resizing.
     * 1. Windows Mobile
     * 2. iOS / OSX
     */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
  
        /**
     * Remove extra space added to tables and cells in Outlook.
     */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
  
        /**
     * Better fluid images in Internet Explorer.
     */
        img {
          -ms-interpolation-mode: bicubic;
        }
  
        /**
     * Remove blue links for iOS devices.
     */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
  
        /**
     * Fix centering issues in Android 4.4.
     */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
  
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
  
        /**
     * Collapse table borders to avoid space between cells.
     */
        table {
          border-collapse: collapse !important;
        }
  
        a {
          color: black;
        }
  
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
      </style>
    </head>
    <body>
      <!-- start preheader -->
      <div
        class="preheader"
        style="
          display: none;
          max-width: 0;
          max-height: 0;
          overflow: hidden;
          font-size: 1px;
          line-height: 1px;
          color: #fff;
          opacity: 0;
        "
      >
        A preheader is the short summary text that follows the subject line when
        an email is viewed in the inbox.
      </div>
      <!-- end preheader -->
  
      <!-- start body -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- start logo -->
        <tr>
          <td align="center">
            <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="max-width: 600px"
            >
              <tr>
                <td align="center" valign="top" style="padding: 36px 24px">
                  <a
                    href="https://sendgrid.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="display: inline-block"
                  >
                    <img
                      src="https://raw.githubusercontent.com/Dhruv-Banking/Dhruv-Banking/main/images/Dhruv%20BankingLongggggggggg.png"
                      alt="Logo"
                      border="0"
                      width="600px"
                      style="
                        display: block;
                        width: 600px;
                        max-width: 600px;
                        min-width: 600px;
                      "
                    />
                  </a>
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
          </td>
        </tr>
        <!-- end logo -->
  
        <!-- start hero -->
        <tr>
          <td align="center">
            <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="max-width: 600px"
            ></table>
            <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
          </td>
        </tr>
        <!-- end hero -->
  
        <!-- start copy block -->
        <tr>
          <td align="center">
            <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="max-width: 600px"
            >
              <!-- start copy -->
              <tr>
                <td
                  bgcolor="#ffffff"
                  align="left"
                  style="
                    padding: 24px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                  "
                >
                  <h1
                    style="
                      margin: 0 0 12px;
                      font-size: 32px;
                      font-weight: 400;
                      line-height: 48px;
                    "
                  >
                    Welcome, user.name!
                  </h1>
                  <p style="margin: 0">
                    Thank you so much for signing up to Dhruv Banking. We're happy
                    to welcome you to the family!
                  </p>
                </td>
              </tr>
              <!-- end copy -->
  
              <!-- start button -->
              <tr>
                <td align="left" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="padding: 12px">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="border-radius: 6px">
                              <a
                                href="https://sendgrid.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="
                                  border: 3px solid #1a82e2;
                                  display: inline-block;
                                  padding: 16px 36px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 16px;
                                  color: #1a82e2;
                                  text-decoration: none;
                                  border-radius: 6px;
                                "
                                >Go to Website</a
                              >
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- end button -->
  
              <!-- start copy -->
              <tr>
                <td
                  align="left"
                  bgcolor="#ffffff"
                  style="
                    padding: 24px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    border-bottom: 3px solid #d4dadf;
                  "
                >
                  <p style="margin: 0">
                    Cheers,<br />
                    CEO: Dhruv Rayat
                  </p>
                </td>
              </tr>
              <!-- end copy -->
            </table>
            <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
          </td>
        </tr>
        <!-- end copy block -->
  
        <!-- start footer -->
        <tr>
          <td align="center" style="padding: 24px">
            <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="max-width: 600px"
            >
              <!-- start permission -->
              <tr>
                <td
                  align="center"
                  style="
                    padding: 12px 24px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    font-size: 14px;
                    line-height: 20px;
                    color: #666;
                  "
                >
                  <p style="margin: 0">
                    You received this email because we received a request for
                    creation of your account. If you didn't request create an
                    account (You got hacked. Skill issue ngl).
                  </p>
                </td>
              </tr>
              <!-- end permission -->
            </table>
            <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
          </td>
        </tr>
        <!-- end footer -->
      </table>
      <!-- end body -->
    </body>
  </html>
  `.replace("user.name", user.username),
    };

    console.log(mailOptions)


    // Checking is any item in the user object is null, or empty
    for (let item in user) {
        if ((user[item] === "" || user[item] === undefined)) {
            res.status(400).send({detail: "Please provide all items."});
            return;
        }
    }


    // Query to check if a user with that username exists
    const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
    const existsValues = [user.username];

    // Querying the database
    pool.query(existsQuery, existsValues, async (err, sqlRes) => {
        // If err, then we send an error
        if (err) {
            res.status(500).send({detail: err.stack});
            return;
        }
        // else if user already exists, then we send an error
        else if (sqlRes.rows[0].exists === true) {
            res
                .status(400)
                .send({detail: `User with name '${user.username}' already exists`});
            return;
        }

        // PUT IN FUNCTION
        // Hash password since we know everything is fine
        user.password = await bcrypt.hash(user.password, 12);

        // Query, and values to post the user to the database
        const query = "INSERT INTO users (uuid, username, firstname, lastname, email, password, savings, checkings, role) VALUES($1, $2, $3, $4, $5, $6, $7, $8 , $9)";
        const values = [user.uuid, user.username, user.firstname, user.lastname, user.email, user.password, user.savings, user.checkings, user.role,];

        // Here we are just posting the user to the database
        pool.query(query, values, (err, sqlRes) => {
            // If error, then we send back the error
            if (err) {
                res.status(500).send({detail: err.stack});
                return;
            }

            transporter.sendMail(mailOptions, (err, success) => {
                if (err) {
                    res.status(500).send({detail: "User successfully created", error: {get: "good nlg"}});
                    console.log("bad");
                } else {
                    console.log("ayyay");
                }
            });


            // else we know the user does exist
            res.status(201).send({
                detail: `${user.username} has been successfully created!`,
            });
        });
    });
});

// Exporting the module, so we can use it from the main file
module.exports = router;
