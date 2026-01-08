import React, { useState } from "react";
import  Sidebar  from "../../Components/ui/Sidebar";
import  Header  from "../../Components/ui/Header";
import  TimetableContent  from "../../Components/timetable/GenerateTT";

const GenerateTimetablePage = () => {
  const [activeMenu, setActiveMenu] = useState("timetable");

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="flex-1 flex flex-col px-6 pt-4">
        <div className="bg-white rounded-[12px] px-6 py-4 shadow-sm mb-5">
          <Header />
        </div>

        <TimetableContent />
      </div>
    </div>
  );
};

export default GenerateTimetablePage;