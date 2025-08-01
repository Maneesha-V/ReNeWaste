import axiosSuperadmin from "../../api/axiosSuperadmin";
import { PaginationPayload } from "../../types/common/commonTypes";

export const getPaymentHistory = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosSuperadmin.get(`/payment-history`,{
         params: { page, limit, search }
    });
    console.log("response",response);
    return response.data;
};