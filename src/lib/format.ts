import { format, isToday, isTomorrow, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";

// Detect if user is in US based on browser locale
const isUSLocale = () => {
  if (typeof navigator === "undefined") return false;
  const locale = navigator.language || "en-US";
  return locale.startsWith("en-US") || locale.startsWith("en-");
};

export const formatRideDate = (date: Date) => 
  isUSLocale() 
    ? format(date, "MMM d, yyyy", { locale: enUS }) 
    : format(date, "d. MMM yyyy");

export const formatRideTime = (time: Date) => 
  isUSLocale() 
    ? format(time, "h:mm a", { locale: enUS }) 
    : format(time, "HH:mm");

export const formatDayHeading = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return isUSLocale()
    ? format(date, "EEEE, MMMM d", { locale: enUS })
    : format(date, "EEEE, d MMMM");
};

export const formatMessageTime = (date: Date) =>
  isSameDay(date, new Date()) 
    ? (isUSLocale() ? format(date, "h:mm a", { locale: enUS }) : format(date, "HH:mm"))
    : (isUSLocale() ? format(date, "MMM d", { locale: enUS }) : format(date, "d MMM"));

export const formatMemberSince = (date: Date) => format(date, "MMMM yyyy");

/** Value for <input type="date"> */
export const toDateInput = (date: Date) => format(date, "yyyy-MM-dd");

/** Value for <input type="time"> */
export const toTimeInput = (date: Date) => format(date, "HH:mm");

