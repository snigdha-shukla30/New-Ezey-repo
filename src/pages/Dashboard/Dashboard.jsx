







import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/ui/Sidebar";
import Header from "../../Components/ui/Header";
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
    // <div className="min-h-screen h-screen bg-[#FFFFFF] flex px-2 py-4 gap-4 overflow-hidden" style={{ fontFamily: 'Mulish, sans-serif' }}>
    <div className="h-screen bg-[#FFFFFF] flex px-2 pt-4 gap-4 overflow-hidden" style={{ fontFamily: 'Mulish, sans-serif' }}>

      <div className="shrink-0">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>

      <div className="flex-1 flex pt-2 overflow-y-auto">
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


                </section>

                <section className="flex items-start justify-end gap-6 mb-15">
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

                <section className="flex items-start gap-15 mt-[-315px] mb-0.1">
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




