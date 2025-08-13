import axiosUser from "../../api/axiosUser";
import { PartialResidPickupReq } from "../../types/pickupReq/pickupTypes";

export const getResidentialService = async () => {
  const response = await axiosUser.get(`/residential`);
  return response.data;
};
export const updateResidentialPickupService = async (
  formData: PartialResidPickupReq
) => {
  const response = await axiosUser.patch(`/residential/pickup`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Response:", response);
  return response;
};
