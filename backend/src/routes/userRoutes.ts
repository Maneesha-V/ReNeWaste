import express from "express";
import { signup, login, logout, sendOtp, verifyOtp, resetPassword, googleSignUp } from "../controllers/user/userController";
import { getProfile, getEditProfile, updateUserProfileHandler } from "../controllers/user/profileController"
import { authenticateUser } from "../middlewares/authMiddware"

const router = express.Router();

router.post("/signup", signup);
router.post("/", login)
router.post("/logout", logout)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/reset-password",resetPassword)
router.post("/google-signup",googleSignUp)
router.get("/profile", authenticateUser as express.RequestHandler, getProfile)
router.get("/edit-profile", authenticateUser as express.RequestHandler, getEditProfile)
router.put("/edit-profile", authenticateUser as express.RequestHandler, updateUserProfileHandler)
export default router;