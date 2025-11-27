import { axiosWasteplant } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getWalletService = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosWasteplant.get("/wallet", {
        params: { page, limit, search },
    });
    return response.data;
}