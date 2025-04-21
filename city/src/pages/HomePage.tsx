import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// const backgroundStyle = {
//   backgroundImage: "url('assets/city-of-ws-2.jpeg')",
//   backgroundSize: "cover",
//   backgroundPosition: "center",
//   height: "100vh",
//   width: "100%",
// };
//console.log('test)

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen">
      <div className="relative z-10 h-100">
        <Header backButton={false} />
        <div className="flex flex-col justify-center items-center py-4 h-full gap-y-10 mt-50">
          {/* <div className="bg-white text-[#25228B] border-1 border-[#25228B] text-xl font-inter px-4 py-2 rounded-md mb-20">
            Select an option
          </div> */}
          <div className="flex flex-col justify-center items-center">
            <div className=" text-8xl font-black font-inter">
              {/* <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#25228B]/60 to-[#25228B]/90"> */}
              <p className="text-[#25228B]/90 ">ANCHOR POINT</p>
            </div>
            <div className="text-2xl text-[#25228B] font-medium font-poppins text-center">
              Bridging <span className="font-bold underline">compassion</span>{" "}
              and <span className="font-bold underline">technology</span> to
              support our homeless neighbors...
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-y-10 mb-20">
            <div className="w-[50%] flex flex-col lg:flex-row justify-center items-center gap-y-6 lg:gap-y-0 lg:gap-x-14 text-lg lg:text-xl">
              <div
                onClick={() => {
                  window.open(
                    "https://winston-salem-iota.vercel.app/",
                    "_blank"
                  );
                }}
                className="cursor-pointer"
              >
                <div className="bg-[#25228B] hover:bg-[#25228B]/90 transition-all duration-300 text-white font-bold font-poppins px-12 py-2 rounded-md cursor-pointer flex flex-col items-center justify-center py-4">
                  <p className="text-2xl py-3">I am homeless</p>
                </div>{" "}
                <div className="bg-white/50 px-3 py-3 rounded-b-lg text-center font-poppins text-black leading-tight">
                  Click here if you are currently homeless and need of help. Our
                  AI Homeless Assistance will direct you to the nearest
                  resources to help you.
                </div>
              </div>
              <div
                onClick={() => {
                  navigate("/report");
                }}
                className="cursor-pointer"
              >
                <div className="bg-[#25228B] hover:bg-[#25228B]/90 transition-all duration-300 text-white font-bold font-poppins px-5 py-2 rounded-md cursor-pointer flex flex-col items-center justify-center py-4">
                  <p className="text-2xl py-3">I am here to report</p>
                </div>
                <div className="bg-white/50 px-3 py-3 rounded-b-lg text-center font-poppins text-black leading-tight">
                  Click here if you are here to report a homeless person. Our AI
                  Homeless Assistance will direct you to the nearest resources
                  to help you.
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <div
                className="mt-10 py-4 text-center w-[50%] font-bold bg-[#25228B]/90 text-white border-1 border-[white] text-base lg:text-2xl font-poppins  px-8 lg:px-10 py-3 rounded-md cursor-pointer hover:bg-[#25228B] hover:text-white transition-all duration-300"
                onClick={() => navigate("/mappage")}
              >
                View Homeless Heatmap
              </div>
            </div>
          </div>
          <div className=" text-[#25228B] font-black text-lg lg:text-2xl font-poppins italic px-8 lg:px-20 py-5 rounded-md">
            "Together, we can make a difference"
          </div>
        </div>
      </div>
      <div className="fixed top-1/2 -translate-y-1/2 left-[-20px] w-fit p-4 ml-[-20px]">
        <img src="/assets/helping-hands-3.png" />
      </div>
    </div>
  );
};

export default HomePage;
