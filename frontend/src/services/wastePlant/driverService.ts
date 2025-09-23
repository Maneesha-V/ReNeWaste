import { axiosWasteplant } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getCreateDriverService = async () => {
  const response = await axiosWasteplant.get(`/add-driver`);
  return response.data;
};

export const getDrivers = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosWasteplant.get(`/drivers`, {
    params: { page, limit, search },
  });
  return response.data;
};
export const createDriver = async (driverData: FormData) => {
  const response = await axiosWasteplant.post(`/add-driver`, driverData, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return response.data;
};
export const getDriverById = async (driverId: string) => {
  const response = await axiosWasteplant.get(`/edit-driver/${driverId}`);
  return response.data;
};
export const updateDriverById = async (driverId: string, data: FormData) => {
  const response = await axiosWasteplant.patch(
    `/edit-driver/${driverId}`,
    data,
    {
      headers: {
        "Content-Type": undefined,
      },
    }
  );
  return response.data;
};
export const deleteDriverById = async (driverId: string) => {
  const response = await axiosWasteplant.delete(`/delete-driver/${driverId}`);
  console.log("response", response);

  return response.data;
};
