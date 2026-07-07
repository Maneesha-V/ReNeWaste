import { ClientSession } from "mongoose";
import { AddMoneyToWallet, AddMoneyToWalletRepoReq, CreateWalletReq, FetchFilteredWPRevenueResp, FetchWPDashboardRepo, IWalletDocument, PaginatedDriverWallet, PaginatedGetWalletReq, PaginatedSuperAdminWallet, PaginatedUserWallet, PaginatedWPWallet } from "../../../models/wallet/interfaces/walletInterface";

export interface IWalletRepository {
    findWallet(accountId: string, accountType: string, session?: ClientSession): Promise<IWalletDocument | null>
    createWallet(payload: CreateWalletReq): Promise<IWalletDocument>
    findWalletByWalletId(walletId: string): Promise<IWalletDocument | null>
    addMoney(payload: AddMoneyToWallet, session?: ClientSession): Promise<IWalletDocument | null>
    createDrWpWallet(payload: AddMoneyToWalletRepoReq, session?: ClientSession): Promise<IWalletDocument>
    paginatedWPGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedWPWallet>;
    paginatedDriverGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedDriverWallet>;
    paginatedUserGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedUserWallet>;
    fetchFilteredWPRevenue(data: FetchWPDashboardRepo): Promise<FetchFilteredWPRevenueResp>;
    paginatedSuperAdminWallet(payload: PaginatedGetWalletReq): Promise<PaginatedSuperAdminWallet>;
}
