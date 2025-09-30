import { axiosUser } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";
import { CreatePaymentPayload, RepaymentOrderResponse, ReturnGetAllPayments, VerifyPaymentPayload, VerifyPaymentResponse, VerifyWalletPaymentReq } from "../../types/pickupReq/paymentTypes";

export const createPaymentOrderService = async (paymentData: CreatePaymentPayload) => {
  const response = await axiosUser.post(`/payment/create-order`,{ paymentData });
  return response.data;
};

export const verifyPaymentService = async (paymentData: VerifyPaymentPayload)
:Promise<VerifyPaymentResponse> => {
  const response = await axiosUser.post(`/payment/verify`,{ paymentData });
  return response.data;
};

export const getAllPaymentsService = async ({page, limit, search, filter}: PaginationPayload): Promise<ReturnGetAllPayments>  => {
  const response = await axiosUser.get(`/payments`,{
    params: { page, limit, search, filter }
  });
  return response.data;
};

export const repayService = async (pickupReqId: string, amount: number): Promise<RepaymentOrderResponse> => {
  const response = await axiosUser.post(`/payment/repay`, { pickupReqId, amount});
  console.log("res",response);
  
  return response.data.repaymentOrder;
};
export const verifyWalletPaymentService = async(paymentData: VerifyWalletPaymentReq) => {
  const response = await axiosUser.post("/payment/wallet/verify",{
    paymentData
  });
  return response.data;
}