const verificationEmail = (otp) => {
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

                <tr>
                    <td style="padding:40px;">

                    <h2
                        style="
                        margin-top:0;
                        color:#111827;
                        font-size:28px;
                        "
                    >
                        Verify your email
                    </h2>

                    <p
                        style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                        "
                    >
                        Welcome to <strong>Flux</strong>.
                    </p>

                    <p
                        style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                        "
                    >
                        Use the verification code below to complete your registration.
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
                        This code will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p
                        style="
                        color:#6b7280;
                        font-size:15px;
                        line-height:1.7;
                        "
                    >
                        If you didn't create a Flux account,
                        you can safely ignore this email.
                    </p>

                    </td>
                </tr>

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

module.exports = verificationEmail;