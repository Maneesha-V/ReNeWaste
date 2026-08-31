import { axiosSuperadmin } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import { refundPayReq, UpdateRefundStatusReq } from "../../types/subscriptionPayment/paymentTypes";

export const getPaymentHistory = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosSuperadmin.get(API_ROUTES.SUPER_ADMIN.PAYMENT_HISTORY,{
         params: { page, limit, search }
    });
    console.log("response",response);
    return response.data;
};
export const updateRefundPayment = async({ subPayId, refundStatus, rejectionMessage }: UpdateRefundStatusReq) => {
     console.log({refundStatus, rejectionMessage});
    const response = await axiosSuperadmin.patch(API_ROUTES.SUPER_ADMIN.PAYMENT_UPDATE_STTAUS,{
        subPayId, 
        refundStatus,
        rejectionMessage
   });
   console.log("response",response);
   return response.data;
}
export const updateRefund = async({ subPayId, refundStatus }: refundPayReq) => {
    const response = await axiosSuperadmin.patch(API_ROUTES.SUPER_ADMIN.PAYMENT_REFUND,{
        subPayId, 
        refundStatus
   });
   console.log("response",response);
   return response.data;
}