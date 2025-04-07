interface HeatMapSideBarProps {
  selectedYears: string[];
  setSelectedYears: React.Dispatch<React.SetStateAction<string[]>>;
}

const HeatMapSideBar = ({
  selectedYears,
  setSelectedYears,
}: HeatMapSideBarProps) => {
  const toggleYear = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  return (
    <div className="w-fit h-fit bg-[#25228b] px-4 py-2">
      <div className=" z-50 w-full">
        <h2 className="font-bold mb-2 w-full">Filter by Year</h2>
        <div className="flex flex-col gap-x-2 justify-start items-start">
          {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
            <div
              key={year}
              className="block flex items-center justify-center gap-x-2 pr-2 py-1"
            >
              <input
                type="checkbox"
                value={year}
                checked={selectedYears.includes(String(year))}
                onChange={() => toggleYear(String(year))}
              />
              <span className="">{year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatMapSideBar;
