import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function ClassroomData({ searchQuery = "" }) {
  const facultyList = [
    {
      name: "Dr Rakesh Kumar Yadav",
      email: "rakeshkumar675@gmail.com",
      maxLoad: "5 Hrs",
      leaves: 5,
    },
    {
      name: "Dr Shweta Vikram",
      email: "shweta69@gmail.com",
      maxLoad: "3 Hrs",
      leaves: 3,
    },
    {
      name: "Mrs Pooja Shukla",
      email: "poojasunshore@gmail.com",
      maxLoad: "2 Hrs",
      leaves: 2,
    },
    {
      name: "Mr Sanjeev Kumar",
      email: "sanjeev65@gmail.com",
      maxLoad: "5 Hrs",
      leaves: 5,
    },
    {
      name: "Dr kalayan Acharya",
      email: "kalayan977@gmail.com",
      maxLoad: "2 Hrs",
      leaves: 2,
    },
  ];

  const query = searchQuery.toLowerCase();
  const filtered = facultyList.filter((f) =>
    `${f.name} ${f.email}`.toLowerCase().includes(query)
  );

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
      style={{ maxWidth: "1068px", height: "293px" }}
    >
      {/* Header row */}
      <div className="flex items-center px-8 py-3 text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF]">
        <div className="flex-[1.7]">Faculty Name</div>
        <div className="flex-[1.7]">Email</div>
        <div className="flex-[0.8] text-center">Max load per day</div>
        <div className="flex-[0.8] text-center">Leaves per month</div>
        <div className="flex-[1] text-center">Assigned Subjects</div>
        <div className="w-20 text-center">Actions</div>
      </div>

      {/* Body rows */}
      <div
        className="overflow-y-auto custom-scroll"
        style={{ height: "calc(293px - 56px)" }}
      >
        {filtered.map((f, idx) => (
          <div
            key={idx}
            className={`flex items-center px-8 py-3 text-sm border-b border-[#ECF0F4] ${
              idx === filtered.length - 1 ? "border-b-0" : ""
            } hover:bg-[#F7FAFF] transition`}
          >
            {/* Faculty Name */}
            <div className="flex-[1.7] text-[#4C5968]">{f.name}</div>

            {/* Email */}
            <div className="flex-[1.7] text-[13px] text-[#8C96A3]">{f.email}</div>

            {/* Max load */}
            <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
              {f.maxLoad}
            </div>

            {/* Leaves */}
            <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
              {f.leaves}
            </div>

            {/* Assigned Subjects */}
            <div className="flex-[1] text-center">
              <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
                See List
              </button>
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

      {/* Scrollbar */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #B7DFFF;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #1DA5FF;
        }
      `}</style>
    </div>
  );
}
