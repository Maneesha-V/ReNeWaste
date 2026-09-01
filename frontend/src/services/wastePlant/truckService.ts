import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getTrucks = async ({ page, limit, search }: PaginationPayload) => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.TRUCKS, {
    params: { page, limit, search },
  });
  console.log("res", response);
  return response.data;
};
export const getAvailableTrucks = async (driverId: string) => {
  const response = await axiosWasteplant.get(
    `${API_ROUTES.WASTE_PLANT.AVAILABLE_TRUCKS}?driverId=${driverId}`,
  );
  console.log("res", response);
  return response.data;
};
export const createTruck = async (truckData: FormData) => {
  const response = await axiosWasteplant.post(
    API_ROUTES.WASTE_PLANT.ADD_TRUCK,
    truckData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};
export const getTruckById = async (truckId: string) => {
  const response = await axiosWasteplant.get(
    `${API_ROUTES.WASTE_PLANT.EDIT_TRUCK}/${truckId}`,
  );
  return response.data;
};
export const updateTruckById = async (truckId: string, data: FormData) => {
  const response = await axiosWasteplant.patch(
    `${API_ROUTES.WASTE_PLANT.EDIT_TRUCK}/${truckId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};
export const deleteTruckById = async (truckId: string) => {
  const response = await axiosWasteplant.delete(
    `${API_ROUTES.WASTE_PLANT.DELETE_TRUCK}/${truckId}`,
  );
  return response.data;
};
export const getTruckRequests = async () => {
  const response = await axiosWasteplant.get(
    API_ROUTES.WASTE_PLANT.PENDING_TRUCK_REQ,
  );
  console.log("res", response);
  return response.data;
};

export const getTrucksForDriver = async () => {
  const response = await axiosWasteplant.get(
    API_ROUTES.WASTE_PLANT.TRUCKS_FOR_DRIVER,
  );
  console.log("res", response);
  return response.data;
};

export const assignTruckForDriver = async (
  driverId: string,
  truckId: string,
  prevTruckId: string,
) => {
  const response = await axiosWasteplant.post(
    API_ROUTES.WASTE_PLANT.ASSIGN_TRUCK,
    {
      driverId,
      truckId,
      prevTruckId,
    },
  );
  console.log("res-assign", response);
  return response.data;
};
