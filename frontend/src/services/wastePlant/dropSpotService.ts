import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import {
  DropSpotFormValues,
  updateDropSpotReq,
} from "../../types/dropspots/dropSpotTypes";

export const createDropSpotService = async (
  dropSpotData: DropSpotFormValues
) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.ADD_DROP_SPOT, dropSpotData);
  return response.data;
};

export const fetchDropSpotsService = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.DROPSPOTS, {
    params: { page, limit, search },
  });

  return response.data;
};
export const fetchDropSpotByIdService = async (dropSpotId: string) => {
  const response = await axiosWasteplant.get(`${API_ROUTES.WASTE_PLANT.EDIT_DROP_SPOT}/${dropSpotId}`);
  console.log("Thunk response", response);
  return response.data;
};

export const deleteDropSpotServive = async (dropSpotId: string) => {
  const response = await axiosWasteplant.delete(
    `${API_ROUTES.WASTE_PLANT.DELETE_DROP_SPOT}/${dropSpotId}`
  );
  return response.data.data;
};

export const updateDropSpotServive = async ({
  dropSpotId,
  data,
}: updateDropSpotReq) => {
  const response = await axiosWasteplant.patch(
    `${API_ROUTES.WASTE_PLANT.EDIT_DROP_SPOT}/${dropSpotId}`,
    data
  );
  return response.data;
};
