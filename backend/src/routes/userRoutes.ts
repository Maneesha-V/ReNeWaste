import { Router } from "express";
import UserController from "../controllers/user/userController";
import ProfileController  from "../controllers/user/profileController";
import { authenticateUser } from "../middlewares/authMiddware"
import { RequestHandler } from "express"; 

const router: Router = Router();

router.post("/signup", UserController.signup);
router.post("/", UserController.login)
router.post("/logout", UserController.logout)
router.post("/send-otp", UserController.sendOtp)
router.post("/resend-otp",UserController.resendOtp)
router.post("/verify-otp", UserController.verifyOtp)
router.post("/reset-password",UserController.resetPassword)
router.post("/google-signup",UserController.googleSignUp)
router.post("/google-login",UserController.googleLogin)
router.get("/profile", authenticateUser as RequestHandler, ProfileController.getProfile)
router.get("/edit-profile", authenticateUser as RequestHandler, ProfileController.getEditProfile)
router.put("/edit-profile", authenticateUser as RequestHandler, ProfileController.updateUserProfileHandler)

export default router;

