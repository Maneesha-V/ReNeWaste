import express, { RequestHandler } from "express"
import upload from "../config/multer"
import { authenticateSuperAdmin } from "../middlewares/authMiddware";
import TYPES from "../config/inversify/types";
import container from "../config/inversify/container";
import { AuthController } from "../controllers/superAdmin/authController";
import { WastePlantController } from "../controllers/superAdmin/wastePlantController";
import { DashboardController } from "../controllers/superAdmin/dashboardController";
import { NotificationController } from "../controllers/superAdmin/notificationController";

const router = express.Router()
const superAdminCtrl = container.get<AuthController>(TYPES.SuperAdminAuthController);
const superAdminPlantCtrl = container.get<WastePlantController>(TYPES.SuperAdminPlantController);
const superAdminDashbdCtrl = container.get<DashboardController>(TYPES.SuperAdminDashboardController);
const superAdminNotificationCtrl = container.get<NotificationController>(TYPES.SuperAdminNotificationController);

router.get("/refresh-token", superAdminCtrl.refreshToken.bind(superAdminCtrl))
router.post("/",superAdminCtrl.superAdminLogin.bind(superAdminCtrl))
router.post("/signup",superAdminCtrl.superAdminSignup.bind(superAdminCtrl))
router.post("/logout",superAdminCtrl.superAdminLogout.bind(superAdminCtrl))
router.post("/send-otp", superAdminCtrl.sendOtp.bind(superAdminCtrl))
router.post("/resend-otp",superAdminCtrl.resendOtp.bind(superAdminCtrl))
router.post("/verify-otp", superAdminCtrl.verifyOtp.bind(superAdminCtrl))
router.post("/reset-password",superAdminCtrl.resetPassword.bind(superAdminCtrl))
router.get("/waste-plants", authenticateSuperAdmin as RequestHandler, superAdminPlantCtrl.fetchWastePlants.bind(superAdminPlantCtrl))
router.post("/add-waste-plant",authenticateSuperAdmin as RequestHandler, upload.single("licenseDocument"),superAdminPlantCtrl.addWastePlant.bind(superAdminPlantCtrl))
router.get("/edit-waste-plant/:id",authenticateSuperAdmin as RequestHandler, superAdminPlantCtrl.getWastePlantById.bind(superAdminPlantCtrl))
router.patch("/edit-waste-plant/:id", authenticateSuperAdmin as RequestHandler, upload.single("licenseDocument"),superAdminPlantCtrl.updateWastePlant.bind(superAdminPlantCtrl))
router.delete("/delete-waste-plant/:id", authenticateSuperAdmin as RequestHandler,superAdminPlantCtrl.deleteWastePlantById.bind(superAdminPlantCtrl))

export default router;

