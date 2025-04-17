import express, { RequestHandler } from "express";
import AuthController from "../controllers/wastePlant/authController";
import DriverController from "../controllers/wastePlant/driverController";
import TruckController from "../controllers/wastePlant/truckController";
import PickupController from "../controllers/wastePlant/pickupController";
import { authenticateWastePlant } from "../middlewares/authMiddware";
import uploadImages from "../middlewares/imageUploader";

const router = express.Router();

router.post("/", AuthController.wastePlantLogin);
router.post("/logout", AuthController.wastePlantLogout);
router.post("/send-otp", AuthController.sendOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/reset-password", AuthController.resetPassword);
router.post("/add-driver", authenticateWastePlant as RequestHandler, uploadImages.fields([
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
  ]),
  DriverController.addDriver
);
router.get("/drivers", DriverController.fetchDrivers);
router.get("/edit-driver/:driverId", DriverController.getDriverById);
router.patch(
  "/edit-driver/:driverId",
  uploadImages.fields([
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
  ]),
  DriverController.updateDriver
);
router.delete("/delete-driver/:driverId", authenticateWastePlant as RequestHandler, DriverController.deleteDriverById)
router.get("/pickup-requests", authenticateWastePlant as RequestHandler, PickupController.getPickupRequests);
router.get("/trucks", authenticateWastePlant as RequestHandler, TruckController.fetchTrucks);
router.post("/add-truck", authenticateWastePlant as RequestHandler, TruckController.addTruck);
router.get("/edit-truck/:truckId", TruckController.getTruckById);
router.patch("/edit-truck/:truckId", authenticateWastePlant as RequestHandler, TruckController.updateTruck);
router.delete("/delete-truck/:truckId", authenticateWastePlant as RequestHandler, TruckController.deleteTruckById)

export default router;
