import axiosUser from "../../api/axiosUser";
import { PickupPlansResp } from "../../types/pickupReq/pickupTypes";
import { PickupCancelData } from "../../types/wastePlantTypes";

export const getUserPickups = async (): Promise<PickupPlansResp[]> => {
  const response = await axiosUser.get(`/pickup-plans`);
  return response.data.pickups;
};
export const cancelUserPickup = async (pickupReqId: string) => {
  const response = await axiosUser.patch(
    `/pickup-plan/cancel/${pickupReqId}`,
    {}
  );
  return response.data.pickups;
};

export const cancelPickupReqById = async ({
  pickupReqId,
  reason,
}: PickupCancelData) => {
    const response = await axiosUser.patch(`/cancel-pickupReq/${pickupReqId}`, {
      reason,
    });
    return response.data;
};
