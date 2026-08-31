import { axiosDriver } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { FetchDriverEarnStatsReq } from "../../types/attendance/attendanceTypes";

export const getDriverDashboard = async () => {
  const response = await axiosDriver.get(API_ROUTES.DRIVER.DASHBOARD);
  return response.data.dashboardData;
};

export const getWastePlantSupport = async () => {
  const response = await axiosDriver.get(API_ROUTES.DRIVER.SUPPORT);
  console.log("response", response);
  return response.data.supportData;
};

export const markDriverAttendance = async (status: string) => {
  const response = await axiosDriver.post(API_ROUTES.DRIVER.ATTENDANCE,{
     status
  });
  console.log("response", response);
  return response.data;
};
export const fetchDriverEarnStats = async ({ filter, from ,to }: FetchDriverEarnStatsReq) => {
   const response = await axiosDriver.get(API_ROUTES.DRIVER.STATS_EARN_REWARD,{
     params: { filter, from , to }
  });
  console.log("response", response);
  return response.data; 
}
