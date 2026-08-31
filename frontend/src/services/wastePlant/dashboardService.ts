import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { WPDashboardReq } from "../../types/wasteplant/wastePlantTypes";

  export const getDashboard = async ({ filter, from ,to }: WPDashboardReq) => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.DASHBOARD,{
    params: { filter, from , to }
  });
    return response.data.dashboardData;
  };