import express, { RequestHandler } from "express"
import upload from "../config/multer"
import AuthController from "../controllers/superAdmin/authController";
import WastePlantController from "../controllers/superAdmin/wastePlantController";
import { authenticateSuperAdmin } from "../middlewares/authMiddware";

const router = express.Router()

router.post("/",AuthController.superAdminLogin)
router.post("/signup",AuthController.superAdminSignup)
router.post("/logout",AuthController.superAdminLogout)
router.post("/send-otp", AuthController.sendOtp)
router.post("/resend-otp",AuthController.resendOtp)
router.post("/verify-otp", AuthController.verifyOtp)
router.post("/reset-password",AuthController.resetPassword)
router.post("/add-waste-plant", upload.single("licenseDocument"),WastePlantController.addWastePlant)
router.get("/waste-plants", authenticateSuperAdmin as RequestHandler, WastePlantController.fetchWastePlants)
router.get("/edit-waste-plant/:id",WastePlantController.getWastePlantById)
router.patch("/edit-waste-plant/:id", upload.single("licenseDocument"),WastePlantController.updateWastePlant)

export default router;

