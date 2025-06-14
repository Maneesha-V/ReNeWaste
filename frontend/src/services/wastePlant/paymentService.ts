import axiosWasteplant from "../../api/axiosWasteplant";
import { PaginationPayload } from "../../types/commonTypes";
import { RefundPaymntPayload, retryPaymentData, SubptnVerifyPaymentPayload, UpdateStatusPayload } from "../../types/paymentTypes";
import { subPaymnetPayload } from "../../types/subscriptionTypes";


export const fetchPaymentsService = async ({ page, limit, search }: PaginationPayload) => {
  try {
    const response = await axiosWasteplant.get(`/payment`,{
      params: { page, limit, search },
    });
    console.log("res", response);

    return response.data;
  } catch (error: any) {
    console.error("error", error);
  }
};

export const createPaymentOrderService = async ({
  amount,
  planId,
  plantName
}: subPaymnetPayload) => {
  const response = await axiosWasteplant.post(`/payment/create-order`, {
    amount,
    planId,
    plantName
  });
  console.log("res", response);
  
  return response.data;
};

export const verifyPaymentService = async (
  paymentData: SubptnVerifyPaymentPayload
) => {
  const response = await axiosWasteplant.post(`/payment/verify`, {
    paymentData,
  });
  return response.data.paymentOrder;
};
export const getAllPayments = async () => {
  const response = await axiosWasteplant.get(`/subscptn-payments`);
  return response.data;
};
export const repayService = async ({ planId, amount, subPaymtId }: retryPaymentData) => {
  const response = await axiosWasteplant.post(`/payment/repay`, { planId, amount, subPaymtId});
  console.log("res",response);
  
  return response.data.repaymentOrder;
};

export const updateRefundStatusService = async (
  statusUpdateData: UpdateStatusPayload
) => {
  const response = await axiosWasteplant.post(`/payment/update-status`, {
    statusUpdateData,
  });
  console.log("response",response);
  
  return response.data.statusUpdate;
};

export const triggerPickupRefundService = async (refundDataReq: RefundPaymntPayload) => {
  const response = await axiosWasteplant.post(`/payment/refund`, refundDataReq);
  console.log("res", response); 
  return response.data;
};