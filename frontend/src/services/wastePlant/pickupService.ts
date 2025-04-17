import axios from "axios";

const API_URL = import.meta.env.VITE_WASTE_PLANT_API_URL;

export const getPickups = async (wasteType: "Residential" | "Commercial") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/pickup-requests?status=Pending&wasteType=${wasteType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };