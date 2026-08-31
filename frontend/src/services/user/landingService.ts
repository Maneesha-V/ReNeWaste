import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const searchLocationService = async (location: string) => {
  // const response = await axiosUser.get(`/search?location=${location}`);
    const response = await axiosUser.get(API_ROUTES.USER.SEARCH, {
    params: {
      location,
    },
  });
  return response.data;
};
export const checkServiceAvailbleService = async (description: string) => {
  const response = await axiosUser.get(`${API_ROUTES.USER.CHECK_SERVICE}/${description}`);
  return response.data;
}
export const checkCurrentLocationService = async (latitude: number, longitude: number) => {
  const response = await axiosUser.get(API_ROUTES.USER.CHECK_CURRENT_LOCATION, {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
}