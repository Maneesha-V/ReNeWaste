import axiosDriver from "../../api/axiosDriver";

export const getDriverDashboard = async () => {
  const response = await axiosDriver.get(`/dashboard`);
  return response.data.dashboardData;
};

export const getWastePlantSupport = async () => {
  const response = await axiosDriver.get(`/support`);
  console.log("response", response);
  return response.data.supportData;
};
