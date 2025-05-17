import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IDropSpotService } from "./interface/IDropSpotService";
import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";
import DropSpotRepository from "../../repositories/dropSpot/dropSpotRepository";
import axios from "axios";
import { PaginatedDropSpotsResult } from "../../types/wastePlant/dropspotTypes";

class DropSpotService implements IDropSpotService {
  async createDropSpotService(payload: IDropSpot) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    try {
      const fullAddress = `${payload.addressLine}, ${payload.location}, ${payload.district}, ${payload.state}, ${payload.pincode}`;
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        fullAddress
      )}&key=${apiKey}`;

      const response = await axios.get(geocodeUrl);
      console.log("response", response);

      if (
        response.data.status === "OK" &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const location = response.data.results[0].geometry.location;
        payload.coordinates = {
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        throw new Error("Unable to fetch coordinates for the given address.");
      }

      return await DropSpotRepository.createDropSpot(payload);
    } catch (error) {
      console.error("Error in createDropSpotService:", error);
      throw error;
    }
  }
  async getAllDropSpots(wasteplantId: string, page: number, limit: number, search: string): Promise<PaginatedDropSpotsResult> {
    return await DropSpotRepository.getDropSpotsByWastePlantId(wasteplantId, page, limit, search);
  }
  async getDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<IDropSpot | null> {
    const dropSpot = await DropSpotRepository.findDropSpotById(dropSpotId);
    if (!dropSpot || dropSpot.wasteplantId.toString() !== wasteplantId) {
      return null;
    }
    return dropSpot;
  }

  async deleteDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<IDropSpot | null> {
    return await DropSpotRepository.deleteDropSpotById(
      dropSpotId,
      wasteplantId
    );
  }

  async updateDropSpotService(
    wasteplantId: string,
    dropSpotId: string,
    updateData: any
  ) {
    const dropSpot = await DropSpotRepository.findDropSpotById(dropSpotId);
    if (!dropSpot || dropSpot.wasteplantId.toString() !== wasteplantId) {
      return null;
    }

    const updatedDropSpot = await DropSpotRepository.updateDropSpot(
      dropSpotId,
      updateData
    );
    return updatedDropSpot;
  }
}
export default new DropSpotService();
