import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const backgroundStyle = {
  backgroundImage: "url('assets/city-of-ws-2.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100%",
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <div className="relative z-10 h-100">
        <Header backButton={false} />
        <div className="flex flex-col justify-center items-center py-4 h-100 gap-y-10 mt-35">
          <div className="bg-white text-[#25228B] border-1 border-[#25228B] text-xl font-inter px-4 py-2 rounded-md mb-20">
            Select an option
          </div>
          <div className="flex flex-col justify-center items-center gap-y-10 mb-20">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-y-6 lg:gap-y-0 lg:gap-x-14 w-full text-lg lg:text-xl">
              <div className="bg-[#25228B] text-white font-bold font-playfair px-12 py-2 rounded-md cursor-pointer">
                I need help
              </div>
              <div
                className="bg-[#25228B] text-white font-bold font-playfair px-5 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  navigate("/report");
                }}
              >
                I am here to report
              </div>
            </div>
            <div
              className="bg-white text-black border-1 border-[#25228B] text-base lg:text-xl font-playfair italic px-8 lg:px-10 py-3 rounded-md cursor-pointer"
              onClick={() => navigate("/mappage")}
            >
              View Heatmap
            </div>
          </div>
          <div className="bg-[#25228B] text-white text-lg lg:text-2xl font-playfair italic px-8 lg:px-20 py-5 rounded-md">
            "Together, we can make a difference"
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
