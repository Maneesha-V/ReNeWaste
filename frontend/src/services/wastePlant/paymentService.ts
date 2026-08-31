import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import {
  RefundPaymntPayload,
  UpdateStatusPayload,
} from "../../types/pickupReq/paymentTypes";
import {
  RetryPaymentData,
  SubptnVerifyPaymenReq,
} from "../../types/subscriptionPayment/paymentTypes";

export const fetchPaymentsService = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.PAYMENTS, {
    params: { page, limit, search },
  });
  console.log("res", response);

  return response.data;
};
export const createPaymentOrderService = async (planId: string) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.PAYMENT_CREATE_ORDER, {
    planId,
  });
  console.log("res", response);

  return response.data;
};

export const verifyPaymentService = async (
  paymentData: SubptnVerifyPaymenReq,
) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.PAYMENT_VERIFY, {
    paymentData,
  });
  console.log("response", response);

  return response.data;
};
export const getAllPayments = async () => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.SUBSCRIPTION_PAYMENTS);
  return response.data;
};
export const repayService = async ({
  planId,
  amount,
  subPaymtId,
}: RetryPaymentData) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.PAYMENT_REPAY, {
    planId,
    amount,
    subPaymtId,
  });
  console.log("res", response);

  return response.data.repaymentOrder;
};

export const updateRefundStatusService = async (
  statusUpdateData: UpdateStatusPayload,
) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.PAYMENT_UPDATE_STATUS, {
    statusUpdateData,
  });
  console.log("response", response);

  return response.data.statusUpdate;
};

export const triggerPickupRefundService = async (
  refundDataReq: RefundPaymntPayload,
) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.PAYMENT_REFUND, refundDataReq);
  console.log("res", response);
  return response.data;
};
