import { format, formatDistanceToNow, isValid } from "date-fns";

export const formatDate = (date, pattern = "MMM dd, yyyy") => {
  if (!date) return "";
  const d = new Date(date);
  if (!isValid(d)) return "";
  return format(d, pattern);
};

export const formatRelativeTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (!isValid(d)) return "";
  return formatDistanceToNow(d, { addSuffix: true });
};
