const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");
const HTTP_STATUS = require("../constants/httpStatus");

const searchUser = asyncHandler(async (req, res) => {
  const result = await userService.searchUser(req.query.q, req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

module.exports = { searchUser };
