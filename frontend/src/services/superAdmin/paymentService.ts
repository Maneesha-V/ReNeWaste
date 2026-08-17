import { axiosSuperadmin } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes";
import { refundPayReq, UpdateRefundStatusReq } from "../../types/subscriptionPayment/paymentTypes";

export const getPaymentHistory = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosSuperadmin.get(`/payment-history`,{
         params: { page, limit, search }
    });
    console.log("response",response);
    return response.data;
};
export const updateRefundPayment = async({ subPayId, refundStatus, rejectionMessage }: UpdateRefundStatusReq) => {
     console.log({refundStatus, rejectionMessage});
    const response = await axiosSuperadmin.patch(`/payment/update-status`,{
        subPayId, 
        refundStatus,
        rejectionMessage
   });
   console.log("response",response);
   return response.data;
}
export const updateRefund = async({ subPayId, refundStatus }: refundPayReq) => {
    const response = await axiosSuperadmin.patch(`/payment/refund`,{
        subPayId, 
        refundStatus
   });
   console.log("response",response);
   return response.data;
}