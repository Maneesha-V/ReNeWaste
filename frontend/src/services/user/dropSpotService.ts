import { axiosUser } from "../../config/axiosClients";

export const fetchDropSpotsService = async () => {
  const response = await axiosUser.get(`/drop-spots`);
  return response.data;
};
