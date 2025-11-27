import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { WalletModel } from "../../models/wallet/walletModel";
import BaseRepository from "../baseRepository/baseRepository";
import { IWalletDocument } from "../../models/wallet/interfaces/walletInterface";
import { IWalletRepository } from "./interface/IWalletRepository";
import { IUserRepository } from "../user/interface/IUserRepository";
import {
  AddMoneyToWallet,
  AddMoneyToWalletReq,
  PaginatedGetWalletReq,
  PaginatedUserWallet,
} from "../../dtos/wallet/walletDTO";
import mongoose from "mongoose";

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
  async findWallet(
    accountId: string,
    accountType: string
  ): Promise<IWalletDocument | null> {
    return await this.model.findOne({ accountId, accountType });
  }
  async createWallet(payload: AddMoneyToWalletReq) {
    const { accountId, accountType } = payload;
    return await this.model.create({
      accountId,
      accountType,
      balance: 0,
      transactions: [],
    });
  }
  async findWalletByWalletId(walletId: string) {
    return await this.model.findOne({
      _id: walletId,
    });
  }
  async addMoney(payload: AddMoneyToWallet) {
    const { walletId, data } = payload;
    return await this.model.findByIdAndUpdate(
      walletId,
      {
        $inc: { balance: data.amount },
        $push: {
          transactions: {
            amount: data.amount,
            description: data.description,
            type: data.type,
            paidAt: Date.now(),
            status: "Paid",
          },
        },
      },
      { new: true }
    );
  }
  async createDrWpWallet(payload: AddMoneyToWalletReq) {
    const { accountId, accountType, data } = payload;
    return await this.model.create({
      accountId,
      accountType,
      balance: data?.amount || 0,
      transactions: data
        ? [
            {
              amount: data.amount,
              description: data.description,
              type: data.type,
              paidAt: Date.now(),
              status: "Paid",
            },
          ]
        : [],
    });
  }

  async paginatedWPGetWallet(payload: PaginatedGetWalletReq) {
    const { walletId, page, limit, search } = payload;
    const skip = (page - 1) * limit;

    let searchMatch: any = {};

    if (search && search.trim() !== "") {
      const trimmed = search.trim();

      const amountNumber = Number(trimmed);
      const isAmount = !isNaN(amountNumber);

      if (isAmount) {
        searchMatch["transactions.amount"] = amountNumber;
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
        const [d, m, y] = trimmed.split("-").map(Number);

        const start = new Date(y, m - 1, d, 0, 0, 0);
        const end = new Date(y, m - 1, d, 23, 59, 59);

        searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
      } else if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}$/.test(trimmed)) {
        const moment = require("moment");

        const parsed = moment(trimmed, "DD-MM-YYYY HH:mm").toDate();
        const start = new Date(parsed.getTime() - 60000);
        const end = new Date(parsed.getTime() + 60000);

        searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
      } else if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
        searchMatch["$expr"] = {
          $eq: [
            {
              $dateToString: {
                format: "%H:%M",
                date: "$transactions.paidAt",
                timezone: "Asia/Kolkata",
              },
            },
            trimmed,
          ],
        };
      } else {
        searchMatch = {
          $or: [
            { "transactions.description": { $regex: trimmed, $options: "i" } },
            { "transactions.type": { $regex: trimmed, $options: "i" } },
            { "transactions.status": { $regex: trimmed, $options: "i" } },
          ],
        };
      }
    }

    const result = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(walletId) } },
      { $unwind: "$transactions" },
      { $match: searchMatch },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { "transactions.paidAt": -1 } },
            { $skip: skip },
            { $limit: limit },
            { $replaceRoot: { newRoot: "$transactions" } },
          ],
          earnings: [
            {
              $match: {
                "transactions.type": "Earning",
              },
            },
            {
              $group: {
                _id: null,
                totalEarnings: { $sum: "$transactions.amount" },
              },
            },
          ],
        },
      },
    ]);

    const total = result[0].metadata[0]?.total || 0;
    const transactions = result[0].data;
    const earnings = result[0].earnings[0]?.totalEarnings || 0;
    console.log("transactions", result[0]);

    return { transactions, total, earnings };
  }

  async paginatedDriverGetWallet(payload: PaginatedGetWalletReq) {
    const { walletId, page, limit, search } = payload;
    const skip = (page - 1) * limit;

    let searchMatch: any = {};

    if (search && search.trim() !== "") {
      const trimmed = search.trim();

      const amountNumber = Number(trimmed);
      const isAmount = !isNaN(amountNumber);

      if (isAmount) {
        searchMatch["transactions.amount"] = amountNumber;
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
        const [d, m, y] = trimmed.split("-").map(Number);

        const start = new Date(y, m - 1, d, 0, 0, 0);
        const end = new Date(y, m - 1, d, 23, 59, 59);

        searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
      } else if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}$/.test(trimmed)) {
        const moment = require("moment");

        const parsed = moment(trimmed, "DD-MM-YYYY HH:mm").toDate();
        const start = new Date(parsed.getTime() - 60000);
        const end = new Date(parsed.getTime() + 60000);

        searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
      } else if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
        searchMatch["$expr"] = {
          $eq: [
            {
              $dateToString: {
                format: "%H:%M",
                date: "$transactions.paidAt",
                timezone: "Asia/Kolkata",
              },
            },
            trimmed,
          ],
        };
      } else {
        searchMatch = {
          $or: [
            { "transactions.description": { $regex: trimmed, $options: "i" } },
            { "transactions.type": { $regex: trimmed, $options: "i" } },
            { "transactions.status": { $regex: trimmed, $options: "i" } },
          ],
        };
      }
    }
    const result = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(walletId) } },
      { $unwind: "$transactions" },
      { $match: searchMatch },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { "transactions.paidAt": -1 } },
            { $skip: skip },
            { $limit: limit },
            { $replaceRoot: { newRoot: "$transactions" } },
          ],
          rewards: [
            {
              $match: {
                // "transactions.description": {$regex: "^Reward", $options: "i"}
                "transactions.type": "Reward",
              },
            },
            {
              $group: {
                _id: null,
                totalRewards: { $sum: "$transactions.amount" },
              },
            },
          ],
        },
      },
    ]);

    const total = result[0].metadata[0]?.total || 0;
    const transactions = result[0].data;
    const rewards = result[0].rewards[0]?.totalRewards || 0;
    console.log("transactions", result[0]);

    return { transactions, total, rewards };
  }
  async paginatedUserGetWallet(
    payload: PaginatedGetWalletReq
  ): Promise<PaginatedUserWallet> {
    const { walletId, page, limit, search } = payload;
    const skip = (page - 1) * limit;

    let searchMatch: any = {};

    if (search && search.trim() !== "") {
      const trimmed = search.trim();

      const amountNumber = Number(trimmed);
      const isAmount = !isNaN(amountNumber);

      if (isAmount) {
        searchMatch["transactions.amount"] = amountNumber;
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
        const [d, m, y] = trimmed.split("-").map(Number);

        const start = new Date(y, m - 1, d, 0, 0, 0);
        const end = new Date(y, m - 1, d, 23, 59, 59);

        // searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
        searchMatch["$or"] = [
          { "transactions.updatedAt": { $gte: start, $lte: end } },
          { "transactions.paidAt": { $gte: start, $lte: end } },
        ];
      } else if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}$/.test(trimmed)) {
        const moment = require("moment");

        const parsed = moment(trimmed, "DD-MM-YYYY HH:mm").toDate();
        const start = new Date(parsed.getTime() - 60000);
        const end = new Date(parsed.getTime() + 60000);

        // searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
        searchMatch["$or"] = [
          { "transactions.updatedAt": { $gte: start, $lte: end } },
          { "transactions.paidAt": { $gte: start, $lte: end } },
        ];
      } else if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
        // searchMatch["$expr"] = {
        //   $eq: [
        //     { $dateToString: { format: "%H:%M", date: "$transactions.paidAt", timezone: "Asia/Kolkata" } },
        //     trimmed
        //   ]
        // };
        searchMatch["$or"] = [
          {
            $expr: {
              $eq: [
                {
                  $dateToString: {
                    format: "%H:%M",
                    date: "$transactions.updatedAt",
                    timezone: "Asia/Kolkata",
                  },
                },
                trimmed,
              ],
            },
          },
          {
            $expr: {
              $eq: [
                {
                  $dateToString: {
                    format: "%H:%M",
                    date: "$transactions.paidAt",
                    timezone: "Asia/Kolkata",
                  },
                },
                trimmed,
              ],
            },
          },
        ];
      } else {
        searchMatch = {
          $or: [
            { "transactions.description": { $regex: trimmed, $options: "i" } },
            { "transactions.type": { $regex: trimmed, $options: "i" } },
            { "transactions.status": { $regex: trimmed, $options: "i" } },
          ],
        };
      }
    }
    const result = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(walletId) } },
      { $unwind: "$transactions" },
      { $match: searchMatch },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { 
              // $sort: { "transactions.paidAt": -1 } 
               $sort: { 
              "transactions.updatedAt": -1,
              "transactions.paidAt": -1 
            } 
            },
            { $skip: skip },
            { $limit: limit },
            { $replaceRoot: { newRoot: "$transactions" } },
          ],
        },
      },
    ]);

    const total = result[0].metadata[0]?.total || 0;
    const transactions = result[0].data;
    console.log("transactions", result[0]);

    return { transactions, total };
  }
}
