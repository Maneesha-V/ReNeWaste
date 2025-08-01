import { PartialResidPickupReq } from "../../types/pickupTypes";
import axiosUser from "../../api/axiosUser";

export const getResidentialService = async () => {
  const response = await axiosUser.get(`/residential`);
  return response;
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
