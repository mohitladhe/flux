const User = require("../models/UserModel");
const Conversation = require("../models/ConversationModel");
const HTTP_STATUS = require("../constants/httpStatus");
const ApiError = require("../utils/ApiError");

const createConversation = async (participantId, userId) => {
  if (!participantId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Participant is required.");
  }

  const participant = await User.findById(participantId);

  if (!participant) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
  }

  if (participantId.toString() === userId.toString()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "You cannot create a conversation with yourself.",
    );
  }

  const existingConversation = await Conversation.findOne({
    participants: {
      $all: [userId, participantId],
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await Conversation.create({
    participants: [userId, participantId],
  });

  return conversation;
};

module.exports = { createConversation };
