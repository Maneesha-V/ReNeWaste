import { axiosUser } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";
import { PickupCancelData, PickupModifyReq, PickupPlansResponse } from "../../types/pickupReq/pickupTypes";


export const getUserPickups = async ({ page, limit, search, filter }: PaginationPayload): Promise<PickupPlansResponse> => {
  const response = await axiosUser.get(`/pickup-plans`,{
    params: { page, limit, search, filter }
  });
  return response.data;
};
export const cancelUserPickup = async (pickupReqId: string) => {
  const response = await axiosUser.patch(
    `/pickup-plan/cancel/${pickupReqId}`,
    {}
  );
  return response.data;
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

export const modifyPickupReqById = async (
 data: PickupModifyReq) => {
    const response = await axiosUser.patch(`/modify-pickupReq`, {
      data
    });
    return response.data;
};