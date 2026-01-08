
import React, { useState } from "react";
import Sidebar from "../../Components/ui/Sidebar";
import Header from "../../Components/ui/Header";
import BalancedTimeTable from "../../Components/timetable/BalancedTimetable";

const BalancedTimeTablePage = () => {
  const [activeMenu, setActiveMenu] = useState("timetable");

  return (
    <div className="flex min-h-screen bg-[#F3F6FB]">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Right Section */}
      <div className="flex flex-col flex-1 px-4 pt-4">
        {/* Header */}
        <div className="bg-white rounded-xl px-6 py-4 shadow-sm mb-4">
          <Header />
        </div>

        {/* Timetable Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <BalancedTimeTable />
        </div>
      </div>
    </div>
  );
};

export default BalancedTimeTablePage;


