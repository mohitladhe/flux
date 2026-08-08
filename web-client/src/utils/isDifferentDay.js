export const isDifferentDay = (previous, current) => {
  if (!previous) return true;

  return new Date(previous).toDateString() !== new Date(current).toDateString();
};
