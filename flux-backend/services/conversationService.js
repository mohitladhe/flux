const User = require("../models/UserModel");
const Conversation = require("../models/ConversationModel");
const HTTP_STATUS = require("../constants/httpStatus");
const ApiError = require("../utils/ApiError");
const { formatConversation } = require("../utils/formatConversation");

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

  let conversation = await Conversation.findOne({
    participants: {
      $all: [userId, participantId],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, participantId],
    });
  }

  conversation = await Conversation.findById(conversation._id).populate({
    path: "participants",
    select: "username name avatar isOnline",
  });

  return formatConversation(conversation, userId);
};

const getConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate({
      path: "participants",
      select: "username name avatar isOnline",
    })
    .populate({
      path: "lastMessage",
      select: "content sender createdAt type",
      populate: {
        path: "sender",
        select: "username name",
      },
    })
    .sort({ updatedAt: -1 });

  return conversations.map((conversation) =>
    formatConversation(conversation, userId),
  );
};

const createGroup = async (groupName, participants, userId) => {
  if (!groupName?.trim() || !Array.isArray(participants)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Group Name and participants is required.");
  }
  console.log(participants);

  const uniqueParticipants = [...new Set([userId, ...participants])];
  if (uniqueParticipants.length < 2) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Select at least two members.");
  }

  const users = await User.find({
    _id: { $in: uniqueParticipants },
  });

  if (users.length !== uniqueParticipants.length) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "One or more group members are invalid.",
    );
  }

  let conversation = await Conversation.create({
    type: "group",
    participants: uniqueParticipants,
    groupName: groupName,
    admin: userId,
  });

  conversation = await Conversation.findById(conversation._id).populate({
    path: "participants",
    select: "username name avatar isOnline",
  });

  return formatConversation(conversation, userId);
};

module.exports = { createConversation, getConversations, createGroup };
