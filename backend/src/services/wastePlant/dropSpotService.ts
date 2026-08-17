import { IDropSpotService } from "./interface/IDropSpotService";
import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";
import axios from "axios";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDropSpotRepository } from "../../repositories/dropSpot/interface/IDropSpotRepository";
import { DropSpotMapper } from "../../mappers/DropSpotMapper";
import {
  DropSpotDTO,
  PaginatedDropSpotsResult,
  UpdateDataDropSpot,
} from "../../dtos/dropspots/dropSpotDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class DropSpotService implements IDropSpotService {
  constructor(
    @inject(TYPES.DropSpotRepository)
    private dropSpotRepository: IDropSpotRepository,
  ) {}
  async createDropSpotService(payload: IDropSpot) {
    console.log("payload", payload);

    const fullAddress = `${payload.addressLine}, ${payload.location}, ${payload.district}, ${payload.state}, ${payload.pincode}`;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const geoBaseUrl = process.env.GOOGLE_MAPS_GEOCODE_URL;
    const encodedAddress = encodeURIComponent(fullAddress);
    // try {
    const geocodeUrl = `${geoBaseUrl}?address=${encodedAddress}&key=${apiKey}`;

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
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.WASTEPLANT.ERROR.DROPSPOT_INVALID_ADDRESS,
      );
    }

    const created = await this.dropSpotRepository.createDropSpot(payload);
    if (!created) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.WASTEPLANT.ERROR.DROPSPOT_CREATE_FAILED,
      );
    }
    return true;
    // } catch (error) {
    //   console.error("Error in createDropSpotService:", error);
    //   throw error;
    // }
  }
  async getAllDropSpots(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginatedDropSpotsResult> {
    const { dropspots, total } =
      await this.dropSpotRepository.getDropSpotsByWastePlantId(
        wasteplantId,
        page,
        limit,
        search,
      );
    if (!dropspots) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.DROPSPOT_NOT_FOUND,
      );
    }

    return {
      dropspots: DropSpotMapper.mapDropSpotsDTO(dropspots),
      total,
    };
  }
  async getDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string,
  ): Promise<DropSpotDTO> {
    const dropSpot = await this.dropSpotRepository.findDropSpotById(
      dropSpotId,
      wasteplantId,
    );
    if (!dropSpot) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.DROPSPOT_NOT_FOUND,
      );
    }
    return DropSpotMapper.mapDropSpotDTO(dropSpot);
  }

  async deleteDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string,
  ): Promise<DropSpotDTO> {
    const dropSpot = await this.dropSpotRepository.deleteDropSpotById(
      dropSpotId,
      wasteplantId,
    );
    if (!dropSpot) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.DROPSPOT_NOT_FOUND,
      );
    }
    return DropSpotMapper.mapDropSpotDTO(dropSpot);
  }

  async updateDropSpotService(
    wasteplantId: string,
    dropSpotId: string,
    updateData: UpdateDataDropSpot,
  ) {
    const dropSpot = await this.dropSpotRepository.findDropSpotById(
      dropSpotId,
      wasteplantId,
    );
    if (!dropSpot) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.DROPSPOT_NOT_FOUND,
      );
    }

    const updatedDropSpot = await this.dropSpotRepository.updateDropSpot(
      dropSpotId,
      updateData,
    );
    if (!updatedDropSpot) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.WASTEPLANT.ERROR.DROPSPOT_UPDATE_FAILED,
      );
    }
    return DropSpotMapper.mapDropSpotDTO(updatedDropSpot);
  }
}
