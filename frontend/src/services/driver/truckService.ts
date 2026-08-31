import { axiosDriver } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { markReturnedProps } from "../../types/driver/driverTypes";

export const getAvaialbleTrucks = async (wasteplantId: string) => {
  const response = await axiosDriver.get(`${API_ROUTES.DRIVER.ASSIGNED_TRUCKS}/${wasteplantId}`);
  return response.data;
};
export const reqTruck = async () => {
  const response = await axiosDriver.post(API_ROUTES.DRIVER.REQ_TRUCK);
  return response.data;
};

export const markTruckReturnService = async ({
  truckId,
  plantId,
}: markReturnedProps) => {
  console.log({ truckId, plantId });
  const response = await axiosDriver.put(API_ROUTES.DRIVER.TRUCK_MARK_RETURNED, { truckId, plantId });
  return response.data;
};
