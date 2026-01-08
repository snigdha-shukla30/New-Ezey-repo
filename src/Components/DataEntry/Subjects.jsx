// src/components/DataEntry/Subjects.jsx
import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function Subjects({ searchQuery = "" }) {
  const subjects = [
    {
      name: "DAA",
      code: "CS201",
      department: "CSE",
      type: "Theory",
      hoursPerWeek: 1,
    },
    {
      name: "Software engineering",
      code: "EC204",
      department: "CSE",
      type: "Theory",
      hoursPerWeek: 2,
    },
    {
      name: "Business Management",
      code: "CS201L",
      department: "CSE",
      type: "Theory",
      hoursPerWeek: 1,
    },
    {
      name: "DSA",
      code: "ME102",
      department: "CSE",
      type: "Theory",
      hoursPerWeek: 4,
    },
    {
      name: "Computer Networks",
      code: "MA201",
      department: "CSE",
      type: "Theory",
      hoursPerWeek: 2,
    },
  ];

  const query = searchQuery.toLowerCase();
  const filtered = subjects.filter((sub) =>
    `${sub.name} ${sub.code} ${sub.department} ${sub.type} ${sub.hoursPerWeek}`
      .toLowerCase()
      .includes(query)
  );

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
      style={{ maxWidth: "1068px", height: "293px" }}
    >
      {/* Header row */}
      <div className="flex items-center px-8 py-3 text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF]">
        <div className="flex-[1.6]">Subject Name</div>
        <div className="flex-[1.1]">Subject Code</div>
        <div className="flex-[1.1]">Department</div>
        <div className="flex-[1.1]">Type</div>
        <div className="flex-[0.9] text-center">Hrs/Week</div>
        <div className="w-20 text-center">Actions</div>
      </div>

      {/* Body rows */}
      <div className="overflow-y-auto" style={{ height: "calc(293px - 56px)" }}>
        {filtered.map((sub, idx) => (
          <div
            key={idx}
            className={`flex items-center px-8 py-3 text-sm border-b border-[#ECF0F4] ${
              idx === filtered.length - 1 ? "border-b-0" : ""
            } hover:bg-[#F7FAFF] transition`}
          >
            {/* Subject Name */}
            <div className="flex-[1.6] text-[#4C5968] leading-snug">
              {sub.name}
            </div>

            {/* Subject Code */}
            <div className="flex-[1.1]">
              <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
                {sub.code}
              </button>
            </div>

            {/* Department */}
            <div className="flex-[1.1] text-[#8A96A8]">{sub.department}</div>

            {/* Type */}
            <div className="flex-[1.1] text-[#8A96A8]">{sub.type}</div>

            {/* Hrs/Week */}
            <div className="flex-[0.9] text-center text-[#8A96A8]">
              {sub.hoursPerWeek}
            </div>

            {/* Actions */}
            <div className="w-20 flex items-center justify-center gap-3">
              <button className="text-[#C0C6D0] hover:text-[#1A8FE3]">
                <Edit2 size={15} />
              </button>
              <button className="text-[#C0C6D0] hover:text-[#F04438]">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
