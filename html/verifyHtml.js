const verifyEmailHtml = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <title>Verify Email</title>
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
        Please click this email to verify your email. 
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
                    Verify Email:
                  </h1>
                  <p style="margin: 0">
                    Please click the button below to verify your email,
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
                                href="http://127.0.0.1:5000/verifyEmail?token=user.token"
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
                                >Verify email</a
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
                    You received this email because we received a request for the 
                    creation of your account, and to verify your email
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
  </html>`

module.exports = verifyEmailHtml;