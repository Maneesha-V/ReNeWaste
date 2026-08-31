import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PartialCommPickupReq } from "../../types/pickupReq/pickupTypes";

export const getCommercialService = async () => {
    const response = await axiosUser.get(API_ROUTES.USER.COMMERCIAL);
    return response;
  };
export const checkAvailabilityService = async(service: string, wasteplantId: string) => {
  const response = await axiosUser.post(API_ROUTES.USER.COMMERCIAL_SERV_CHECK,  
    { service, wasteplantId },
    {
      headers: { 
        "Content-Type": "application/json",
      },
    });
    return response.data;
}
  export const updateCommercialPickupService = async (formData: PartialCommPickupReq) => {
    const response = await axiosUser.patch(API_ROUTES.USER.UPDATE_COMMERCIAL_PICKUP, formData, {
      headers: { 
       "Content-Type": "application/json",
      },
    });
    return response;
};
