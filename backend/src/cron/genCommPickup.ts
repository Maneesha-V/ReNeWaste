import cron from "node-cron";
import TYPES from "../config/inversify/types";
import { IPickupRepository } from "../repositories/pickupReq/interface/IPickupRepository";
import container from "../config/inversify/container";

// Runs every night at midnight
cron.schedule("*/10 * * * * *", async () => {
  const pickupRepo = container.get<IPickupRepository>(TYPES.PickupRepository);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const recurringPickups = await pickupRepo.getRecurringPickups();

  for (const pickup of recurringPickups) {
    const latestPickup = await pickupRepo.getLatestRecurringPickup(
      pickup._id.toString(),
    );
    if (!latestPickup) continue;
    if (pickup.isPaused && pickup.pauseUntil) {
      const resumeDate = new Date(pickup.pauseUntil);
      resumeDate.setDate(resumeDate.getDate() + 1);
      resumeDate.setHours(0, 0, 0, 0);

      const createResumePickupDate = new Date(resumeDate);
      createResumePickupDate.setDate(createResumePickupDate.getDate() - 1);
      createResumePickupDate.setDate(createResumePickupDate.getDate());
      createResumePickupDate.setHours(0, 0, 0, 0);
      console.log("Today:", today);
      console.log("Resume:", resumeDate);
      console.log("Create Resume:", createResumePickupDate);
      console.log(latestPickup);

      // One day before resume date
      if (today.getTime() === createResumePickupDate.getTime()) {
        console.log(
          "Condition:",
          today.getTime(),
          createResumePickupDate.getTime(),
          today.getTime() === createResumePickupDate.getTime(),
        );
        const isFirstPickup =
          latestPickup?._id.toString() === pickup._id.toString();
        console.log("isFirstPickup:", isFirstPickup);
        if (isFirstPickup) {
          pickup.originalPickupDate = resumeDate;
          pickup.isPaused = false;
          pickup.pauseUntil = null;
          pickup.requestType = null;
          pickup.requestedFrequency = null;
          await pickup.save();

          console.log(`First pickup postponed to ${resumeDate.toISOString()}`);

          continue;
        }

        const alreadyExists = await pickupRepo.existsRecurringPickup(
          pickup._id.toString(),
          resumeDate,
        );
        console.log("alreadyExists:", alreadyExists);
        if (!alreadyExists) {
          const { _id, ...newPickup } = pickup.toObject();

          newPickup.originalPickupDate = resumeDate;
          newPickup.parentRequestId = pickup._id;
          newPickup.isPaused = false;
          newPickup.pauseUntil = null;
          newPickup.requestType = null;
          newPickup.requestedFrequency = null;
          await pickupRepo.createPickup(newPickup);

          console.log(
            `Paused pickup resumed: ${pickup.pickupId} -> ${resumeDate.toISOString()}`,
          );
        }
        pickup.isPaused = false;
        pickup.pauseUntil = null;
        pickup.requestType = null;
        pickup.requestedFrequency = null;

        await pickup.save();
      }
      continue;
    }
    let nextDate = new Date(latestPickup.originalPickupDate);
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

    nextDate.setHours(0, 0, 0, 0);
    const createDate = new Date(nextDate);
    createDate.setDate(createDate.getDate() - 1);
    createDate.setHours(0, 0, 0, 0);
    const graceDate = new Date(nextDate);
    graceDate.setDate(graceDate.getDate() + 1);
    graceDate.setHours(0, 0, 0, 0);

    if (today < createDate || today > graceDate) {
      continue;
    }

    const alreadyExists = await pickupRepo.existsRecurringPickup(
      pickup._id.toString(),
      nextDate,
    );

    if (alreadyExists) continue;

    const { _id, ...newPickup } = pickup.toObject();
    newPickup.originalPickupDate = nextDate;
    newPickup.parentRequestId = pickup._id;
    newPickup.isPaused = false;
    newPickup.pauseUntil = null;
    newPickup.requestType = null;
    newPickup.requestedFrequency = null;
    await pickupRepo.createPickup(newPickup);

    console.log(
      `Recurring pickup created: ${pickup.pickupId} (${pickup.frequency}) -> ${nextDate.toISOString()}`,
    );
  }
});
