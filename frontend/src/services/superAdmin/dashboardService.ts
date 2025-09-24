import { axiosSuperadmin } from "../../config/axiosClients";

export const getSuperAdminDashboard = async () => {
  const response = await axiosSuperadmin.get(`/dashboard`);
  return response.data;
};