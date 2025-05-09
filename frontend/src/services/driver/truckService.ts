import axiosDriver from "../../api/axiosDriver";

export const getAvaialbleTrucks = async (driverId: string) => {
  const response = await axiosDriver.get(
    `/assigned-trucks/${driverId}`
  );
  return response.data.data;
};
export const reqTruck = async () => {
  const response = await axiosDriver.post(`/req-truck`);
  return response.data.data;
};