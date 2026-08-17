import axios from "axios";
import { IHomeService } from "./interface/IHomeService";
import {
  GoogleAutocompleteResponse,
  LocationSuggestion,
  PlacePrediction,
  WPServiceResp,
} from "../../dtos/common/commonDTO";
import TYPES from "../../config/inversify/types";
import { inject, injectable } from "inversify";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class HomeService implements IHomeService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
  ) {}
  async searchLocation(location: string): Promise<LocationSuggestion[]> {
    const response = await axios.get<GoogleAutocompleteResponse>(
      process.env.GOOGLE_MAPS_AUTOCOMPLETE_URL!,
      {
        params: {
          input: location,
          key: process.env.GOOGLE_MAPS_API_KEY,
          components: "country:in",
        },
      },
    );

    const predictions = response.data.predictions.map(
      (item: PlacePrediction): LocationSuggestion => ({
        placeId: item.place_id,
        description: item.description,
      }),
    );
    return predictions;
  }
  async checkWPServiceAvailability(location: string): Promise<WPServiceResp> {
    const response = await axios.get(process.env.NOMINATIM_SEARCH_URL!, {
      params: {
        q: location,
        format: "jsonv2",
        addressdetails: 1,
      },
      headers: {
        "User-Agent": "ReNeWaste/1.0",
      },
    });
    if (!response.data.length) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.LOCATION_NOT_FOUND,
      );
    }
    console.log(response.data[0].address);
    const address = response.data[0].address;

    const taluk = address.county;

    if (!taluk) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMMON.ERROR.TALUK_NOT_DETERMINE,
      );
    }
    const plantId =
      await this._wastePlantRepository.findWastePlantByTaluk(taluk);
    if (!plantId) {
      return {
        serviceAvailable: false,
      };
    }

    const plant = await this._wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      return {
        serviceAvailable: false,
      };
    }

    return {
      serviceAvailable: true,
      plantName: plant.plantName,
      plantId,
      taluk: address.county,
      location: address.local_authority,
      district: address.state_district,
      state: address.state,
      pincode: address.postcode,
    };
  }
  async checkCurrentLocation(latitude: number, longitude: number) {
    const response = await axios.get(process.env.NOMINATIM_REVERSE_URL!, {
      params: {
        lat: latitude,
        lon: longitude,
        format: "jsonv2",
        addressdetails: 1,
      },
      headers: {
        "User-Agent": "ReNeWaste/1.0",
      },
    });
    const address = response.data.address;
    const taluk = address.county;
    console.log({ taluk });
    console.log(response.data.address);

    const plantId =
      await this._wastePlantRepository.findWastePlantByTaluk(taluk);

    if (!plantId) {
      return {
        serviceAvailable: false,
      };
    }

    const plant = await this._wastePlantRepository.getWastePlantById(plantId);

    return {
      serviceAvailable: true,
      plantName: plant?.plantName ?? "",
      plantId,
      taluk: address.county,
      location: address.local_authority || address.town,
      district: address.state_district,
      state: address.state,
      pincode: address.postcode,
    };
  }
}
