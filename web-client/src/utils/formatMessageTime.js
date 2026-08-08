export const formatMessageTime = (timestamp) => {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};
