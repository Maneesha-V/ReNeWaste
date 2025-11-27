import dayjs from "dayjs";
import { NotificationResp } from "../types/notification/notificationTypes";

export function formatDateToDDMMYYYY(dateStr: string | Date | null): string {
  if (!dateStr) return "-"; 
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "Invalid date";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
export const disablePastDates = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf("day");
};

export const disableTimesAfterFive = (current: any) => {
  const now = dayjs();
  const selectedDay = current ? dayjs(current) : null;

  const isToday = selectedDay && selectedDay.isSame(now, "day");

  const disabledHours: number[] = [];

  for (let i = 0; i < 24; i++) {
    if (i < 9 || i > 17 || (isToday && i < now.hour())) {
      disabledHours.push(i);
    }
  }

  const disabledMinutes = (selectedHour: number) => {
    if (isToday && selectedHour === now.hour()) {
      const minutes: number[] = [];
      for (let i = 0; i < now.minute(); i++) {
        minutes.push(i);
      }
      return minutes;
    }
    return [];
  };

  return {
    disabledHours: () => disabledHours,
    disabledMinutes,
  };
};
export function formatTimeTo12Hour(timeStr: string): string {
  const [hourStr, minute] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${minute} ${ampm}`;
}
export function extractTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
export function extractDateTimeParts(isoString: string) {
  const date = new Date(isoString);
  return {
    date: formatDateToDDMMYYYY(isoString),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export const sortByDateDesc = (a: NotificationResp, b: NotificationResp) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

export const extractDateAndTime24H = (isoString: string | Date) => {
  const dateObj = new Date(isoString);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  const hours = String(dateObj.getHours()).padStart(2, "0");   
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes}`,
  };
}