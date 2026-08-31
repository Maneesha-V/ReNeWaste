import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getNotifications = async () => {
  const response = await axiosUser.get(API_ROUTES.USER.NOTIFICATIONS);
  console.log("response",response);
  
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosUser.patch(`${API_ROUTES.USER.NOTIFICATIONS}/${id}/read`);
  return response.data;
}
