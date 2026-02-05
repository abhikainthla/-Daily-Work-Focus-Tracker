import { AlarmClockPlus, Calendar, ChartPie, Timer } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition
     ${isActive ? "bg-blue-50 text-[#258cf4] border-blue-200" : "hover:bg-gray-100"}`;

  return (
    <nav className="w-full h-16 bg-white border-b flex justify-between items-center px-12">
      

      <div className="flex items-center gap-[50px]">
        <div className="flex items-center gap-2 font-semibold text-[#258cf4]">
          <div className="w-8 h-8 rounded-lg bg-[#258cf4] text-white flex items-center justify-center">
            <Timer />
          </div>
          FocusDaily
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {today}
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <NavLink to="/focus" className={navClass}>
          <AlarmClockPlus />
          Focus Timer
        </NavLink>

        <NavLink to="/summary" className={navClass}>
          <ChartPie />
          Daily Summary
        </NavLink>
      </div>

    </nav>
  );
}
