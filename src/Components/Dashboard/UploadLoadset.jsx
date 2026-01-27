
import React from "react";
import { useNavigate } from "react-router-dom";

const UploadLoadset = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-[335px] h-[259px] bg-white rounded-[10px] border border-[#CACACA] p-6 flex flex-col"
      style={{
        boxShadow: "0px 4px 50px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Heading */}
      <h3 className="text-[16px] font-semibold text-[#265768] text-center mb-1">
        Quick Actions <span className="text-[15px]" style={{ filter: 'hue-rotate(180deg) saturate(0.2)' }}>⚡</span>
      </h3>

      {/* Line under Quick Actions (figma style) */}
      <div className="w-full h-[3px] bg-[#D9D9D9] mt-2 mb-4" />

      {/* 3 Buttons – centered, vertical */}
      <div className="flex-1 flex flex-col items-center justify-center gap-7">
        <button onClick={() => navigate("/generate")}

          className="w-[230px] h-[40px] text-[13px] font-medium text-[#4B8FA8] bg-white border border-[#B4D4DF] rounded-[10px] shadow-[0px_4px_20px_rgba(148,163,184,0.15)] hover:text-white transition-all group"
          style={{
            background: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(270deg, #265768 0%, #4BACCE 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          Generate Timetable
        </button>

        {/* <button
          onClick={handleViewTimetable}
          className="w-[230px] h-[40px] text-[13px] font-medium text-[#4B8FA8] bg-white border border-[#B4D4DF] rounded-[10px] shadow-[0px_4px_20px_rgba(148,163,184,0.15)] hover:text-white transition-all group"
          style={{
            background: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(270deg, #265768 0%, #4BACCE 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          View Timetable
        </button> */}

        <button
          onClick={() => navigate("/dashboard")}
          className="w-[230px] h-[40px] text-[13px] font-medium text-[#4B8FA8] bg-white border border-[#B4D4DF] rounded-[10px] shadow-[0px_4px_20px_rgba(148,163,184,0.15)] hover:text-white transition-all group"
          style={{
            background: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(270deg, #265768 0%, #4BACCE 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          Manage Data
        </button>
      </div>
    </div>
  );
};

export default UploadLoadset;