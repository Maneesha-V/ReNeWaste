import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import { PickupCancelData, PickupModifyReq, PickupPlansResponse } from "../../types/pickupReq/pickupTypes";


export const getUserPickups = async ({ page, limit, search, filter }: PaginationPayload): Promise<PickupPlansResponse> => {
  const response = await axiosUser.get(API_ROUTES.USER.PICKUP_PLANS,{
    params: { page, limit, search, filter }
  });
  return response.data;
};
export const cancelUserPickup = async (pickupReqId: string) => {
  const response = await axiosUser.patch(
    `${API_ROUTES.USER.PICKUP_PLAN_CANCEL}/${pickupReqId}`,
    {}
  );
  return response.data;
};

export const cancelPickupReqById = async ({
  pickupReqId,
  reason,
}: PickupCancelData) => {
    const response = await axiosUser.patch(`${API_ROUTES.USER.PICKUP_REQ_CANCEL}/${pickupReqId}`, {
      reason,
    });
    return response.data;
};

export const modifyPickupReqById = async (
 data: PickupModifyReq) => {
    const response = await axiosUser.patch(API_ROUTES.USER.PICKUP_REQ_MODIFY, {
      data
    });
    return response.data;
};