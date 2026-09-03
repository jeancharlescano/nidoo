export const formatTimeAgo = (date: Date) => {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "À l'instant";

  if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `Il y a ${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `Il y a ${diffDays} j`;
};