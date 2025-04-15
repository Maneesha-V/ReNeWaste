import axios from "axios";
import { PartialCommPickupReq } from "../../types/pickupTypes";

const API_URL = import.meta.env.VITE_API_URL; 

export const getCommercialService = async (token: string) => {
    const response = await axios.get(`${API_URL}/commercial`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  };
export const checkAvailabilityService = async(service: string, wasteplantId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/commercial/service-check`,  
    { service, wasteplantId },
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
}
  export const updateCommercialPickupService = async (formData: PartialCommPickupReq, token: string) => {
    const response = await axios.patch(`${API_URL}/commercial/pickup`, formData, {
      headers: { 
       "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    console.log("Response:", response);
    return response;
};
