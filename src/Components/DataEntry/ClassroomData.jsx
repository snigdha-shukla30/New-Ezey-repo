// src/components/DataEntry/ClassroomData.jsx
import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function ClassroomData({ searchQuery }) {
  const classrooms = [
    { number: "B-201", type: "Lecture Hall", capacity: 60 },
    { number: "B-202", type: "Lecture Hall", capacity: 60 },
    { number: "B-203", type: "Computer Lab", capacity: 40 },
    { number: "B-204", type: "Lecture Hall", capacity: 70 },
    { number: "B-205", type: "Lecture Hall", capacity: 65 },
  ];

  const filtered = classrooms.filter((c) =>
    c.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
      style={{ maxWidth: "1068px", height: "293px" }}
    >
      {/* Column headers */}
      <div className="flex items-center border-b border-[#DFDFDF] px-6 pt-1 pb-2">
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700">Classroom number</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-gray-700">Classroom type</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-gray-700">Capacity</span>
        </div>
        <div className="w-32 text-center">
          <span className="text-sm font-medium text-gray-700">Action</span>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto" style={{ height: "calc(293px - 48px)" }}>
        {filtered.map((room, idx) => (
          <div
            key={idx}
            className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="flex-1 text-sm text-gray-600">{room.number}</div>
            <div className="flex-1 text-center text-sm text-gray-400">{room.type}</div>
            <div className="flex-1 text-center text-sm text-gray-600">{room.capacity}</div>

            {/* Action buttons */}
            <div className="w-32 flex items-center justify-center gap-4">
              <button className="text-gray-400 hover:text-blue-600">
                <Edit2 size={15} />
              </button>
              <button className="text-gray-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}