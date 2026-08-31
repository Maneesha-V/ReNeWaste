import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const fetchDropSpotsService = async () => {
  const response = await axiosUser.get(API_ROUTES.USER.DROPSPOTS);
  return response.data;
};
