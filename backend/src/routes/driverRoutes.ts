import express, { RequestHandler } from "express"
import multer from "multer";
import { authenticateDriver } from "../middlewares/authMiddware";
import AuthController from "../controllers/driver/authController";
import ProfileController from "../controllers/driver/profileController";
import PickupController from "../controllers/driver/pickupController";
import TruckController from "../controllers/driver/truckController";
import ChatController from "../controllers/driver/chatController";

const router = express.Router()
const upload = multer();

router.get("/refresh-token", AuthController.refreshToken)
router.post("/",AuthController.driverLogin)
router.post("/logout",AuthController.driverLogout)
router.post("/send-otp", AuthController.sendOtp)
router.post("/resend-otp",AuthController.resendOtp)
router.post("/verify-otp", AuthController.verifyOtp)
router.post("/reset-password",AuthController.resetPassword)
router.get("/profile",authenticateDriver as RequestHandler, ProfileController.getProfile)
router.patch("/edit-profile",authenticateDriver as RequestHandler,upload.none(),ProfileController.updateProfile)
router.get("/drivers", authenticateDriver as RequestHandler,ProfileController.getDriversByWastePlant)
router.get("/alloted-pickups", authenticateDriver as RequestHandler, PickupController.getPickupRequests);
router.get("/track-pickup/:pickupReqId", authenticateDriver as RequestHandler, PickupController.getPickupRequestById)
router.patch("/address/:addressId/location", authenticateDriver as RequestHandler, PickupController.updateAddressLatLng)
router.patch("/pickup/:pickupReqId/tracking-status", authenticateDriver as RequestHandler, PickupController.updateTrackingStatus)
router.get("/assigned-trucks/:driverId", authenticateDriver as RequestHandler, TruckController.fetchTruckForDriver)
router.post("/req-truck", authenticateDriver as RequestHandler, TruckController.requestTruckForDriver)
router.get("/driver/chat")
router.post("/conversation", authenticateDriver as RequestHandler, ChatController.getConversationId)
router.post("/chat-messages", authenticateDriver as RequestHandler, ChatController.getChatMessages)

export default router;

