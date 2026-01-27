







import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { dashboardSummaryAPI } from "../../api/api"; // ✅ path adjust karo

const FacultyStatus = () => {
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await dashboardSummaryAPI();
        setFaculty(res?.data?.facultyList || []);
      } catch (error) {
        console.error("Failed to fetch faculty list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div
      className="bg-white rounded-[10px] border border-[#CACACA] shadow w-[340px] max-w-full h-[391px] "
      style={{
        width: "340px",
        height: "391px",
        borderRadius: "10px",
        borderWidth: "1px",
        opacity: 1,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E5E7EB]">
        <h3
          className="text-[14px] font-semibold text-[#265768]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Faculty
        </h3>
        <User size={16} className="text-[#94A3B8]" />
      </div>

      {/* Faculty List Container */}
      <div
        className="rounded-[10px] border border-[#E5E7EB] custom-scroll mx-2 my-2  h-[318px]"
        style={{
          width: "320px",
          height: "318px",
          margin: "10px",
          borderRadius: "10px",
          borderWidth: "1px",
          opacity: 1,
          overflowY: "auto", // ✅ list zyada ho sakti hai, scroll add
        }}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center text-[#265768] text-[12px] font-semibold">
            Loading...
          </div>
        ) : faculty.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#9CA3AF] text-[12px]">
            No faculty found
          </div>
        ) : (
          faculty.map((member, index) => (
            <div
              key={member?._id || index}
              className="relative flex items-center border-b border-[#F3F4F6] last:border-b-0 group hover:bg-[#F9FAFB] transition-colors cursor-pointer"
              style={{ height: "53px" }}
            >
              {/* Hover Line - Left Side */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-[#413E7D] opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full"
                style={{ width: "4px" }}
              />

              {/* Profile Image (Fallback Avatar) */}
              <div
                className="rounded-full overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB] absolute flex items-center justify-center"
                style={{
                  width: "40px",
                  height: "40px",
                  top: "8px",
                  left: "16px",
                  borderRadius: "57.86px",
                  opacity: 1,
                }}
              >
                {/* ✅ backend me avatar nahi aata, to placeholder initials */}
                <span className="text-[12px] font-bold text-[#265768]">
                  {member?.name?.charAt(0)?.toUpperCase() || "F"}
                </span>
              </div>

              {/* Name */}
              <div
                className="text-[#6B7280] absolute overflow-hidden text-ellipsis whitespace-nowrap"
                style={{
                  width: "240px",
                  height: "18px",
                  top: "19px",
                  left: "64px",
                  fontFamily: "Mulish, sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  opacity: 1,
                }}
              >
                {member?.name || "Unnamed Faculty"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Classroom / Faculty jaisi scrollbar style */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 9.78px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 44.02px;
          border: 1.22px solid #E5E5E5;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
          border-radius: 4.89px;
          width: 12.23px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
        }
      `}</style>
    </div>
  );
};

export default FacultyStatus;






