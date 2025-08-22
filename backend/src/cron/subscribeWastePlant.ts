import cron from "node-cron";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { sendNotification } from "../utils/notificationUtils";
import { SuperAdminModel } from "../models/superAdmin/superAdminModel";

cron.schedule("0 9 * * *", async () => {
  const now = new Date();

  const plants = await WastePlantModel.find({
    autoSubscribeAt: { $lte: now },
    subscribeNotificationSent: false,
  });
  const superadmin = await SuperAdminModel.findOne({
    role: "superadmin",
  });
  if (!superadmin) {
    throw new Error("No superadmin found");
  }
  for (const plant of plants) {

    await sendNotification({
      receiverId: plant._id.toString(),
      receiverType: plant.role,
      senderId: superadmin._id.toString(),
      senderType: "superadmin",
      message: `Reminder: Your plant subscription is pending. Please subscribe to activate features.`,
      type: "subscribe_reminder",
    });

    await WastePlantModel.findByIdAndUpdate(plant._id, {
      subscribeNotificationSent: true,
    });

  }
});
