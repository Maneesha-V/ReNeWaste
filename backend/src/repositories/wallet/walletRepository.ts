import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { WalletModel } from "../../models/wallet/walletModel";
import BaseRepository from "../baseRepository/baseRepository";
import { IWalletDocument } from "../../models/wallet/interfaces/walletInterface";
import { IWalletRepository } from "./interface/IWalletRepository";
import { IUserRepository } from "../user/interface/IUserRepository";
import { AddMoneyToWalletReq } from "../../dtos/wallet/walletDTO";

@injectable()
export class WalletRepository
  extends BaseRepository<IWalletDocument>
  implements IWalletRepository
{
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
  ) {
    super(WalletModel);
  }
  async findWalletByUserId(userId: string): Promise<IWalletDocument | null>{
    return await this.model.findOne({userId});
  }
  async createUserWallet(payload: AddMoneyToWalletReq) {
    const { userId } = payload;
    return await this.model.create({
      userId,
      balance: 0,
      transactions: [],
    })
  }
  async findWalletByWalletId(walletId: string) {
   return await this.model.findOne({
    _id: walletId
  });

  }
}