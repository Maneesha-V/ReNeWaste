import axiosWasteplant from "../../api/axiosWasteplant";
import { PaginationPayload } from "../../types/commonTypes";

  export const fetchUsersService = async ({ page, limit, search }: PaginationPayload) => {
    try {
      const response = await axiosWasteplant.get(`/users`, {
        params: { page, limit, search },
      });

      return response.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  
  export const toggleUserBlockStatusService = async (userId: string, isBlocked: boolean) => {
  try {
    const response = await axiosWasteplant.patch(
      `/users/${userId}/block`,{
        isBlocked
      });
    return response.data;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};