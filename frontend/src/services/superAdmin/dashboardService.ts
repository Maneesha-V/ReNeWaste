import { axiosSuperadmin } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getSuperAdminDashboard = async () => {
  const response = await axiosSuperadmin.get(API_ROUTES.SUPER_ADMIN.DASHBOARD);
  return response.data;
};