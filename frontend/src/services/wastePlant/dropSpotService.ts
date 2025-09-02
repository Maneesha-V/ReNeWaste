import { axiosWasteplant } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";
import {
  DropSpotFormValues,
  updateDropSpotReq,
} from "../../types/dropspots/dropSpotTypes";

export const createDropSpotService = async (
  dropSpotData: DropSpotFormValues
) => {
  const response = await axiosWasteplant.post(`/add-drop-spot`, dropSpotData);
  return response.data;
};

export const fetchDropSpotsService = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosWasteplant.get(`/drop-spots`, {
    params: { page, limit, search },
  });

  return response.data;
};
export const fetchDropSpotByIdService = async (dropSpotId: string) => {
  const response = await axiosWasteplant.get(`/edit-drop-spot/${dropSpotId}`);
  console.log("Thunk response", response);
  return response.data;
};

export const deleteDropSpotServive = async (dropSpotId: string) => {
  const response = await axiosWasteplant.delete(
    `/delete-drop-spot/${dropSpotId}`
  );
  return response.data.data;
};

export const updateDropSpotServive = async ({
  dropSpotId,
  data,
}: updateDropSpotReq) => {
  const response = await axiosWasteplant.patch(
    `/edit-drop-spot/${dropSpotId}`,
    data
  );
  return response.data;
};
