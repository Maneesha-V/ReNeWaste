import express, { RequestHandler } from "express"
import multer from "multer";
import AuthController from "../controllers/driver/authController";
import ProfileController from "../controllers/driver/profileController";
import PickupController from "../controllers/driver/pickupController";
import { authenticateDriver } from "../middlewares/authMiddware";

const router = express.Router()
const upload = multer();

router.post("/",AuthController.driverLogin)
router.post("/logout",AuthController.driverLogout)
router.post("/send-otp", AuthController.sendOtp)
router.post("/resend-otp",AuthController.resendOtp)
router.post("/verify-otp", AuthController.verifyOtp)
router.post("/reset-password",AuthController.resetPassword)
router.get("/profile",authenticateDriver as RequestHandler, ProfileController.getProfile)
router.patch("/edit-profile",authenticateDriver as RequestHandler,upload.none(),ProfileController.updateProfile)
router.get("/drivers",ProfileController.getDriversByWastePlant)
router.get("/alloted-pickups", authenticateDriver as RequestHandler, PickupController.getPickupRequests);

export default router;

