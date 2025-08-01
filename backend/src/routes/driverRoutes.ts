import express, { RequestHandler } from "express"
import multer from "multer";
import { authenticateDriver } from "../middlewares/authMiddware";
import { AuthController } from "../controllers/driver/authController";
import { ProfileController } from "../controllers/driver/profileController";
import { PickupController } from "../controllers/driver/pickupController";
import { TruckController } from "../controllers/driver/truckController";
import { ChatController } from "../controllers/driver/chatController";
import TYPES from "../config/inversify/types";
import container from "../config/inversify/container";
import { NotificationController } from "../controllers/driver/notificationController";
import { DashboardController } from "../controllers/driver/dashboardController";

const router = express.Router()
const upload = multer();

const driverCtrl = container.get<AuthController>(TYPES.DriverAuthController);
const driverChatCtrl = container.get<ChatController>(TYPES.DriverChatController);
const driverProfCtrl = container.get<ProfileController>(TYPES.DriverProfileController);
const driverPickupCtrl = container.get<PickupController>(TYPES.DriverPickupController);
const driverTruckCtrl = container.get<TruckController>(TYPES.DriverTruckController);
const driverNotificationCtrl = container.get<NotificationController>(TYPES.DriverNotificationController);
const driverDashboardCtrl = container.get<DashboardController>(TYPES.DriverDashboardController);

router.get("/refresh-token", driverCtrl.refreshToken.bind(driverCtrl))
router.post("/",driverCtrl.driverLogin.bind(driverCtrl))
router.post("/logout",driverCtrl.driverLogout.bind(driverCtrl))
router.post("/send-otp", driverCtrl.sendOtp.bind(driverCtrl))
router.post("/resend-otp",driverCtrl.resendOtp.bind(driverCtrl))
router.post("/verify-otp", driverCtrl.verifyOtp.bind(driverCtrl))
router.post("/reset-password",driverCtrl.resetPassword.bind(driverCtrl))
router.get("/profile",authenticateDriver as RequestHandler, driverProfCtrl.getProfile.bind(driverProfCtrl))
router.patch("/edit-profile",authenticateDriver as RequestHandler,upload.none(),driverProfCtrl.updateProfile.bind(driverProfCtrl))
router.get("/drivers", authenticateDriver as RequestHandler,driverProfCtrl.getDriversByWastePlant.bind(driverProfCtrl))
router.get("/alloted-pickups", authenticateDriver as RequestHandler, driverPickupCtrl.getPickupRequests.bind(driverPickupCtrl));
router.put("/pickup-complete/:pickupReqId", authenticateDriver as RequestHandler, driverPickupCtrl.markPickupCompleted.bind(driverPickupCtrl))

router.get("/track-pickup/:pickupReqId", authenticateDriver as RequestHandler, driverPickupCtrl.getPickupRequestById.bind(driverPickupCtrl))
router.patch("/address/:addressId/location", authenticateDriver as RequestHandler, driverPickupCtrl.updateAddressLatLng.bind(driverPickupCtrl))
router.patch("/pickup/:pickupReqId/tracking-status", authenticateDriver as RequestHandler, driverPickupCtrl.updateTrackingStatus.bind(driverPickupCtrl))
router.get("/assigned-trucks/:wasteplantId", authenticateDriver as RequestHandler, driverTruckCtrl.fetchTruckForDriver.bind(driverTruckCtrl))
router.post("/req-truck", authenticateDriver as RequestHandler, driverTruckCtrl.requestTruckForDriver.bind(driverTruckCtrl))
router.get("/driver/chat")
router.post("/conversation", authenticateDriver as RequestHandler, driverChatCtrl.getConversationId.bind(driverChatCtrl));
router.post("/chat-messages", authenticateDriver as RequestHandler, driverChatCtrl.getChatMessages.bind(driverChatCtrl));
router.put("/truck/mark-returned", authenticateDriver as RequestHandler, driverTruckCtrl.markTruckReturn.bind(driverTruckCtrl));
router.get("/notifications", authenticateDriver as RequestHandler, driverNotificationCtrl.fetchNotifications.bind(driverNotificationCtrl));
router.patch("/notifications/:notifId/read", authenticateDriver as RequestHandler, driverNotificationCtrl.markReadNotification.bind(driverNotificationCtrl));
router.get("/dashboard", authenticateDriver as RequestHandler, driverDashboardCtrl.fetchDriverDashboard.bind(driverDashboardCtrl));
router.get("/support", authenticateDriver as RequestHandler, driverDashboardCtrl.fetchWastePlantSupport.bind(driverDashboardCtrl));

export default router;

