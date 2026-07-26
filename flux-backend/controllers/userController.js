const userService = require("../services/userService");

const searchUser = async (req, res) => {
  try {
    const result = await userService.searchUser(req.query.q, req.user._id);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { searchUser };