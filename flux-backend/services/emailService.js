const { Resend } = require("resend");
const verificationEmail = require("../templates/verificationEmail");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "Flux <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Flux account.",
      html: verificationEmail(otp),
    });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

module.exports = { sendOtpEmail, };