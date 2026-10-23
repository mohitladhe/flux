
const formatMessage = (message) => {
  if (!message) return null;

  const sender = message.sender ?? null;

  return {
    _id: message._id,
    conversation: message.conversation,

    sender: sender
      ? {
          _id: sender._id,
          name: sender.name ?? "",
          username: sender.username ?? "",
          avatar: sender.avatar ?? null,
        }
      : null,

    content: message.content ?? "",
    type: message.type ?? "text",
    seenBy: message.seenBy ?? [],
    edited: message.edited ?? false,
    deletedForEveryone: message.deletedForEveryone ?? false,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,

    systemEvent: message.systemEvent ?? null,
    actor: message.actor ?? null,
    target: message.target ?? null,
  };
};

module.exports = { formatMessage };
