export const getEmailContent = (otp: string): string => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification - DSS VJIT</title>
    </head>
    <body
      style="
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
      "
    >
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table
              width="500px"
              border="0"
              cellspacing="0"
              cellpadding="0"
              style="
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              "
            >
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 15px">
                  <img
                    src="https://avatars.githubusercontent.com/u/64025496?s=400&u=11264c9c1eed9fcd07ba3b49f01a954aaa4d9435&v=4"
                    alt="DSS VJIT Logo"
                    width="90"
                    height="90"
                    style="border-radius: 8px"
                  />
                </td>
              </tr>
  
              <!-- Title -->
              <tr>
                <td align="center" style="padding-bottom: 10px">
                  <h2 style="margin: 0; font-size: 22px; color: #333">
                    Verify Your Email
                  </h2>
                </td>
              </tr>
  
              <!-- Welcome Message -->
              <tr>
                <td
                  align="left"
                  style="font-size: 14px; color: #555; padding: 0 20px"
                >
                  <p>Hello,</p>
                  <p>
                    Welcome to
                    <strong>Developer Student Society, VJIT!</strong> We're
                    excited to have you join our community of passionate
                    developers, innovators, and tech enthusiasts.
                  </p>
                  <p>
                    To complete your registration and get exclusive updates,
                    please enter the OTP below:
                  </p>
                </td>
              </tr>
  
              <!-- OTP Box -->
              <tr>
                <td align="center" style="padding: 15px 0">
                  <table
                    border="0"
                    cellspacing="0"
                    cellpadding="10"
                    style="
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      padding: 10px;
                    "
                  >
                    <tr>
                      ${otp
                        .split("")
                        .map(
                          (digit) => `
                        <td
                          style="
                            font-size: 18px;
                            font-weight: bold;
                            color: #333;
                            text-align: center;
                          "
                        >
                          ${digit}
                        </td>
                      `
                        )
                        .join("")}
                    </tr>
                  </table>
                </td>
              </tr>
  
              <!-- Instructions -->
              <tr>
                <td
                  align="left"
                  style="font-size: 14px; color: #555; padding: 0 20px"
                >
                  <p>
                    Copy and paste this OTP on the DSS VJIT registration page to
                    complete the process.
                  </p>
                </td>
              </tr>
  
              <!-- Divider -->
              <tr>
                <td align="center" style="padding: 20px 0">
                  <hr style="border: none; height: 2px; background-color: #ddd" />
                </td>
              </tr>
  
              <!-- Social Media Links -->
              <tr>
                <td align="center" style="padding-bottom: 10px">
                  <p style="font-size: 14px; color: #555; margin: 0">
                    Stay connected with DSS VJIT for events, hackathons, and
                    opportunities.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <a href="https://www.instagram.com/dss_vjit/" target="_blank">
                    <img
                      src="https://img.icons8.com/color/48/000000/instagram-new.png"
                      width="30"
                      height="30"
                      style="margin-right: 10px"
                      alt="Instagram"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/dss-vjit/posts/?feedView=all"
                    target="_blank"
                  >
                    <img
                      src="https://img.icons8.com/color/48/000000/linkedin.png"
                      width="30"
                      height="30"
                      style="margin-right: 10px"
                      alt="LinkedIn"
                    />
                  </a>
                  <a href="https://github.com/dssvjit" target="_blank">
                    <img
                      src="https://img.icons8.com/ios-glyphs/30/github.png"
                      width="30"
                      height="30"
                      alt="GitHub"
                    />
                  </a>
                </td>
              </tr>
  
              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="font-size: 12px; color: #999; padding-top: 20px"
                >
                  <p>
                    © 2025 DSS VJIT |
                    <a href="#" style="color: #777">Privacy Policy</a> |
                    <a href="#" style="color: #777">Contact Us</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
};
