import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { getFaculties, updateFaculty, deleteFaculty } from "../../api/api";

export default function Faculty({ searchQuery = "", refreshTrigger = 0 }) {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchFaculties();
  }, [refreshTrigger]);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await getFaculties();
      if (response.success && response.data) {
        setFacultyList(response.data);
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
      alert("Failed to fetch faculties");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faculty) => {
    setEditingId(faculty._id);
    setEditData({
      ...faculty,
      subjects: faculty.subjects?.join(", ") || "",
    });
  };

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) {
      return;
    }

    try {
      const response = await deleteFaculty(facultyId);
      if (response.success) {
        alert("Faculty deleted successfully!");
        fetchFaculties();
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
      alert(error.message || "Failed to delete faculty");
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        maxLoad: Number.parseInt(editData.maxLoad),
        leavesPerMonth: Number.parseInt(editData.leavesPerMonth),
        subjects: editData.subjects
          ? editData.subjects.split(",").map((s) => s.trim())
          : [],
      };

      const response = await updateFaculty(editingId, updateData);
      if (response.success) {
        alert("Faculty updated successfully!");
        setFacultyList(
          facultyList.map((f) =>
            f._id === editingId
              ? { ...f, ...updateData, subjects: updateData.subjects }
              : f
          )
        );
        setEditingId(null);
        setEditData(null);
      }
    } catch (error) {
      console.error("Error updating faculty:", error);
      alert(error.message || "Failed to update faculty");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const query = searchQuery.toLowerCase();
  const filtered = facultyList.filter((f) =>
    `${f.name} ${f.email}`.toLowerCase().includes(query)
  );

  if (loading) {
    return (
      <div
        className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm flex items-center justify-center"
        style={{ maxWidth: "1068px", height: "293px" }}
      >
        <p className="text-[#6C7A90]">Loading faculties...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
      style={{ maxWidth: "1068px", minHeight: "293px" }}
    >
      {/* Header row (exact ClassroomData style) */}
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
        style={{ maxHeight: "calc(293px - 56px)" }}
      >
        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-[#8A96A8]">
            No faculties found
          </div>
        ) : (
          filtered.map((f, idx) => (
            <div
              key={f._id}
              className={`flex items-center px-8 py-3 text-sm border-b border-[#ECF0F4] ${
                idx === filtered.length - 1 ? "border-b-0" : ""
              } hover:bg-[#F7FAFF] transition`}
            >
              {editingId === f._id ? (
                <>
                  {/* Edit Mode - Faculty Name (Read-only) */}
                  <div className="flex-[1.7] text-[#4C5968] leading-snug">
                    {f.name}
                  </div>

                  {/* Edit Mode - Email (Read-only) */}
                  <div className="flex-[1.7] text-[13px] text-[#8C96A3] leading-snug">
                    {f.email}
                  </div>

                  {/* Edit Mode - Max Load */}
                  <div className="flex-[0.8] text-center">
                    <input
                      type="number"
                      value={editData.maxLoad}
                      onChange={(e) =>
                        setEditData({ ...editData, maxLoad: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                    />
                  </div>

                  {/* Edit Mode - Leaves */}
                  <div className="flex-[0.8] text-center">
                    <input
                      type="number"
                      value={editData.leavesPerMonth}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          leavesPerMonth: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                    />
                  </div>

                  {/* Edit Mode - Subjects */}
                  <div className="flex-[1] text-center">
                    <input
                      type="text"
                      value={editData.subjects}
                      onChange={(e) =>
                        setEditData({ ...editData, subjects: e.target.value })
                      }
                      placeholder="IDs, comma separated"
                      className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                    />
                  </div>

                  {/* Save / Cancel */}
                  <div className="w-20 flex items-center justify-center gap-2">
                    <button
                      onClick={handleUpdate}
                      className="text-[#1A8FE3] hover:text-[#0056b3] text-[12px] font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-[#8A96A8] hover:text-[#4C5968] text-[12px] font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode - Faculty Name */}
                  <div className="flex-[1.7] text-[#4C5968] leading-snug">
                    {f.name}
                  </div>

                  {/* View Mode - Email */}
                  <div className="flex-[1.7] text-[13px] text-[#8C96A3] leading-snug">
                    {f.email}
                  </div>

                  {/* View Mode - Max Load */}
                  <div className="flex-[0.8] text-center text-[13px] text-[#8C96A3]">
                    {f.maxLoad} Hrs
                  </div>

                  {/* View Mode - Leaves */}
                  <div className="flex-[0.8] text-center text-[13px] text-[#8C96A3]">
                    {f.leavesPerMonth}
                  </div>

                  {/* View Mode - Subjects */}
                  <div className="flex-[1] text-center">
                    <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
                      See List ({f.subjects?.length || 0})
                    </button>
                  </div>

                  {/* View Mode - Actions */}
                  <div className="w-20 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(f)}
                      className="text-[#C0C6D0] hover:text-[#1A8FE3]"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(f._id)}
                      className="text-[#C0C6D0] hover:text-[#F04438]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* scrollbar exact ClassroomData */}
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
}























// import React, { useState, useEffect } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import { getFaculties, updateFaculty, deleteFaculty } from "../../api/api";

// export default function Faculty({ searchQuery = "", refreshTrigger = 0 }) {
//   const [facultyList, setFacultyList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     fetchFaculties();
//   }, [refreshTrigger]);

//   const fetchFaculties = async () => {
//     try {
//       setLoading(true);
//       const response = await getFaculties();
//       if (response.success && response.data) {
//         setFacultyList(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching faculties:", error);
//       alert("Failed to fetch faculties");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (faculty) => {
//     setEditingId(faculty._id);
//     setEditData({
//       ...faculty,
//       subjects: faculty.subjects?.join(", ") || "",
//     });
//   };

//   const handleDelete = async (facultyId) => {
//     if (!window.confirm("Are you sure you want to delete this faculty?")) {
//       return;
//     }

//     try {
//       const response = await deleteFaculty(facultyId);
//       if (response.success) {
//         alert("Faculty deleted successfully!");
//         fetchFaculties();
//       }
//     } catch (error) {
//       console.error("Error deleting faculty:", error);
//       alert(error.message || "Failed to delete faculty");
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const updateData = {
//         maxLoad: Number.parseInt(editData.maxLoad),
//         leavesPerMonth: Number.parseInt(editData.leavesPerMonth),
//         subjects: editData.subjects
//           ? editData.subjects.split(",").map((s) => s.trim())
//           : [],
//       };

//       const response = await updateFaculty(editingId, updateData);
//       if (response.success) {
//         alert("Faculty updated successfully!");
//         setFacultyList(
//           facultyList.map((f) =>
//             f._id === editingId
//               ? { ...f, ...updateData, subjects: updateData.subjects }
//               : f
//           )
//         );
//         setEditingId(null);
//         setEditData(null);
//       }
//     } catch (error) {
//       console.error("Error updating faculty:", error);
//       alert(error.message || "Failed to update faculty");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditData(null);
//   };

//   const query = searchQuery.toLowerCase();
//   const filtered = facultyList.filter((f) =>
//     `${f.name} ${f.email}`.toLowerCase().includes(query)
//   );

//   if (loading) {
//     return (
//       <div
//         className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm flex items-center justify-center"
//         style={{ maxWidth: "1068px", height: "293px" }}
//       >
//         <p className="text-[#6C7A90]">Loading faculties...</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white rounded-[10px] border border-[#DFDFDF] w-full overflow-hidden"
//       style={{ maxWidth: "1068px", height: "420px" }}
//     >
//       {/* Header Row (Screenshot style) */}
//       <div className="relative bg-white px-8 pt-4">
//         <div className="flex items-center text-[13px] font-semibold text-[#265768]">
//           <div className="flex-[1.7] text-center">Faculty Name</div>
//           <div className="flex-[1.7] text-center">Email</div>
//           <div className="flex-[0.8] text-center">Max load per day</div>
//           <div className="flex-[0.8] text-center">Leaves per month</div>
//           <div className="flex-[1] text-center">Assigned Subjects</div>
//           <div className="w-20 text-center">Actions</div>
//         </div>

//         {/* Blue underline + shadow */}
//         <div className="mt-2 h-[2px] w-full bg-[#1DA5FF] shadow-[0_3px_10px_rgba(29,165,255,0.45)]" />
//       </div>

//       {/* Scrollable content */}
//       <div
//         className="overflow-y-auto custom-scroll"
//         style={{ height: "calc(420px - 56px)" }}
//       >
//         {filtered.length === 0 ? (
//           <div className="flex items-center justify-center h-full text-[#9CA3AF]">
//             No faculties found
//           </div>
//         ) : (
//           filtered.map((f, idx) => (
//             <div
//               key={f._id}
//               className={`flex items-center px-8 py-[18px] text-[13px] border-b border-[#E5E7EB] ${
//                 idx === filtered.length - 1 ? "border-b-0" : ""
//               } hover:bg-[#F7FAFF] transition`}
//             >
//               {editingId === f._id ? (
//                 <>
//                   {/* Edit Mode - Faculty Name (Read-only) */}
//                   <div className="flex-[1.7] text-center text-[#6C7A90] font-medium">
//                     {f.name}
//                   </div>

//                   {/* Edit Mode - Email (Read-only) */}
//                   <div className="flex-[1.7] text-center text-[13px] text-[#6C7A90]">
//                     {f.email}
//                   </div>

//                   {/* Edit Mode - Max Load */}
//                   <div className="flex-[0.8] text-center">
//                     <input
//                       type="number"
//                       value={editData.maxLoad}
//                       onChange={(e) =>
//                         setEditData({ ...editData, maxLoad: e.target.value })
//                       }
//                       className="w-[85%] mx-auto px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                     />
//                   </div>

//                   {/* Edit Mode - Leaves per Month */}
//                   <div className="flex-[0.8] text-center">
//                     <input
//                       type="number"
//                       value={editData.leavesPerMonth}
//                       onChange={(e) =>
//                         setEditData({
//                           ...editData,
//                           leavesPerMonth: e.target.value,
//                         })
//                       }
//                       className="w-[85%] mx-auto px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                     />
//                   </div>

//                   {/* Edit Mode - Subjects */}
//                   <div className="flex-[1] text-center">
//                     <input
//                       type="text"
//                       value={editData.subjects}
//                       onChange={(e) =>
//                         setEditData({ ...editData, subjects: e.target.value })
//                       }
//                       placeholder="IDs, comma separated"
//                       className="w-[95%] mx-auto px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                     />
//                   </div>

//                   {/* Edit Mode - Save/Cancel Buttons */}
//                   <div className="w-20 flex items-center justify-center gap-3">
//                     <button
//                       onClick={handleUpdate}
//                       className="text-[#1A8FE3] hover:text-[#0B6FBF] text-[12px] font-semibold"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       className="text-[#8A96A8] hover:text-[#4C5968] text-[12px] font-semibold"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* View Mode - Faculty Name */}
//                   <div className="flex-[1.7] text-center text-[#6C7A90] font-medium">
//                     {f.name}
//                   </div>

//                   {/* View Mode - Email */}
//                   <div className="flex-[1.7] text-center text-[13px] text-[#6C7A90]">
//                     {f.email}
//                   </div>

//                   {/* View Mode - Max Load */}
//                   <div className="flex-[0.8] text-center text-[13px] text-[#6C7A90]">
//                     {f.maxLoad} Hrs
//                   </div>

//                   {/* View Mode - Leaves per Month */}
//                   <div className="flex-[0.8] text-center text-[13px] text-[#6C7A90]">
//                     {f.leavesPerMonth}
//                   </div>

//                   {/* View Mode - Assigned Subjects */}
//                   <div className="flex-[1] text-center">
//                     <button className="text-[13px] font-medium text-[#7FA7BF] hover:underline">
//                       See List ({f.subjects?.length || 0})
//                     </button>
//                   </div>

//                   {/* View Mode - Actions */}
//                   <div className="w-20 flex items-center justify-center gap-4">
//                     <button
//                       onClick={() => handleEdit(f)}
//                       className="text-[#7FA7BF] hover:text-[#1A8FE3] transition"
//                       title="Edit"
//                     >
//                       <Edit2 size={16} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(f._id)}
//                       className="text-[#7FA7BF] hover:text-[#F04438] transition"
//                       title="Delete"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))
//         )}
//       </div>

//       <style>{`
//         .custom-scroll::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: #cfe8ff;
//           border-radius: 12px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           background: #1DA5FF;
//         }
//       `}</style>
//     </div>
//   );
// }










// import React, { useState, useEffect } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import { getFaculties, updateFaculty, deleteFaculty } from "../../api/api";

// export default function Faculty({ searchQuery = "", refreshTrigger = 0 }) {
//   const [facultyList, setFacultyList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     fetchFaculties();
//   }, [refreshTrigger]);

//   const fetchFaculties = async () => {
//     try {
//       setLoading(true);
//       const response = await getFaculties();
//       if (response.success && response.data) {
//         setFacultyList(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching faculties:", error);
//       alert("Failed to fetch faculties");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (faculty) => {
//     setEditingId(faculty._id);
//     setEditData({
//       ...faculty,
//       subjects: faculty.subjects?.join(", ") || "",
//     });
//   };

//   const handleDelete = async (facultyId) => {
//     if (!window.confirm("Are you sure you want to delete this faculty?")) {
//       return;
//     }

//     try {
//       const response = await deleteFaculty(facultyId);
//       if (response.success) {
//         alert("Faculty deleted successfully!");
//         fetchFaculties();
//       }
//     } catch (error) {
//       console.error("Error deleting faculty:", error);
//       alert(error.message || "Failed to delete faculty");
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const updateData = {
//         maxLoad: Number.parseInt(editData.maxLoad),
//         leavesPerMonth: Number.parseInt(editData.leavesPerMonth),
//         subjects: editData.subjects ? editData.subjects.split(",").map((s) => s.trim()) : [],
//       };

//       const response = await updateFaculty(editingId, updateData);
//       if (response.success) {
//         alert("Faculty updated successfully!");
//         setFacultyList(facultyList.map((f) => 
//           f._id === editingId 
//             ? { ...f, ...updateData, subjects: updateData.subjects }
//             : f
//         ));
//         setEditingId(null);
//         setEditData(null);
//       }
//     } catch (error) {
//       console.error("Error updating faculty:", error);
//       alert(error.message || "Failed to update faculty");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditData(null);
//   };

//   const query = searchQuery.toLowerCase();
//   const filtered = facultyList.filter((f) =>
//     `${f.name} ${f.email}`.toLowerCase().includes(query)
//   );

//   if (loading) {
//     return (
//       <div className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm flex items-center justify-center" style={{ maxWidth: "1068px", height: "293px" }}>
//         <p className="text-[#6C7A90]">Loading faculties...</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
//       style={{ maxWidth: "1068px", height: "400px" }}
//     >
//       <div className="flex items-center px-8 py-3 text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF]">
//         <div className="flex-[1.7]">Faculty Name</div>
//         <div className="flex-[1.7]">Email</div>
//         <div className="flex-[0.8] text-center">Max load per day</div>
//         <div className="flex-[0.8] text-center">Leaves per month</div>
//         <div className="flex-[1] text-center">Assigned Subjects</div>
//         <div className="w-20 text-center">Actions</div>
//       </div>

//       <div
//         className="overflow-y-auto custom-scroll"
//         style={{ height: "calc(400px - 56px)" }}
//       >
//         {filtered.length === 0 ? (
//           <div className="flex items-center justify-center h-full text-[#9CA3AF]">
//             No faculties found
//           </div>
//         ) : (
//           filtered.map((f, idx) => (
//             <div
//               key={f._id}
//               className={`flex items-center px-8 py-3 text-sm border-b border-[#ECF0F4] ${
//                 idx === filtered.length - 1 ? "border-b-0" : ""
//               } hover:bg-[#F7FAFF] transition`}
//             >
//               {editingId === f._id ? (
//                 <>
//                   {/* Edit Mode - Faculty Name (Read-only) */}
//                   <div className="flex-[1.7] text-[#4C5968]">{f.name}</div>

//                   {/* Edit Mode - Email (Read-only) */}
//                   <div className="flex-[1.7] text-[13px] text-[#8C96A3]">{f.email}</div>

//                   {/* Edit Mode - Max Load */}
//                   <div className="flex-[0.8] text-center">
//                     <input
//                       type="number"
//                       value={editData.maxLoad}
//                       onChange={(e) => setEditData({ ...editData, maxLoad: e.target.value })}
//                       className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                     />
//                   </div>

//                   {/* Edit Mode - Leaves per Month */}
//                   <div className="flex-[0.8] text-center">
//                     <input
//                       type="number"
//                       value={editData.leavesPerMonth}
//                       onChange={(e) => setEditData({ ...editData, leavesPerMonth: e.target.value })}
//                       className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                     />
//                   </div>

//                   {/* Edit Mode - Subjects */}
//                   <div className="flex-[1] text-center">
//                     <input
//                       type="text"
//                       value={editData.subjects}
//                       onChange={(e) => setEditData({ ...editData, subjects: e.target.value })}
//                       placeholder="IDs, comma separated"
//                       className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                     />
//                   </div>

//                   {/* Edit Mode - Save/Cancel Buttons */}
//                   <div className="w-20 flex items-center justify-center gap-2">
//                     <button
//                       onClick={handleUpdate}
//                       className="text-[#1A8FE3] hover:text-[#0056b3] text-[12px] font-medium"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       className="text-[#8A96A8] hover:text-[#4C5968] text-[12px] font-medium"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* View Mode - Faculty Name */}
//                   <div className="flex-[1.7] text-[#4C5968]">{f.name}</div>

//                   {/* View Mode - Email */}
//                   <div className="flex-[1.7] text-[13px] text-[#8C96A3]">{f.email}</div>

//                   {/* View Mode - Max Load */}
//                   <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                     {f.maxLoad} Hrs
//                   </div>

//                   {/* View Mode - Leaves per Month */}
//                   <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                     {f.leavesPerMonth}
//                   </div>

//                   {/* View Mode - Assigned Subjects */}
//                   <div className="flex-[1] text-center">
//                     <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
//                       See List ({f.subjects?.length || 0})
//                     </button>
//                   </div>

//                   {/* View Mode - Actions */}
//                   <div className="w-20 flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => handleEdit(f)}
//                       className="text-[#C0C6D0] hover:text-[#1A8FE3]"
//                     >
//                       <Edit2 size={15} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(f._id)}
//                       className="text-[#C0C6D0] hover:text-[#F04438]"
//                     >
//                       <Trash2 size={15} />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))
//         )}
//       </div>

//       <style>{`
//         .custom-scroll::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: #B7DFFF;
//           border-radius: 10px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           background: #1DA5FF;
//         }
//       `}</style>
//     </div>
//   );
// }