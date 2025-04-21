import axios from 'axios';
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { IMapService } from "./interface/IMapService";

class MapService implements IMapService {
    async getAndSaveETA(origin: string, destination: string, pickupReqId: string): Promise<any> {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const encodedDestination = encodeURIComponent(destination);
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${encodedDestination}&key=${apiKey}`;
        try {
        const response = await axios.get(url);
        console.log("Google Maps response:", response.data);  
        const data = response.data;
        const duration = data?.rows?.[0]?.elements?.[0]?.duration;
    
        if (!duration) {
          throw new Error("Could not retrieve ETA from Google Maps");
        }
 
        await PickupRepository.updateETAAndTracking(pickupReqId, {
            eta: {
              text: duration.text,
              value: duration.value
            },
            trackingStatus: 'Assigned'
          });
      
    
        return duration; // { text: "15 mins", value: 900 }
    } catch (error) {
        console.error("Google Maps API call failed:", error);
        throw new Error("Could not retrieve ETA from Google Maps");
      }
      }
  }
  export default new MapService();