import { format, isToday, isTomorrow, isSameDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { enUS } from "date-fns/locale";

// Always use Los Angeles timezone and US format
const LA_TIMEZONE = "America/Los_Angeles";

export const formatRideDate = (date: Date) => 
  formatInTimeZone(date, LA_TIMEZONE, "MMM d, yyyy", { locale: enUS });

export const formatRideTime = (time: Date) => 
  formatInTimeZone(time, LA_TIMEZONE, "h:mm a", { locale: enUS });

export const formatDayHeading = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return formatInTimeZone(date, LA_TIMEZONE, "EEEE, MMMM d", { locale: enUS });
};

export const formatMessageTime = (date: Date) =>
  isSameDay(date, new Date()) 
    ? formatInTimeZone(date, LA_TIMEZONE, "h:mm a", { locale: enUS })
    : formatInTimeZone(date, LA_TIMEZONE, "MMM d", { locale: enUS });

export const formatMemberSince = (date: Date) => format(date, "MMMM yyyy");

/** Value for <input type="date"> */
export const toDateInput = (date: Date) => format(date, "yyyy-MM-dd");

/** Value for <input type="time"> */
export const toTimeInput = (date: Date) => format(date, "HH:mm");

