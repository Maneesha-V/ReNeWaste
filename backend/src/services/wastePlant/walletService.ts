import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletService } from "./interface/IWalletService";
import {
  AddMoneyToWalletReq,
  CreateWalletOrderResp,
  GetWalletWPResp,
  RetryWalletAddPaymentResp,
  VerifyWalletAddPaymentReq,
  VerifyWalletAddPaymentResp,
} from "../../dtos/wallet/walletDTO";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { WalletMapper } from "../../mappers/WalletMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import crypto from "crypto";
import Razorpay from "razorpay";

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
        "Razorpay API keys are not defined in environment variables",
      );
    }

    this._razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }
  async getWallet(
    accountId: string,
    accountType: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<GetWalletWPResp> {
    const wallet = await this._walletRepository.findWallet(
      accountId,
      accountType,
    );
    if (!wallet) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND,
      );
    }
    const { transactions, total, earnings } =
      await this._walletRepository.paginatedWPGetWallet({
        walletId: wallet._id.toString(),
        page,
        limit,
        search,
      });

    return {
      transactions: WalletMapper.mapTransactionsDTO(transactions),
      balance: wallet.balance,
      holdingBalance: wallet.holdingBalance,
      total,
      earnings,
    };
  }
  async createAddMoneyOrder(
    payload: AddMoneyToWalletReq,
  ): Promise<CreateWalletOrderResp> {
    const {
      accountId,
      accountType,
      data: { amount, description, type },
    } = payload;
    let plantWallet;
    plantWallet = await this._walletRepository.findWallet(
      accountId,
      accountType,
    );
    if (!plantWallet) {
      plantWallet = await this._walletRepository.createWallet({
        accountId,
        accountType,
      });
    }

    const now = new Date();
    const transactions = plantWallet.transactions;
    const activeTransaction = transactions.find(
      (tx) =>
        tx.status === "InProgress" &&
        tx.inProgressExpiresAt &&
        tx.inProgressExpiresAt > now,
    );
    if (activeTransaction) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.COMMON.ERROR.PAYMENT_IN_PROGRESS,
      );
    }

    let expiredTransaction = transactions.find(
      (tx) =>
        tx.status === "InProgress" &&
        tx.amount === amount &&
        tx.inProgressExpiresAt &&
        tx.inProgressExpiresAt <= now,
    );
    let order;
    let inProgressExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    if (expiredTransaction) {
      order = await this._razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${plantWallet._id}_${Date.now().toString().slice(-4)}`,
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
        receipt: `receipt_${plantWallet._id}_${Date.now().toString().slice(-4)}`,
        notes: {
          accountId,
        },
        payment_capture: true,
      });

      plantWallet.transactions.push({
        type,
        subType: "WPDeposit",
        amount,
        description,
        razorpayOrderId: order.id,
        inProgressExpiresAt,
        status: "InProgress",
      });
      await plantWallet.save();
    }

    return {
      orderId: order.id,
      amount,
      currency: order.currency,
      walletId: plantWallet._id.toString(),
      expiresAt: inProgressExpiresAt.toISOString(),
    };
  }

  async verifyWalletAddPayment(
    payload: VerifyWalletAddPaymentReq,
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
        MESSAGES.COMMON.ERROR.INVALID_SIGNATURE,
      );
    }
    const plantWallet =
      await this._walletRepository.findWalletByWalletId(walletId);
    if (!plantWallet) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND,
      );
    }
    const transaction = plantWallet.transactions.find(
      (t) => t.razorpayOrderId === razorpay_order_id,
    );

    if (!transaction) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.TRANSACTION_NOT_FOUND,
      );
    }
    transaction.settlementStatus = "NotApplicable";
    transaction.status = "Paid";
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.paidAt = new Date();
    plantWallet.balance += amount;
    await plantWallet.save();

    return {
      amount,
      balance: plantWallet.balance,
      transactionId: transaction._id.toString(),
      transaction: WalletMapper.mapTransactionDTO(transaction),
    };
  }
  async retryWalletAddPayment(
    accountId: string,
    accountType: string,
    transactionId: string,
  ): Promise<RetryWalletAddPaymentResp> {
    const plantWallet = await this._walletRepository.findWallet(
      accountId,
      accountType,
    );
    if (!plantWallet) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND,
      );
    }
    const transaction = plantWallet?.transactions.find(
      (tx) => tx._id.toString() === transactionId,
    );
    if (!transaction) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.TRANSACTION_NOT_FOUND,
      );
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
        MESSAGES.COMMON.ERROR.PAYMENT_IN_PROGRESS,
      );
    }

    const expiresIn = 5 * 60 * 1000;
    transaction.status = "InProgress";
    transaction.inProgressExpiresAt = new Date(now.getTime() + expiresIn);

    await plantWallet.save();
    return {
      orderId: transaction.razorpayOrderId!,
      amount: transaction.amount,
      currency: "INR",
      walletId: plantWallet._id.toString(),
      expiresAt: transaction.inProgressExpiresAt?.toISOString(),
    };
  }
}
