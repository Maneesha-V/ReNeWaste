"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const PIckupReqMapper_1 = require("../../mappers/PIckupReqMapper");
const DriverMapper_1 = require("../../mappers/DriverMapper");
let PickupService = class PickupService {
    pickupRepository;
    driverRepository;
    notificationRepository;
    truckRepository;
    wastePlantRepository;
    userRepository;
    subscriptionplanRepository;
    constructor(pickupRepository, driverRepository, notificationRepository, truckRepository, wastePlantRepository, userRepository, subscriptionplanRepository) {
        this.pickupRepository = pickupRepository;
        this.driverRepository = driverRepository;
        this.notificationRepository = notificationRepository;
        this.truckRepository = truckRepository;
        this.wastePlantRepository = wastePlantRepository;
        this.userRepository = userRepository;
        this.subscriptionplanRepository = subscriptionplanRepository;
    }
    async getPickupRequestService(filters) {
        const pickups = await this.pickupRepository.getPickupsByPlantId(filters);
        console.log("pickups-pickups", pickups);
        return PIckupReqMapper_1.PickupRequestMapper.mapPickupReqsGetDTO(pickups);
    }
    async approvePickupService(data) {
        const { plantId, pickupReqId, status, driverId, assignedTruckId } = data;
        const totalUserCount = await this.userRepository.fetchAllUsersByPlantId(plantId);
        console.log("totalUserCount", totalUserCount);
        const existingPlant = await this.wastePlantRepository.getWastePlantById(plantId);
        console.log("existingPlant", existingPlant);
        if (!existingPlant) {
            throw new Error("Plant not found.");
        }
        if (existingPlant.status === "Active") {
            const purchasedPlan = await this.subscriptionplanRepository.checkPlanNameExist(existingPlant.subscriptionPlan);
            if (!purchasedPlan) {
                throw new Error("Subscription plan not found.");
            }
            if (totalUserCount >= purchasedPlan?.userLimit) {
                throw new Error(`You can't approve this request bcoz your plan user limit is ${purchasedPlan?.userLimit}.`);
            }
        }
        const updatedPickup = await this.pickupRepository.updatePickupStatusAndDriver(pickupReqId, {
            status,
            driverId,
            truckId: assignedTruckId,
        });
        if (!updatedPickup)
            throw new Error("Pickup  not found or update failed");
        if (updatedPickup.wasteplantId?.toString() !== plantId) {
            throw new Error("Pickup  not belongs to this wasteplant");
        }
        await this.driverRepository.updateDriverTruck(driverId, assignedTruckId);
        const driver = await this.driverRepository.getDriverById(driverId);
        const truck = await this.truckRepository.getTruckById(assignedTruckId);
        if (!driver || !truck)
            throw new Error("Driver or Truck or User not found");
        const plant = await this.wastePlantRepository.getWastePlantById(driver.wasteplantId.toString());
        if (!plant || String(plant._id) !== String(updatedPickup.wasteplantId)) {
            throw new Error("Driver's plant does not match pickup's plant. Skipping notification.");
        }
        const io = globalThis.io;
        const driverMessage = `New pickup task assigned: Truck ${truck.vehicleNumber} from ${plant.plantName}.`;
        const driverNotification = await this.notificationRepository.createNotification({
            receiverId: driverId,
            receiverType: "driver",
            senderId: plantId,
            senderType: "wasteplant",
            message: driverMessage,
            type: "pickup_scheduled",
        });
        if (io) {
            io.to(`${driverId}`).emit("newNotification", driverNotification);
        }
        const userId = updatedPickup.userId.toString();
        const userMessage = `Your pickup request has been approved. Driver ${driver.name} with truck ${truck.vehicleNumber} is assigned.`;
        const userNotification = await this.notificationRepository.createNotification({
            receiverId: userId,
            receiverType: "user",
            senderId: plantId,
            senderType: "wasteplant",
            message: userMessage,
            type: "pickup_approved",
        });
        if (io) {
            io.to(`${userId}`).emit("newNotification", userNotification);
        }
        return PIckupReqMapper_1.PickupRequestMapper.mapPickupReqDTO(updatedPickup);
    }
    async cancelPickupRequest(plantId, pickupReqId, reason) {
        const updatedPickupRequest = await this.pickupRepository.updatePickupRequest(pickupReqId);
        const io = globalThis.io;
        const userId = updatedPickupRequest.userId.toString();
        const userMessage = `Your pickup ID ${updatedPickupRequest.pickupId} is cancelled.${reason}`;
        const userNotification = await this.notificationRepository.createNotification({
            receiverId: userId,
            receiverType: "user",
            senderId: plantId,
            senderType: "wasteplant",
            message: userMessage,
            type: "pickup_cancelled",
        });
        console.log("userNotification", userNotification);
        if (io) {
            io.to(`${userId}`).emit("newNotification", userNotification);
        }
        return PIckupReqMapper_1.PickupRequestMapper.mapPickupReqDTO(updatedPickupRequest);
    }
    async reschedulePickup(wasteplantId, pickupReqId, data) {
        const existingPickup = await this.pickupRepository.getPickupById(pickupReqId);
        if (!existingPickup) {
            throw new Error("Pickup request not found");
        }
        if (existingPickup?.wasteplantId?.toString() !== wasteplantId.toString()) {
            throw new Error("Pickup not belongs this wasteplant.");
        }
        const driver = await this.driverRepository.updateDriverAssignedZone(data.driverId, data.assignedZone);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        const truckId = driver?.assignedTruckId;
        if (!truckId) {
            throw new Error("Truck ID is missing for the assigned driver.");
        }
        const truck = await this.truckRepository.getTruckById(truckId.toString());
        const updatedPickup = await this.pickupRepository.updatePickupDate(pickupReqId, {
            driverId: data.driverId,
            rescheduledPickupDate: data.rescheduledPickupDate,
            pickupTime: data.pickupTime,
            status: data.status,
        });
        if (!updatedPickup) {
            throw new Error("Failed to reschedule pickup");
        }
        const plant = await this.wastePlantRepository.getWastePlantById(wasteplantId);
        if (!plant || String(plant._id) !== String(updatedPickup.wasteplantId)) {
            throw new Error("Driver's plant does not match pickup's plant. Skipping notification.");
        }
        const io = globalThis.io;
        const driverMessage = `Pickup ${updatedPickup.pickupId} is rescheduled to you from ${plant.plantName}.`;
        const driverNotification = await this.notificationRepository.createNotification({
            receiverId: data.driverId,
            receiverType: "driver",
            senderId: wasteplantId,
            senderType: "wasteplant",
            message: driverMessage,
            type: "pickup_rescheduled",
        });
        console.log("driverNotification", driverNotification);
        if (io) {
            io.to(`${data.driverId}`).emit("newNotification", driverNotification);
        }
        const userId = existingPickup.userId.toString();
        const userMessage = `Your pickup ID ${updatedPickup.pickupId} is rescheduled. Driver ${driver.name} with truck ${truck?.vehicleNumber} is assigned.`;
        const userNotification = await this.notificationRepository.createNotification({
            receiverId: userId,
            receiverType: "user",
            senderId: wasteplantId,
            senderType: "wasteplant",
            message: userMessage,
            type: "pickup_rescheduled",
        });
        console.log("userNotification", userNotification);
        if (io) {
            io.to(`${userId}`).emit("newNotification", userNotification);
        }
        return PIckupReqMapper_1.PickupRequestMapper.mapPickupReqDTO(updatedPickup);
    }
    async getAvailableDriverService(location, plantId) {
        const drivers = await this.driverRepository.getDriversByLocation(location, plantId);
        return DriverMapper_1.DriverMapper.mapDriversDTO(drivers);
    }
};
exports.PickupService = PickupService;
exports.PickupService = PickupService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.NotificationRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.TruckRepository)),
    __param(4, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(5, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(6, (0, inversify_1.inject)(types_1.default.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], PickupService);
