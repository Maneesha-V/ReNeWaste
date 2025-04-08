import axios from "axios";

const API_URL = import.meta.env.VITE_WASTE_PLANT_API_URL;

export const getDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  export const createDriver = async (driverData: FormData) => {
    try {
      const response = await axios.post(
        `${API_URL}/add-driver`,
        driverData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("res", response);
      return response.data;
    } catch (error: any) {
      console.error("Error adding driver:", error.response?.data || error);
      throw error;
    }
  };
  export const getDriverById = async (driverId: string) => {
    try {
      const response = await axios.get(`${API_URL}/edit-driver/${driverId}`);
      console.log("res", response);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  export const updateDriverById = async (driverId: string, data: FormData) => {
    try {
      // const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/edit-driver/${driverId}`, data, 
        {
            headers: {
              "Content-Type": "multipart/form-data",
              // Authorization: `Bearer ${token}`
            },
          }
      );
      console.log("res", response);
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };