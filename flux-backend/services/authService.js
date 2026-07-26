const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/UserModel");
const PendingUser = require("../models/PendingUserModel");
const PasswordReset = require("../models/PasswordResetModel");
const { sendRegisterEmail, sendPasswordResetEmail } = require("./emailService");

const loginUser = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    const error = new Error("All fields are required.");
    error.status = 400;
    throw error;
  }

  if (!validator.isEmail(email)) {
    const error = new Error("Invalid email address.");
    error.status = 400;
    throw error;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    const error = new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User does not exist.");
    error.status = 409;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  return {
    message: "User LoggedIn",
    token,
    loggedIn: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};

const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // Validate required fields
  if (!username || !email || !password) {
    const error = new Error("All fields are required.");
    error.status = 400;
    throw error;
  }

  // Username validation
  if (username.trim().length < 3) {
    const error = new Error("Username must be at least 3 characters long.");
    error.status = 400;
    throw error;
  }

  // Email validation
  if (!validator.isEmail(email)) {
    const error = new Error("Invalid email address.");
    error.status = 400;
    throw error;
  }

  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    const error = new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
    error.status = 400;
    throw error;
  }

  // Check existing username
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    const error = new Error("Username already exists.");
    error.status = 409;
    throw error;
  }

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists.");
    error.status = 409;
    throw error;
  }

  // Remove previous pending registration
  await PendingUser.deleteOne({ email });
  await PendingUser.deleteOne({ username });

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // OTP expiry (10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Save pending user
  const pendingUser = await PendingUser.create({
    username,
    email,
    passwordHash,
    otp,
    expiresAt,
  });

  // Send OTP to User for Verification
  await sendRegisterEmail(email, otp);

  return {
    message: "Registration initiated.",
    pendingUserId: pendingUser._id,
  };
};

const verifyUser = async (verificationData) => {
  const { pendingUserId, otp } = verificationData;
  const pendingUser = await PendingUser.findById(pendingUserId);

  if (!pendingUser) {
    const error = new Error("Registration not found.");
    error.status = 400;
    throw error;
  }

  const savedOtp = pendingUser.otp;
  const expiresAt = pendingUser.expiresAt;

  if (expiresAt < new Date()) {
    const error = new Error("OTP has expired.");
    error.status = 409;
    throw error;
  }

  if (savedOtp !== otp.toString()) {
    const error = new Error("Incorrect OTP.");
    error.status = 409;
    throw error;
  }

  const user = await User.create({
    username: pendingUser.username,
    email: pendingUser.email,
    passwordHash: pendingUser.passwordHash,
    verified: true,
  });

  await PendingUser.deleteOne({ _id: pendingUser._id });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  return {
    message: "Account Verified.",
    token,
    user,
  };
};

const resendOtp = async (pendingUserId) => {
  if (!pendingUserId) {
    const error = new Error("Registration Not Found.");
    error.status = 404;
    throw error;
  }

  const pendingUser = await PendingUser.findById({ pendingUserId });
  const email = pendingUser.email;

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

  const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  pendingUser.otp = newOtp;
  pendingUser.expiresAt = newExpiresAt;
  await pendingUser.save();

  await sendRegisterEmail(email, newOtp);

  return {
    message: "A new verification code has been sent to your email.",
  };
};

const requestPasswordReset = async (userData) => {
  const { email } = userData;
  if (!email) {
    const error = new Error("Email is required.");
    error.status = 400;
    throw error;
  }

  if (!validator.isEmail(email)) {
    const error = new Error("Invalid email address.");
    error.status = 400;
    throw error;
  }
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // OTP expiry (10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PasswordReset.deleteOne({ email });

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const error = new Error("No account found with this email address.");
    error.status = 400;
    throw error;
  }

  const passwordReset = await PasswordReset.create({
    email: email,
    otp: otp,
    expiresAt: expiresAt,
  });

  await sendPasswordResetEmail(email, otp);

  return {
    message: "Verification code sent successfully.",
    resetRequestId: passwordReset._id,
  };
};

const verifyPasswordReset = async (userData) => {
  const { resetRequestId, otp } = userData;
  if (!resetRequestId || !otp) {
    const error = new Error("OTP is required.");
    error.status = 400;
    throw error;
  }

  const request = await PasswordReset.findById(resetRequestId);
  if (!request) {
    const error = new Error("Password reset request not found.");
    error.status = 400;
    throw error;
  }

  const expiresAt = request.expiresAt;

  if (expiresAt < new Date()) {
    await PasswordReset.findByIdAndDelete({
      _id: request._id,
    });
    const error = new Error("OTP has expired.");
    error.status = 409;
    throw error;
  }

  if (request.otp !== String(otp)) {
    const error = new Error("The verification code is incorrect.");
    error.status = 409;
    throw error;
  }

  request.verified = true;
  await request.save();

  return {
    message: "OTP verified successfully.",
    resetRequestId: request._id,
  };
};

const setNewPassword = async (userData) => {
  const { resetRequestId, password } = userData;
  if (!resetRequestId || !password) {
    const error = new Error("A new password is required.");
    error.status = 400;
    throw error;
  }
  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    const error = new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
    error.status = 400;
    throw error;
  }

  const passwordReset = await PasswordReset.findById(resetRequestId);
  if (!passwordReset || !passwordReset.verified) {
    const error = new Error("Password reset request not found.");
    error.status = 400;
    throw error;
  }

  const email = passwordReset.email;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("No account found.");
    error.status = 404;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  user.passwordHash = passwordHash;
  await user.save();

  await PasswordReset.deleteOne({
    _id: passwordReset._id,
  });

  return {
    message: "Password updated successfully.",
  };
};

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
  resendOtp,  
  requestPasswordReset,
  verifyPasswordReset,
  setNewPassword,
};
