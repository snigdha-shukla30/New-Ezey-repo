import React from "react";
import { Home, FileText, Calendar } from "lucide-react";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const mainMenu = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "dataentry", label: "Data Entry", icon: FileText },
    { id: "timetable", label: "Time Table", icon: Calendar },
  ];

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = activeMenu === item.id;

    return (
      <button
        key={item.id}
        onClick={() => setActiveMenu(item.id)}
        className={`relative w-full flex items-center gap-2 -mx-3 px-10 py-2 rounded-xl mb-3 transition-all ${
          isActive
            ? "text-white shadow-[0_8px_18px_rgba(15,23,42,0.35)]"
            : "text-white/80 hover:bg-white/10"
        }`}
        style={
          isActive
            ? {
                background: "linear-gradient(272deg, #167291 0%, #8B7EFF 100%)",
                border: "1px solid",
                borderImageSource:
                  "linear-gradient(95deg, #7EECFF 0%, rgba(92, 117, 144, 0) 90%)",
                borderImageSlice: 1,
              }
            : {}
        }
      >
        {isActive && (
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-[#413E7D]" />
        )}

        <Icon size={18} />

        {/* Menu Text (Figma exact) */}
        <span
          className="flex items-center justify-center text-white"
          style={{
            width: "105px",
            height: "30px",
            fontFamily: "Mulish, sans-serif",
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "150%",
            textAlign: "center",
          }}
        >
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <aside
      className="
        relative
        w-64
        h-[calc(100vh-3rem)]
        mt-2 mb-6 ml-4
        rounded-[10px]
        bg-gradient-to-b from-[#0F809C] via-[#167291] to-[#174264]
        shadow-[0_10px_30px_rgba(0,0,0,0.20)]
        flex flex-col justify-between
        px-4 pt-5 pb-4
      "
      style={{ fontFamily: "Mulish, sans-serif" }}
    >
      {/* TOP SECTION */}
      <div>
        {/* Ezey Text (Restored & Fixed) */}
        <div
          className="absolute text-white"
          style={{
            width: "64px",
            height: "38px",
            top: "21px",
            left: "88px",
            fontFamily: "Playfair Display, serif",
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: "120%",
            textAlign: "center",
          }}
        >
          Ezey
        </div>

        {/* Spacer so menu does not overlap */}
        <div className="h-20" />

        <div className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3 ml-1">
          Menu
        </div>

        {mainMenu.map(renderItem)}
      </div>

      {/* BOTTOM: User Info */}
      <div className="pt-4 border-t border-white/70">
        <div className="flex items-center gap-3 pt-1">
          <div 
            className="rounded-full overflow-hidden border border-white/90 flex-shrink-0"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '57.86px',
              opacity: 1
            }}
          >
            <img
              src="/profile.jpg"
              alt="user"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <div 
              className="text-white whitespace-nowrap"
              style={{
                fontFamily: 'Mulish, sans-serif',
                fontWeight: 600,
                fontSize: '8px',
                lineHeight: '150%',
                letterSpacing: '0%',
                height: '12px',
                opacity: 1
              }}
            >
              Divyansh Pandey
            </div>
            <div 
              className="text-white"
              style={{
                fontFamily: 'Mulish, sans-serif',
                fontWeight: 600,
                fontSize: '8px',
                lineHeight: '150%',
                letterSpacing: '0%',
                width: '123px',
                height: '12px',
                opacity: 1
              }}
            >
              pandeydivyansh5748@gmail.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;









// import React from "react";
// import { Home, FileText, Calendar } from "lucide-react";

// const Sidebar = ({ activeMenu, setActiveMenu }) => {
//   const mainMenu = [
//     { id: "dashboard", label: "Dashboard", icon: Home },
//     { id: "dataentry", label: "Data Entry", icon: FileText },
//     { id: "timetable", label: "Time Table", icon: Calendar },
//   ];

//   const renderItem = (item) => {
//     const Icon = item.icon;
//     const isActive = activeMenu === item.id;

//     return (
//       <button
//         key={item.id}
//         onClick={() => setActiveMenu(item.id)}
//         className={`relative w-full flex items-center gap-2 -mx-3 px-10 py-2 rounded-xl mb-3 transition-all ${
//           isActive
//             ? "text-white shadow-[0_8px_18px_rgba(15,23,42,0.35)]"
//             : "text-white/80 hover:bg-white/10"
//         }`}
//         style={
//           isActive
//             ? {
//                 background: "linear-gradient(272deg, #167291 0%, #8B7EFF 100%)",
//                 border: "1px solid",
//                 borderImageSource:
//                   "linear-gradient(95deg, #7EECFF 0%, rgba(92, 117, 144, 0) 90%)",
//                 borderImageSlice: 1,
//               }
//             : {}
//         }
//       >
//         {isActive && (
//           <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-[#413E7D]" />
//         )}

//         <Icon size={18} />

//         {/* Menu Text (Figma exact) */}
//         <span
//           className="flex items-center justify-center text-white"
//           style={{
//             width: "105px",
//             height: "30px",
//             fontFamily: "Mulish, sans-serif",
//             fontWeight: 600,
//             fontSize: "20px",
//             lineHeight: "150%",
//             textAlign: "center",
//           }}
//         >
//           {item.label}
//         </span>
//       </button>
//     );
//   };

//   return (
//     <aside
//       className="
//         relative
//         w-64
//         h-[calc(100vh-3rem)]
//         mt-2 mb-6 ml-4
//         rounded-[10px]
//         bg-gradient-to-b from-[#0F809C] via-[#167291] to-[#174264]
//         shadow-[0_10px_30px_rgba(0,0,0,0.20)]
//         flex flex-col justify-between
//         px-4 pt-5 pb-4
//       "
//       style={{ fontFamily: "Mulish, sans-serif" }}
//     >
//       {/* TOP SECTION */}
//       <div>
//         {/* Ezey Text (Restored & Fixed) */}
//         <div
//           className="absolute text-white"
//           style={{
//             width: "64px",
//             height: "38px",
//             top: "21px",
//             left: "88px",
//             fontFamily: "Playfair Display, serif",
//             fontWeight: 700,
//             fontSize: "32px",
//             lineHeight: "120%",
//             textAlign: "center",
//           }}
//         >
//           Ezey
//         </div>

//         {/* Spacer so menu does not overlap */}
//         <div className="h-20" />

//         <div className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3 ml-1">
//           Menu
//         </div>

//         {mainMenu.map(renderItem)}
//       </div>

//       {/* BOTTOM: User Info */}
//       <div className="pt-4 border-t border-white/70">
//         <div className="flex items-center gap-3 pt-1">
//           <div 
//             className="rounded-full overflow-hidden border border-white/90 flex-shrink-0"
//             style={{
//               width: '40px',
//               height: '40px',
//               borderRadius: '57.86px',
//               opacity: 1
//             }}
//           >
//             <img
//               src="/profile.jpg"
//               alt="user"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="flex flex-col justify-center gap-0.5">
//             <div 
//               className="text-white whitespace-nowrap"
//               style={{
//                 fontFamily: 'Mulish, sans-serif',
//                 fontWeight: 600,
//                 fontSize: '8px',
//                 lineHeight: '150%',
//                 letterSpacing: '0%',
//                 height: '12px',
//                 opacity: 1
//               }}
//             >
//               Divyansh Pandey
//             </div>
//             <div 
//               className="text-white"
//               style={{
//                 fontFamily: 'Mulish, sans-serif',
//                 fontWeight: 600,
//                 fontSize: '8px',
//                 lineHeight: '150%',
//                 letterSpacing: '0%',
//                 width: '123px',
//                 height: '12px',
//                 opacity: 1
//               }}
//             >
//               pandeydivyansh5748@gmail.com
//             </div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;






// import React from "react";
// import {
//   Home,
//   FileText,
//   Calendar,
//   CheckCircle,
//   Globe,
//   Settings,
//   HelpCircle,
// } from "lucide-react";

// // Sidebar Component
//  const Sidebar = ({ activeMenu, setActiveMenu }) => {
//   const mainMenu = [
//     { id: "dashboard", label: "Dashboard", icon: Home },
//     { id: "dataentry", label: "Data Entry", icon: FileText },
//     { id: "timetable", label: "Time Table", icon: Calendar },
//   ];



//   const renderItem = (item) => {
//     const Icon = item.icon;
//     const isActive = activeMenu === item.id;

//     return (
//       <button
//         key={item.id}
//         onClick={() => setActiveMenu(item.id)}
//         className={`relative w-full flex items-center gap-3 px-4 py-1.5 rounded-xl mb-2 text-sm transition-all ${
//           isActive
//             ? "text-white shadow-[0_8px_18px_rgba(15,23,42,0.35)]"
//             : "text-white/80 hover:bg-white/10"
//         }`}
//         style={
//           isActive
//             ? {
//                 background:
//                   "linear-gradient(270deg, #413E7D 0%, #7670E3 100%)",
//                 border: "1px solid",
//                 borderImageSource:
//                   "linear-gradient(90deg, #7EECFF 0%, rgba(92, 117, 144, 0) 100%)",
//                 borderImageSlice: 1,
//               }
//             : {}
//         }
//       >
//         {isActive && (
//           <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-[#413E7D]" />
//         )}
//         <Icon size={18} />
//         <span className="font-medium">{item.label}</span>
//       </button>
//     );
//   };

//   return (
//     <aside className="w-64 h-[calc(100vh-3rem)] mt-2 mb-6 ml-4 rounded-[10px] bg-gradient-to-b from-[#0F809C] via-[#167291] to-[#174264] shadow-[0_10px_30px_rgba(0,0,0,0.20)] flex flex-col justify-between px-4 pt-5 pb-4">
//       <div>
//         <div className="text-2xl font-bold text-white mb-8 text-center">
//           Ezey
//         </div>

//         <div className="text-[11px] uppercase tracking-[0.18em] text-white/65 mb-3 ml-1">
//           Menu
//         </div>

//         {mainMenu.map(renderItem)}

       
//       </div>

//       <div className="pt-4 border-t border-white/70">
//         <div className="flex items-center gap-3 pt-1">
//           <div className="w-11 h-11 rounded-full overflow-hidden border border-white/90 bg-gray-300">
//             <div className="w-full h-full flex items-center justify-center text-white text-lg">
//               D
//             </div>
//           </div>
//           <div>
//             <div className="text-sm font-semibold text-white">
//               Divyansh Pandey
//             </div>
//             <div className="text-[11px] text-white/100">
//               pandeydivyansh5748@gmail.com
//             </div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

