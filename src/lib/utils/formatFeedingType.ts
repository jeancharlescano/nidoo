export const formatFeedingType = (type: string) => {
  if (type === "BOTTLE") return "Biberon";
  if (type === "BREAST") return "Tétée";

  return type;
};