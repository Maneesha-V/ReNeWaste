import axiosWasteplant from "../../api/axiosWasteplant";
import { SubscptnCancelReq } from "../../types/subscriptionPayment/paymentTypes";

export const fetchSubscriptionPlanService = async () => {
    const response = await axiosWasteplant.get(`/subscription-plan`);
    console.log("res", response);
    return response.data;
};

export const fetchSubscriptionPlansService = async () => {
    const response = await axiosWasteplant.get(`/subscription`);
    console.log("resrtttt", response);
    return response.data;
};
export const cancelSubPayReqById = async ({ subPayId, reason }:SubscptnCancelReq) => {
    const response = await axiosWasteplant.patch(`/cancel-subscription/${subPayId}`, {
        reason,
      });
    console.log("resrtttt", response);
    return response.data;
}