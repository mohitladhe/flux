export const formatMessageTime = (timestamp) => {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
