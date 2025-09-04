import { axiosDriver } from "../../config/axiosClients";
import { markReturnedProps } from "../../types/driver/driverTypes";

export const getAvaialbleTrucks = async (wasteplantId: string) => {
  const response = await axiosDriver.get(`/assigned-trucks/${wasteplantId}`);
  return response.data;
};
export const reqTruck = async () => {
  const response = await axiosDriver.post(`/req-truck`);
  return response.data;
};

export const markTruckReturnService = async ({
  truckId,
  plantId,
}: markReturnedProps) => {
  console.log({ truckId, plantId });
  await axiosDriver.put(`/truck/mark-returned`, { truckId, plantId });
  return;
};
