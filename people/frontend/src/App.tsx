import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatWelcomePage from "./pages/chat/ChatWelcomePage";
import Chat from "./pages/chat/ChatBox";

function App() {
  return (
    <div className="h-screen overflow-hidden ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatWelcomePage />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
