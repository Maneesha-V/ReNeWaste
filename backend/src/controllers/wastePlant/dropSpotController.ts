import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IDropSpotController } from "./interface/IDropSpotController";
import DropSpotService from "../../services/wastePlant/dropSpotService";

class DropSpotController implements IDropSpotController {
  async createDropSpot(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log(req.body);
      const wasteplantId = req.user?.id;
      console.log(wasteplantId);
      if (!wasteplantId) {
        res
          .status(403)
          .json({ success: false, error: "Unauthorized or invalid plant ID" });
        return;
      }

      const payloadWithPlant = {
        ...req.body,
        wasteplantId,
      };
      const dropSpotData = req.body;
      const newDropSpot = await DropSpotService.createDropSpotService(
        payloadWithPlant
      );
      console.log("newDropSpot", newDropSpot);

      res.status(201).json({ success: true, data: newDropSpot });
    } catch (error: any) {
      res
        .status(500)
        .json({
          success: false,
          error: error.message || "Failed to create drop spot",
        });
    }
  }

  async fetchDropSpots(req: AuthRequest, res: Response): Promise<void> {
    try {
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        res.status(404).json({ message: "wasteplantId not found" });
        return;
      }
      const dropspots = await DropSpotService.getAllDropSpots(wasteplantId);
      console.log("dropspots", dropspots);

      res.status(200).json({
        success: true,
        message: "Fetch dropspots successfully",
        data: dropspots,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching dropspots.", error });
    }
  }

  async fetchDropSpotById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { dropSpotId } = req.params;
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        res.status(404).json({ message: "wasteplantId not found" });
        return;
      }
      const selectedDropSpot = await DropSpotService.getDropSpotByIdService(
        dropSpotId,
        wasteplantId
      );
      if (!selectedDropSpot) {
        res.status(404).json({ message: "Dropspot not found." });
        return;
      }
      console.log("selectedDropSpot", selectedDropSpot);

      res.status(200).json(selectedDropSpot);
    } catch (error: any) {
      console.error("Error fetching truck:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async deleteDropSpotById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { dropSpotId } = req.params;
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        res.status(404).json({ message: "wasteplantId not found" });
        return;
      }
      const result = await DropSpotService.deleteDropSpotByIdService(
        dropSpotId,
        wasteplantId
      );
      console.log("result-delete", result);
      if (!result) {
        res.status(404).json({ message: "Dropspot not found" });
        return;
      }

      res.status(200).json({ message: "Dropspot deleted successfully" });
    } catch (error: any) {
      console.error("Error in deleting dropspot:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async updateDropSpot(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { dropSpotId } = req.params;
      const wasteplantId = req.user?.id;

      if (!wasteplantId) {
        res.status(401).json({ message: "Unauthorized: wasteplantId missing" });
        return;
      }

      if (!dropSpotId) {
        res.status(400).json({ message: "DropSpot ID is required" });
        return;
      }

      const updateData = req.body;

      const updatedDropSpot = await DropSpotService.updateDropSpotService(
        wasteplantId,
        dropSpotId,
        updateData
      );

      if (!updatedDropSpot) {
        res.status(404).json({ message: "DropSpot not found or unauthorized" });
        return;
      }

      res.status(200).json(updatedDropSpot);
    } catch (error: any) {
      console.error("Error updating dropspot:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}
export default new DropSpotController();
