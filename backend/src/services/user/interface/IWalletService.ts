import {
  AddMoneyToWalletReq,
  CreateWalletOrderResp,
  GetWalletUserResp,
  RetryWalletAddPaymentResp,
  VerifyWalletAddPaymentReq,
  VerifyWalletAddPaymentResp,
  WalletDTO,
} from "../../../dtos/wallet/walletDTO";

export interface IWalletService {
  createAddMoneyOrder(
    payload: AddMoneyToWalletReq
  ): Promise<CreateWalletOrderResp>;
  verifyWalletAddPayment(
    payload: VerifyWalletAddPaymentReq
  ): Promise<VerifyWalletAddPaymentResp>;
  getWallet(
    accountId: string,
    accountType: string,
    page: number,
    limit: number,
    search: string
  ): Promise<GetWalletUserResp>;
  retryWalletAddPayment(
    accountId: string,
    accountType: string,
    transactionId: string
  ): Promise<RetryWalletAddPaymentResp>;
}
