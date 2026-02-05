import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DailySummary from "./pages/DailySummary";
import FocusTimer from "./pages/FocusTimer";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/focus" />} />
        <Route path="/focus" element={<FocusTimer />} />
        <Route path="/summary" element={<DailySummary />} />
      </Routes>
    </>
  );
}
