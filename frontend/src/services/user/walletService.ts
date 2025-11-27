import { axiosUser } from "../../config/axiosClients"
import { PaginationPayload } from "../../types/common/commonTypes";
import { AddMoneyReq, VerifyWalletAddPaymentReq } from "../../types/wallet/walletTypes";

export const addMoneyService = async (data: AddMoneyReq) => {
   const response = await axiosUser.post("/wallet/create-order",{
        data
    })
    return response.data;
}
export const verifyWalletPaymentService  = async (data: VerifyWalletAddPaymentReq) => {
   const response = await axiosUser.post("/wallet/verify-payment",{
        data
    })
    return response.data;
}
export const getWalletService = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosUser.get("/wallet",{
        params: { page, limit, search }
    });
    return response.data;
}
export const retryAddMoneyService = async (transactionId: string) => {
    const response = await axiosUser.post("/wallet/retry", {
        transactionId
    });
    return response.data;
}