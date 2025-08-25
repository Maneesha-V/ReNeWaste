import axiosSuperadmin from "../../api/axiosSuperadmin";
import { PaginationPayload } from "../../types/common/commonTypes";
import { UpdateRefundStatusReq } from "../../types/subscriptionPayment/paymentTypes";

export const getPaymentHistory = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosSuperadmin.get(`/payment-history`,{
         params: { page, limit, search }
    });
    console.log("response",response);
    return response.data;
};
export const updateRefundPayment = async({ subPayId, refundStatus }: UpdateRefundStatusReq) => {
    const response = await axiosSuperadmin.patch(`/payment/update-status`,{
        subPayId, 
        refundStatus
   });
   console.log("response",response);
   return response.data;
}