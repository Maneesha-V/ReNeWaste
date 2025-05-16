import { Router } from "express";
import UserController from "../controllers/user/userController";
import ProfileController  from "../controllers/user/profileController";
import ResidentialController from "../controllers/user/residentialController";
import CommercialController from "../controllers/user/commercialController";
import PickupController from "../controllers/user/pickupController";
import PaymentController from "../controllers/user/paymentController";
import DropSpotController from "../controllers/user/dropSpotController";
import { authenticateUser } from "../middlewares/authMiddware"
import { RequestHandler } from "express"; 
import { checkNotBlocked } from "../middlewares/blockMiddleware";

const router: Router = Router();

router.get("/refresh-token", UserController.refreshToken)
router.post("/signup", UserController.signup);
router.post("/", UserController.login)
router.post("/logout", UserController.logout)
router.post("/send-otp-signup",UserController.sendOtpForSignup)
router.post("/resend-otp-signup",UserController.resendOtpForSignup)
router.post("/verify-otp-signup", UserController.verifyOtpForSignup)
router.post("/send-otp", UserController.sendOtp)
router.post("/resend-otp",UserController.resendOtp)
router.post("/verify-otp", UserController.verifyOtp)
router.post("/reset-password",UserController.resetPassword)
router.post("/google-signup",UserController.googleSignUp)
router.post("/google-login",UserController.googleLogin)
router.get("/profile", authenticateUser as RequestHandler, checkNotBlocked, ProfileController.getProfile)
router.get("/edit-profile", authenticateUser as RequestHandler, checkNotBlocked, ProfileController.getEditProfile)
router.patch("/edit-profile", authenticateUser as RequestHandler, checkNotBlocked, ProfileController.updateUserProfileHandler)
router.get("/residential", authenticateUser as RequestHandler, checkNotBlocked, ResidentialController.getResidential)
router.patch("/residential/pickup", authenticateUser as RequestHandler, checkNotBlocked, ResidentialController.updateResidentialPickup)
router.get("/commercial", authenticateUser as RequestHandler, checkNotBlocked, CommercialController.getCommercial)
router.post("/commercial/service-check", authenticateUser as RequestHandler, checkNotBlocked, CommercialController.checkServiceAvailable)
router.patch("/commercial/pickup", authenticateUser as RequestHandler, checkNotBlocked, CommercialController.updateCommercialPickup)
router.get("/pickup-plans", authenticateUser as RequestHandler, checkNotBlocked, PickupController.getPickupPlans)
router.post("/payment/create-order", authenticateUser as RequestHandler, checkNotBlocked, PaymentController.createPaymentOrder)
router.post("/payment/verify", authenticateUser as RequestHandler, checkNotBlocked, PaymentController.verifyPayment)
router.get("/payments", authenticateUser as RequestHandler, checkNotBlocked, PaymentController.getAllPayments)
router.post("/payment/repay", authenticateUser as RequestHandler, checkNotBlocked, PaymentController.rePayment)
router.get("/drop-spots", authenticateUser as RequestHandler, checkNotBlocked, DropSpotController.fetchAllNearDropSpots)

export default router;
