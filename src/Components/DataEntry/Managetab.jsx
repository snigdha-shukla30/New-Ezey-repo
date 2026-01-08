// src/components/DataEntry/ManageTab.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";

export default function ManageTab({ searchQuery, setSearchQuery }) {
  const [activeTab, setActiveTab] = useState("Classroom");
  const tabs = ["Classroom", "Batches", "Subjects", "Faculty", "Constraints"];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1068px]">

        {/* Tabs */}
        <div className="flex items-center gap-10 border-b border-[#E5E7EB] mb-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-medium relative transition-colors ${
                activeTab === tab ? "text-[#265768]" : "text-[#9CA3AF] hover:text-[#265768]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#265768]" />
              )}
            </button>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex items-center justify-between gap-4 mb-6">
       <div className="flex-1 max-w-[400px]">
        <div className="relative bg-[#F7FAFD] border border-[#BFBFBF] rounded-[16px] px-4 py-2.5">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5B6]"
          />
          <input
            type="text"
            placeholder="Search time table"
            value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-7 pr-3 text-sm text-[#374151] placeholder:text-[#9AA5B6] focus:outline-none"
          />
        </div>
      </div>






          <button
            className="h-[40px] px-5 text-sm font-semibold text-white rounded-[6px] flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg, #265768 0%, #4BACCE 100%)" }}
          >
            <span className="text-lg leading-none">+</span>
            Add Classroom
          </button>
        </div>
      </div>
    </div>
  );
}