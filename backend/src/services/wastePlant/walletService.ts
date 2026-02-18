import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletService } from "./interface/IWalletService";
import { GetWalletWPResp } from "../../dtos/wallet/walletDTO";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { WalletMapper } from "../../mappers/WalletMapper";

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
    ): Promise<GetWalletWPResp> {
      const wallet = await this._walletRepository.findWallet(accountId, accountType);
      if (!wallet) {
        throw new Error("Wallet not found for this wasteplant.");
      }
      const { transactions, total, earnings } = await this._walletRepository.paginatedWPGetWallet({
        walletId: wallet._id.toString(),
        page,
        limit,
        search
      })

      return {
        transactions: WalletMapper.mapTransactionsDTO(transactions),
        balance: wallet.balance,
        holdingBalance: wallet.holdingBalance,
        total,
        earnings
      };
    }
}
