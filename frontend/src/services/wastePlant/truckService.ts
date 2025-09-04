import { axiosWasteplant } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getTrucks = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosWasteplant.get(`/trucks`,{
      params: { page, limit, search },
    });
    console.log("res", response);
    return response.data;
};
export const getAvailableTrucks = async (driverId: string) => {
    const response = await axiosWasteplant.get(
      `/available-trucks?driverId=${driverId}`
    );
    console.log("res", response);
    return response.data;
};
export const createTruck = async (truckData: FormData) => {
    const response = await axiosWasteplant.post(`/add-truck`, truckData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
};
export const getTruckById = async (truckId: string) => {
    const response = await axiosWasteplant.get(`/edit-truck/${truckId}`);
    return response.data;
};
export const updateTruckById = async (truckId: string, data: FormData) => {
    const response = await axiosWasteplant.patch(
      `/edit-truck/${truckId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
};
export const deleteTruckById = async (truckId: string) => {
    const response = await axiosWasteplant.delete(`/delete-truck/${truckId}`);
    return response.data;
};
export const getTruckRequests = async () => {
    const response = await axiosWasteplant.get(`/pending-truck-req`);
    console.log("res", response);
    return response.data;
};

export const getTrucksForDriver = async () => {
    const response = await axiosWasteplant.get(`/trucks-for-driver`);
    console.log("res", response);
    return response.data;
};

export const assignTruckForDriver = async (
  driverId: string,
  truckId: string,
  prevTruckId: string
) => {
    const response = await axiosWasteplant.post(`/assign-truck`, {
      driverId,
      truckId,
      prevTruckId
    });
    console.log("res-assign", response);
    return response.data;
};
