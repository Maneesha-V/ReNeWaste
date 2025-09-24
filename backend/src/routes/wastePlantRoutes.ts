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
import { ReportController } from "../controllers/wastePlant/reportController";
import { ProfileController } from "../controllers/wastePlant/profileController";
import upload from "../config/multer";
import { checkNotBlocked } from "../middlewares/blockMiddleware";

const router = express.Router();
const plantCtrl = container.get<AuthController>(TYPES.PlantAuthController);
const plantTruckCtrl = container.get<TruckController>(
  TYPES.PlantTruckController,
);
const plantDriverCtrl = container.get<DriverController>(
  TYPES.PlantDriverController,
);
const plantPickupCtrl = container.get<PickupController>(
  TYPES.PlantPickupController,
);
const plantDropSpotCtrl = container.get<DropSpotController>(
  TYPES.PlantDropSpotController,
);
const plantChatCtrl = container.get<ChatController>(TYPES.PlantChatController);
const plantUserCtrl = container.get<UserController>(TYPES.PlantUserController);
const plantNotificationCtrl = container.get<NotificationController>(
  TYPES.PlantNotificationController,
);
const plantDashboardCtrl = container.get<DashboardController>(
  TYPES.PlantDashboardController,
);
const plantSubscriptionCtrl = container.get<SubscriptionController>(
  TYPES.PlantSubscriptionController,
);
const plantPaymentCtrl = container.get<PaymentController>(
  TYPES.PlantPaymentController,
);
const plantReportCtrl = container.get<ReportController>(
  TYPES.PlantReportController,
);
const plantProfileCtrl = container.get<ProfileController>(
  TYPES.PlantProfileController,
);

router.get("/refresh-token", plantCtrl.refreshToken.bind(plantCtrl));
router.post("/", plantCtrl.wastePlantLogin.bind(plantCtrl));
router.post("/logout", plantCtrl.wastePlantLogout.bind(plantCtrl));
router.post("/send-otp", plantCtrl.sendOtp.bind(plantCtrl));
router.post("/resend-otp", plantCtrl.resendOtp.bind(plantCtrl));
router.post("/verify-otp", plantCtrl.verifyOtp.bind(plantCtrl));
router.post("/reset-password", plantCtrl.resetPassword.bind(plantCtrl));
router.get(
  "/add-driver",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDriverCtrl.getCreateDriver.bind(plantDriverCtrl),
);
router.post(
  "/add-driver",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  uploadImages.fields([
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
  ]),
  plantDriverCtrl.addDriver.bind(plantDriverCtrl),
);
router.get(
  "/drivers",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDriverCtrl.fetchDrivers.bind(plantDriverCtrl),
);
router.get(
  "/edit-driver/:driverId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDriverCtrl.getDriverById.bind(plantDriverCtrl),
);
router.patch(
  "/edit-driver/:driverId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  uploadImages.fields([
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
  ]),
  plantDriverCtrl.updateDriver.bind(plantDriverCtrl),
);
router.delete(
  "/delete-driver/:driverId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDriverCtrl.deleteDriverById.bind(plantDriverCtrl),
);
router.get(
  "/trucks",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.fetchTrucks.bind(plantTruckCtrl),
);
router.get(
  "/available-trucks",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.fetchAvailableTrucks.bind(plantTruckCtrl),
);
router.post(
  "/add-truck",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.addTruck.bind(plantTruckCtrl),
);
router.get(
  "/edit-truck/:truckId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.getTruckById.bind(plantTruckCtrl),
);
router.patch(
  "/edit-truck/:truckId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.updateTruck.bind(plantTruckCtrl),
);
router.delete(
  "/delete-truck/:truckId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.deleteTruckById.bind(plantTruckCtrl),
);
router.get(
  "/pending-truck-req",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.getAvailableTruckReqsts.bind(plantTruckCtrl),
);
router.get(
  "/trucks-for-driver",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.getTrucksForDriver.bind(plantTruckCtrl),
);
router.post(
  "/assign-truck",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantTruckCtrl.assignTruckToDriver.bind(plantTruckCtrl),
);

