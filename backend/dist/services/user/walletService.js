"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const WalletMapper_1 = require("../../mappers/WalletMapper");
let WalletService = class WalletService {
    _walletRepository;
    _userRepository;
    _razorpay;
    constructor(_walletRepository, _userRepository) {
        this._walletRepository = _walletRepository;
        this._userRepository = _userRepository;
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_id || !key_secret) {
            throw new Error("Razorpay API keys are not defined in environment variables");
        }
        this._razorpay = new razorpay_1.default({
            key_id,
            key_secret,
        });
    }
    async createAddMoneyOrder(payload) {
        const { accountId, accountType, data: { amount, description, type }, } = payload;
        let userWallet;
        userWallet = await this._walletRepository.findWallet(accountId, accountType);
        if (!userWallet) {
            userWallet = await this._walletRepository.createWallet({
                accountId,
                accountType
            });
        }
        console.log("userWallet", userWallet);
        const now = new Date();
        const transactions = userWallet.transactions;
        const activeTransaction = transactions.find((tx) => tx.status === "InProgress" &&
            tx.inProgressExpiresAt &&
            tx.inProgressExpiresAt > now);
        if (activeTransaction) {
            throw new Error("A payment is already in progress. Please wait a few minutes before retrying.");
        }
        console.log("activeTransaction", activeTransaction);
        let expiredTransaction = transactions.find((tx) => tx.status === "InProgress" &&
            tx.amount === amount &&
            tx.inProgressExpiresAt &&
            tx.inProgressExpiresAt <= now);
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
            console.log("expiredTransaction", expiredTransaction);
        }
        else {
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
    async verifyWalletAddPayment(payload) {
        const { accountId, accountType, data } = payload;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, walletId, amount, } = data;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            throw new Error("Invalid signature. Payment could not be verified.");
        }
        const userWallet = await this._walletRepository.findWalletByWalletId(walletId);
        if (!userWallet) {
            throw new Error("Wallet or transaction not found.");
        }
        const transaction = userWallet.transactions.find((t) => t.razorpayOrderId === razorpay_order_id);
        if (!transaction) {
            throw new Error("Transaction not found.");
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
    async getWallet(accountId, accountType, page, limit, search) {
        const userWallet = await this._walletRepository.findWallet(accountId, accountType);
        if (!userWallet) {
            throw new Error("Wallet not found for this user");
        }
        console.log("userWallet", userWallet);
        const { transactions, total } = await this._walletRepository.paginatedUserGetWallet({
            walletId: userWallet._id.toString(),
            page,
            limit,
            search,
        });
        console.log({ transactions, total });
        return {
            transactions: WalletMapper_1.WalletMapper.mapTransactionsDTO(transactions),
            balance: userWallet.balance,
            total,
        };
    }
    async retryWalletAddPayment(accountId, accountType, transactionId) {
        const userWallet = await this._walletRepository.findWallet(accountId, accountType);
        if (!userWallet)
            throw new Error("Wallet not found for this user.");
        const transaction = userWallet?.transactions.find((tx) => tx._id.toString() === transactionId);
        if (!transaction)
            throw new Error("Transaction not found.");
        const now = new Date();
        if (transaction.status === "InProgress" &&
            transaction.inProgressExpiresAt &&
            transaction.inProgressExpiresAt <= now) {
            transaction.status = "Pending";
            transaction.inProgressExpiresAt = null;
        }
        if (transaction.status === "InProgress" &&
            transaction.inProgressExpiresAt &&
            transaction.inProgressExpiresAt > now) {
            throw new Error("A payment is already in progress. Please wait a few minutes before retrying.");
        }
        const expiresIn = 5 * 60 * 1000;
        transaction.status = "InProgress";
        transaction.inProgressExpiresAt = new Date(now.getTime() + expiresIn);
        await userWallet.save();
        return {
            orderId: transaction.razorpayOrderId,
            amount: transaction.amount,
            currency: "INR",
            walletId: userWallet._id.toString(),
            expiresAt: transaction.inProgressExpiresAt?.toISOString(),
        };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.WalletRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], WalletService);
