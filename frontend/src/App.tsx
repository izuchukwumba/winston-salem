import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat-welcome-page" element={<div>I zu</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
