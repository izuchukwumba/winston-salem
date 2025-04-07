import { useNavigate } from "react-router-dom";

const Header: React.FC<{ backButton?: boolean }> = ({ backButton }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#25228B] flex justify-around items-center py-4 w-full">
      {backButton && (
        <div
          className="fixed left-2 text-white text-xl lg:text-xl font-inter border-1 border-white rounded-md px-4 py-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Back
        </div>
      )}
      <div className="text-white text-2xl lg:text-4xl font-bold font-playfair ">
        City of Winston-Salem
      </div>
      <div className="fixed right-3">
        <div className="flex justify-between items-center gap-x-4 text-xl lg:text-base font-inter">
          <div
            className="text-white  border-1 border-white rounded-md px-4 py-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </div>
          <div
            className="text-white  border-1 border-white rounded-md px-4 py-1 cursor-pointer"
            onClick={() => navigate("/report")}
          >
            Report
          </div>
          <div
            className="text-white  border-1 border-white rounded-md px-4 py-1 cursor-pointer"
            onClick={() => navigate("/mappage")}
          >
            Heatmap
          </div>
          <div
            className="text-white  border-1 border-white rounded-md px-4 py-1 cursor-pointer"
            onClick={() => window.open("http://localhost:5174/", "_blank")}
          >
            Assistance
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
