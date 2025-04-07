import express, { RequestHandler } from "express"
import AuthController from "../controllers/wastePlant/authController";
import DriverController from "../controllers/wastePlant/driverController";
import { authenticateSuperAdmin } from "../middlewares/authMiddware";
import uploadImages from "../middlewares/imageUploader";

const router = express.Router()

router.post("/",AuthController.wastePlantLogin)
router.post("/logout",AuthController.wastePlantLogout)
router.post("/send-otp", AuthController.sendOtp)
router.post("/resend-otp",AuthController.resendOtp)
router.post("/verify-otp", AuthController.verifyOtp) 
router.post("/reset-password",AuthController.resetPassword)
router.post("/add-driver",
    uploadImages.fields([
      { name: "licenseFront", maxCount: 1 },
      { name: "licenseBack", maxCount: 1 },
    ]),
    DriverController.addDriver
  );
router.get("/drivers",DriverController.fetchDrivers);


export default router;

