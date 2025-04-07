import React, { useState } from "react";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 36.0999,
  lng: -80.2442,
};

// export default HeatMap;
const HeatMap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<
    google.maps.visualization.WeightedLocation[]
  >([]);
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>({});

  const handleMapLoad = () => {
    // Now google is guaranteed to be defined
    const points: google.maps.visualization.WeightedLocation[] = [
      { location: new google.maps.LatLng(36.0999, -80.2442), weight: 3 }, // Downtown/Bus Station
      { location: new google.maps.LatLng(36.1232, -80.2615), weight: 2 }, // Hanes Mall Blvd area
      { location: new google.maps.LatLng(36.069, -80.247), weight: 1 }, // Peters Creek Pkwy & Brewer Rd
      { location: new google.maps.LatLng(36.0781, -80.248), weight: 4 }, // Walmart on Peters Creek
      { location: new google.maps.LatLng(36.1005, -80.221), weight: 2 }, // East Winston
      { location: new google.maps.LatLng(36.0992, -80.2595), weight: 1 }, // West End
      { location: new google.maps.LatLng(36.1143, -80.254), weight: 0.5 }, // University Pkwy
    ];
    setHeatmapData(points);

    const wintonSalemBounds = {
      north: 36.24,
      south: 35.97,
      east: -80.09,
      west: -80.41,
    };

    setMapOptions({
      restriction: {
        latLngBounds: wintonSalemBounds,
        strictBounds: true,
      },
      // minZoom: 6, // Prevents zooming out too far
      mapTypeControl: true,
      zoomControl: true,
      fullscreenControl: true,
      streetViewControl: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT,
      },
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
    });
  };
  return (
    <div className="w-full h-full">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["visualization"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          mapTypeId="roadmap"
          onLoad={handleMapLoad}
          options={mapOptions}
        >
          {heatmapData.length > 0 && <HeatmapLayer data={heatmapData} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default HeatMap;
