import { axiosUser } from "../../config/axiosClients";

export const searchLocationService = async (location: string) => {
  const response = await axiosUser.get(`/search?location=${location}`);
  return response.data;
};
export const checkServiceAvailbleService = async (description: string) => {
  const response = await axiosUser.get(`/check-service/${description}`);
  return response.data;
}
export const checkCurrentLocationService = async (latitude: number, longitude: number) => {
  const response = await axiosUser.get("/check-current-location", {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
}