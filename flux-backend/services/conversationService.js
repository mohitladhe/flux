const User = require("../models/UserModel");
const Conversation = require("../models/ConversationModel");

const createConversation = async (body, userId) => {
  const { participantId } = body;
  if (!participantId) {
    const error = new Error("Participant is required.");
    error.status = 400;
    throw error;
  }

  const participant = await User.findById(participantId);

  if (!participant) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  if (participantId.toString() === userId.toString()) {
    const error = new Error("You cannot create a conversation with yourself.");
    error.status = 400;
    throw error;
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
