import { AddMoneyToWallet, AddMoneyToWalletReq, PaginatedDriverWallet, PaginatedGetWalletReq, PaginatedUserWallet, PaginatedWPWallet } from "../../../dtos/wallet/walletDTO";
import { IWalletDocument } from "../../../models/wallet/interfaces/walletInterface";

export interface IWalletRepository {
    findWallet(accountId: string, accountType: string): Promise<IWalletDocument | null>
    createWallet(payload: AddMoneyToWalletReq): Promise<IWalletDocument>
    findWalletByWalletId(walletId: string): Promise<IWalletDocument | null>
    addMoney(payload: AddMoneyToWallet): Promise<IWalletDocument | null>
    createDrWpWallet(payload: AddMoneyToWalletReq): Promise<IWalletDocument>
    paginatedWPGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedWPWallet>;
    paginatedDriverGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedDriverWallet>;
    paginatedUserGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedUserWallet>;
}
