import React, { useEffect, useRef, useState } from "react";
import { fetchSearchResults } from "./map_api_client";
import { Place } from "./map_types";
import { MAP_CONFIG, UI_CONFIG } from "./map_config";
import { createInfoWindowContent } from "./map_utils";

// Define types for Google Maps libraries
declare global {
  interface Window {
    google: any;
    initMap: () => void;
    switchToRoadView: () => void;
    showDirectionsToPlace: (lat: number, lng: number) => void;
  }
}

interface MapProps {
  apiKey: string;
  searchQuery?: string;
}

const Map: React.FC<MapProps> = ({ apiKey, searchQuery }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [userMarker, setUserMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Get current location first, then load Google Maps API
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);

        // Now load the Google Maps script
        loadGoogleMapsScript();
      } catch (error) {
        console.error("Error getting location:", error);
        // Load maps anyway with default location
        setUserLocation({ latitude: 36.1319, longitude: -80.2553 });
        loadGoogleMapsScript();
      }
    };

    getLocation();
  }, [apiKey]);

  // Get current location
  const getCurrentLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error(`Geolocation error: ${error.message}`);
            // Default to Winston-Salem
            resolve({ latitude: 36.1319, longitude: -80.2553 });
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        // Default to Winston-Salem
        resolve({ latitude: 36.1319, longitude: -80.2553 });
      }
    });
  };

  // Load Google Maps API
  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      // Google Maps is already loaded
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,routes&v=beta&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define global initMap function
    window.initMap = async () => {
      if (mapRef.current) {
        await initializeMap();
      }
    };

    document.head.appendChild(script);
  };

  // Initialize the map
  const initializeMap = async () => {
    try {
      const { Map, InfoWindow } = await window.google.maps.importLibrary(
        "maps"
      );

      let center = new window.google.maps.LatLng(
        userLocation?.latitude,
        userLocation?.longitude
      );

      // Create map instance
      const map = new Map(mapRef.current, {
        center: center,
        zoom: MAP_CONFIG.defaultZoom,
        mapId: MAP_CONFIG.mapId || "DEMO_MAP_ID",
      });

      setMapInstance(map);

      // Create info window
      const infoWindowInstance = new InfoWindow();
      setInfoWindow(infoWindowInstance);

      let my_current_location = await getCurrentLocation();
      setUserLocation(my_current_location);
      center = new window.google.maps.LatLng(
        my_current_location.latitude,
        my_current_location.longitude
      );
      // Add user location marker
      try {
        await addUserLocationMarker(map, center);
      } catch (error) {
        console.error("Failed to add user location marker:", error);
        // Continue without user marker
      }

      setMapLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  // Add user location marker
  const addUserLocationMarker = async (
    map: google.maps.Map,
    position: google.maps.LatLng
  ) => {
    try {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );
      // Create a custom marker element for user location
      const userMarkerElement = document.createElement("div");
      userMarkerElement.innerHTML = `
        <div style="position: relative;">
          <div style="width: 24px; height: 24px; background-color: ${
            UI_CONFIG.colors.primary || "#4285F4"
          }; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,.3);">
          </div>
          <div style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background-color: white; padding: 2px 8px; border-radius: 10px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,.3); white-space: nowrap;">
            Your Location
          </div>
        </div>
      `;
      const userLocationMarker = new AdvancedMarkerElement({
        map,
        position,
        content: userMarkerElement,
        zIndex: 1000, // Ensure it's always on top
      });
      setUserMarker(userLocationMarker);
    } catch (error) {
      console.error("Error in addUserLocationMarker:", error);
      throw error; // Re-throw to handle in initializeMap
    }
  };

  // Effect to update search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (mapInstance && userLocation && searchQuery && mapLoaded) {
        setIsLoading(true);
        try {
          await displaySearchResults(searchQuery);
        } catch (error) {
          console.error("Error performing search:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    performSearch();
  }, [searchQuery, mapInstance, userLocation, mapLoaded]);

  // Display search results on the map
  const displaySearchResults = async (query: string) => {
    if (!mapInstance || !userLocation || !infoWindow) {
      return;
    }

    try {
      // Fetch search results from backend API
      const places = await fetchSearchResults(
        query,
        userLocation.latitude,
        userLocation.longitude
      );

      if (places && places.length > 0) {
        await displayPlacesOnMap(places);
      } else {
        alert(`No ${query} facilities found in this area.`);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };

  // Display places on the map
  const displayPlacesOnMap = async (places: Place[]) => {
    if (!mapInstance || !infoWindow) return;

    try {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );
      const { LatLngBounds } = await window.google.maps.importLibrary("core");

      // Clear existing markers (except user location)
      document.querySelectorAll(".place-marker").forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      // Clear existing directions
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
        setDirectionsRenderer(null);
      }

      const bounds = new LatLngBounds();

      // Add user location to bounds
      if (userMarker) {
        bounds.extend(userMarker.position as google.maps.LatLng);
      }

      // Add markers for each place
      places.forEach((place) => {
        // Convert the place.location from backend format to Google Maps LatLng
        const position = new window.google.maps.LatLng(
          place.location.lat,
          place.location.lng
        );

        // Create marker element
        const markerElement = document.createElement("div");
        markerElement.className = "place-marker";
        markerElement.innerHTML = `
          <div style="position: relative; cursor: pointer;">
            <div style="width: 36px; height: 36px; background-color: ${
              UI_CONFIG.colors.accent || "#EA4335"
            }; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">
              ${place.displayName.charAt(0).toUpperCase()}
            </div>
            <div style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); background-color: white; padding: 2px 8px; border-radius: 10px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,.3); white-space: nowrap; max-width: 150px; overflow: hidden; text-overflow: ellipsis;">
              ${place.displayName}
            </div>
          </div>
        `;

        const markerView = new AdvancedMarkerElement({
          map: mapInstance,
          position,
          content: markerElement,
        });

        // Generate URLs for Earth view, satellite view, and Maps
        const lat = position.lat();
        const lng = position.lng();
        const earthUrl = `https://earth.google.com/web/@${lat},${lng},0a,1000d,35y,0h,0t,0r`;
        const satelliteUrl = `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lng}&zoom=18&maptype=satellite`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          place.displayName
        )}`;

        // Add click event to open info window
        markerView.addListener("click", async () => {
          // Switch to satellite view and zoom in
          mapInstance.setMapTypeId(window.google.maps.MapTypeId.SATELLITE);
          mapInstance.setCenter(position);
          mapInstance.setZoom(MAP_CONFIG.closeZoom || 18);

          // Calculate distance if user marker exists
          let distanceInfo = null;
          if (userMarker) {
            const userPos = userMarker.position as google.maps.LatLng;
            const distance =
              window.google.maps.geometry.spherical.computeDistanceBetween(
                userPos,
                position
              );
            const miles = (distance * 0.000621371).toFixed(1);
            const kilometers = (distance * 0.001).toFixed(1);
            distanceInfo = { miles, kilometers };
          }

          // Set info window content
          infoWindow.setContent(
            createInfoWindowContent(
              { ...place, location: position },
              distanceInfo,
              { earthUrl, satelliteUrl, mapsUrl }
            )
          );

          infoWindow.open(mapInstance, markerView);
        });

        bounds.extend(position);
      });

      // Fit map to bounds and ensure it's visible
      if (!bounds.isEmpty()) {
        mapInstance.fitBounds(bounds);
      }
    } catch (error) {
      console.error("Error displaying places on map:", error);
    }
  };

  // Show directions between two points
  const showDirections = async (
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ) => {
    if (!mapInstance) return;

    try {
      const { DirectionsService, DirectionsRenderer } =
        await window.google.maps.importLibrary("routes");

      // Clear existing directions
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }

      const directionsService = new DirectionsService();
      const newDirectionsRenderer = new DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true, // Don't show the default A/B markers
        polylineOptions: {
          strokeColor: UI_CONFIG.colors.primary || "#4285F4",
          strokeWeight: 5,
          strokeOpacity: 0.7,
        },
      });

      setDirectionsRenderer(newDirectionsRenderer);

      // Calculate route
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (
          response: google.maps.DirectionsResult,
          status: google.maps.DirectionsStatus
        ) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            newDirectionsRenderer.setDirections(response);
            // Switch to road map for better directions visibility
            mapInstance.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
          } else {
            console.error(`Directions request failed: ${status}`);
            alert("Could not calculate directions to this location.");
          }
        }
      );
    } catch (error) {
      console.error("Error showing directions:", error);
    }
  };

  // Setup global functions for the info window buttons
  useEffect(() => {
    if (mapInstance) {
      // Function to switch back to road view
      window.switchToRoadView = function () {
        if (mapInstance) {
          mapInstance.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
        }
      };

      // Function to show directions
      window.showDirectionsToPlace = async function (
        destLat: number,
        destLng: number
      ) {
        try {
          if (mapInstance && userMarker) {
            const userPos = userMarker.position as google.maps.LatLng;
            const destPos = new window.google.maps.LatLng(destLat, destLng);
            await showDirections(userPos, destPos);
          }
        } catch (error) {
          console.error("Error showing directions:", error);
        }
      };
    }

    return () => {
      // Clean up global functions
      window.switchToRoadView = () => {};
      window.showDirectionsToPlace = () => {};
    };
  }, [mapInstance, userMarker]);

  return (
    <div className="map-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading results...</p>
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "40vh",
          borderRadius: "15px",
          border: "1px solid #1c1c1c",
        }}
      />
    </div>
  );
};

export default Map;
