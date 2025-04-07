import Header from "../components/Header";
import HeatMap from "./HeatMap";
import HeatMapSideBar from "../components/HeatMapSideBar";

const Map = () => {
  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <HeatMap />
        <HeatMapSideBar />
      </div>
    </div>
  );
};

export default Map;
