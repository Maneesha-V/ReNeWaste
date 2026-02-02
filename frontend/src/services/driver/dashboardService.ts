import { axiosDriver } from "../../config/axiosClients";
import { FetchDriverEarnStatsReq } from "../../types/attendance/attendanceTypes";

export const getDriverDashboard = async () => {
  const response = await axiosDriver.get(`/dashboard`);
  return response.data.dashboardData;
};

export const getWastePlantSupport = async () => {
  const response = await axiosDriver.get(`/support`);
  console.log("response", response);
  return response.data.supportData;
};

export const markDriverAttendance = async (status: string) => {
  const response = await axiosDriver.post(`/attendance`,{
     status
  });
  console.log("response", response);
  return response.data;
};
export const fetchDriverEarnStats = async ({ filter, from ,to }: FetchDriverEarnStatsReq) => {
   const response = await axiosDriver.get(`/stats/earn/reward`,{
     params: { filter, from , to }
  });
  console.log("response", response);
  return response.data; 
}
