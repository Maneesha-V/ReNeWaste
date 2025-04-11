import axios from "axios";
import { PartialResidPickupReq } from "../../types/pickupTypes";

const API_URL = import.meta.env.VITE_API_URL; 

export const getResidentialService = async (token: string) => {
      const response = await axios.get(`${API_URL}/residential`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
  };
  export const updateResidentialPickupService = async (formData: PartialResidPickupReq, token: string) => {
    const response = await axios.patch(`${API_URL}/residential/pickup`, formData, {
      headers: { 
       "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    console.log("Response:", response);
    return response;
};