






import React, { useEffect, useState } from "react";
import { Users, School, Calendar, BarChart2 } from "lucide-react";
import { dashboardSummaryAPI } from "../../api/api"; // ✅ path apne project ke hisaab se adjust karna

const QuickReport = () => {
  const [loading, setLoading] = useState(true);
  const [quickReport, setQuickReport] = useState({
    facultyUtilization: 0,
    classroomUtilization: 0,
    blankPeriods: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await dashboardSummaryAPI();
        setQuickReport(res?.data?.quickReport || {});
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const reports = [
    {
      label: "Faculty\nUtilization",
      value: `${quickReport.facultyUtilization ?? 0}%`,
      Icon: Users,
    },
    {
      label: "Classroom\nUtilization",
      value: `${quickReport.classroomUtilization ?? 0}%`,
      Icon: School,
    },
    {
      label: "Blank\nPeriods",
      value: `${quickReport.blankPeriods ?? 0}%`,
      Icon: Calendar,
    },
  ];

  return (
    <div
      className="w-[335px] h-[259px] bg-white rounded-[10px] border border-[#CACACA] p-6 flex flex-col"
      style={{ boxShadow: "0px 4px 50px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <h3 className="text-[16px] font-semibold text-[#265768] text-center">
          Quick Report
        </h3>
        <BarChart2 className="w-4 h-4 text-[#265768]" />
      </div>

      {/* Divider line */}
      <div className="w-full h-[3px] bg-[#D9D9D9] mb-5" />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[#265768]">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 flex-1">
          {reports.map((item, idx) => {
            const Icon = item.Icon;
            const percentage = parseInt(item.value) || 0;

            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center group"
              >
                {/* Semi-circle with percentage */}
                <div className="relative w-[80px] h-[45px] mb-2">
                  {/* Background faded semi-circle */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M 10 45 A 40 40 0 0 1 90 45"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Foreground blue semi-circle */}
                  <svg
                    className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:opacity-80"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M 10 45 A 40 40 0 0 1 90 45"
                      fill="none"
                      stroke="#4BACCE"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(percentage / 100) * 125.66} 125.66`}
                    />
                  </svg>

                  {/* Percentage text */}
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span
                      className="text-[12px] font-semibold text-[#265768]"
                      style={{
                        fontFamily: "Mulish, sans-serif",
                        lineHeight: "150%",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>

                <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-6 h-6 text-[#4A90E2]" strokeWidth={1.5} />
                </div>

                <div className="text-[14px] text-[#265768] leading-tight whitespace-pre-line font-normal">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuickReport;













