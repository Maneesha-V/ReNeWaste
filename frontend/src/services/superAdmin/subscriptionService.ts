import axiosSuperadmin from "../../api/axiosSuperadmin";
import { SubsptnPlanData, updateSubscptnData } from "../../types/subscriptionTypes";

export const createSubscriptionPlanService = async (
  subscptnPlanData: SubsptnPlanData
) => {
  try {
    const response = await axiosSuperadmin.post(
      `/add-subscription-plan`,
      subscptnPlanData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding Subscription plan:",
      error.response?.data || error
    );
    throw error;
  }
};

export const getSubscriptionPlans = async () => {
  try {
    const response = await axiosSuperadmin.get(`/subscription-plans`);
    console.log("response",response);
    
    return response.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const deleteSubscriptionPlanById = async (id: string) => {
   try {
    const response = await axiosSuperadmin.delete(`/delete-subscription-plan/${id}`);
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
}
export const getSubscrptionPlanById = async (id: string) => {
  try {
    const response = await axiosSuperadmin.get(`/edit-subscription-plan/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
  }
};

export const updateSubscriptionPlanById = async ({id, data}: updateSubscptnData) => {
  try {
    const response = await axiosSuperadmin.patch(
      `/edit-subscription-plan/${id}`,
      data,
    );
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};