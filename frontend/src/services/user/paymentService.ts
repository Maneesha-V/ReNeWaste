import axiosUser from "../../api/axiosUser";
import { VerifyPaymentPayload } from "../../types/paymentTypes";
import { CreatePaymentPayload, PaymentSummary, RepaymentOrderResponse, VerifyPaymentResponse } from "../../types/pickupReq/paymentTypes";

export const createPaymentOrderService = async (paymentData: CreatePaymentPayload) => {
  const response = await axiosUser.post(`/payment/create-order`,{ paymentData });
  return response.data;
};

export const verifyPaymentService = async (paymentData: VerifyPaymentPayload)
:Promise<VerifyPaymentResponse> => {
  const response = await axiosUser.post(`/payment/verify`,{ paymentData });
  return response.data;
};

export const getAllPaymentsService = async (): Promise<PaymentSummary[]>  => {
  const response = await axiosUser.get(`/payments`);
  return response.data.payments;
};

export const repayService = async (pickupReqId: string, amount: number): Promise<RepaymentOrderResponse> => {
  const response = await axiosUser.post(`/payment/repay`, { pickupReqId, amount});
  console.log("res",response);
  
  return response.data.repaymentOrder;
};