// src/components/DataEntry/ConstraintsList.jsx
import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function ConstraintsList() {
  const [constraints, setConstraints] = useState([
    {
      id: 1,
      text: "No faculty member should be scheduled to teach two different batches at the same time on the same day.",
      active: false,
    },
    {
      id: 2,
      text: "A faculty member may teach a maximum of three consecutive periods.",
      active: true,
    },
    {
      id: 3,
      text: "Each theory subject must be allocated only one session per day to ensure proper distribution and avoid repetition.",
      active: true,
    },
    {
      id: 4,
      text: "Subjects requiring laboratory/practical sessions must be assigned four dedicated lab periods per week.",
      active: false,
    },
    {
      id: 5,
      text: "A class can only be scheduled in a room that matches its requirement (e.g., lab subjects in labs, theory in standard classrooms).",
      active: true,
    },
  ]);

  const toggleConstraint = (id) => {
    setConstraints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, active: !c.active } : c
      )
    );
  };

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
      style={{ maxWidth: "1068px", height: "293px" }}
    >
      {/* Header */}
      <div className="flex items-center border-b border-[#DFDFDF] px-6 pt-1 pb-2">
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700">
            Constraints
          </span>
        </div>
        <div className="w-24 text-center">
          <span className="text-sm font-medium text-gray-700">
            Actions
          </span>
        </div>
      </div>

      {/* List */}
      <div
        className="overflow-y-auto"
        style={{ height: "calc(293px - 48px)" }}
      >
        {constraints.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 px-6 py-3 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="flex-1 text-sm text-gray-700 leading-relaxed">
              {item.text}
            </div>
            <div className="w-24 flex items-center justify-center pt-1">
              <button
                onClick={() => toggleConstraint(item.id)}
                className="text-gray-400 hover:text-blue-600 transition"
              >
                {item.active ? (
                  <CheckCircle2 size={20} className="stroke-[2.2]" />
                ) : (
                  <Circle size={20} className="stroke-[1.8]" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}