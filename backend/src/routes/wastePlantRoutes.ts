import express, { RequestHandler } from "express";
import { AuthController } from "../controllers/wastePlant/authController";
import { DriverController } from "../controllers/wastePlant/driverController";
import { TruckController } from "../controllers/wastePlant/truckController";
import { PickupController } from "../controllers/wastePlant/pickupController";
import { ChatController } from "../controllers/wastePlant/chatController";
import { DropSpotController } from "../controllers/wastePlant/dropSpotController";
import { UserController } from "../controllers/wastePlant/userController";
import { authenticateWastePlant } from "../middlewares/authMiddware";
import uploadImages from "../middlewares/imageUploader";
import TYPES from "../config/inversify/types";
import container from "../config/inversify/container";
import { NotificationController } from "../controllers/wastePlant/notificationController";
import { DashboardController } from "../controllers/wastePlant/dashboardController";
import { SubscriptionController } from "../controllers/wastePlant/subscriptionController";
import { PaymentController } from "../controllers/wastePlant/paymentController";

const router = express.Router();
const plantCtrl = container.get<AuthController>(TYPES.PlantAuthController);
const plantTruckCtrl = container.get<TruckController>(TYPES.PlantTruckController);
const plantDriverCtrl = container.get<DriverController>(TYPES.PlantDriverController);
const plantPickupCtrl = container.get<PickupController>(TYPES.PlantPickupController);
const plantDropSpotCtrl = container.get<DropSpotController>(TYPES.PlantDropSpotController);
const plantChatCtrl = container.get<ChatController>(TYPES.PlantChatController);
const plantUserCtrl = container.get<UserController>(TYPES.PlantUserController);
const plantNotificationCtrl = container.get<NotificationController>(TYPES.PlantNotificationController);
const plantDashboardCtrl = container.get<DashboardController>(TYPES.PlantDashboardController);
const plantSubscriptionCtrl = container.get<SubscriptionController>(TYPES.PlantSubscriptionController);
const plantPaymentCtrl = container.get<PaymentController>(TYPES.PlantPaymentController);


router.get("/refresh-token", plantCtrl.refreshToken.bind(plantCtrl));
router.post("/", plantCtrl.wastePlantLogin.bind(plantCtrl));
router.post("/logout", plantCtrl.wastePlantLogout.bind(plantCtrl));
router.post("/send-otp", plantCtrl.sendOtp.bind(plantCtrl));
router.post("/resend-otp", plantCtrl.resendOtp.bind(plantCtrl));
router.post("/verify-otp", plantCtrl.verifyOtp.bind(plantCtrl));
router.post("/reset-password", plantCtrl.resetPassword.bind(plantCtrl));
router.get("/add-driver",authenticateWastePlant as RequestHandler, plantDriverCtrl.getCreateDriver.bind(plantDriverCtrl));
router.post("/add-driver", authenticateWastePlant as RequestHandler, uploadImages.fields([
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
  ]),
  plantDriverCtrl.addDriver.bind(plantDriverCtrl)
);
router.get("/drivers",authenticateWastePlant as RequestHandler, plantDriverCtrl.fetchDrivers.bind(plantDriverCtrl));
router.get("/edit-driver/:driverId",authenticateWastePlant as RequestHandler, plantDriverCtrl.getDriverById.bind(plantDriverCtrl));
router.patch(
  "/edit-driver/:driverId",authenticateWastePlant as RequestHandler,
  uploadImages.fields([
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
  ]),
  plantDriverCtrl.updateDriver.bind(plantDriverCtrl)
);
router.delete("/delete-driver/:driverId", authenticateWastePlant as RequestHandler, plantDriverCtrl.deleteDriverById.bind(plantDriverCtrl))
router.get("/trucks", authenticateWastePlant as RequestHandler, plantTruckCtrl.fetchTrucks.bind(plantTruckCtrl));
router.get("/available-trucks", authenticateWastePlant as RequestHandler, plantTruckCtrl.fetchAvailableTrucks.bind(plantTruckCtrl));
router.post("/add-truck", authenticateWastePlant as RequestHandler, plantTruckCtrl.addTruck.bind(plantTruckCtrl));
router.get("/edit-truck/:truckId",authenticateWastePlant as RequestHandler, plantTruckCtrl.getTruckById.bind(plantTruckCtrl));
router.patch("/edit-truck/:truckId", authenticateWastePlant as RequestHandler, plantTruckCtrl.updateTruck.bind(plantTruckCtrl));
router.delete("/delete-truck/:truckId", authenticateWastePlant as RequestHandler, plantTruckCtrl.deleteTruckById.bind(plantTruckCtrl))
router.get("/pending-truck-req", authenticateWastePlant as RequestHandler, plantTruckCtrl.getAvailableTruckReqsts.bind(plantTruckCtrl))
router.get("/trucks-for-driver", authenticateWastePlant as RequestHandler, plantTruckCtrl.getTrucksForDriver.bind(plantTruckCtrl))
router.post("/assign-truck", authenticateWastePlant as RequestHandler, plantTruckCtrl.assignTruckToDriver.bind(plantTruckCtrl))

