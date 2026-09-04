import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import { AddMoneyReq, VerifyWalletAddPaymentReq } from "../../types/wallet/walletTypes";

export const getWalletService = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.WALLET, {
    params: { page, limit, search },
  });
  return response.data;
};
export const addMoneyService = async (data: AddMoneyReq) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.WALLET_CREATE_ORDER, {
    data,
  });
  return response.data;
};
export const verifyWalletPaymentService = async (
  data: VerifyWalletAddPaymentReq,
) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.WALLET_VERIFY, {
    data,
  });
  return response.data;
};
export const retryAddMoneyService = async (transactionId: string) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.WALLET_RETRY, {
    transactionId,
  });
  return response.data;
};