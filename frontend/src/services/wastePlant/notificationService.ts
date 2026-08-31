import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { SaveWasteMeasurementPayload } from "../../types/wasteCollections/wasteCollectionTypes";

export const getNotifications = async () => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.NOTIFICATIONS);
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosWasteplant.patch(`${API_ROUTES.WASTE_PLANT.NOTIFICATIONS}/${id}/read`);
  return response.data;
}
export const saveWasteMeasurementService = async(data: SaveWasteMeasurementPayload) => {
  const response = await axiosWasteplant.post(`${API_ROUTES.WASTE_PLANT.WASTE_MEASUREMENT}/`, data);
  return response.data;
}