// config.ts - Application configuration settings

// Default values
export const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194, // San Francisco
};

export const MAP_CONFIG = {
  defaultZoom: 11,
  closeZoom: 18,
  searchRadius: 0.0005, // Degrees for search area (approximately 500m)
  mapId: "DEMO_MAP_ID",
};

export const SEARCH_CONFIG = {
  maxResults: 8,
  defaultQuery: "medical",
  minRating: 3.2,
  language: "en-US",
  region: "us",
};

export const UI_CONFIG = {
  colors: {
    primary: "#4285F4",
    secondary: "#34A853",
    accent: "#EA4335",
    warning: "#FBBC05",
    background: "#FFFFFF",
    text: "#202124",
  },
  markerSize: {
    user: 24,
    place: 36,
  },
};
