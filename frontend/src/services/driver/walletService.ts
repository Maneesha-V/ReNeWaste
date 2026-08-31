import { axiosDriver } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getWalletService = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosDriver.get(API_ROUTES.DRIVER.WALLET, {
        params: { page, limit, search },
    });
    return response.data;
}