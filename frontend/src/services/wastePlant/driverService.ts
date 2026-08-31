import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getCreateDriverService = async () => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.ADD_DRIVER);
  return response.data;
};

export const getDrivers = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.DRIVERS, {
    params: { page, limit, search },
  });
  return response.data;
};
export const createDriver = async (driverData: FormData) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.ADD_DRIVER, driverData, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return response.data;
};
export const getDriverById = async (driverId: string) => {
  const response = await axiosWasteplant.get(`${API_ROUTES.WASTE_PLANT.EDIT_DRIVER}/${driverId}`);
  return response.data;
};
export const updateDriverById = async (driverId: string, data: FormData) => {
  const response = await axiosWasteplant.patch(
    `${API_ROUTES.WASTE_PLANT.EDIT_DRIVER}/${driverId}`,
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
  const response = await axiosWasteplant.delete(`${API_ROUTES.WASTE_PLANT.DELETE_DRIVER}/${driverId}`);
  console.log("response", response);

  return response.data;
};
