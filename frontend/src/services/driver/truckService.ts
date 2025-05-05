import axiosDriver from "../../api/axiosDriver";

export const getAvaialbleTrucks = async (driverId: string) => {
  const response = await axiosDriver.get(
    `/assigned-trucks/${driverId}`
  );
  return response.data.data;
};
