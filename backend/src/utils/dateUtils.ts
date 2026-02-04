type DashboardFilter = "daily" | "weekly" | "monthly" | "custom";

export function getDateRange(
  filter: string,
  from?: string,
  to?: string,
): { start?: Date; end?: Date } {
  const now = new Date();
  switch (filter) {
    case "daily": {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "weekly": {
      const start = new Date();
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    case "monthly": {
      // const start = new Date(now.getFullYear(), now.getMonth(), 1);
      // start.setHours(0,0,0,0);
      // const end = new Date(now.getFullYear(), now.getMonth()+1, 0);
      // end.setHours(23, 59, 59, 999);
      const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const end = new Date(
        Date.UTC(now.getUTCFullYear(), 11, 31, 23, 59, 59, 999),
      );

      console.log("MONTH RANGE", start, end);

      return { start, end };
    }
    case "yearly": {
      return {};
    }
    case "custom": {
      if (!from || !to) return {};
      return {
        start: new Date(from),
        end: new Date(to),
      };
    }
    default:
      return {};
  }
}
export function getGroupFormat(filter: string): string {
  switch (filter) {
    case "daily":
      return "%Y-%m-%d";

    case "monthly":
      return "%Y-%m";

    case "yearly":
      return "%Y";

    default:
      return "%Y-%m-%d";
  }
}
