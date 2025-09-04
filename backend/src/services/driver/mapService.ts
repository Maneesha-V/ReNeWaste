import axios from "axios";
import { IMapService } from "./interface/IMapService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { GetAndSaveETAResponse } from "../../dtos/common/commonDTO";

@injectable()
export class MapService implements IMapService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository
  ){}
  async getAndSaveETA(
    origin: string,
    destination: string,
    pickupReqId: string,
    addressId: string
  ): Promise<GetAndSaveETAResponse> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const distBaseUrl = process.env.GOOGLE_MAPS_DISTANCE_URL;
    const geoBaseUrl = process.env.GOOGLE_MAPS_GEOCODE_URL;
    const encodedDestination = encodeURIComponent(destination);
     try {
    // 1. Get ETA
    const distUrl = `${distBaseUrl}?origins=${origin}&destinations=${encodedDestination}&key=${apiKey}`;
    const distRes = await axios.get(distUrl);
    const duration = distRes.data?.rows?.[0]?.elements?.[0]?.duration;
    if (!duration) throw new Error("Could not retrieve ETA");
    console.log("dur",duration);
      
    // 2. Get Lat/Lng
    const geoUrl = `${geoBaseUrl}?address=${encodedDestination}&key=${apiKey}`;
    const geoRes = await axios.get(geoUrl);
    const location = geoRes.data.results[0]?.geometry?.location;
    if (!location) throw new Error("Could not retrieve lat/lng");
    console.log("geo-loca",location);
    
    // 3. Find the user's matching address and update it
    await this.userRepository.updateAddressByIdLatLng(addressId, location.lat, location.lng)
    // 4. Save ETA in pickup request tracking
    await this.pickupRepository.updateETAAndTracking(pickupReqId, {
      eta: {
        text: duration.text,
        value: duration.value
      },
    });

    return {
      duration,
      location
    };

  } catch (error) {
    console.error("Google Maps API error:", error);
    throw new Error("Could not retrieve ETA or update coordinates");
  }
  }
}

