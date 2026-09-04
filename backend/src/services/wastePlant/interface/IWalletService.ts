import {
  AddMoneyToWalletReq,
  CreateWalletOrderResp,
  GetWalletWPResp,
  RetryWalletAddPaymentResp,
  VerifyWalletAddPaymentReq,
  VerifyWalletAddPaymentResp,
} from "../../../dtos/wallet/walletDTO";

export interface IWalletService {
  getWallet(
    accountId: string,
    accountType: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<GetWalletWPResp>;
  createAddMoneyOrder(
    payload: AddMoneyToWalletReq,
  ): Promise<CreateWalletOrderResp>;
  verifyWalletAddPayment(
    payload: VerifyWalletAddPaymentReq,
  ): Promise<VerifyWalletAddPaymentResp>;
  retryWalletAddPayment(
    accountId: string,
    accountType: string,
    transactionId: string,
  ): Promise<RetryWalletAddPaymentResp>;
}
