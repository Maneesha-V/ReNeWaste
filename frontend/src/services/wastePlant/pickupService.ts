import axios from "axios";

const API_URL = import.meta.env.VITE_WASTE_PLANT_API_URL;

export const getPickups = async (
  wasteType: "Residential" | "Commercial",
  status: "Pending" | "Scheduled"| "Completed" | "Cancelled" | "Rescheduled") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/pickup-requests?status=${status}&wasteType=${wasteType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    assignedZone: string ) =>{
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/approve-pickup/${pickupReqId}`,
      {
        pickupId,
        status,
        driverId,
        assignedZone
      }, 
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }
  export const reschedulePickupService = async (formData: any) => {
    const token = localStorage.getItem("token");
    const { pickupReqId, ...rest } = formData;
    const response = await axios.put(`${API_URL}/reschedule-pickup/${pickupReqId}`, 
      rest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  };

  export const getScheduledPickups = async (wasteType: "Residential" | "Commercial") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/scheduled-pickups?status=Scheduled&wasteType=${wasteType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  export const cancelPickupReqById = async (pickupReqId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/cancel-pickupReq/${pickupReqId}`, 
      { status }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };