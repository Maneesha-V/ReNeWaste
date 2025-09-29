import cron from "node-cron";
import { PickupModel } from "../models/pickupRequests/pickupModel";
import TYPES from "../config/inversify/types";
import { IPickupRepository } from "../repositories/pickupReq/interface/IPickupRepository";
import container from "../config/inversify/container";

// Runs every night at midnight
cron.schedule("0 12 * * *", async () => {
  const pickupRepo = container.get<IPickupRepository>(TYPES.PickupRepository);
  // await PickupModel.deleteMany({
  //   wasteType: "Commercial",
  //   frequency: { $in: ["Daily", "Weekly", "Monthly"] },
  //   parentRequestId: null,
  // })
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
        break;
      case "Weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "Monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        continue;
    }

    const parentId = pickup._id;

    const {_id, ...newPickup} = pickup.toObject();
    newPickup.originalPickupDate = nextDate;
    newPickup.parentRequestId = parentId;
    await pickupRepo.createPickup(newPickup);
  }
});
