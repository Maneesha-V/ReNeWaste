import { axiosWasteplant } from "../../config/axiosClients";
import { PickupCancelData } from "../../types/pickupReq/pickupTypes";
import { FetchPickupReqParams } from "../../types/wasteplant/wastePlantTypes";


export const getPickups = async (
  params: FetchPickupReqParams) => {

      const response = await axiosWasteplant.get(`/pickups?status=${params.status}&wasteType=${params.wasteType}`);
      return response.data;
  };
  export const approvePickupService = async(  
    pickupReqId: string,
    pickupId: string,
    status: string,
    driverId: string,
    assignedTruckId: string ) =>{
    const response = await axiosWasteplant.patch(`/approve-pickup/${pickupReqId}`,
      {
        pickupId,
        status,
        driverId,
        assignedTruckId,
      }
    );
    return response.data;
  }
  export const reschedulePickupService = async (formData: any) => {
    const { pickupReqId, ...rest } = formData;
    const response = await axiosWasteplant.put(`/reschedule-pickup/${pickupReqId}`, 
      rest,
    );
    return response.data;
  };

  export const cancelPickupReqById = async ({pickupReqId, reason}: PickupCancelData) => {
      const response = await axiosWasteplant.put(`/cancel-pickupReq/${pickupReqId}`, 
      { reason }, 
      );
      return response.data;
  };

  export const getAvailableDriversByPlace = async (location: string) => {
      const response = await axiosWasteplant.get(`/drivers-in-place?location=${location}`);
      console.log("res",response);
      
      return response.data;
  };