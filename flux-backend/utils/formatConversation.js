
const formatConversation = (conversation, userId) => {
  let otherParticipant = null;

  const participants = conversation.participants ?? [];

  if (conversation.type === "direct") {
    otherParticipant =
      participants.find(
        (participant) =>
          participant?._id &&
          participant._id.toString() !== userId?.toString()
      ) ?? null;
  }

  const lastMessage = conversation.lastMessage ?? null;
  const lastMessageSender = lastMessage?.sender ?? null;

  const displayName =
    conversation.type === "direct"
      ? otherParticipant
        ? otherParticipant.name ||
          (otherParticipant.username
            ? `@${otherParticipant.username}`
            : "Unknown User")
        : "Unknown User"
      : conversation.groupName || "Unnamed Group";

  return {
    _id: conversation._id,
    type: conversation.type,

    display: {
      name: displayName,

      username:
        conversation.type === "direct" && otherParticipant?.name
          ? otherParticipant.username ?? null
          : false,

      avatar:
        conversation.type === "direct"
          ? otherParticipant?.avatar ?? null
          : conversation.groupAvatar ?? null,

      isOnline:
        conversation.type === "direct"
          ? otherParticipant?.isOnline ?? false
          : null,
    },

    participants,
    admins: conversation.admins ?? [],
    groupCreator: conversation.groupCreator ?? null,

    lastMessage: lastMessage
      ? {
          content: lastMessage.content ?? "",
          sender: lastMessageSender
            ? {
                name: lastMessageSender.name ?? "Unknown User",
                username: lastMessageSender.username ?? null,
              }
            : null,
          createdAt: lastMessage.createdAt ?? null,
        }
      : null,

    updatedAt: conversation.updatedAt,
  };
};

module.exports = { formatConversation };
