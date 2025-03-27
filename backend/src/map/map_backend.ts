// BackendMapService.ts - Backend service implementation for Google Maps

import { Client } from "@googlemaps/google-maps-services-js";
import { Place, SearchParams } from "./map_types";
import { MAP_CONFIG, SEARCH_CONFIG } from "./map_config";
import dotenv from "dotenv";
dotenv.config();

class BackendMapService {
  private client: Client;
  private apiKey: string | any;

  constructor(apiKey: string | any) {
    this.client = new Client({});
    this.apiKey = apiKey;
  }

  /**
   * Search for places based on query and location
   *
   * @param params Search parameters
   * @returns Array of places
   */
  async searchPlaces(params: SearchParams): Promise<Place[]> {
    try {
      // Create bounds for search area
      const radius = params.radius || MAP_CONFIG.searchRadius * 111000; // Convert degrees to meters (roughly)

      // Use Google Maps Places API
      const response = await this.client.textSearch({
        params: {
          query: params.query,
          location: `${params.lat},${params.lng}`,
          radius: radius,
          key: this.apiKey,
          language: SEARCH_CONFIG.language as any,
          region: SEARCH_CONFIG.region,
          opennow: params.openNow,
        },
      });

      if (response.data.status !== "OK") {
        console.error(`Google Places API Error: ${response.data.status}`);
        return [];
      }

      // Map Google Places results to our Place interface
      return response.data.results.map((place: any) => ({
        id: place.place_id,
        displayName: place.name,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        businessStatus: place.business_status,
        primaryType: place.types?.length > 0 ? place.types[0] : undefined,
        primaryTypeDisplayName:
          place.types?.length > 0
            ? this.formatPlaceType(place.types[0])
            : undefined,
        formattedAddress: place.formatted_address,
        rating: place.rating,
        userRatingCount: place.user_ratings_total,
      }));
    } catch (error) {
      console.error("Error searching places:", error);
      throw error;
    }
  }

  /**
   * Get directions between two points
   *
   * @param originLat Origin latitude
   * @param originLng Origin longitude
   * @param destLat Destination latitude
   * @param destLng Destination longitude
   * @param mode Travel mode
   * @returns Directions result
   */
  async getDirections(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    mode: string = "driving"
  ): Promise<any> {
    try {
      // Convert mode string to Google Maps travel mode
      const travelMode = this.getTravelMode(mode);

      // Use Google Maps Directions API
      const response = await this.client.directions({
        params: {
          origin: `${originLat},${originLng}`,
          destination: `${destLat},${destLng}`,
          mode: travelMode as any,
          key: this.apiKey,
        },
      });

      if (response.data.status !== "OK") {
        console.error(`Google Directions API Error: ${response.data.status}`);
        throw new Error(`Failed to get directions: ${response.data.status}`);
      }

      return response.data;
    } catch (error) {
      console.error("Error getting directions:", error);
      throw error;
    }
  }

  /**
   * Format place type to be more human-readable
   *
   * @param type Place type from Google API
   * @returns Formatted type
   */
  private formatPlaceType(type: string): string {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Convert string travel mode to Google Maps travel mode
   *
   * @param mode Travel mode string
   * @returns Google Maps travel mode
   */
  private getTravelMode(mode: string): string {
    const validModes = ["driving", "walking", "bicycling", "transit"];
    return validModes.includes(mode.toLowerCase())
      ? mode.toLowerCase()
      : "driving";
  }
}

// Create and export service instance
const mapService = new BackendMapService(
  process.env.GOOGLE_MAPS_API_KEY as string
);
export default mapService;
