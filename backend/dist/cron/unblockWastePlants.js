"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const wastePlantModel_1 = require("../models/wastePlant/wastePlantModel");
const pickupModel_1 = require("../models/pickupRequests/pickupModel");
const notificationUtils_1 = require("../utils/notificationUtils");
node_cron_1.default.schedule("* * * * *", async () => {
    try {
        const now = new Date();
        const plantsToUnblock = await wastePlantModel_1.WastePlantModel.find({
            isBlocked: true,
            autoUnblockAt: { $lte: now },
            unblockNotificationSent: { $ne: true },
        });
        for (const plant of plantsToUnblock) {
            plant.isBlocked = false;
            plant.blockedAt = null;
            plant.autoUnblockAt = null;
            plant.unblockNotificationSent = true;
            await plant.save();
            const pickups = await pickupModel_1.PickupModel.find({
                wasteplantId: plant._id,
                status: { $in: ["Pending", "Scheduled", "Rescheduled"] },
            });
            const notifiedUsers = new Set();
            for (const pickup of pickups) {
                const userId = pickup.userId?.toString();
                if (!userId || notifiedUsers.has(userId))
                    continue;
                await (0, notificationUtils_1.sendNotification)({
                    receiverId: userId,
                    receiverType: "user",
                    senderId: plant._id.toString(),
                    senderType: "wasteplant",
                    message: `The plant (${plant.plantName}) you scheduled pickup with is now unblocked. Services are available again.`,
                    type: "general",
                });
                notifiedUsers.add(userId);
            }
            console.log(`✅ Auto-unblocked: ${plant.plantName}`);
        }
    }
    catch (err) {
        console.error("❌ Error in auto-unblock cron:", err);
    }
});
