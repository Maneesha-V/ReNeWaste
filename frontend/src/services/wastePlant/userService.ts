import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";

export const fetchUsersService = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.USERS, {
    params: { page, limit, search },
  });

  return response.data;
};

export const toggleUserBlockStatusService = async (
  userId: string,
  isBlocked: boolean,
) => {
  const response = await axiosWasteplant.patch(
    `${API_ROUTES.WASTE_PLANT.USERS}/${userId}/block`,
    {
      isBlocked,
    },
  );
  return response.data;
};
