import express, { RequestHandler } from "express";
import upload from "../config/multer";
import { authenticateSuperAdmin } from "../middlewares/authMiddware";
import TYPES from "../config/inversify/types";
import container from "../config/inversify/container";
import { AuthController } from "../controllers/superAdmin/authController";
import { WastePlantController } from "../controllers/superAdmin/wastePlantController";
import { DashboardController } from "../controllers/superAdmin/dashboardController";
import { NotificationController } from "../controllers/superAdmin/notificationController";
import { SubscriptionController } from "../controllers/superAdmin/subscriptionController";
import { PaymentController } from "../controllers/superAdmin/paymentController";

const router = express.Router();
const superAdminCtrl = container.get<AuthController>(
  TYPES.SuperAdminAuthController,
);
const superAdminPlantCtrl = container.get<WastePlantController>(
  TYPES.SuperAdminPlantController,
);
const superAdminDashbdCtrl = container.get<DashboardController>(
  TYPES.SuperAdminDashboardController,
);
const superAdminNotificationCtrl = container.get<NotificationController>(
  TYPES.SuperAdminNotificationController,
);
const superAdminSubscriptionCtrl = container.get<SubscriptionController>(
  TYPES.SuperAdminSubscriptionController,
);
const superAdminPaymentCtrl = container.get<PaymentController>(
  TYPES.SuperAdminPaymentController,
);

router.get("/refresh-token", superAdminCtrl.refreshToken.bind(superAdminCtrl));
router.post("/", superAdminCtrl.superAdminLogin.bind(superAdminCtrl));
router.post("/signup", superAdminCtrl.superAdminSignup.bind(superAdminCtrl));
router.post("/logout", superAdminCtrl.superAdminLogout.bind(superAdminCtrl));
router.post("/send-otp", superAdminCtrl.sendOtp.bind(superAdminCtrl));
router.post("/resend-otp", superAdminCtrl.resendOtp.bind(superAdminCtrl));
router.post("/verify-otp", superAdminCtrl.verifyOtp.bind(superAdminCtrl));
router.post(
  "/reset-password",
  superAdminCtrl.resetPassword.bind(superAdminCtrl),
);
router.get(
  "/waste-plants",
  authenticateSuperAdmin as RequestHandler,
  superAdminPlantCtrl.fetchWastePlants.bind(superAdminPlantCtrl),
);
router.get(
  "/add-waste-plant",
  authenticateSuperAdmin as RequestHandler,
  superAdminPlantCtrl.getAddWastePlant.bind(superAdminPlantCtrl),
);
router.post(
  "/add-waste-plant",
  authenticateSuperAdmin as RequestHandler,
  upload.single("licenseDocument"),
  superAdminPlantCtrl.addWastePlant.bind(superAdminPlantCtrl),
);
router.get(
  "/view-license/:publicId(*)",
  superAdminPlantCtrl.viewLicenseDocument.bind(superAdminPlantCtrl),
);
router.get(
  "/edit-waste-plant/:id",
  authenticateSuperAdmin as RequestHandler,
  superAdminPlantCtrl.getWastePlantById.bind(superAdminPlantCtrl),
);
router.patch(
  "/edit-waste-plant/:id",
  authenticateSuperAdmin as RequestHandler,
  upload.single("licenseDocument"),
  superAdminPlantCtrl.updateWastePlant.bind(superAdminPlantCtrl),
);
router.delete(
  "/delete-waste-plant/:id",
  authenticateSuperAdmin as RequestHandler,
  superAdminPlantCtrl.deleteWastePlantById.bind(superAdminPlantCtrl),
);
router.post(
  "/add-subscription-plan",
  authenticateSuperAdmin as RequestHandler,
  superAdminSubscriptionCtrl.createSubscriptionPlan.bind(
    superAdminSubscriptionCtrl,
  ),
);
router.get(
  "/subscription-plans",
  authenticateSuperAdmin as RequestHandler,
  superAdminSubscriptionCtrl.fetchSubscriptionPlans.bind(
    superAdminSubscriptionCtrl,
  ),
);
router.delete(
  "/delete-subscription-plan/:id",
  authenticateSuperAdmin as RequestHandler,
  superAdminSubscriptionCtrl.deleteSubscriptionPlan.bind(
    superAdminSubscriptionCtrl,
  ),
);
router.get(
  "/edit-subscription-plan/:id",
  authenticateSuperAdmin as RequestHandler,
  superAdminSubscriptionCtrl.getSubscriptionPlanById.bind(
    superAdminSubscriptionCtrl,
  ),
);
router.patch(
  "/edit-subscription-plan/:id",
  authenticateSuperAdmin as RequestHandler,
  superAdminSubscriptionCtrl.updateSubscriptionPlanById.bind(
    superAdminSubscriptionCtrl,
  ),
);
// router.post("/notification/subscribe-remind/:id", authenticateSuperAdmin as RequestHandler, superAdminPlantCtrl.sendSubscribeNotification.bind(superAdminPlantCtrl));
router.get(
  "/notifications",
  authenticateSuperAdmin as RequestHandler,
  superAdminNotificationCtrl.fetchNotifications.bind(
    superAdminNotificationCtrl,
  ),
);
router.patch(
  "/notifications/:notifId/read",
  authenticateSuperAdmin as RequestHandler,
  superAdminNotificationCtrl.markReadNotification.bind(
    superAdminNotificationCtrl,
  ),
);
// router.post("/notification/renew-remind", authenticateSuperAdmin as RequestHandler, superAdminNotificationCtrl.remindRenewNotification.bind(superAdminNotificationCtrl));
// router.post("/notification/recharge-remind", authenticateSuperAdmin as RequestHandler, superAdminNotificationCtrl.remindRechargeNotification.bind(superAdminNotificationCtrl));
router.post(
  "/location/:pincode",
  authenticateSuperAdmin as RequestHandler,
  superAdminPlantCtrl.fetchPostOffices.bind(superAdminPlantCtrl),
);
router.get(
  "/payment-history",
  authenticateSuperAdmin as RequestHandler,
  superAdminPaymentCtrl.fetchPayments.bind(superAdminPaymentCtrl),
);
router.get(
  "/dashboard",
  authenticateSuperAdmin as RequestHandler,
  superAdminDashbdCtrl.fetchSuperAdminDashboard.bind(superAdminDashbdCtrl),
);
router.patch(
  "/:plantId/block",
  authenticateSuperAdmin as RequestHandler,
  superAdminPlantCtrl.plantBlockStatus.bind(superAdminPlantCtrl),
);
router.patch(
  "/payment/update-status",
  authenticateSuperAdmin as RequestHandler,
  superAdminPaymentCtrl.updateRefundStatusPayment.bind(superAdminPaymentCtrl),
);
router.patch(
  "/payment/refund",
  authenticateSuperAdmin as RequestHandler,
  superAdminPaymentCtrl.refundPayment.bind(superAdminPaymentCtrl),
);

export default router;
