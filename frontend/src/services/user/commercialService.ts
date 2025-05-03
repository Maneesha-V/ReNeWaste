import { PartialCommPickupReq } from "../../types/pickupTypes";
import axiosUser from "../../api/axiosUser";

export const getCommercialService = async () => {
    const response = await axiosUser.get(`/commercial`);
    return response;
  };
export const checkAvailabilityService = async(service: string, wasteplantId: string) => {
  const response = await axiosUser.post(`/commercial/service-check`,  
    { service, wasteplantId },
    {
      headers: { 
        "Content-Type": "application/json",
      },
    });
    return response;
}
  export const updateCommercialPickupService = async (formData: PartialCommPickupReq) => {
    const response = await axiosUser.patch(`/commercial/pickup`, formData, {
      headers: { 
       "Content-Type": "application/json",
      },
    });
    console.log("Response:", response);
    return response;
};
