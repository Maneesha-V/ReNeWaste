import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import { CreatePaymentPayload, RepaymentOrderResponse, ReturnGetAllPayments, VerifyPaymentPayload, VerifyPaymentResponse, VerifyWalletPaymentReq } from "../../types/pickupReq/paymentTypes";

export const createPaymentOrderService = async (paymentData: CreatePaymentPayload) => {
  const response = await axiosUser.post(API_ROUTES.USER.PAYMENT_CREATE_ORDER,{ paymentData });
  return response.data;
};

export const verifyPaymentService = async (paymentData: VerifyPaymentPayload)
:Promise<VerifyPaymentResponse> => {
  const response = await axiosUser.post(API_ROUTES.USER.PAYMENT_VERIFY,{ paymentData });
  return response.data;
};

export const getAllPaymentsService = async ({page, limit, search, filter}: PaginationPayload): Promise<ReturnGetAllPayments>  => {
  const response = await axiosUser.get(API_ROUTES.USER.PAYMENTS,{
    params: { page, limit, search, filter }
  });
  return response.data;
};

export const repayService = async (pickupReqId: string, amount: number): Promise<RepaymentOrderResponse> => {
  const response = await axiosUser.post(API_ROUTES.USER.PAYMENT_REPAY, { pickupReqId, amount});
  return response.data.repaymentOrder;
};
export const verifyWalletPaymentService = async(paymentData: VerifyWalletPaymentReq) => {
  const response = await axiosUser.post(API_ROUTES.USER.PAYMENT_WALLET_VERIFY,{
    paymentData
  });
  return response.data;
}
export const downloadReceiptService = async (pickupReqId: string) => {
  const response = await axiosUser.get(`${API_ROUTES.USER.PAYMENT_RECEIPT}/${pickupReqId}`,{
    responseType: "blob",
  })
  return response.data;
}