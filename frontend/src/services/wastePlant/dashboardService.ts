import { axiosWasteplant } from "../../config/axiosClients";

  export const getDashboard = async () => {
  const response = await axiosWasteplant.get(`/dashboard`);
  console.log("response",response);
  
    return response.data.dashboardData;
  };