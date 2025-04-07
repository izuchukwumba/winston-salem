import Header from "../components/Header";
import HeatMap from "./HeatMap";
import HeatMapSideBar from "../components/HeatMapSideBar";
import { useState } from "react";
const Map = () => {
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <HeatMap selectedYears={selectedYears} />{" "}
        <div className="z-60 absolute top-50 right-0">
          <HeatMapSideBar
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
        </div>
      </div>
    </div>
  );
};

export default Map;
