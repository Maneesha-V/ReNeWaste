import axios from "axios";
import { WastePlantFormData } from "../../utils/addWastePlantValidator";

const API_URL = import.meta.env.VITE_SUPER_ADMIN_API_URL;

export const createWastePlant = async (wastePlantData: FormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-waste-plant`,
      wastePlantData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("Error adding waste plant:", error.response?.data || error);
    throw error;
  }
};
export const getWastePlants = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/waste-plants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const getWastePlantById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/edit-waste-plant/${id}`);
    console.log("res", response);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const updateWastePlantById = async (id: string, data: FormData) => {
    try {
      // const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/edit-waste-plant/${id}`, data, 
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