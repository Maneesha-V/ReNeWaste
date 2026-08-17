import { axiosSuperadmin } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";
import { SubsptnPlans, updateSubscptnReq } from "../../types/subscription/subscriptionTypes";

export const createSubscriptionPlanService = async (
  subscptnPlanData: SubsptnPlans
) => {
    const response = await axiosSuperadmin.post(
      `/add-subscription-plan`,
      subscptnPlanData
    );
    return response.data;
};

export const getSubscriptionPlans = async ({ page, limit, search }:  PaginationPayload,) => {
    const response = await axiosSuperadmin.get(`/subscription-plans`,{
      params: { page, limit, search },
    });
    console.log("response",response);
    
    return response.data;
};
export const deleteSubscriptionPlanById = async (id: string) => {
    const response = await axiosSuperadmin.delete(`/delete-subscription-plan/${id}`);
    console.log("res", response);
    return response.data;
}
export const getSubscrptionPlanById = async (id: string) => {
    const response = await axiosSuperadmin.get(`/edit-subscription-plan/${id}`);
    return response.data;
};

export const updateSubscriptionPlanById = async ({id, data}: updateSubscptnReq) => {
    const response = await axiosSuperadmin.patch(
      `/edit-subscription-plan/${id}`,
      data,
    );
    console.log("res", response);
    return response.data;
};