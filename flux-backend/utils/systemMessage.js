const Message = require("../models/MessageModel");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");

const createSystemMessage = async ({
  conversationId,
  systemEvent,
  actor,
  target = null,
}) => {
  if (!conversationId || !systemEvent || !actor?._id) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Conversation, system event, and actor are required.",
    );
  }

  const eventMessages = {
    member_joined: ({ target }) =>
      `@${target.username} joined the group`,

    member_added: ({ actor, target }) =>
      `@${actor.username} added @${target.username}`,

    member_removed: ({ actor, target }) =>
      `@${actor.username} removed @${target.username}`,

    admin_promoted: ({ actor, target }) =>
      `@${actor.username} made @${target.username} an admin`,

    admin_demoted: ({ actor, target }) =>
      `@${actor.username} removed @${target.username} as admin`,
  };    

  const buildContent = eventMessages[systemEvent];

  if (!buildContent) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Unsupported system event.",
    );
  }

  if (!actor.username) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Actor username is required.",
    );
  }

  const eventsRequiringTarget = [
    "member_joined",
    "member_added",
    "member_removed",
    "admin_promoted",
    "admin_demoted",
  ];

  if (
    eventsRequiringTarget.includes(systemEvent) &&
    !target?.username
  ) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Target user is required for this system event.",
    );
  }

  const content = buildContent({ actor, target });

  const systemMessage = await Message.create({
    conversation: conversationId,
    sender: null,
    content,
    type: "system",
    systemEvent,
    actor: actor._id,
    target: target?._id ?? null,
  });

  return systemMessage;
};

module.exports = { createSystemMessage };
