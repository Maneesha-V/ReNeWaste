import { axiosSuperadmin } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";

export const viewLicenseDoc = async (publicId: string) => {
  const response = await axiosSuperadmin.get(
    `${API_ROUTES.SUPER_ADMIN.VIEW_LICENSE}/${encodeURIComponent(publicId)}`,
    {
      responseType: "blob",
    },
  );
  console.log("response", response);

  return response.data;
};
export const getAddWastePlant = async () => {
  const response = await axiosSuperadmin.get(API_ROUTES.SUPER_ADMIN.ADD_WASTE_PLANT);
  console.log("res", response);
  return response.data;
};
export const createWastePlant = async (wastePlantData: FormData) => {
  const response = await axiosSuperadmin.post(
    API_ROUTES.SUPER_ADMIN.ADD_WASTE_PLANT,
    wastePlantData,
  );
  console.log("res", response);
  return response.data;
};
export const getWastePlants = async ({
  page,
  limit,
  search,
  capacityRange,
}: PaginationPayload) => {
  const response = await axiosSuperadmin.get(API_ROUTES.SUPER_ADMIN.WASTE_PLANTS, {
    params: { page, limit, search, capacityRange },
  });
  return response.data;
};
export const getWastePlantById = async (id: string) => {
  const response = await axiosSuperadmin.get(`${API_ROUTES.SUPER_ADMIN.EDIT_WASTE_PLANT}/${id}`);
  return response.data;
};
export const updateWastePlantById = async (id: string, data: FormData) => {
  const response = await axiosSuperadmin.patch(
    `${API_ROUTES.SUPER_ADMIN.EDIT_WASTE_PLANT}/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  console.log("res", response);
  return response.data;
};
export const deleteWastePlantById = async (id: string) => {
  const response = await axiosSuperadmin.delete(`${API_ROUTES.SUPER_ADMIN.DELETE_WASTE_PLANT}/${id}`);
  console.log("res", response);
  return response.data;
};

export const getPostOffices = async (pincode: string) => {
  const response = await axiosSuperadmin.post(`/location/${pincode}`);
  console.log("res", response);
  return response.data;
};
export const togglePlantBlockStatusService = async (
  plantId: string,
  isBlocked: boolean,
) => {
  const response = await axiosSuperadmin.patch(`/${plantId}/block`, {
    isBlocked,
  });
  return response.data;
};
