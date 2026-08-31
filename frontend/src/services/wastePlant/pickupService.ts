import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PickupCancelData } from "../../types/pickupReq/pickupTypes";
import { FetchPickupReqParams, ReschedulePickupReq } from "../../types/wasteplant/wastePlantTypes";

export const getPickups = async (params: FetchPickupReqParams) => {
  const response = await axiosWasteplant.get(
    `${API_ROUTES.WASTE_PLANT.PICKUPS}?status=${params.status}&wasteType=${params.wasteType}`,
  );
  return response.data;
};
export const approvePickupService = async (
  pickupReqId: string,
  pickupId: string,
  status: string,
  driverId: string,
  assignedTruckId: string,
) => {
  const response = await axiosWasteplant.patch(
    `${API_ROUTES.WASTE_PLANT.APPROVE_PICKUP}/${pickupReqId}`,
    {
      pickupId,
      status,
      driverId,
      assignedTruckId,
    },
  );
  return response.data;
};
export const reschedulePickupService = async (formData: ReschedulePickupReq) => {
  const { pickupReqId, ...rest } = formData;
  const response = await axiosWasteplant.put(
    `${API_ROUTES.WASTE_PLANT.RESCHEDULE_PICKUP}/${pickupReqId}`,
    rest,
  );
  return response.data;
};

export const cancelPickupReqById = async ({
  pickupReqId,
  reason,
}: PickupCancelData) => {
  const response = await axiosWasteplant.put(
    `${API_ROUTES.WASTE_PLANT.CANCEL_PICKUPREQ}/${pickupReqId}`,
    { reason },
  );
  return response.data;
};

export const getAvailableDriversByPlace = async (location: string) => {
  const response = await axiosWasteplant.get(
    `${API_ROUTES.WASTE_PLANT.DRIVERS_IN_PLACE}?location=${location}`,
  );
  console.log("res", response);

  return response.data;
};
export const approveModifyPickupById = async (pickupReqId: string) => {
  const response = await axiosWasteplant.patch(`${API_ROUTES.WASTE_PLANT.MODIFY_PICKUP}/${pickupReqId}`)
  return response.data;
}
export const rejectModifyPickupById = async (pickupReqId: string) => {
  const response = await axiosWasteplant.patch(`${API_ROUTES.WASTE_PLANT.REJECT_MODIFY_PICKUP}/${pickupReqId}`)
  return response.data;
}