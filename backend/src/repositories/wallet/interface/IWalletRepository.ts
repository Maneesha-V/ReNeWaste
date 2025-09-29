import { AddMoneyToWalletReq } from "../../../dtos/wallet/walletDTO";
import { IWalletDocument } from "../../../models/wallet/interfaces/walletInterface";

export interface IWalletRepository {
    findWalletByUserId(userId: string): Promise<IWalletDocument | null>
    createUserWallet(payload: AddMoneyToWalletReq): Promise<IWalletDocument>
    findWalletByWalletId(walletId: string): Promise<IWalletDocument | null>
}