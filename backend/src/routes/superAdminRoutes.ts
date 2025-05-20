import express, { RequestHandler } from "express"
import upload from "../config/multer"
import { AuthController } from "../controllers/superAdmin/authController";
import WastePlantController from "../controllers/superAdmin/wastePlantController";
import { authenticateSuperAdmin } from "../middlewares/authMiddware";
import TYPES from "../config/inversify/types";
import container from "../config/inversify/container";

const router = express.Router()
const superAdminCtrl = container.get<AuthController>(TYPES.SuperAdminAuthController);

router.get("/refresh-token", superAdminCtrl.refreshToken.bind(superAdminCtrl))
router.post("/",superAdminCtrl.superAdminLogin.bind(superAdminCtrl))
router.post("/signup",superAdminCtrl.superAdminSignup.bind(superAdminCtrl))
router.post("/logout",superAdminCtrl.superAdminLogout.bind(superAdminCtrl))
router.post("/send-otp", superAdminCtrl.sendOtp.bind(superAdminCtrl))
router.post("/resend-otp",superAdminCtrl.resendOtp.bind(superAdminCtrl))
router.post("/verify-otp", superAdminCtrl.verifyOtp.bind(superAdminCtrl))
router.post("/reset-password",superAdminCtrl.resetPassword.bind(superAdminCtrl))
router.get("/waste-plants", authenticateSuperAdmin as RequestHandler, WastePlantController.fetchWastePlants)
router.post("/add-waste-plant",authenticateSuperAdmin as RequestHandler, upload.single("licenseDocument"),WastePlantController.addWastePlant)
router.get("/edit-waste-plant/:id",authenticateSuperAdmin as RequestHandler, WastePlantController.getWastePlantById)
router.patch("/edit-waste-plant/:id", upload.single("licenseDocument"),WastePlantController.updateWastePlant)
router.delete("/delete-waste-plant/:id", authenticateSuperAdmin as RequestHandler,WastePlantController.deleteWastePlantById)

export default router;

