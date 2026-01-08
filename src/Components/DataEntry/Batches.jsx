import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function Batches({ searchQuery }) {
  const batches = [
    { course: "B.Tech", batchCode: "CSE01", department: "CSE", capacity: 56, semester: "1", section: "A", subjects: "See List" },
    { course: "BCA", batchCode: "CSE07", department: "CSE", capacity: 42, semester: "5", section: "B", subjects: "See List" },
    { course: "B.Com", batchCode: "ACC25", department: "Accounting", capacity: 74, semester: "3", section: "C", subjects: "See List" },
    { course: "MCA", batchCode: "EE45", department: "EE", capacity: 62, semester: "2", section: "A", subjects: "See List" },
    { course: "B.Tech", batchCode: "ME40", department: "ME", capacity: 38, semester: "4", section: "A", subjects: "See List" },
  ];

  const q = (searchQuery || "").toLowerCase();
  const filtered = batches.filter((b) =>
    b.course.toLowerCase().includes(q) ||
    b.batchCode.toLowerCase().includes(q) ||
    b.department.toLowerCase().includes(q)
  );

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
      style={{ maxWidth: "1068px" }}
    >
      {/* Header row (exact figma) */}
      <div className="flex items-center border-b border-[#DFDFDF] px-6 py-3 bg-gray-50">
        <div className="w-[140px]"><span className="text-sm font-medium text-gray-700">Degree / Course</span></div>
        <div className="w-[120px]"><span className="text-sm font-medium text-gray-700">Batch code</span></div>
        <div className="w-[160px]"><span className="text-sm font-medium text-gray-700">Department</span></div>
        <div className="w-[90px]"><span className="text-sm font-medium text-gray-700">Capacity</span></div>
        <div className="w-[90px]"><span className="text-sm font-medium text-gray-700">Semester</span></div>
        <div className="w-[90px]"><span className="text-sm font-medium text-gray-700">Section</span></div>
        <div className="flex-1"><span className="text-sm font-medium text-gray-700">Assigned Subjects</span></div>
        <div className="w-[100px] text-center"><span className="text-sm font-medium text-gray-700">Actions</span></div>
      </div>

      {/* Data rows */}
      <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="w-[140px] text-sm font-medium text-gray-900">{item.course}</div>
            <div className="w-[120px] text-sm text-gray-900">{item.batchCode}</div>
            <div className="w-[160px] text-sm text-gray-900 truncate">{item.department}</div>
            <div className="w-[90px] text-sm text-gray-900">{item.capacity}</div>
            <div className="w-[90px] text-sm text-gray-900">{item.semester}</div>
            <div className="w-[90px] text-sm text-gray-900">{item.section}</div>

            {/* Subjects – figma clickable */}
            <div className="flex-1 text-sm text-[#2563EB] cursor-pointer hover:underline">
              {item.subjects}
            </div>

            {/* Actions icons – same as figma */}
            <div className="w-[100px] flex items-center justify-center gap-3">
              <button className="text-gray-400 hover:text-blue-600 transition"><Edit2 size={17} /></button>
              <button className="text-gray-400 hover:text-red-600 transition"><Trash2 size={17} /></button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-6 py-6 text-sm text-gray-500">No results found.</div>
        )}
      </div>
    </div>
  );
}