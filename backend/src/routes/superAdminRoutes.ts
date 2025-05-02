import express, { RequestHandler } from "express"
import upload from "../config/multer"
import AuthController from "../controllers/superAdmin/authController";
import WastePlantController from "../controllers/superAdmin/wastePlantController";
import { authenticateSuperAdmin } from "../middlewares/authMiddware";

const router = express.Router()

router.get("/refresh-token", AuthController.refreshToken)
router.post("/",AuthController.superAdminLogin)
router.post("/signup",AuthController.superAdminSignup)
router.post("/logout",AuthController.superAdminLogout)
router.post("/send-otp", AuthController.sendOtp)
router.post("/resend-otp",AuthController.resendOtp)
router.post("/verify-otp", AuthController.verifyOtp)
router.post("/reset-password",AuthController.resetPassword)
router.get("/waste-plants", authenticateSuperAdmin as RequestHandler, WastePlantController.fetchWastePlants)
router.post("/add-waste-plant",authenticateSuperAdmin as RequestHandler, upload.single("licenseDocument"),WastePlantController.addWastePlant)
router.get("/edit-waste-plant/:id",authenticateSuperAdmin as RequestHandler, WastePlantController.getWastePlantById)
router.patch("/edit-waste-plant/:id", upload.single("licenseDocument"),WastePlantController.updateWastePlant)
router.delete("/delete-waste-plant/:id", authenticateSuperAdmin as RequestHandler,WastePlantController.deleteWastePlantById)

export default router;

