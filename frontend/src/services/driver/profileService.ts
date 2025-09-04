import { axiosDriver } from "../../config/axiosClients";

export const getDriverProfile = async () => {
  const response = await axiosDriver.get(`/profile`);
  return response.data;
};
export const updateProfile = async (formData: FormData) => {
  const response = await axiosDriver.patch(`/edit-profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const fetchDriversService = async (wastePlantId: string) => {
  const response = await axiosDriver.get(
    `/drivers?wastePlantId=${wastePlantId}`
  );
  return response.data;
};
