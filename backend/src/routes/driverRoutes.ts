import express, { RequestHandler } from "express"
import AuthController from "../controllers/driver/authController";
import { authenticateSuperAdmin } from "../middlewares/authMiddware";

const router = express.Router()

router.post("/",AuthController.driverLogin)
// router.post("/logout",AuthController.wastePlantLogout)
// router.post("/send-otp", AuthController.sendOtp)
// router.post("/resend-otp",AuthController.resendOtp)
// router.post("/verify-otp", AuthController.verifyOtp)
// router.post("/reset-password",AuthController.resetPassword)

export default router;

