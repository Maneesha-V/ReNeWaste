import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { PaginationPayload } from "../../types/common/commonTypes";
import {
  AddMoneyReq,
  VerifyWalletAddPaymentReq,
} from "../../types/wallet/walletTypes";

export const addMoneyService = async (data: AddMoneyReq) => {
  const response = await axiosUser.post(API_ROUTES.USER.WALLET_CREATE_ORDER, {
    data,
  });
  return response.data;
};
export const verifyWalletPaymentService = async (
  data: VerifyWalletAddPaymentReq,
) => {
  const response = await axiosUser.post(API_ROUTES.USER.WALLET_VERIFY, {
    data,
  });
  return response.data;
};
export const getWalletService = async ({
  page,
  limit,
  search,
}: PaginationPayload) => {
  const response = await axiosUser.get(API_ROUTES.USER.WALLET, {
    params: { page, limit, search },
  });
  return response.data;
};
export const retryAddMoneyService = async (transactionId: string) => {
  const response = await axiosUser.post(API_ROUTES.USER.WALLET_RETRY, {
    transactionId,
  });
  return response.data;
};
