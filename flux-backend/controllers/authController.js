const authService = require("../services/authService");



const registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};


const verifyUser = async (req, res) => {
  try {
    const result = await authService.verifyUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const result = await authService.resendOtp(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    return res.status(200).json({
      loggedIn: true,
      user: req.user
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { registerUser, verifyUser, resendOtp, verifyToken };
