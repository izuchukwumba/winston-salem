import { useState } from "react";

const HeatMapSideBar = () => {
  const [selected, setSelected] = useState<string>("");
  const [heatmapData, setHeatmapData] = useState<
    google.maps.visualization.WeightedLocation[]
  >([]);
  return (
    <div className="w-fit bg-blue-500 px-10">
      {selected === "" ? (
        <div className="w-full h-full">
          Click on an heatmap to view information
        </div>
      ) : (
        <div className="w-full h-full">
          {
            heatmapData.find(
              (data) =>
                data.location &&
                data.location.lat() === parseFloat(selected.split(",")[0]) &&
                data.location.lng() === parseFloat(selected.split(",")[1])
            )?.weight
          }
        </div>
      )}
    </div>
  );
};

export default HeatMapSideBar;
