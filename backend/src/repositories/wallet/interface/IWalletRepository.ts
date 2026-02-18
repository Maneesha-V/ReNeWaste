import { ClientSession } from "mongoose";
import { AddMoneyToWallet, AddMoneyToWalletReq, CreateWalletReq, FetchFilteredWPRevenueResp, PaginatedDriverWallet, PaginatedGetWalletReq, PaginatedUserWallet, PaginatedWPWallet, RevenueWPTrendDTO } from "../../../dtos/wallet/walletDTO";
import { IWalletDocument } from "../../../models/wallet/interfaces/walletInterface";
import { FetchWPDashboard } from "../../../dtos/wasteplant/WasteplantDTO";

export interface IWalletRepository {
    findWallet(accountId: string, accountType: string, session?: ClientSession): Promise<IWalletDocument | null>
    createWallet(payload: CreateWalletReq): Promise<IWalletDocument>
    findWalletByWalletId(walletId: string): Promise<IWalletDocument | null>
    addMoney(payload: AddMoneyToWallet, session?: ClientSession): Promise<IWalletDocument | null>
    createDrWpWallet(payload: AddMoneyToWalletReq, session?: ClientSession): Promise<IWalletDocument>
    paginatedWPGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedWPWallet>;
    paginatedDriverGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedDriverWallet>;
    paginatedUserGetWallet(payload: PaginatedGetWalletReq): Promise<PaginatedUserWallet>;
    fetchFilteredWPRevenue(data: FetchWPDashboard): Promise<FetchFilteredWPRevenueResp>;
}
