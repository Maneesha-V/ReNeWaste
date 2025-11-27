import { GetWalletDriverResp } from "../../../dtos/wallet/walletDTO";

export interface IWalletService {
   getWallet(
     accountId: string,
     accountType: string,
     page: number,
     limit: number,
     search: string
   ): Promise<GetWalletDriverResp>;
}