import { axiosSuperadmin } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getWalletService = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosSuperadmin.get("/wallet", {
        params: { page, limit, search },
    });
    return response.data;
}