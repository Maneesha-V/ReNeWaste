import axiosWasteplant from "../../api/axiosWasteplant";
import { PaginationPayload } from "../../types/commonTypes";
import { DropSpotFormValues } from "../../types/dropSpotTypes";

  export const createDropSpotService = async (dropSpotData: any) => {
    try {
      const response = await axiosWasteplant.post(
        `/add-drop-spot`,
        dropSpotData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding drop spot:", error.response?.data || error);
      throw error;
    }
  };
  
  export const fetchDropSpotsService = async ({ page, limit, search }: PaginationPayload) => {
    try {
      const response = await axiosWasteplant.get(`/drop-spots`,{
        params: { page, limit, search },
      });

      return response.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
    export const fetchDropSpotByIdService = async (dropSpotId: string) => {
    try {
      const response = await axiosWasteplant.get(`/edit-drop-spot/${dropSpotId}`);
      console.log("Thunk response", response);
      return response.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  
     export const deleteDropSpotServive = async (dropSpotId: string) => {
    try {
      const response = await axiosWasteplant.delete(`/delete-drop-spot/${dropSpotId}`);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  
    export const updateDropSpotServive = async (dropSpotId: string, data: DropSpotFormValues) => {
    try {
      const response = await axiosWasteplant.patch(`/edit-drop-spot/${dropSpotId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };