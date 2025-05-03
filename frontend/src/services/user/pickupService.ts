import axiosUser from "../../api/axiosUser";

export const getUserPickups = async () => {
    const token = localStorage.getItem("token");
    console.log("token",token);
    
    const response = await axiosUser.get(`/pickup-plans`);
      return response.data.pickups;
  };
  export const cancelUserPickup = async (pickupReqId: string) => {
    const response = await axiosUser.patch(`/pickup-plans/cancel/${pickupReqId}`, {});
      return response.data.pickups;
  };