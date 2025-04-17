import axios from "axios";

const API_URL = import.meta.env.VITE_WASTE_PLANT_API_URL;

export const getTrucks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/trucks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res", response);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  export const createTruck = async (truckData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/add-truck`,
        truckData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding truck:", error.response?.data || error);
      throw error;
    }
  };
  export const getTruckById = async (truckId: string) => {
    try {
      const response = await axios.get(`${API_URL}/edit-truck/${truckId}`);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  export const updateTruckById = async (truckId: string, data: FormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/edit-truck/${truckId}`, data, 
        {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
          }
      );
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };
  export const deleteTruckById = async (truckId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/delete-truck/${truckId}`, {
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