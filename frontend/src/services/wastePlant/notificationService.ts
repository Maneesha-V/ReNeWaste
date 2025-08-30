import { axiosWasteplant } from "../../config/axiosClients";
import { SaveWasteMeasurementPayload } from "../../types/notificationTypes";

export const getNotifications = async () => {
  const response = await axiosWasteplant.get(`/notifications`);
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosWasteplant.patch(`/notifications/${id}/read`);
  return response.data;
}
export const saveWasteMeasurementService = async(data: SaveWasteMeasurementPayload) => {
  const response = await axiosWasteplant.post(`/waste-measurement/`, data);
  return response.data;
}