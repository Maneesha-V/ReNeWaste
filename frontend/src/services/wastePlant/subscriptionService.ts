import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { SubscptnCancelReq } from "../../types/subscriptionPayment/paymentTypes";

export const fetchSubscriptionPlanService = async () => {
  const response = await axiosWasteplant.get(
    API_ROUTES.WASTE_PLANT.SUBSCRIPTION_PLAN,
  );
  console.log("res", response);
  return response.data;
};

export const fetchSubscriptionPlansService = async () => {
  const response = await axiosWasteplant.get(
    API_ROUTES.WASTE_PLANT.SUBSCRIPTION,
  );
  console.log("resrtttt", response);
  return response.data;
};
export const cancelSubPayReqById = async ({
  subPayId,
  reason,
}: SubscptnCancelReq) => {
  const response = await axiosWasteplant.patch(
    `${API_ROUTES.WASTE_PLANT.CANCEL_SUBSCRIPTION_PLAN}/${subPayId}`,
    {
      reason,
    },
  );
  console.log("resrtttt", response);
  return response.data;
};
