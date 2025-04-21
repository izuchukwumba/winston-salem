import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import MapPage from "./pages/MapPage";
import "./App.css";

const backgroundStyle = {
  backgroundImage: "url('assets/city-of-ws-2.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100%",
};

function App() {
  return (
    <div style={backgroundStyle} className="h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[#dcdbff] opacity-80"></div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/mappage" element={<MapPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
