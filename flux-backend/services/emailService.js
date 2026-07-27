require("dotenv").config();
const { Resend } = require("resend");
const verificationEmail = require("../templates/verificationEmail");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendRegisterEmail = async (email, otp) => {
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

const sendPasswordResetEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "Flux <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password.",
      html: passwordResetEmail(otp),
    });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

module.exports = { sendRegisterEmail, sendPasswordResetEmail };
