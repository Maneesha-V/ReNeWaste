import { Router } from "express";
import { UserController } from "../controllers/user/userController";
import { ProfileController } from "../controllers/user/profileController";
import { ResidentialController } from "../controllers/user/residentialController";
import { CommercialController } from "../controllers/user/commercialController";
import { PickupController } from "../controllers/user/pickupController";
import { PaymentController } from "../controllers/user/paymentController";
import { DropSpotController } from "../controllers/user/dropSpotController";
import { authenticateUser } from "../middlewares/authMiddware";
import { RequestHandler } from "express";
import { checkNotBlocked } from "../middlewares/blockMiddleware";
import container from "../config/inversify/container";
import TYPES from "../config/inversify/types";
import { NotificationController } from "../controllers/user/notificationController";
import { checkWastePlantNotBlocked } from "../middlewares/checkWastePlantNotBlocked";
import { WalletController } from "../controllers/user/walletController";
import { RatingController } from "../controllers/user/ratingController";

const router: Router = Router();

const userCtrl = container.get<UserController>(TYPES.UserAuthController);
const proflCtrl = container.get<ProfileController>(TYPES.UserProfileController);
const residCtrl = container.get<ResidentialController>(
  TYPES.ResidentialController,
);
const commCtrl = container.get<CommercialController>(
  TYPES.CommercialController,
);
const pickupCtrl = container.get<PickupController>(TYPES.UserPickupController);
const paymentCtrl = container.get<PaymentController>(
  TYPES.UserPaymentController,
);
const dropSpotCtrl = container.get<DropSpotController>(
  TYPES.UserDropSpotController,
);
const notificationCtrl = container.get<NotificationController>(
  TYPES.UserNotificationController,
);
const walletCtrl = container.get<WalletController>(
  TYPES.UserWalletController
);
const ratingCtrl = container.get<RatingController>(
  TYPES.UserRatingController
);

router.get("/refresh-token", userCtrl.refreshToken.bind(userCtrl));
router.post("/signup", userCtrl.signup.bind(userCtrl));
router.post("/", userCtrl.login.bind(userCtrl));
router.post("/logout", userCtrl.logout.bind(userCtrl));
router.post("/send-otp-signup", userCtrl.sendOtpForSignup.bind(userCtrl));
router.post("/resend-otp-signup", userCtrl.resendOtpForSignup.bind(userCtrl));
router.post("/verify-otp-signup", userCtrl.verifyOtpForSignup.bind(userCtrl));
router.post("/send-otp", userCtrl.sendOtp.bind(userCtrl));
router.post("/resend-otp", userCtrl.resendOtp.bind(userCtrl));
router.post("/verify-otp", userCtrl.verifyOtp.bind(userCtrl));
router.post("/reset-password", userCtrl.resetPassword.bind(userCtrl));
router.post("/google-signup", userCtrl.googleSignUp.bind(userCtrl));
router.post("/google-login", userCtrl.googleLogin.bind(userCtrl));
router.get(
  "/profile",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  proflCtrl.getProfile.bind(proflCtrl),
);
router.get(
  "/edit-profile",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  proflCtrl.getEditProfile.bind(proflCtrl),
);
router.patch(
  "/edit-profile",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  proflCtrl.updateUserProfileHandler.bind(proflCtrl),
);
router.get(
  "/residential",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  residCtrl.getResidential.bind(residCtrl),
);
router.patch(
  "/residential/pickup",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  residCtrl.updateResidentialPickup.bind(residCtrl),
);
router.get(
  "/commercial",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  commCtrl.getCommercial.bind(commCtrl),
);
router.post(
  "/commercial/service-check",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  commCtrl.checkServiceAvailable.bind(commCtrl),
);
router.patch(
  "/commercial/pickup",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  commCtrl.updateCommercialPickup.bind(commCtrl),
);
router.get(
  "/pickup-plans",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  pickupCtrl.getPickupPlans.bind(pickupCtrl),
);
router.post(
  "/payment/create-order",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  paymentCtrl.createPaymentOrder.bind(paymentCtrl),
);
router.post(
  "/payment/verify",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  paymentCtrl.verifyPayment.bind(paymentCtrl),
);
router.post(
  "/payment/wallet/verify",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  paymentCtrl.verifyWalletPickupPayment.bind(paymentCtrl),  
)
router.get(
  "/payments",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  paymentCtrl.getAllPayments.bind(paymentCtrl),
);
router.post(
  "/payment/repay",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  paymentCtrl.rePayment.bind(paymentCtrl),
);
router.get(
  "/drop-spots",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  dropSpotCtrl.fetchAllNearDropSpots.bind(dropSpotCtrl),
);
router.patch(
  "/pickup-plan/cancel/:pickupReqId",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  pickupCtrl.cancelPickupPlan.bind(pickupCtrl),
);
router.get(
  "/notifications",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  notificationCtrl.fetchNotifications.bind(notificationCtrl),
);
router.patch(
  "/notifications/:notifId/read",
  authenticateUser as RequestHandler,
  notificationCtrl.markReadNotification.bind(notificationCtrl),
);
router.patch(
  "/cancel-pickupReq/:pickupReqId",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  pickupCtrl.cancelPickupReason.bind(pickupCtrl),
);
router.get(
  "/wallet",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  walletCtrl.getWallet.bind(walletCtrl),  
);
router.post(
  "/wallet/create-order",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  walletCtrl.createAddMoneyOrder.bind(walletCtrl),
);
router.post(
  "/wallet/verify-payment",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  walletCtrl.verifyWalletAddPayment.bind(walletCtrl),
);
router.post(
  "/wallet/retry",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  walletCtrl.retryWalletAddPayment.bind(walletCtrl), 
);
router.post(
  "/add/rating",
  authenticateUser as RequestHandler,
  checkNotBlocked,
  checkWastePlantNotBlocked,
  ratingCtrl.addUserRating.bind(ratingCtrl), 
)

export default router;
