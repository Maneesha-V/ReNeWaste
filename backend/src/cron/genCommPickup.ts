import cron from "node-cron";
import { PickupModel } from "../models/pickupRequests/pickupModel";
import TYPES from "../config/inversify/types";
import { IPickupRepository } from "../repositories/pickupReq/interface/IPickupRepository";
import container from "../config/inversify/container";

// Runs every night at midnight
cron.schedule("0 0 * * *", async () => {
  const pickupRepo = container.get<IPickupRepository>(TYPES.PickupRepository);
  const recurringPickups = await PickupModel.find({
    wasteType: "Commercial",
    frequency: { $in: ["Daily", "Weekly", "Monthly"] },
    parentRequestId: null,
    status: { $ne: "Cancelled" },
  });
  for (const pickup of recurringPickups) {
    let nextDate = new Date(pickup.originalPickupDate);
    switch (pickup.frequency) {
      case "Daily":
        nextDate.setDate(nextDate.getDate() + 1);
        pickup.originalPickupDate = nextDate;
        break;
      case "Weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        pickup.originalPickupDate = nextDate;
        break;
      case "Monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        pickup.originalPickupDate = nextDate;
        break;
      default:
        continue;
    }
    pickup.parentRequestId = pickup._id;
    await pickupRepo.createPickup(pickup.toObject());
  }
});
