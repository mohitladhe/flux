const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/UserModel");
const PendingUser = require("../models/PendingUserModel");
const { sendOtpEmail } = require("./emailService");

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
  await sendOtpEmail(email, otp);

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

  await sendOtpEmail(email, newOtp);

  return {
    message: "A new verification code has been sent to your email.",
  };
};

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
  resendOtp,
};
