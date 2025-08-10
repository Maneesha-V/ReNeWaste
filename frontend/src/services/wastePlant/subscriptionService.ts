import axiosWasteplant from "../../api/axiosWasteplant";

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