import cron from "node-cron";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { PickupModel } from "../models/pickupRequests/pickupModel";
import { sendNotification } from "../utils/notificationUtils";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const plantsToUnblock = await WastePlantModel.find({
      isBlocked: true,
      autoUnblockAt: { $lte: now },
      unblockNotificationSent: { $ne: true }
    });

    for (const plant of plantsToUnblock) {
      plant.isBlocked = false;
      plant.blockedAt = null;
      plant.autoUnblockAt = null;
      plant.unblockNotificationSent = true;
      await plant.save();

      const pickups = await PickupModel.find({
        wasteplantId: plant._id,
        status: { $in: ["Pending", "Scheduled", "Rescheduled"] },
      });

      const notifiedUsers = new Set<string>();
      for (const pickup of pickups) {
        const userId = pickup.userId?.toString();
        if (!userId || notifiedUsers.has(userId)) continue;

        await sendNotification({
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
  } catch (err) {
    console.error("❌ Error in auto-unblock cron:", err);
  }
});
