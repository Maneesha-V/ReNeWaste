import { Router } from "express";
import MapController from "../controllers/driver/mapController";
const router: Router = Router();

router.get("/eta", MapController.getETA);

export default router;