router.get("/pickups", authenticateWastePlant as RequestHandler, plantPickupCtrl.getPickupRequests.bind(plantPickupCtrl));
router.patch("/approve-pickup/:pickupReqId",authenticateWastePlant as RequestHandler, plantPickupCtrl.approvePickup.bind(plantPickupCtrl))
router.put("/cancel-pickupReq/:pickupReqId",authenticateWastePlant as RequestHandler, plantPickupCtrl.cancelPickup.bind(plantPickupCtrl))
router.put("/reschedule-pickup/:pickupReqId",authenticateWastePlant as RequestHandler, plantPickupCtrl.reschedulePickup.bind(plantPickupCtrl))
router.get("/drivers-in-place", authenticateWastePlant as RequestHandler, plantPickupCtrl.fetchDriversByPlace.bind(plantPickupCtrl))
router.post("/conversation", authenticateWastePlant as RequestHandler, plantChatCtrl.getConversationId.bind(plantChatCtrl))
router.post("/chat-messages", authenticateWastePlant as RequestHandler, plantChatCtrl.getChatMessages.bind(plantChatCtrl))
router.post("/add-drop-spot", authenticateWastePlant as RequestHandler, plantDropSpotCtrl.createDropSpot.bind(plantDropSpotCtrl))
router.get("/drop-spots", authenticateWastePlant as RequestHandler, plantDropSpotCtrl.fetchDropSpots.bind(plantDropSpotCtrl))
router.get("/edit-drop-spot/:dropSpotId", authenticateWastePlant as RequestHandler, plantDropSpotCtrl.fetchDropSpotById.bind(plantDropSpotCtrl))
router.patch("/edit-drop-spot/:dropSpotId", authenticateWastePlant as RequestHandler, plantDropSpotCtrl.updateDropSpot.bind(plantDropSpotCtrl))
router.delete("/delete-drop-spot/:dropSpotId", authenticateWastePlant as RequestHandler, plantDropSpotCtrl.deleteDropSpotById.bind(plantDropSpotCtrl))
router.get("/users", authenticateWastePlant as RequestHandler, plantUserCtrl.fetchUsers.bind(plantUserCtrl))
router.patch("/users/:userId/block", authenticateWastePlant as RequestHandler, plantUserCtrl.userBlockStatus.bind(plantUserCtrl))
router.get("/notifications", authenticateWastePlant as RequestHandler, plantNotificationCtrl.fetchNotifications.bind(plantNotificationCtrl))
router.patch("/notifications/:notifId/read", authenticateWastePlant as RequestHandler, plantNotificationCtrl.markReadNotification.bind(plantNotificationCtrl))
router.post("/waste-measurement", authenticateWastePlant as RequestHandler, plantNotificationCtrl.saveWasteMeasurement.bind(plantNotificationCtrl))
router.get("/dashboard", authenticateWastePlant as RequestHandler, plantDashboardCtrl.fetchDashboardData.bind(plantDashboardCtrl))
router.get("/payment", authenticateWastePlant as RequestHandler, plantPaymentCtrl.fetchPayments.bind(plantPaymentCtrl))

export default router;