router.get(
  "/pickups",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPickupCtrl.getPickupRequests.bind(plantPickupCtrl),
);
router.patch(
  "/approve-pickup/:pickupReqId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  checkNotBlocked,
  plantPickupCtrl.approvePickup.bind(plantPickupCtrl),
);
router.put(
  "/cancel-pickupReq/:pickupReqId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPickupCtrl.cancelPickup.bind(plantPickupCtrl),
);
router.put(
  "/reschedule-pickup/:pickupReqId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPickupCtrl.reschedulePickup.bind(plantPickupCtrl),
);
router.get(
  "/drivers-in-place",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPickupCtrl.fetchDriversByPlace.bind(plantPickupCtrl),
);
router.post(
  "/conversation",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantChatCtrl.getConversationId.bind(plantChatCtrl),
);
router.post(
  "/chat-messages",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantChatCtrl.getChatMessages.bind(plantChatCtrl),
);
router.post(
  "/add-drop-spot",
  authenticateWastePlant as RequestHandler,
  plantDropSpotCtrl.createDropSpot.bind(plantDropSpotCtrl),
);
router.get(
  "/drop-spots",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDropSpotCtrl.fetchDropSpots.bind(plantDropSpotCtrl),
);
router.get(
  "/edit-drop-spot/:dropSpotId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDropSpotCtrl.fetchDropSpotById.bind(plantDropSpotCtrl),
);
router.patch(
  "/edit-drop-spot/:dropSpotId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDropSpotCtrl.updateDropSpot.bind(plantDropSpotCtrl),
);
router.delete(
  "/delete-drop-spot/:dropSpotId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDropSpotCtrl.deleteDropSpotById.bind(plantDropSpotCtrl),
);
router.get(
  "/users",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantUserCtrl.fetchUsers.bind(plantUserCtrl),
);
router.patch(
  "/users/:userId/block",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantUserCtrl.userBlockStatus.bind(plantUserCtrl),
);
router.get(
  "/notifications",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantNotificationCtrl.fetchNotifications.bind(plantNotificationCtrl),
);
router.patch(
  "/notifications/:notifId/read",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantNotificationCtrl.markReadNotification.bind(plantNotificationCtrl),
);
router.post(
  "/waste-measurement",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantNotificationCtrl.saveWasteMeasurement.bind(plantNotificationCtrl),
);
router.get(
  "/dashboard",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantDashboardCtrl.fetchDashboardData.bind(plantDashboardCtrl),
);
router.get(
  "/payment",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPaymentCtrl.fetchPayments.bind(plantPaymentCtrl),
);
router.get(
  "/subscription-plan",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantSubscriptionCtrl.fetchSubscriptionPlan.bind(plantSubscriptionCtrl),
);
router.post(
  "/payment/create-order",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPaymentCtrl.createPaymentOrder.bind(plantPaymentCtrl),
);
router.post(
  "/payment/verify",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPaymentCtrl.verifyPayment.bind(plantPaymentCtrl),
);
router.get(
  "/subscptn-payments",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPaymentCtrl.fetchSubscriptionPayments.bind(plantPaymentCtrl),
);
router.post(
  "/payment/repay",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPaymentCtrl.retrySubscriptionPayment.bind(plantPaymentCtrl),
);
router.post(
  "/payment/update-status",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPaymentCtrl.updateRefundStatusPayment.bind(plantPaymentCtrl),
);
router.post(
  "/payment/refund",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantPaymentCtrl.refundPayment.bind(plantPaymentCtrl),
);
router.get(
  "/waste-reports",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantReportCtrl.getWasteReports.bind(plantReportCtrl),
);
router.get(
  "/waste-reports/from=:from&to=:to",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantReportCtrl.filterWasteReports.bind(plantReportCtrl),
);

router.get(
  "/profile",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantProfileCtrl.getPlantProfile.bind(plantProfileCtrl),
);
router.patch(
  "/edit-profile",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  upload.single("licenseDocument"),
  plantProfileCtrl.updatePlantProfile.bind(plantProfileCtrl),
);
router.get(
  "/view-license/:publicId(*)",
  plantProfileCtrl.viewLicenseDocument.bind(plantProfileCtrl),
);
router.get(
  "/subscription",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantSubscriptionCtrl.fetchSubscriptionPlans.bind(plantSubscriptionCtrl),
);
router.patch(
  "/cancel-subscription/:subPayId",
  authenticateWastePlant as RequestHandler,
  checkNotBlocked,
  plantSubscriptionCtrl.cancelSubcptReason.bind(plantSubscriptionCtrl),
);
export default router;
