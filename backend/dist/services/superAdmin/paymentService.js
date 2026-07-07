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
exports.PaymentService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const SubscriptionPaymentMapper_1 = require("../../mappers/SubscriptionPaymentMapper");
const notificationUtils_1 = require("../../utils/notificationUtils");
const razorpay_1 = __importDefault(require("razorpay"));
let PaymentService = class PaymentService {
    _subscriptionPaymentRepository;
    _wastePlantRepository;
    _walletRepository;
    razorpay;
    constructor(_subscriptionPaymentRepository, _wastePlantRepository, _walletRepository) {
        this._subscriptionPaymentRepository = _subscriptionPaymentRepository;
        this._wastePlantRepository = _wastePlantRepository;
        this._walletRepository = _walletRepository;
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_id || !key_secret) {
            throw new Error("Razorpay API keys are not defined in environment variables");
        }
        this.razorpay = new razorpay_1.default({
            key_id,
            key_secret,
        });
    }
    async fetchPayments(data) {
        const paymentHisData = await this._subscriptionPaymentRepository.getAllSubscptnPayments(data);
        if (!paymentHisData) {
            throw new Error("Payment history not found.");
        }
        return paymentHisData;
    }
    async updateRefundStatusPayment(data) {
        const { subPayId, refundStatus, adminId } = data;
        const payment = await this._subscriptionPaymentRepository.findSubscriptionPaymentById(subPayId);
        if (!payment) {
            throw new Error("Payment not found");
        }
        console.log("RefundPaym..", payment);
        const currentStatus = payment.refundStatus;
        const inProgressExpiresAt = payment.inProgressExpiresAt;
        if (!refundStatus) {
            throw new Error("Refund status cannot be null.");
        }
        if (!currentStatus) {
            throw new Error("Current status cannot be null.");
        }
        if ((currentStatus === "Pending" &&
            !["Processing", "Rejected"].includes(refundStatus)) ||
            (currentStatus === "Processing" && refundStatus !== "Refunded") ||
            ["Refunded", "Rejected"].includes(currentStatus)) {
            throw new Error("Invalid refund status transition.");
        }
        if (currentStatus === "Processing" &&
            inProgressExpiresAt &&
            new Date(inProgressExpiresAt) > new Date()) {
            const expireTime = new Date(inProgressExpiresAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            throw new Error(`Refund is already being processed. Try again after ${expireTime}.`);
        }
        payment.refundStatus = refundStatus;
        const plant = await this._wastePlantRepository.getWastePlantById(payment.wasteplantId.toString());
        if (!plant)
            throw new Error("Plant not found.");
        let plantMessage = "";
        let notificationType = "";
        if (refundStatus) {
            if (refundStatus === "Processing") {
                payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
            }
            else {
                payment.inProgressExpiresAt = null;
            }
            // payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
            switch (refundStatus) {
                case "Pending":
                    plantMessage = `Refund process started for ${plant.plantName}.`;
                    notificationType = "subscriptn-refund-pending";
                    break;
                case "Processing":
                    plantMessage = `Refund is currently being processed for ${plant.plantName}.`;
                    notificationType = "subscriptn-refund-processing";
                    break;
                case "Rejected":
                    plantMessage = `Refund has been rejected for ${plant.plantName}.`;
                    notificationType = "subscriptn-refund-rejected";
                    break;
                default:
                    plantMessage = `Refund status updated for ${plant.plantName}.`;
                    notificationType = "general";
            }
            await (0, notificationUtils_1.sendNotification)({
                receiverId: plant._id.toString(),
                receiverType: plant.role,
                senderId: adminId,
                senderType: "superadmin",
                message: plantMessage,
                type: notificationType,
            });
        }
        else {
            payment.inProgressExpiresAt = null;
        }
        await payment.save();
        return SubscriptionPaymentMapper_1.SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
    }
    // async refundPayment(
    //   data: UpdateRefundStatusReq,
    // ): Promise<SubscriptionPaymentDTO> {
    //   const { subPayId, refundStatus, adminId } = data;
    //   const payment =
    //     await this._subscriptionPaymentRepository.findSubscriptionPaymentById(
    //       subPayId,
    //     );
    //   if (!payment) {
    //     throw new Error("Payment not found");
    //   }
    //   const plant = await this._wastePlantRepository.getWastePlantById(
    //     payment.wasteplantId.toString(),
    //   );
    //   if (!plant) throw new Error("Plant not found.");
    //   if (refundStatus === "Refunded") {
    //     payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    //     if (!payment.razorpayPaymentId) {
    //       throw new Error(
    //         "Razorpay Payment ID is missing, refund cannot be processed.",
    //       );
    //     }
    //     try {
    //       const paymentDetails = await this.razorpay.payments.fetch(
    //         payment.razorpayPaymentId,
    //       );
    //       console.log("paymentDetails", paymentDetails);
    //       if (paymentDetails.status !== "captured") {
    //         throw new Error("Payment is not captured and cannot be refunded.");
    //       }
    //       if (process.env.NODE_ENV === "production") {
    //         const refund = await this.razorpay.payments.refund(
    //           payment.razorpayPaymentId,
    //           {
    //             amount: paymentDetails.amount,
    //             speed: "normal",
    //           },
    //         );
    //         payment.razorpayRefundId = refund.id;
    //       } else {
    //         console.log("Simulating refund success in TEST MODE");
    //         payment.razorpayRefundId = `test_refund_${Date.now()}`;
    //       }
    //       payment.refundStatus = "Refunded";
    //       payment.refundAt = new Date();
    //       const plantMessage = `Refund process completed for ${plant.plantName}.`;
    //       await sendNotification({
    //         receiverId: plant._id.toString(),
    //         receiverType: plant.role,
    //         senderId: adminId,
    //         senderType: "superadmin",
    //         message: plantMessage,
    //         type: "subscriptn-refund-completed",
    //       });
    //     } catch (error: any) {
    //       console.error("Refund failed:", JSON.stringify(error, null, 2));
    //       throw new Error(error?.error?.description || "Refund failed");
    //     }
    //   } else {
    //     payment.inProgressExpiresAt = null;
    //   }
    //   await payment.save();
    //   plant.status = "Inactive";
    //   await plant.save();
    //   return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
    // }
    async refundPayment(data) {
        const { subPayId, adminId } = data;
        const payment = await this._subscriptionPaymentRepository.findSubscriptionPaymentById(subPayId);
        if (!payment)
            throw new Error("Payment not found");
        if (payment.refundStatus === "Refunded") {
            throw new Error("This payment has already been refunded.");
        }
        if (!payment.razorpayPaymentId) {
            throw new Error("Razorpay Payment ID missing.");
        }
        payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await payment.save();
        try {
            const paymentDetails = await this.razorpay.payments.fetch(payment.razorpayPaymentId);
            if (paymentDetails.status !== "captured") {
                throw new Error("Payment not captured. Cannot refund.");
            }
            let refundId;
            if (process.env.NODE_ENV === "production") {
                const refund = await this.razorpay.payments.refund(payment.razorpayPaymentId, {
                    amount: paymentDetails.amount,
                    speed: "normal",
                });
                refundId = refund.id;
            }
            else {
                refundId = `test_refund_${Date.now()}`;
                console.log("Simulated refund in test mode");
            }
            const plant = await this._wastePlantRepository.getWastePlantById(payment.wasteplantId.toString());
            if (!plant)
                throw new Error("Plant not found.");
            const accountId = payment.wasteplantId.toString();
            let wastePlantWallet = await this._walletRepository.findWallet(accountId, "WastePlant");
            if (!wastePlantWallet) {
                wastePlantWallet = await this._walletRepository.createWallet({
                    accountId,
                    accountType: "WastePlant",
                });
            }
            wastePlantWallet.balance += payment.amount;
            wastePlantWallet.transactions.push({
                type: "Credit",
                subType: "Refund",
                amount: payment.amount,
                description: `Refunded subscription payment of wasteplant ${plant?.plantName}`,
                refundAt: new Date(),
                refundStatus: "Refunded"
            });
            await wastePlantWallet.save();
            let adminWallet = await this._walletRepository.findWallet(adminId, "SuperAdmin");
            if (!adminWallet) {
            }
            payment.razorpayRefundId = refundId;
            payment.refundStatus = "Refunded";
            payment.refundAt = new Date();
            payment.inProgressExpiresAt = null;
            await payment.save();
            if (plant) {
                plant.status = "Inactive";
                await plant.save();
                await (0, notificationUtils_1.sendNotification)({
                    receiverId: plant._id.toString(),
                    receiverType: plant.role,
                    senderId: adminId,
                    senderType: "superadmin",
                    message: `Refund completed for ${plant.plantName}.`,
                    type: "subscriptn-refund-completed",
                });
            }
            return SubscriptionPaymentMapper_1.SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
        }
        catch (error) {
            payment.inProgressExpiresAt = null;
            await payment.save();
            throw new Error(error?.error?.description || "Refund failed");
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.SubscriptionPaymentRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.WalletRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], PaymentService);
