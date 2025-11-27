import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletService } from "./interface/IWalletService";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { WalletMapper } from "../../mappers/WalletMapper";
import { GetWalletDriverResp } from "../../dtos/wallet/walletDTO";

@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
  ) {}
   async getWallet(accountId: string, accountType: string,
        page: number,
        limit: number,
        search: string,
      ): Promise<GetWalletDriverResp> {
        const wallet = await this._walletRepository.findWallet(accountId, accountType);
        if (!wallet) {
          throw new Error("Wallet not found for this wasteplant.");
        }
        const { transactions, total, rewards } = await this._walletRepository.paginatedDriverGetWallet({
          walletId: wallet._id.toString(),
          page,
          limit,
          search
        })
  
        return {
          transactions: WalletMapper.mapTransactionsDTO(transactions),
          balance: wallet.balance,
          total,
          rewards
        };
      }
}