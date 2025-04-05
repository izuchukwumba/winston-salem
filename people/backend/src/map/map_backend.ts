// BackendMapService.ts - Backend service implementation for Google Maps

import { Client } from "@googlemaps/google-maps-services-js";
import { Place, SearchParams } from "./map_types";
import { MAP_CONFIG, SEARCH_CONFIG } from "./map_config";
import axios from "axios";

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
    // try {
    //   // const radius = params.radius; // Convert degrees to meters (roughly)
    //   const southwestCorner = {
    //     lat: params.lat - 0.5,
    //     lng: params.lng - 0.5,
    //   };
    //   const northeastCorner = {
    //     lat: params.lat + 0.5,
    //     lng: params.lng + 0.5,
    //   };
    //   // Use Google Maps Places API
    //   const response = await this.client.textSearch({
    //     params: {
    //       query: params.query,
    //       location: `${params.lat},${params.lng}`,
    //       // radius: params.radius,
    //       locationRestriction: {
    //         southwest: southwestCorner,
    //         northeast: northeastCorner,
    //       },
    //       key: this.apiKey,
    //       language: SEARCH_CONFIG.language as any,
    //       region: SEARCH_CONFIG.region,
    //       opennow: params.openNow,
    //     },
    //   });

    //   if (response.data.status !== "OK") {
    //     console.error(`Google Places API Error: ${response.data.status}`);
    //     return [];
    //   }

    //   // const filteredResults = response.data.results.filter((place: any) => {
    //   //   const placeLat = place.geometry.location.lat;
    //   //   const placeLng = place.geometry.location.lng;

    //   //   const distance = this.calculateDistance(
    //   //     params.lat,
    //   //     params.lng,
    //   //     placeLat,
    //   //     placeLng
    //   //   );

    //   //   return distance <= radius / 1000;
    //   // });

    //   // Map Google Places results to our Place interface
    //   return response.data.results.map((place: any) => ({
    //     id: place.place_id,
    //     displayName: place.name,
    //     location: {
    //       lat: place.geometry.location.lat,
    //       lng: place.geometry.location.lng,
    //     },
    //     businessStatus: place.business_status,
    //     primaryType: place.types?.length > 0 ? place.types[0] : undefined,
    //     primaryTypeDisplayName:
    //       place.types?.length > 0
    //         ? this.formatPlaceType(place.types[0])
    //         : undefined,
    //     formattedAddress: place.formatted_address,
    //     rating: place.rating,
    //     userRatingCount: place.user_ratings_total,
    //   }));
    try {
      const url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
      const bounds = {
        southwest: {
          lat: params.lat - 0.1111,
          lng: params.lng - 0.1111,
        },
        northeast: {
          lat: params.lat + 0.1111,
          lng: params.lng + 0.1111,
        },
      };
      const response = await axios.get(url, {
        params: {
          query: params.query,
          locationRestriction: bounds,
          opennow: true,
          language: "en-US",
          key: this.apiKey,
        },
      });
      const results = response.data.results.slice(0, 5);
      // Process results here
      return results.map((place: any) => ({
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
