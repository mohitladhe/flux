const User = require("../models/UserModel");

const searchUser = async (search, currentUserId) => {
  search = search.trim();

  if (!search) {
    const error = new Error("Please enter a name or username.");
    error.status = 400;
    throw error;
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