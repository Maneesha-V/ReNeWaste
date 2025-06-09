import axiosWasteplant from "../../api/axiosWasteplant";
import { PickupCancelData } from "../../types/wastePlantTypes";

export const getPickups = async (
  wasteType: "Residential" | "Commercial",
  status: "Pending" | "Scheduled"| "Completed" | "Cancelled" | "Rescheduled") => {
    try {
      const response = await axiosWasteplant.get(`/pickups?status=${status}&wasteType=${wasteType}`);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
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
    return response.data.data;
  }
  export const reschedulePickupService = async (formData: any) => {
    const { pickupReqId, ...rest } = formData;
    const response = await axiosWasteplant.put(`/reschedule-pickup/${pickupReqId}`, 
      rest,
    );
    return response.data.data;
  };

  export const cancelPickupReqById = async ({pickupReqId, reason}: PickupCancelData) => {
    try {
      const response = await axiosWasteplant.put(`/cancel-pickupReq/${pickupReqId}`, 
      { reason }, 
      );
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };

  export const getAvailableDriversByPlace = async (location: string) => {
    try {
      const response = await axiosWasteplant.get(`/drivers-in-place?location=${location}`);
      console.log("res",response);
      
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };