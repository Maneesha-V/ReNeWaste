import express from "express"
import { superAdminLogin } from "../controllers/superAdmin/authController";
const router = express.Router()

router.post("/",superAdminLogin)

export default router;