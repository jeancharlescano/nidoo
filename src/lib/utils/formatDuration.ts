export const formatDuration = (startAt: Date, endAt?: Date) => {
  const endTime = endAt ? endAt.getTime() : Date.now();

  const totalMinutes = Math.floor(
    (endTime - startAt.getTime()) / 60000,
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes} min`;
};