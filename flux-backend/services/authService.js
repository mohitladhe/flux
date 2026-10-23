const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");

const User = require("../models/UserModel");
const PendingUser = require("../models/PendingUserModel");
const PasswordReset = require("../models/PasswordResetModel");
const { sendRegisterEmail, sendPasswordResetEmail } = require("./emailService");

const loginUser = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required.");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid email address.");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
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
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required.");
  }

  // Username validation
  if (username.length < 5 || username.length > 12) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Username must be between 5 and 12 characters.",
    );
  }

  if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Username can contain only letters, numbers, underscores and full stops.",
    );
  }

  // Email validation
  if (!validator.isEmail(email)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid email address.");
  }

  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
  }

  // Check existing username
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Username already exists.");
  }

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists.");
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
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Registration not found.");
  }

  const savedOtp = pendingUser.otp;
  const expiresAt = pendingUser.expiresAt;

  if (expiresAt < new Date()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "OTP has expired.");
  }

  if (savedOtp !== otp.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Incorrect OTP.");
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
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Registration not found.");
  }

  const pendingUser = await PendingUser.findById( pendingUserId );
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
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email is required.");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid email address");
  }
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // OTP expiry (10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PasswordReset.deleteOne({ email });

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "No account found with this email address.",
    );
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
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "OTP is required.");
  }

  const request = await PasswordReset.findById(resetRequestId);
  if (!request) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Password reset request not found.",
    );
  }

  const expiresAt = request.expiresAt;

  if (expiresAt < new Date()) {
    await PasswordReset.findByIdAndDelete({
      _id: request._id,
    });
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "OTP has expired.");
  }

  if (request.otp !== String(otp)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "The verification code is incorrect.",
    );
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
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "A new password is required.");
  }
  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
  }

  const passwordReset = await PasswordReset.findById(resetRequestId);
  if (!passwordReset || !passwordReset.verified) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Password reset request not found.",
    );
  }

  const email = passwordReset.email;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "No account found.");
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

const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "_id username email name avatar avatarLabel avatarGradient about status verified lastSeen isOnline createdAt updatedAt"
  );

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
  }

  return user;
};

const updateMyProfile = async (userId, profileData) => {
  const { name, username, about, status, avatarLabel, avatarGradient } =
    profileData;

  const updates = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length > 50) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Display name must be 50 characters or fewer."
      );
    }

    updates.name = name.trim();
  }

  if (username !== undefined) {
    if (typeof username !== "string") {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid username.");
    }

    const normalizedUsername = username.trim().toLowerCase();

    if (
      normalizedUsername.length < 5 ||
      normalizedUsername.length > 12 ||
      !/^[a-zA-Z0-9_.]+$/.test(normalizedUsername)
    ) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Username must be 5–12 characters and contain only letters, numbers, underscores, or full stops."
      );
    }

    const existingUser = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Username already exists."
      );
    }

    updates.username = normalizedUsername;
  }

  if (about !== undefined) {
    if (typeof about !== "string" || about.length > 140) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "About must be 140 characters or fewer."
      );
    }

    updates.about = about.trim();
  }

  const allowedStatuses = [
    "Available",
    "Busy",
    "Away",
    "Do not disturb",
    "Invisible",
  ];

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid status.");
    }

    updates.status = status;
  }

  if (avatarLabel !== undefined) {
    if (
      typeof avatarLabel !== "string" ||
      avatarLabel.trim().length > 2
    ) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Avatar initials must be at most 2 characters."
      );
    }

    updates.avatarLabel = avatarLabel.trim().slice(0, 2).toUpperCase();
  }

  const allowedGradients = [
    "avatar-primary",
    "avatar-work",
    "avatar-design",
    "avatar-team",
    "avatar-support",
    "avatar-neutral",
  ];

  if (avatarGradient !== undefined) {
    if (!allowedGradients.includes(avatarGradient)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid avatar color."
      );
    }

    updates.avatarGradient = avatarGradient;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select(
    "_id username email name avatar avatarLabel avatarGradient about status verified lastSeen isOnline createdAt updatedAt"
  );

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
  }

  return user;
};

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
  resendOtp,
  requestPasswordReset,
  verifyPasswordReset,
  setNewPassword,
  getMyProfile,
  updateMyProfile,
};
