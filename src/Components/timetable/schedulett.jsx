import React from "react";
import { Calendar } from "lucide-react";

export default function ScheduleTable() {
  const modes = ["Balanced", "Room Optimized", "Faculty Efficient"];

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-teal-700">Scheduling Modes</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-teal-700">Preview</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {modes.map((mode) => (
            <tr key={mode} className="border-b hover:bg-gray-50">
              <td className="py-4 px-4 text-sm font-medium text-gray-700">{mode}</td>

              <td className="text-center py-4">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Calendar size={18} className="text-gray-400 mx-auto" />
                </button>
              </td>

              <td className="text-right py-4 px-4">
                <div className="flex justify-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  </button>

                  <button className="p-2 hover:bg-red-50 rounded">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4h-6v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
