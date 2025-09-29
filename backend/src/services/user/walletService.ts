import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { IWalletService } from "./interface/IWalletService";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import {
  AddMoneyToWalletReq,
  CreateWalletOrderResp,
  RetryWalletAddPaymentResp,
  VerifyWalletAddPaymentReq,
  VerifyWalletAddPaymentResp,
  WalletDTO,
} from "../../dtos/wallet/walletDTO";
import Razorpay from "razorpay";
import crypto from "crypto";
import { WalletMapper } from "../../mappers/WalletMapper";

@injectable()
export class WalletService implements IWalletService {
  private _razorpay: Razorpay;
  constructor(
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
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
      userId,
      data: { amount, description, type },
    } = payload;
    let userWallet;
    userWallet = await this._walletRepository.findWalletByUserId(userId);
    if (!userWallet) {
      userWallet = await this._walletRepository.createUserWallet(payload);
    }
    console.log("userWallet",userWallet);
    
    const now = new Date();
    const transactions = userWallet.transactions;
    const activeTransaction = transactions.find(
      (tx) =>
        tx.status === "InProgress" &&
        tx.inProgressExpiresAt &&
        tx.inProgressExpiresAt > now
    );
    if (activeTransaction) {
      throw new Error(
        "A payment is already in progress. Please wait a few minutes before retrying."
      );
    }
    console.log("activeTransaction",activeTransaction);
    
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
          userId,
        },
        payment_capture: true,
      });
      expiredTransaction.razorpayOrderId = order.id;
      expiredTransaction.inProgressExpiresAt = inProgressExpiresAt;
          console.log("expiredTransaction",expiredTransaction);
    } else {
      order = await this._razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${userWallet._id}_${Date.now().toString().slice(-4)}`,
        notes: {
          userId,
        },
        payment_capture: true,
      });
      
      userWallet.transactions.push({
        type,
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
    const { userId, data } = payload;
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
      throw new Error("Invalid signature. Payment could not be verified.");
    }
    const userWallet =
      await this._walletRepository.findWalletByWalletId(walletId);
    if (!userWallet) {
      throw new Error("Wallet or transaction not found.");
    }
    const transaction = userWallet.transactions.find(
      (t) => t.razorpayOrderId === razorpay_order_id
    );

    if (!transaction) {
      throw new Error("Transaction not found.");
    }
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
  async getWallet(userId: string): Promise<WalletDTO> {
    const userWallet = await this._walletRepository.findWalletByUserId(userId);
    if (!userWallet) {
      throw new Error("Wallet not found for this user");
    }
    console.log("userWallet", userWallet);

    return WalletMapper.mapWalletDTO(userWallet);
  }
  async retryWalletAddPayment(userId: string, transactionId: string): Promise<RetryWalletAddPaymentResp> {
    const userWallet = await this._walletRepository.findWalletByUserId(userId);
    if(!userWallet) throw new Error("Wallet not found for this user.")
    const transaction = userWallet?.transactions.find(
      (tx) => tx._id.toString() === transactionId
    )
    if(!transaction) throw new Error("Transaction not found.");
    const now = new Date();
        if(
      transaction.status === "InProgress" &&
      transaction.inProgressExpiresAt && 
      transaction.inProgressExpiresAt <= now){
      transaction.status = "Pending";
      transaction.inProgressExpiresAt = null;
    }
    if(
      transaction.status === "InProgress" &&
      transaction.inProgressExpiresAt && 
      transaction.inProgressExpiresAt > now){
      throw new Error(
        "A payment is already in progress. Please wait a few minutes before retrying.",
      );
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
