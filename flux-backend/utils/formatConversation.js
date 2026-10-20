const formatConversation = (conversation, userId) => {
  let otherParticipant = null;
  if (conversation.type === "direct") {
    otherParticipant = conversation.participants.find(
      (participant) => participant._id.toString() !== userId.toString(),
    );
  }

  return {
    _id: conversation._id,
    type: conversation.type,

    display: {
      name:
        conversation.type === "direct"
          ? otherParticipant.name || "@" + otherParticipant.username
          : conversation.groupName,

      username:
        conversation.type === "direct" && otherParticipant.name
          ? otherParticipant.username
          : false,

      avatar:
        conversation.type === "direct"
          ? otherParticipant.avatar
          : conversation.groupAvatar,

      isOnline:
        conversation.type === "direct" ? otherParticipant.isOnline : null,
    },
    participants: conversation.participants,
    admins: conversation.admins,
    groupCreator: conversation.groupCreator,
    lastMessage: conversation.lastMessage
      ? {
          content: conversation.lastMessage.content,
          sender: {
            name: conversation.lastMessage.sender.name,
            username: conversation.lastMessage.sender.username,
          },
          createdAt: conversation.lastMessage.createdAt,
        }
      : null,
    updatedAt: conversation.updatedAt,
  };
};

module.exports = { formatConversation };
