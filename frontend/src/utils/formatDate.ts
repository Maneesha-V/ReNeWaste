import dayjs from "dayjs";

export function formatDateToDDMMYYYY(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  export const disablePastDates = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf("day");
  };
  export const disableTimesAfterFive = (current: dayjs.Dayjs | null) => {
    if (!current) return {};
    const now = dayjs();
  
    if (current.isSame(now, 'day')) {
      const disabledHours = Array.from({ length: 24 }, (_, i) => i > 17 ? i : -1).filter(h => h !== -1);
      return {
        disabledHours: () => disabledHours,
      };
    }
  
    return {};
  };