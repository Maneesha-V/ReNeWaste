import { axiosDriver } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getDriverProfile = async () => {
  const response = await axiosDriver.get(API_ROUTES.DRIVER.PROFILE);
  return response.data;
};
export const updateProfile = async (formData: FormData) => {
  const response = await axiosDriver.patch(API_ROUTES.DRIVER.EDIT_PROFILE, formData, {
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
