import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Dashboard/Sidebar";
import Header from "../../Components/Dashboard/Header";
import StatsCard from "../../Components/Dashboard/StatsCard";
import QuickReport from "../../Components/Dashboard/QuickReport";
import UploadLoadset from "../../Components/Dashboard/UploadLoadset";
import FacultyStatus from "../../Components/Dashboard/FacultyStatus";
import { dashboardSummaryAPI } from "../../api/api";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardSummaryAPI();
        setDashboardData(res.data ?? res);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = dashboardData
    ? [
        {
          label: "Classroom",
          count: dashboardData.totalClassrooms,
          imageUrl:
            "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
        },
        {
          label: "Subjects",
          count: dashboardData.totalSubjects,
          imageUrl:
            "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
        },
        {
          label: "Faculty",
          count: dashboardData.totalFaculties,
          imageUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        },
        {
          label: "Time Tables",
          count: dashboardData.totalApprovedTimetables,
          imageUrl:
            "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
        },
      ]
    : [
        
      ];

  return (
    <div className="min-h-screen h-screen bg-[#FFFFFF] flex px-4 py-4 gap-4 overflow-hidden" style={{ fontFamily: 'Mulish, sans-serif' }}>
      <div className="shrink-0">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>

      <div className="flex-1 flex justify-center pt-2 overflow-y-auto">
        <div className="w-full max-w-[1170px] space-y-2">
          <div className="w-full bg-white border border-[#BFBFBF] rounded-[10px] px-6 py-3 shadow-[0_4px_14px_rgba(148,163,184,0.18)] flex items-center gap-6">
            <Header />
          </div>

          <div className="w-full bg-white rounded-[10px] border border-[#BFBFBF] shadow-[0_16px_40px_rgba(148,163,184,0.22)] px-8 pt-6 pb-11">
            {loading && <p className="text-center mt-10">Loading dashboard...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && (
              <>
                <section className="mb-6 flex items-start justify-between gap-8">
                  <div>
                    <h1 className="text-[32px] leading-tight font-bold text-[#265768] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Welcome back, Divyansh!
                    </h1>
                    <p className="text-sm text-[#265768] max-w-3xl" style={{ fontFamily: 'Mulish, sans-serif' }}>
                      Your smart scheduling workspace is ready. Seamlessly manage
                      departments, teachers, subjects, and classroom availability.
                    </p>
                  </div>

                  <div className="text-right">
                    <div 
                      className="text-[16px] font-semibold mb-1"
                      style={{ color: '#265768', fontFamily: 'Playfair Display, serif' }}
                    >
                      ERP Last Sync:
                    </div>
                    <div className="text-[12px] text-[#9CA3AF] mb-2" style={{ fontFamily: 'Mulish, sans-serif' }}>
                      Last synced at 12:40 PM
                    </div>
                    <button 
                      className="w-[60px] h-5 text-[11px] font-medium text-white rounded-[3.21px] flex items-center justify-center hover:opacity-90 transition-opacity ml-auto"
                      style={{
                        background: 'linear-gradient(0deg, #265768 0%, #4BACCE 100%)',
                        fontFamily: 'Mulish, sans-serif'
                      }}
                    >
                      Sync
                    </button>
                  </div>
                </section>

                <section className="flex items-start justify-end gap-6 mb-10">
                  <div className="flex gap-5">
                    {stats.map((item, index) => (
                      <StatsCard key={index} {...item} />
                    ))}
                  </div>
                  
                  <FacultyStatus 
                    facultyList={dashboardData?.facultyList}
                    totalFaculties={dashboardData?.totalFaculties}
                  />
                </section>

                <section className="flex items-start gap-15 mt-[-300px] mb-0.1">
                  <QuickReport quickReport={dashboardData?.quickReport} />
                  <UploadLoadset />
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;







// import React, { useEffect, useState } from "react";
// import Sidebar from "../../Components/Dashboard/Sidebar";
// import Header from "../../Components/Dashboard/Header";
// import StatsCard from "../../Components/Dashboard/StatsCard";
// import QuickReport from "../../Components/Dashboard/QuickReport";
// import UploadLoadset from "../../Components/Dashboard/UploadLoadset";
// import FacultyStatus from "../../Components/Dashboard/FacultyStatus";
// import { dashboardSummaryAPI } from "../../api/api";

// const Dashboard = () => {
//   const [activeMenu, setActiveMenu] = useState("dashboard");
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const res = await dashboardSummaryAPI();
//         setDashboardData(res.data ?? res);
//       } catch (err) {
//         setError(err.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const stats = dashboardData
//     ? [
//         {
//           label: "Classroom",
//           count: dashboardData.totalClassrooms,
//           imageUrl:
//             "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Subjects",
//           count: dashboardData.totalSubjects,
//           imageUrl:
//             "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Faculty",
//           count: dashboardData.totalFaculties,
//           imageUrl:
//             "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Time Tables",
//           count: dashboardData.totalApprovedTimetables,
//           imageUrl:
//             "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
//         },
//       ]
//     : [
//         {
//           label: "Classroom",
//           count: 45,
//           imageUrl:
//             "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Subjects",
//           count: 78,
//           imageUrl:
//             "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Faculty",
//           count: 34,
//           imageUrl:
//             "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Time Tables",
//           count: 8,
//           imageUrl:
//             "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
//         },
//       ];

//   return (
//     <div className="min-h-screen h-screen bg-[#FFFFFF] flex px-4 py-4 gap-4 overflow-hidden" style={{ fontFamily: 'Mulish, sans-serif' }}>
//       <div className="shrink-0">
//         <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
//       </div>

//       <div className="flex-1 flex justify-center pt-2 overflow-y-auto">
//         <div className="w-full max-w-[1170px] space-y-2">
//           <div className="w-full bg-white border border-[#BFBFBF] rounded-[10px] px-6 py-3 shadow-[0_4px_14px_rgba(148,163,184,0.18)] flex items-center gap-6">
//             <Header />
//           </div>

//           <div className="w-full bg-white rounded-[10px] border border-[#BFBFBF] shadow-[0_16px_40px_rgba(148,163,184,0.22)] px-8 pt-6 pb-11">
//             {loading && <p className="text-center mt-10">Loading dashboard...</p>}
//             {error && <p className="text-center text-red-500">{error}</p>}

//             {!loading && (
//               <>
//                 <section className="mb-6 flex items-start justify-between gap-8">
//                   <div>
//                     <h1 className="text-[32px] leading-tight font-bold text-[#265768] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
//                       Welcome back, Divyansh!
//                     </h1>
//                     <p className="text-sm text-[#265768] max-w-3xl" style={{ fontFamily: 'Mulish, sans-serif' }}>
//                       Your smart scheduling workspace is ready. Seamlessly manage
//                       departments, teachers, subjects, and classroom availability.
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <div 
//                       className="text-[16px] font-semibold mb-1"
//                       style={{ color: '#265768', fontFamily: 'Playfair Display, serif' }}
//                     >
//                       ERP Last Sync:
//                     </div>
//                     <div className="text-[12px] text-[#9CA3AF] mb-2" style={{ fontFamily: 'Mulish, sans-serif' }}>
//                       Last synced at 12:40 PM
//                     </div>
//                     <button 
//                       className="w-[60px] h-5 text-[11px] font-medium text-white rounded-[3.21px] flex items-center justify-center hover:opacity-90 transition-opacity ml-auto"
//                       style={{
//                         background: 'linear-gradient(0deg, #265768 0%, #4BACCE 100%)',
//                         fontFamily: 'Mulish, sans-serif'
//                       }}
//                     >
//                       Sync
//                     </button>
//                   </div>
//                 </section>

//                 <section className="flex items-start justify-end gap-6 mb-10">
//                   <div className="flex gap-5">
//                     {stats.map((item, index) => (
//                       <StatsCard key={index} {...item} />
//                     ))}
//                   </div>
                  
//                   <FacultyStatus 
//                     facultyList={dashboardData?.facultyList}
//                     totalFaculties={dashboardData?.totalFaculties}
//                   />
//                 </section>

//                 <section className="flex items-start gap-15 mt-[-300px] mb-0.1">
//                   <QuickReport quickReport={dashboardData?.quickReport} />
//                   <UploadLoadset />
//                 </section>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;







// import React, { useEffect, useState } from "react";
// import Sidebar from "../../Components/ui/Sidebar";
// import Header from "../../Components/ui/Header";
// import StatsCard from "../../Components/Dashboard/StatsCard";
// import QuickReport from "../../Components/Dashboard/QuickReport";
// import UploadLoadset from "../../Components/Dashboard/UploadLoadset";
// import FacultyStatus from "../../Components/Dashboard/FacultyStatus";
// import { dashboardSummaryAPI } from "../../api/api";


// const Dashboard = () => {
//   const [activeMenu, setActiveMenu] = useState("dashboard");
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   console.log("Dashboard Data:", dashboardData);

//   useEffect(() => {
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       const res = await dashboardSummaryAPI();

//       setDashboardData(res.data ?? res);

//     } catch (err) {

//       setError(err.message || "Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchDashboardData();
// }, []);




//   const stats = dashboardData
//     ? [
//         {
//           label: "Classroom",
//           count: dashboardData.totalClassrooms,
//           imageUrl:
//             "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Subjects",
//           count: dashboardData.totalSubjects,
//           imageUrl:
//             "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Faculty",
//           count: dashboardData.totalFaculties,
//           imageUrl:
//             "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
//         },
//         {
//           label: "Time Tables",
//           count: dashboardData.totalApprovedTimetables,
//           imageUrl:
//             "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
//         },
//       ]
//     : [];

//   return (
//     <div className="min-h-screen h-screen bg-[#FFFFFF] flex px-4 py-4 gap-4 overflow-hidden">
//       <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

//       <div className="flex-1 overflow-y-auto">
//         <Header />

//         {loading && <p className="text-center mt-10">Loading dashboard...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {!loading && dashboardData && (
//           <>
//             <div className="flex gap-5 mt-6">
//               {stats.map((item, index) => (
//                 <StatsCard key={index} {...item} />
//               ))}
//             </div>

//             <div className="flex gap-6 mt-10">
//               <FacultyStatus
//                 facultyList={dashboardData.facultyList}
//                 totalFaculties={dashboardData.totalFaculties}
//               />
//             </div>

//             <div className="flex gap-6 mt-10">
//               <QuickReport quickReport={dashboardData.quickReport} />
//               <UploadLoadset />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

