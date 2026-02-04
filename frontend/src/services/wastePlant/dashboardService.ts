import { axiosWasteplant } from "../../config/axiosClients";
import { WPDashboardReq } from "../../types/wasteplant/wastePlantTypes";

  export const getDashboard = async ({ filter, from ,to }: WPDashboardReq) => {
  const response = await axiosWasteplant.get(`/dashboard`,{
    params: { filter, from , to }
  });
  console.log("response",response);
  
    return response.data.dashboardData;
  };