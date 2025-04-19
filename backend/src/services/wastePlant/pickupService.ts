import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import DriverRepository from "../../repositories/driver/driverRepository";
import { PickupFilterParams } from "../../types/wastePlant/authTypes";
import { ApprovePickupDTO, IUpdatePickupRequest, ReschedulePickupDTO } from "../../types/wastePlant/pickupTypes";
import { IPickupService } from "./interface/IPickupService";

class PickupService implements IPickupService {
  async getPickupRequestService(
    filters: PickupFilterParams
  ): Promise<IPickupRequest[]> {
    return await PickupRepository.getPickupsByPlantId(filters);
  }

async approvePickupService(data: ApprovePickupDTO) {
  const { pickupReqId, status, driverId, assignedZone } = data;

  const updatedPickup = await PickupRepository.updatePickupStatusAndDriver(
    pickupReqId,
    { status, driverId }
  );

  if (!updatedPickup) throw new Error("Pickup  not found or update failed");

  await DriverRepository.updateDriverAssignedZone(driverId, assignedZone);
  
  return updatedPickup;
}
async cancelPickupRequest(pickupReqId: string, status: string) {
  try {
    const updatePayload: IUpdatePickupRequest = {
      status,
    };

    const updatedPickupRequest = await PickupRepository.updatePickupRequest(pickupReqId, updatePayload);
    return updatedPickupRequest;
  } catch (error) {
    console.error(error);
    throw new Error("Error in cancelling the pickup request.");
  }
}
async reschedulePickup(pickupReqId: string, data: ReschedulePickupDTO) {
  const existingPickup = await PickupRepository.getPickupById(pickupReqId);

  if (!existingPickup) {
    throw new Error("Pickup request not found");
  }

  await DriverRepository.updateDriverAssignedZone(data.driverId,data.assignedZone);
  const updatedPickup = await PickupRepository.updatePickupDate(pickupReqId, {
    driverId: data.driverId,
    rescheduledPickupDate: data.rescheduledPickupDate,
    status: data.status, 
  });
  if (!updatedPickup) {
    throw new Error("Failed to reschedule pickup");
  }
  return updatedPickup;
}
}
export default new PickupService();
