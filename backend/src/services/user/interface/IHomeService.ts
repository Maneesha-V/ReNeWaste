import { CurrentLocationResp, LocationSuggestion, WPServiceResp } from "../../../dtos/common/commonDTO";

export interface IHomeService {
    searchLocation(location: string): Promise<LocationSuggestion[]>;
    checkWPServiceAvailability(location: string): Promise<WPServiceResp>;
    checkCurrentLocation(latitude: number,longitude: number): Promise<CurrentLocationResp>;
}