import React from "react";

export default function Filters() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {["Course", "Department", "Semester", "Section"].map((label) => (
        <div key={label}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Default</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      ))}
    </div>
  );
}
