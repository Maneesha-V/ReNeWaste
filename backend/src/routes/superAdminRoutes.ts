import express from "express"
import upload from "../config/multer"
import AuthController from "../controllers/superAdmin/authController";
import WastePlantController from "../controllers/superAdmin/wastePlantController";

const router = express.Router()

router.post("/",AuthController.superAdminLogin)
router.post("/add-waste-plant",upload.single("licenseDocument"),WastePlantController.addWastePlant)
router.get("/waste-plants",WastePlantController.fetchWastePlants)
router.get("/edit-waste-plant/:id",WastePlantController.getWastePlantById)
export default router;

