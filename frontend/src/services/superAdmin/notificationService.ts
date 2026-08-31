import { axiosSuperadmin } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getNotifications = async () => {
  const response = await axiosSuperadmin.get(API_ROUTES.SUPER_ADMIN.NOTIFICATIONS);
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosSuperadmin.patch(`${API_ROUTES.SUPER_ADMIN.NOTIFICATIONS}/${id}/read`);
  return response.data;
}