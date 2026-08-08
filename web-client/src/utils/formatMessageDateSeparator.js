export const formatMessageDateSeparator = (timestamp) => {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isYesterday) {
    return "Yesterday";
  }

  const isSameYear = date.getFullYear() === now.getFullYear();

  if (isSameYear) {
    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
