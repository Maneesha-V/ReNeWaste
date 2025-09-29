import { axiosUser } from "../../config/axiosClients"
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
export const getWalletService = async () => {
    const response = await axiosUser.get("/wallet");
    return response.data;
}
export const retryAddMoneyService = async (transactionId: string) => {
    const response = await axiosUser.post("/wallet/retry", {
        transactionId
    });
    return response.data;
}