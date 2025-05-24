import { Router } from "express";
import { MapController } from "../controllers/driver/mapController";
import container from "../config/inversify/container";
import TYPES from "../config/inversify/types";

const router: Router = Router();

const mapCtrl = container.get<MapController>(TYPES.DriverMapController);

router.get("/eta", mapCtrl.getETA.bind(mapCtrl));

export default router;