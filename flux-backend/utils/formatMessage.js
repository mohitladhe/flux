const formatMessage = (message) => {
  return {
    _id: message._id,
    conversation: message.conversation,
    sender: {
      _id: message.sender._id,
      name: message.sender.name,
      username: message.sender.username,
      avatar: message.sender.avatar,
    },
    content: message.content,
    type: message.type,
    seenBy: message.seenBy,
    edited: message.edited,
    deletedForEveryone: message.deletedForEveryone,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};

module.exports = { formatMessage };
