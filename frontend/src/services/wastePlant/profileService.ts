import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getPlantProfile = async () => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.PROFILE);
  return response.data;
};
export const updateProfile = async (formData: FormData) => {
  const response = await axiosWasteplant.patch(API_ROUTES.WASTE_PLANT.EDIT_PROFILE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

