import axios from "axios";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { IMapService } from "./interface/IMapService";
import UserRepository from "../../repositories/user/userRepository";

class MapService implements IMapService {
  async getAndSaveETA(
    origin: string,
    destination: string,
    pickupReqId: string,
    addressId: string
  ): Promise<any> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const encodedDestination = encodeURIComponent(destination);
     try {
    // 1. Get ETA
    const distUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${encodedDestination}&key=${apiKey}`;
    const distRes = await axios.get(distUrl);
    const duration = distRes.data?.rows?.[0]?.elements?.[0]?.duration;
    if (!duration) throw new Error("Could not retrieve ETA");
    console.log("dur",duration);
      
    // 2. Get Lat/Lng
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedDestination}&key=${apiKey}`;
    const geoRes = await axios.get(geoUrl);
    const location = geoRes.data.results[0]?.geometry?.location;
    if (!location) throw new Error("Could not retrieve lat/lng");
    console.log("geo-loca",location);
    
    // 3. Find the user's matching address and update it
    // const pickup = await PickupRepository.getPickupById(pickupReqId);
    //  if (!pickup) throw new Error("PickupId id is not found.");
    // await UserRepository.findAddressByAddressId(pickup.userId, addressId, location.lat, location.lng)
    await UserRepository.updateAddressByIdLatLng(addressId, location.lat, location.lng)
    // 4. Save ETA in pickup request tracking
    await PickupRepository.updateETAAndTracking(pickupReqId, {
      eta: {
        text: duration.text,
        value: duration.value
      },
      // trackingStatus: "Assigned"
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
export default new MapService();
