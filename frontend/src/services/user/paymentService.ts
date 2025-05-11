import axiosUser from "../../api/axiosUser";
import { VerifyPaymentPayload } from "../../utils/paymentTypes";

export const createPaymentOrderService = async (amount: number, pickupReqId: string) => {
  const response = await axiosUser.post(`/payment/create-order`,{ amount, pickupReqId });
  return response.data;
};

export const verifyPaymentService = async (paymentData: VerifyPaymentPayload) => {
  const response = await axiosUser.post(`/payment/verify`,{ paymentData });
  return response.data.paymentOrder;
};

export const getAllPaymentsService = async () => {
  const response = await axiosUser.get(`/payments`);
  return response.data.payments;
};

export const repayService = async (pickupReqId: string, amount: number) => {
  const response = await axiosUser.post(`/payment/repay`, { pickupReqId, amount});
  console.log("res",response);
  
  return response.data.repaymentOrder;
};