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
    const plants = await wastePlantModel_1.WastePlantModel.find({
        autoSubscribeAt: { $lte: now },
        subscribeNotificationSent: false,
    });
    const superadmin = await superAdminModel_1.SuperAdminModel.findOne({
        role: "superadmin",
    });
    if (!superadmin) {
        throw new Error("No superadmin found");
    }
    for (const plant of plants) {
        await (0, notificationUtils_1.sendNotification)({
            receiverId: plant._id.toString(),
            receiverType: plant.role,
            senderId: superadmin._id.toString(),
            senderType: "superadmin",
            message: `Reminder: Your plant subscription is pending. Please subscribe to activate features.`,
            type: "subscribe_reminder",
        });
        await wastePlantModel_1.WastePlantModel.findByIdAndUpdate(plant._id, {
            subscribeNotificationSent: true,
        });
    }
});
