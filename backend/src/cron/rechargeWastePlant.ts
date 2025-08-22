import cron from "node-cron";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { sendNotification } from "../utils/notificationUtils";
import { SuperAdminModel } from "../models/superAdmin/superAdminModel";

cron.schedule("0 9 * * *", async () => {
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const superadmin = await SuperAdminModel.findOne({
    role: "superadmin",
  });
  if (!superadmin) {
    throw new Error("No superadmin found");
  }
  const reminderPlants = await WastePlantModel.find({
    autoRechargeAt: { $lte: oneDayLater, $gt: now },
    renewNotificationSent: { $ne: true },
  });
  for (const plant of reminderPlants) {
    await sendNotification({
      receiverId: plant._id.toString(),
      receiverType: plant.role,
      senderId: superadmin._id.toString(),
      senderType: "superadmin",
      message: `Reminder: Your plant subscription will expire tomorrow. Please renew to avoid interruption.`,
      type: "renew_reminder",
    });

    await WastePlantModel.findByIdAndUpdate(plant._id, {
      renewNotificationSent: true,
    });
  }
  const expiredPlants = await WastePlantModel.find({
    autoRechargeAt: { $lte: now },
    rechargeNotificationSent: { $ne: true },
  });
  console.log("Expired plants:", expiredPlants.length);
  for (const plant of expiredPlants) {
    await sendNotification({
      receiverId: plant._id.toString(),
      receiverType: plant.role,
      senderId: superadmin._id.toString(),
      senderType: "superadmin",
      message: `Alert: Your plant subscription plan is expired. Please recharge to continue.`,
      type: "recharge_reminder",
    });

    await WastePlantModel.findByIdAndUpdate(plant._id, {
      rechargeNotificationSent: true,
      status: "Inactive"
    });
  }
});
