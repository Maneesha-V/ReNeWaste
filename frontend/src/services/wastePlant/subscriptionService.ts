import axiosWasteplant from "../../api/axiosWasteplant";

export const fetchSubscriptionPlanService = async () => {
  try {
    const response = await axiosWasteplant.get(`/subscription-plan`);
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
  }
};