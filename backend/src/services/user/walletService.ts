import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { IWalletService } from "./interface/IWalletService";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import {
  AddMoneyToWalletReq,
  CreateWalletOrderResp,
  GetWalletUserResp,
  RetryWalletAddPaymentResp,
  VerifyWalletAddPaymentReq,
  VerifyWalletAddPaymentResp,
} from "../../dtos/wallet/walletDTO";
import Razorpay from "razorpay";
import crypto from "crypto";
import { WalletMapper } from "../../mappers/WalletMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class WalletService implements IWalletService {
  private _razorpay: Razorpay;
  constructor(
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
  ) {
    const key_id = process.env.RAZORPAY_KEY_ID!;
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;

    if (!key_id || !key_secret) {
      throw new Error(
        "Razorpay API keys are not defined in environment variables"
      );
    }

    this._razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }

  async createAddMoneyOrder(
    payload: AddMoneyToWalletReq
  ): Promise<CreateWalletOrderResp> {
    const {
      accountId,
      accountType,
      data: { amount, description, type },
    } = payload;
    let userWallet;
    userWallet = await this._walletRepository.findWallet(
      accountId,
      accountType
    );
    if (!userWallet) {
      userWallet = await this._walletRepository.createWallet({
        accountId,
        accountType
      });
    }

    const now = new Date();
    const transactions = userWallet.transactions;
    const activeTransaction = transactions.find(
      (tx) =>
        tx.status === "InProgress" &&
        tx.inProgressExpiresAt &&
        tx.inProgressExpiresAt > now
    );
    if (activeTransaction) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.COMMON.ERROR.PAYMENT_IN_PROGRESS
      )
    }

    let expiredTransaction = transactions.find(
      (tx) =>
        tx.status === "InProgress" &&
        tx.amount === amount &&
        tx.inProgressExpiresAt &&
        tx.inProgressExpiresAt <= now
    );
    let order;
    let inProgressExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    if (expiredTransaction) {
      order = await this._razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${userWallet._id}_${Date.now().toString().slice(-4)}`,
        notes: {
          accountId,
        },
        payment_capture: true,
      });
      expiredTransaction.razorpayOrderId = order.id;
      expiredTransaction.inProgressExpiresAt = inProgressExpiresAt;
    } else {
      order = await this._razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${userWallet._id}_${Date.now().toString().slice(-4)}`,
        notes: {
          accountId,
        },
        payment_capture: true,
      });

      userWallet.transactions.push({
        type,
        subType: "UserDeposit",
        amount,
        description,
        razorpayOrderId: order.id,
        inProgressExpiresAt,
        status: "InProgress",
      });
      await userWallet.save();
    }

    return {
      orderId: order.id,
      amount,
      currency: order.currency,
      walletId: userWallet._id.toString(),
      expiresAt: inProgressExpiresAt.toISOString(),
    };
  }

  async verifyWalletAddPayment(
    payload: VerifyWalletAddPaymentReq
  ): Promise<VerifyWalletAddPaymentResp> {
    const { data } = payload;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      walletId,
      amount,
    } = data;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMMON.ERROR.INVALID_SIGNATURE
      )
    }
    const userWallet =
      await this._walletRepository.findWalletByWalletId(walletId);
    if (!userWallet) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND
      )
    }
    const transaction = userWallet.transactions.find(
      (t) => t.razorpayOrderId === razorpay_order_id
    );

    if (!transaction) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.TRANSACTION_NOT_FOUND
      )
    }
    transaction.settlementStatus = "NotApplicable";
    transaction.status = "Paid";
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.paidAt = new Date();
    userWallet.balance += amount;
    await userWallet.save();

    return {
      amount,
      balance: userWallet.balance,
      transactionId: transaction._id.toString(),
    };
  }
  async getWallet(
    accountId: string,
    accountType: string,
    page: number,
    limit: number,
    search: string
  ): Promise<GetWalletUserResp> {
    const userWallet = await this._walletRepository.findWallet(
      accountId,
      accountType
    );
    if (!userWallet) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND
      )
    }

    const { transactions, total } =
      await this._walletRepository.paginatedUserGetWallet({
        walletId: userWallet._id.toString(),
        page,
        limit,
        search,
      });

      
    return {
      transactions: WalletMapper.mapTransactionsDTO(transactions),
      balance: userWallet.balance,
      total,
    };
  }
  async retryWalletAddPayment(
    accountId: string,
    accountType: string,
    transactionId: string
  ): Promise<RetryWalletAddPaymentResp> {
    const userWallet = await this._walletRepository.findWallet(
      accountId,
      accountType
    );
    if (!userWallet) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND
      )
    }
    const transaction = userWallet?.transactions.find(
      (tx) => tx._id.toString() === transactionId
    );
    if (!transaction) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.TRANSACTION_NOT_FOUND
      )
    }
    const now = new Date();
    if (
      transaction.status === "InProgress" &&
      transaction.inProgressExpiresAt &&
      transaction.inProgressExpiresAt <= now
    ) {
      transaction.status = "Pending";
      transaction.inProgressExpiresAt = null;
    }
    if (
      transaction.status === "InProgress" &&
      transaction.inProgressExpiresAt &&
      transaction.inProgressExpiresAt > now
    ) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.COMMON.ERROR.PAYMENT_IN_PROGRESS
      )
    }

    const expiresIn = 5 * 60 * 1000;
    transaction.status = "InProgress";
    transaction.inProgressExpiresAt = new Date(now.getTime() + expiresIn);

    await userWallet.save();
    return {
      orderId: transaction.razorpayOrderId!,
      amount: transaction.amount,
      currency: "INR",
      walletId: userWallet._id.toString(),
      expiresAt: transaction.inProgressExpiresAt?.toISOString(),
    };
  }
}
