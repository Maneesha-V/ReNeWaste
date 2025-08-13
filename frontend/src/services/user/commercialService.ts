import axiosUser from "../../api/axiosUser";
import { PartialCommPickupReq } from "../../types/pickupReq/pickupTypes";

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
    return response.data;
}
  export const updateCommercialPickupService = async (formData: PartialCommPickupReq) => {
    const response = await axiosUser.patch(`/commercial/pickup`, formData, {
      headers: { 
       "Content-Type": "application/json",
      },
    });
    return response;
};
