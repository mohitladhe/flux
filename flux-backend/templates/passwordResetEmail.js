const passwordResetEmail = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
    </head>

    <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 20px;">

            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              style="
                max-width:600px;
                background:#ffffff;
                border-radius:16px;
                overflow:hidden;
                border:1px solid #e5e7eb;
              "
            >

              <!-- Header -->
              <tr>
                <td
                  style="
                    background:#4f46e5;
                    color:white;
                    text-align:center;
                    padding:28px;
                    font-size:28px;
                    font-weight:bold;
                  "
                >
                  Flux
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:40px;">

                  <h2
                    style="
                      margin-top:0;
                      color:#111827;
                      font-size:28px;
                    "
                  >
                    Reset your password
                  </h2>

                  <p
                    style="
                      color:#4b5563;
                      line-height:1.7;
                      font-size:16px;
                    "
                  >
                    We received a request to reset the password for your
                    <strong>Flux</strong> account.
                  </p>

                  <p
                    style="
                      color:#4b5563;
                      line-height:1.7;
                      font-size:16px;
                    "
                  >
                    Enter the verification code below to continue resetting your password.
                  </p>

                  <div
                    style="
                      margin:35px 0;
                      text-align:center;
                    "
                  >
                    <span
                      style="
                        display:inline-block;
                        background:#f3f4f6;
                        border:2px dashed #4f46e5;
                        border-radius:12px;
                        padding:18px 40px;
                        font-size:34px;
                        font-weight:bold;
                        letter-spacing:10px;
                        color:#111827;
                      "
                    >
                      ${otp}
                    </span>
                  </div>

                  <p
                    style="
                      color:#6b7280;
                      font-size:15px;
                    "
                  >
                    This verification code will expire in
                    <strong>10 minutes</strong>.
                  </p>

                  <div
                    style="
                      margin:30px 0;
                      padding:18px;
                      background:#eef2ff;
                      border-left:4px solid #4f46e5;
                      border-radius:8px;
                    "
                  >
                    <p
                      style="
                        margin:0;
                        color:#4338ca;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      <strong>Security Tip:</strong><br/>
                      Never share this code with anyone. Flux support will never ask you for your verification code.
                    </p>
                  </div>

                  <p
                    style="
                      color:#6b7280;
                      font-size:15px;
                      line-height:1.7;
                    "
                  >
                    If you didn't request a password reset, you can safely ignore this email.
                    Your password will remain unchanged and no further action is required.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  style="
                    text-align:center;
                    background:#f9fafb;
                    padding:24px;
                    color:#9ca3af;
                    font-size:13px;
                  "
                >
                  © ${new Date().getFullYear()} Flux Messenger
                  <br/>
                  Secure. Private. Encrypted.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};

module.exports = passwordResetEmail;