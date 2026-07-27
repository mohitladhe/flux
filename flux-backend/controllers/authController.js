const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const HTTP_STATUS = require("../constants/httpStatus");

const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: result,
  });
});

const verifyUser = asyncHandler(async (req, res) => {
  const result = await authService.verifyUser(req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendOtp(req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const verifyToken = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    loggedIn: true,
    user: req.user,
  });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: result,
  });
});

const verifyPasswordReset = asyncHandler(async (req, res) => {
  const result = await authService.verifyPasswordReset(req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const setNewPassword = asyncHandler(async (req, res) => {
  const result = await authService.setNewPassword(req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
  resendOtp,
  verifyToken,
  requestPasswordReset,
  verifyPasswordReset,
  setNewPassword,
};
