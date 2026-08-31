import { axiosSuperadmin } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import { SubsptnPlans, updateSubscptnReq } from "../../types/subscription/subscriptionTypes";

export const createSubscriptionPlanService = async (
  subscptnPlanData: SubsptnPlans
) => {
    const response = await axiosSuperadmin.post(
      API_ROUTES.SUPER_ADMIN.ADD_SUBSCRIPTION_PLAN,
      subscptnPlanData
    );
    return response.data;
};

export const getSubscriptionPlans = async ({ page, limit, search }:  PaginationPayload,) => {
    const response = await axiosSuperadmin.get(API_ROUTES.SUPER_ADMIN.SUBSCRIPTION_PLANS,{
      params: { page, limit, search },
    });
    console.log("response",response);
    
    return response.data;
};
export const deleteSubscriptionPlanById = async (id: string) => {
    const response = await axiosSuperadmin.delete(`${API_ROUTES.SUPER_ADMIN.DELETE_SUBSCRIPTION_PLAN}/${id}`);
    console.log("res", response);
    return response.data;
}
export const getSubscrptionPlanById = async (id: string) => {
    const response = await axiosSuperadmin.get(`${API_ROUTES.SUPER_ADMIN.EDIT_SUBSCRIPTION_PLAN}/${id}`);
    return response.data;
};

export const updateSubscriptionPlanById = async ({id, data}: updateSubscptnReq) => {
    const response = await axiosSuperadmin.patch(
      `${API_ROUTES.SUPER_ADMIN.EDIT_SUBSCRIPTION_PLAN}/${id}`,
      data,
    );
    console.log("res", response);
    return response.data;
};