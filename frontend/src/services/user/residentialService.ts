import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PartialResidPickupReq } from "../../types/pickupReq/pickupTypes";

export const getResidentialService = async () => {
  const response = await axiosUser.get(API_ROUTES.USER.RESIDENTIAL);
  return response.data;
};
export const updateResidentialPickupService = async (
  formData: PartialResidPickupReq
) => {
  const response = await axiosUser.patch(API_ROUTES.USER.UPDATE_RESIDENTIAL_PICKUP, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
