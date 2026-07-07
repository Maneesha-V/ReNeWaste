"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const wastePlantModel_1 = require("../models/wastePlant/wastePlantModel");
const notificationUtils_1 = require("../utils/notificationUtils");
const superAdminModel_1 = require("../models/superAdmin/superAdminModel");
node_cron_1.default.schedule("* * * * *", async () => {
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const superadmin = await superAdminModel_1.SuperAdminModel.findOne({
        role: "superadmin",
    });
    if (!superadmin) {
        throw new Error("No superadmin found");
    }
    const reminderPlants = await wastePlantModel_1.WastePlantModel.find({
        autoRechargeAt: { $lte: oneDayLater, $gt: now },
        renewNotificationSent: { $ne: true },
    });
    for (const plant of reminderPlants) {
        await (0, notificationUtils_1.sendNotification)({
            receiverId: plant._id.toString(),
            receiverType: plant.role,
            senderId: superadmin._id.toString(),
            senderType: "superadmin",
            message: `Reminder: Your plant subscription will expire tomorrow. Please renew to avoid interruption.`,
            type: "renew_reminder",
        });
        await wastePlantModel_1.WastePlantModel.findByIdAndUpdate(plant._id, {
            renewNotificationSent: true,
        });
    }
    const expiredPlants = await wastePlantModel_1.WastePlantModel.find({
        autoRechargeAt: { $lte: now },
        rechargeNotificationSent: { $ne: true },
    });
    console.log("Expired plants:", expiredPlants.length);
    for (const plant of expiredPlants) {
        await (0, notificationUtils_1.sendNotification)({
            receiverId: plant._id.toString(),
            receiverType: plant.role,
            senderId: superadmin._id.toString(),
            senderType: "superadmin",
            message: `Alert: Your plant subscription plan is expired. Please recharge to continue.`,
            type: "recharge_reminder",
        });
        await wastePlantModel_1.WastePlantModel.findByIdAndUpdate(plant._id, {
            rechargeNotificationSent: true,
            status: "Inactive",
        });
    }
});
