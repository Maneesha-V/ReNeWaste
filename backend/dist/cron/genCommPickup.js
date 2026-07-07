"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const types_1 = __importDefault(require("../config/inversify/types"));
const container_1 = __importDefault(require("../config/inversify/container"));
// Runs every night at midnight
node_cron_1.default.schedule("0 0 * * *", async () => {
    const pickupRepo = container_1.default.get(types_1.default.PickupRepository);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recurringPickups = await pickupRepo.getRecurringPickups();
    for (const pickup of recurringPickups) {
        const latestPickup = await pickupRepo.getLatestRecurringPickup(pickup._id.toString());
        if (!latestPickup)
            continue;
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
        const alreadyExists = await pickupRepo.existsRecurringPickup(pickup._id.toString(), nextDate);
        if (alreadyExists)
            continue;
        const { _id, ...newPickup } = pickup.toObject();
        newPickup.originalPickupDate = nextDate;
        newPickup.parentRequestId = pickup._id;
        await pickupRepo.createPickup(newPickup);
        console.log(`Recurring pickup created: ${pickup.pickupId} (${pickup.frequency}) -> ${nextDate.toISOString()}`);
    }
});
