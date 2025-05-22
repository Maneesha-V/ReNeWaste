import { IDropSpotService } from "./interface/IDropSpotService";
import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";
import axios from "axios";
import { PaginatedDropSpotsResult } from "../../types/wastePlant/dropspotTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDropSpotRepository } from "../../repositories/dropSpot/interface/IDropSpotRepository";

@injectable()
export class DropSpotService implements IDropSpotService {
  constructor(
    @inject(TYPES.DropSpotRepository)
    private dropSpotRepository: IDropSpotRepository
  ) {}
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

      return await this.dropSpotRepository.createDropSpot(payload);
    } catch (error) {
      console.error("Error in createDropSpotService:", error);
      throw error;
    }
  }
  async getAllDropSpots(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedDropSpotsResult> {
    return await this.dropSpotRepository.getDropSpotsByWastePlantId(
      wasteplantId,
      page,
      limit,
      search
    );
  }
  async getDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<IDropSpot | null> {
    const dropSpot = await this.dropSpotRepository.findDropSpotById(dropSpotId);
    if (!dropSpot || dropSpot.wasteplantId.toString() !== wasteplantId) {
      return null;
    }
    return dropSpot;
  }

  async deleteDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<IDropSpot | null> {
    return await this.dropSpotRepository.deleteDropSpotById(
      dropSpotId,
      wasteplantId
    );
  }

  async updateDropSpotService(
    wasteplantId: string,
    dropSpotId: string,
    updateData: any
  ) {
    const dropSpot = await this.dropSpotRepository.findDropSpotById(dropSpotId);
    if (!dropSpot || dropSpot.wasteplantId.toString() !== wasteplantId) {
      return null;
    }

    const updatedDropSpot = await this.dropSpotRepository.updateDropSpot(
      dropSpotId,
      updateData
    );
    return updatedDropSpot;
  }
}
