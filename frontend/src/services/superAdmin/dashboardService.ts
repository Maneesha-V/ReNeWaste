import axiosSuperadmin from "../../api/axiosSuperadmin";

export const getSuperAdminDashboard = async () => {
  const response = await axiosSuperadmin.get(`/dashboard`);
  return response.data.dashboardData;
};