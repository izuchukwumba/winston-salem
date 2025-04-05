// mapApi.ts - Frontend API client for communicating with the backend

import { Place } from "./map_types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch search results from the backend
 *
 * @param query The search query string
 * @param lat User's latitude
 * @param lng User's longitude
 * @returns Promise with array of places
 */
export const fetchSearchResults = async (
  query: string,
  lat: number,
  lng: number
): Promise<Place[]> => {
  console.log("fetchSearchResults:", query, lat, lng);
  try {
    const params = new URLSearchParams({
      query,
      lat: lat.toString(),
      lng: lng.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/map/places/search?${params}`);

    if (!response.ok) {
      throw new Error(`Error fetching search results: ${response.statusText}`);
    }

    const data = await response.json();
    return data.places;
  } catch (error) {
    console.error("Error in fetchSearchResults:", error);
    throw error;
  }
};

/**
 * Get directions between two points
 *
 * @param originLat Starting point latitude
 * @param originLng Starting point longitude
 * @param destLat Destination latitude
 * @param destLng Destination longitude
 * @param mode Travel mode (driving, walking, bicycling, transit)
 * @returns Promise with directions data
 */
export const getDirections = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  mode: string = "driving"
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      originLat: originLat.toString(),
      originLng: originLng.toString(),
      destLat: destLat.toString(),
      destLng: destLng.toString(),
      mode,
    });

    const response = await fetch(`${BACKEND_URL}/map/directions?${params}`);

    if (!response.ok) {
      throw new Error(`Error fetching directions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getDirections:", error);
    throw error;
  }
};
