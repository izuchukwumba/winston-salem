import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { X } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 36.0999,
  lng: -80.2442,
};

interface HeatMapProps {
  selectedYears: string[];
}

const HeatMap: React.FC<HeatMapProps> = ({ selectedYears }) => {
  const [locationEntries, setLocationEntries] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<
    google.maps.visualization.WeightedLocation[]
  >([]);
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>({});
  const [trendData, setTrendData] = useState<
    { year: string; count: number; location: string }[] | null
  >(null);
  // const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getEntries = async () => {
    const response = await fetch(`${BACKEND_URL}/heatmap/get-entries`);
    const data = await response.json();
    console.log(data);
    setLocationEntries(data);
  };

  useEffect(() => {
    getEntries();
  }, []);

  // useEffect(() => {
  //   const filteredPoints = locationEntries
  //     .filter(
  //       (entry) =>
  //         selectedYears.length === 0 ||
  //         selectedYears.includes(String(entry.Year))
  //     )
  //     .map((entry) => ({
  //       location: new google.maps.LatLng(entry.Latitude, entry.Longitude),
  //       weight: entry.Count,
  //     }));

  //   setHeatmapData(filteredPoints);
  // }, [locationEntries, selectedYears]);

  useEffect(() => {
    if (selectedYears.length === 0) {
      setHeatmapData([]);
      return;
    }

    const locationMap: {
      [key: string]: { lat: number; lng: number; weight: number };
    } = {};

    for (const entry of locationEntries) {
      const entryYear = entry.Year.toString().trim();
      if (
        // selectedYears.length === 0 ||
        selectedYears.includes(entryYear)
      ) {
        const lat = Number(entry.Latitude).toFixed(5);
        const lng = Number(entry.Longitude).toFixed(5);
        const key = `${lat},${lng}`;
        const count = parseInt(entry.Count) || 0;

        if (locationMap[key]) {
          locationMap[key].weight += count;
        } else {
          locationMap[key] = {
            lat: Number(lat),
            lng: Number(lng),
            weight: count,
          };
        }
      }
    }

    const mergedPoints = Object.values(locationMap).map((point) => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      weight: point.weight,
    }));

    setHeatmapData(mergedPoints);
  }, [locationEntries, selectedYears]);

  const handleMapLoad = () => {
    // Now google is guaranteed to be defined
    // let points: google.maps.visualization.WeightedLocation[] = [];

    // for (const entry of locationEntries) {
    //   points.push({
    //     location: new google.maps.LatLng(entry.Latitude, entry.Longitude),
    //     weight: entry.Count,
    //   });
    // }
    // setHeatmapData(points);

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

  const groupByYear = (entries: any[]) => {
    const yearMap: { [key: string]: { count: number; location: string } } = {};

    for (const entry of entries) {
      const year = entry.Year?.toString();
      const count = parseInt(entry.Count || "0");
      const location = entry.Location;
      if (year) {
        yearMap[year] = {
          count: (yearMap[year]?.count || 0) + count,
          location,
        };
      }
    }

    return Object.entries(yearMap).map(([year, { count, location }]) => ({
      year,
      count,
      location,
    }));
  };
  console.log(selectedYears);
  const handleHeatInfo = (lat: number, lng: number) => {
    if (!lat || !lng) return;

    if (selectedYears.length === 0) {
      setTrendData(null);
      return;
    }

    const radius = 0.007; // ~100m radius
    const matchingEntries = locationEntries.filter((entry) => {
      return (
        Math.abs(entry.Latitude - lat) < radius &&
        Math.abs(entry.Longitude - lng) < radius
      );
    });
    const filteredByYear = matchingEntries.filter((entry) =>
      // selectedYears.length === 0 ||
      selectedYears.includes(String(entry.Year).trim())
    );
    const grouped = groupByYear(filteredByYear);
    console.log("grouped", filteredByYear);
    setTrendData(grouped);
  };

  const TrendChart = ({
    data,
  }: {
    data: { year: string; count: number; location: string }[];
  }) => (
    <div className="absolute bottom-5 left-5 bg-white p-4 rounded shadow-md z-50">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium mb-2 text-black">
          Movement Analysis
        </h2>
        <X
          size={25}
          strokeWidth={3}
          className="cursor-pointer text-red-400  "
          onClick={() => setTrendData(null)}
        />
      </div>
      <LineChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <p className="text-xs underline">
          {data.length} entries in the selected year range
        </p>
      </div>
      <div className="flex flex-col items-start justify-between text-black">
        {data.map((item) => (
          <div key={item.year} className="flex items-start  text-xs">
            <p>
              <span className="text-[#25228b] font-bold">{item.count}</span>{" "}
              found at{" "}
              <span className="text-[#25228b] font-medium">
                {item.location}
              </span>{" "}
              in <span className="text-[#25228b] font-bold">{item.year}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const heatLayerOptions = {
    radius: 25, // controls size of the blobs (default: 20)
    opacity: 1, // 0 to 1
    dissipating: true, // should blobs shrink when zoomed out?
    gradient: [
      //Theme 3
      "rgba(255, 255, 204, 0)", // transparent pale yellow
      "rgba(255, 255, 204, 1)", // pale yellow
      "rgba(255, 204, 102, 1)", // light orange
      "rgba(255, 153, 51, 1)", // orange
      "rgba(255, 102, 0, 1)", // deep orange
      "rgba(255, 51, 0, 1)", // bright red-orange
      "rgba(204, 0, 0, 1)", // red
      "rgba(153, 0, 0, 1)", // dark red
      "rgba(102, 0, 0, 1)", // deep crimson
    ],
  };
  console.log(trendData);

  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (heatmapRef.current) {
      // Remove old layer from map
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }

    if (selectedYears.length === 0 || heatmapData.length === 0) return;

    const layer = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      ...heatLayerOptions,
    });

    layer.setMap(mapRef.current);
    heatmapRef.current = layer;
  }, [heatmapData, selectedYears]);

  return (
    <div className="w-full h-full">
      {trendData && <TrendChart data={trendData} />}

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["visualization"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          mapTypeId="roadmap"
          onLoad={(map) => {
            mapRef.current = map;
            handleMapLoad();
          }}
          options={mapOptions}
          onClick={(e) => {
            if (e.latLng) {
              // handleHeatInfo(e.latLng.lat(), e.latLng.lng());
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (!lat || !lng) return;

              const radius = 0.001; // ~90 meters

              const match = locationEntries.find((entry) => {
                return (
                  // (selectedYears.length === 0 ||
                  selectedYears.includes(entry.Year.toString().trim()) &&
                  Math.abs(entry.Latitude - lat) < radius &&
                  Math.abs(entry.Longitude - lng) < radius
                );
              });

              if (match) {
                // setSelectedEntry(match);
                handleHeatInfo(lat, lng);
              }
            }
          }}
        >
          {/* {heatmapData.length > 0 && selectedYears.length > 0 && (
            <HeatmapLayer
              key={JSON.stringify(heatmapData)} // forces re-mount on data change
              data={heatmapData}
              options={heatLayerOptions}
            />
          )} */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default HeatMap;
