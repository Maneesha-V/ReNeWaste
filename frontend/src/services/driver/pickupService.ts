import axios from "axios";

const API_URL = import.meta.env.VITE_DRIVER_API_URL;

export const getDriverPickups = async (
  wasteType: "Residential" | "Commercial") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/alloted-pickups?wasteType=${wasteType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };

export const markPickupService = async(pickupReqId: string) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/pickup-complete/${pickupReqId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
      } catch (error: any) {
        console.error("error", error);
      } 
}
  
