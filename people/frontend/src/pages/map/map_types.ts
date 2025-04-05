// types.ts - Common type definitions for frontend and backend

// Location coordinates
export interface Location {
  latitude?: number;
  longitude?: number;
  lat?: number; // For Google Maps compatibility
  lng?: number; // For Google Maps compatibility
}

// Place information
export interface Place {
  id?: string;
  displayName: string;
  location: Location;
  businessStatus?: string;
  primaryType?: string;
  primaryTypeDisplayName?: string;
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
}

// Distance information
export interface DistanceInfo {
  miles: string;
  kilometers: string;
}

// Map URLs
export interface MapUrls {
  earthUrl: string;
  satelliteUrl: string;
  mapsUrl: string;
}

// Search parameters
export interface SearchParams {
  query: string;
  lat: number;
  lng: number;
  radius?: number;
  openNow?: boolean;
  minRating?: number;
}

// Direction request parameters
export interface DirectionParams {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  mode?: string;
}
