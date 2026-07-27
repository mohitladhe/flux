const User = require("../models/UserModel");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");

const searchUser = async (search, currentUserId) => {
  search = search.trim();

  if (!search) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Please enter a name or username.",
    );
  }

  return await User.find({
    _id: {
      $ne: currentUserId,
    },
    $or: [
      {
        username: {
          $regex: search,
          $options: "i",
        },
      },
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  })
    .select("name username avatar about isOnline")
    .limit(10);
};

module.exports = { searchUser };
