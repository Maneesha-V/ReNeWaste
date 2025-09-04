import { axiosWasteplant } from "../../config/axiosClients";

export const getPlantProfile = async () => {
  const response = await axiosWasteplant.get(`/profile`);
  return response.data;
};
export const updateProfile = async (formData: FormData) => {
  const response = await axiosWasteplant.patch(`/edit-profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

