import { format, isToday, isTomorrow, isSameDay } from "date-fns";

export const formatRideDate = (date: Date) => format(date, "d. MMM yyyy");

export const formatRideTime = (time: Date) => format(time, "HH:mm");

export const formatDayHeading = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE, d MMMM");
};

export const formatMessageTime = (date: Date) =>
  isSameDay(date, new Date()) ? format(date, "HH:mm") : format(date, "d MMM");

export const formatMemberSince = (date: Date) => format(date, "MMMM yyyy");

/** Value for <input type="date"> */
export const toDateInput = (date: Date) => format(date, "yyyy-MM-dd");

/** Value for <input type="time"> */
export const toTimeInput = (date: Date) => format(date, "HH:mm");

