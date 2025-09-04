import { axiosWasteplant } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";

  export const fetchUsersService = async ({ page, limit, search }: PaginationPayload) => {
      const response = await axiosWasteplant.get(`/users`, {
        params: { page, limit, search },
      });

      return response.data;
  };
  
  export const toggleUserBlockStatusService = async (userId: string, isBlocked: boolean) => {
    const response = await axiosWasteplant.patch(
      `/users/${userId}/block`,{
        isBlocked
      });
    return response.data;
};