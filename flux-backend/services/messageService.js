const Conversation = require("../models/ConversationModel");
const Message = require("../models/MessageModel");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");
const { formatMessage } = require("../utils/formatMessage");

const getMessages = async (conversationId, userId) => {
  if (!conversationId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Conversation ID is required.");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found.");
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant._id.toString() === userId.toString(),
  );
  if (!isParticipant) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a participant of this conversation.",
    );
  }

  const messages = await Message.find({ conversation: conversationId })
    .populate({
      path: "sender",
      select: "_id name username",
    })
    .sort({
      createdAt: 1,
    });

  return messages.map((message) => formatMessage(message));
};

const sendMessage = async (conversationId, content, userId) => {
  const trimmedContent = content.trim();
  if (!conversationId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Conversation ID is required.");
  }

  if (!trimmedContent) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Message is required.");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found.");
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant._id.toString() === userId.toString(),
  );
  if (!isParticipant) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a participant of this conversation.",
    );
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: userId,
    content: trimmedContent,
    type: "text",
    seenBy: [userId],
  });
  if (!message) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Message not saved.");
  }

  await message.populate({
    path: "sender",
    select: "_id name username avatar"
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  return formatMessage(message);
};

module.exports = { getMessages, sendMessage };
