import { axiosDriver } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getNotifications = async () => {
  const response = await axiosDriver.get(API_ROUTES.DRIVER.NOTIFICATIONS);
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosDriver.patch(`${API_ROUTES.DRIVER.NOTIFICATIONS}/${id}/read`);
  return response.data;
}