import React, { useState } from "react";
import Sidebar from "../../Components/ui/Sidebar";
import Header from "../../Components/ui/Header";
import TimetableContent from "../../Components/timetable/GenerateTT";

const GenerateTimetablePage = () => {
  const [activeMenu, setActiveMenu] = useState("timetable");

  return (
    <div
      className="min-h-screen h-screen bg-[#FFFFFF] flex px-2 py-4 gap-4 overflow-hidden"
      style={{ fontFamily: "Mulish, sans-serif" }}
    >
      {/* Sidebar */}
      <div className="shrink-0">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex pt-2 overflow-y-auto">
        <div className="w-full max-w-[1170px] space-y-2">
          {/* Header */}
          <div className="w-full bg-white border border-[#BFBFBF] rounded-[10px] px-6 py-3 shadow-[0_4px_14px_rgba(148,163,184,0.18)] flex items-center gap-6">
            <Header />
          </div>

          {/* Body Wrapper */}
          <div className="w-full bg-white rounded-[10px] border border-[#BFBFBF] shadow-[0_16px_40px_rgba(148,163,184,0.22)] px-8 pt-6 pb-11">
            <TimetableContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTimetablePage;









// import React, { useState } from "react";
// import  Sidebar  from "../../Components/ui/Sidebar";
// import  Header  from "../../Components/ui/Header";
// import  TimetableContent  from "../../Components/timetable/GenerateTT";

// const GenerateTimetablePage = () => {
//   const [activeMenu, setActiveMenu] = useState("timetable");

//   return (
//     <div className="min-h-screen bg-[#F1F5F9] flex">
//       <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

//       <div className="flex-1 flex flex-col px-6 pt-4">
//         <div className="bg-white rounded-[12px] px-6 py-4 shadow-sm mb-5">
//           <Header />
//         </div>

//         <TimetableContent />
//       </div>
//     </div>
//   );
// };

// export default GenerateTimetablePage;