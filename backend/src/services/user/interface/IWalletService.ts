import { AddMoneyToWalletReq, CreateWalletOrderResp, RetryWalletAddPaymentResp, VerifyWalletAddPaymentReq, VerifyWalletAddPaymentResp, WalletDTO } from "../../../dtos/wallet/walletDTO";

export interface IWalletService {
    createAddMoneyOrder(payload: AddMoneyToWalletReq): Promise<CreateWalletOrderResp>;
    verifyWalletAddPayment(payload: VerifyWalletAddPaymentReq): Promise<VerifyWalletAddPaymentResp>;
    getWallet(userId: string): Promise<WalletDTO>;
    retryWalletAddPayment(userId: string, transactionId: string): Promise<RetryWalletAddPaymentResp>;
}