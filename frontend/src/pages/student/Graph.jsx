import React, { useState } from "react";
import Attendence from "./tabs/Attendence";
import Marks from "./tabs/Marks";
import Profile from "./tabs/Profile";
import { Calendar, BarChart2, User } from "lucide-react";

const Graph = ({ subjects }) => {
  const [active, setActive] = useState("Attendance");

  const tabs = [
    { id: "Attendance", label: "Attendance", icon: Calendar },
    { id: "Marks", label: "Marks Breakdown", icon: BarChart2 },
    { id: "Profile", label: "Student Profile", icon: User }
  ];

  // If no data yet
  if (!subjects || subjects.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm font-medium">
        Loading graphs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Segmented Tabs Control */}
      <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 w-full sm:w-fit border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="w-full">
        {active === "Attendance" && <Attendence subjects={subjects} />}
        {active === "Marks" && <Marks subjects={subjects} />}
        {active === "Profile" && <Profile subjects={subjects} />}
      </div>
    </div>
  );
};

export default Graph;
