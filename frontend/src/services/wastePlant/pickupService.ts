import axiosWasteplant from "../../api/axiosWasteplant";

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
    // assignedZone: string,
    assignedTruckId: string ) =>{
    const response = await axiosWasteplant.patch(`/approve-pickup/${pickupReqId}`,
      {
        pickupId,
        status,
        driverId,
        // assignedZone,
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

  export const cancelPickupReqById = async (pickupReqId: string, status: string) => {
    try {
      const response = await axiosWasteplant.put(`/cancel-pickupReq/${pickupReqId}`, 
      { status }, 
      );
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };