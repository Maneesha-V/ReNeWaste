import axiosSuperadmin from "../../api/axiosSuperadmin";
import { PaginationPayload } from "../../types/common/commonTypes";
import { SubsptnPlans, updateSubscptnReq } from "../../types/subscription/subscriptionTypes";

export const createSubscriptionPlanService = async (
  subscptnPlanData: SubsptnPlans
) => {
  // try {
    const response = await axiosSuperadmin.post(
      `/add-subscription-plan`,
      subscptnPlanData
    );
    return response.data;
  // } catch (error: any) {
  //   console.error(
  //     "Error adding Subscription plan:",
  //     error.response?.data || error
  //   );
  //   throw error;
  // }
};

export const getSubscriptionPlans = async ({ page, limit, search }:  PaginationPayload,) => {
    const response = await axiosSuperadmin.get(`/subscription-plans`,{
      params: { page, limit, search },
    });
    console.log("response",response);
    
    return response.data;
};
export const deleteSubscriptionPlanById = async (id: string) => {
  //  try {
    const response = await axiosSuperadmin.delete(`/delete-subscription-plan/${id}`);
    console.log("res", response);
    return response.data;
  // } catch (error: any) {
  //   console.error("error", error);
  //   throw error;
  // }
}
export const getSubscrptionPlanById = async (id: string) => {
  // try {
    const response = await axiosSuperadmin.get(`/edit-subscription-plan/${id}`);
    return response.data;
  // } catch (error: any) {
  //   console.error("error", error);
  // }
};

export const updateSubscriptionPlanById = async ({id, data}: updateSubscptnReq) => {
  // try {
    const response = await axiosSuperadmin.patch(
      `/edit-subscription-plan/${id}`,
      data,
    );
    console.log("res", response);
    return response.data;
  // } catch (error: any) {
  //   console.error("error", error);
  //   throw error;
  // }
};