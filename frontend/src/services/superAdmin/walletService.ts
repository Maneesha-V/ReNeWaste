import { axiosSuperadmin } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getWalletService = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosSuperadmin.get(API_ROUTES.SUPER_ADMIN.WALLET, {
        params: { page, limit, search },
    });
    return response.data;
}