import { axiosDriver } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getWalletService = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosDriver.get("/wallet", {
        params: { page, limit, search },
    });
    return response.data;
}