import axiosUser from "../../api/axiosUser";

export const fetchDropSpotsService = async () => {
  const response = await axiosUser.get(`/drop-spots`);
  return response.data;
};
