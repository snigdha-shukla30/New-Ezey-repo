import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { getBatches, updateBatch, deleteBatch } from "../../api/api";

export default function Batches({ searchQuery, refreshTrigger }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, [refreshTrigger]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getBatches();
      if (response.success && response.data) {
        setBatches(response.data);
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) {
      return;
    }

    try {
      const response = await deleteBatch(batchId);
      if (response.success) {
        alert("Batch deleted successfully!");
        fetchBatches();
      }
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert(err.message || "Failed to delete batch");
    }
  };

  const handleEdit = (batch) => {
    setEditingId(batch._id);
    setEditData({ ...batch });
  };

  const handleUpdate = async () => {
    try {
      const response = await updateBatch(editingId, editData);
      if (response.success) {
        alert("Batch updated successfully!");
        setBatches(batches.map((b) => (b._id === editingId ? editData : b)));
        setEditingId(null);
        setEditData(null);
      }
    } catch (err) {
      console.error("Error updating batch:", err);
      alert(err.message || "Failed to update batch");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const q = (searchQuery || "").toLowerCase();
  const filtered = batches.filter((b) =>
    (b.name || "").toLowerCase().includes(q) ||
    (b.code || "").toLowerCase().includes(q) ||
    (b.department || "").toLowerCase().includes(q)
  );

  if (loading) {
    return (
      <div
        className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
        style={{ maxWidth: "1068px" }}
      >
        <div className="px-6 py-6 text-sm text-[#6C7A90] text-center">
          Loading batches...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
        style={{ maxWidth: "1068px" }}
      >
        <div className="px-6 py-6 text-sm text-red-500 text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full overflow-hidden"
      style={{ maxWidth: "1068px" }}
    >
      {/* HEADER ROW */}
      <div className="relative bg-white  pt-4">
        <div className="flex items-center text-[13px] font-semibold text-[#265768]">
          <div className="w-40 text-center">Degree / Course</div>
          <div className="w-32 text-center">Batch code</div>
          <div className="w-40 text-center">Department</div>
          <div className="w-24 text-center">Capacity</div>
          <div className="w-24 text-center">Semester</div>
          <div className="w-24 text-center">Section</div>
          <div className="flex-1 text-center">Assigned Subjects</div>
          <div className="w-24 text-center">Actions</div>
        </div>

        {/* blue underline bar + drop shadow (like screenshot) */}
        <div className="mt-2 h-[1.5px] w-full bg-[#1DA5FF] " />
      </div>

      {/* DATA ROWS */}
      <div className="overflow-y-auto custom-scroll" style={{ maxHeight: "390px" }}>
        {filtered.map((item, idx) => (
          <div
            key={item._id}
            className={`flex items-center px-6 py-[18px] text-[13px] border-b border-[#E5E7EB] ${
              idx === filtered.length - 1 ? "border-b-0" : ""
            }`}
          >
            {editingId === item._id ? (
              <>
                {/* Edit Mode - Degree/Course */}
                <div className="w-40">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                  />
                </div>

                {/* Edit Mode - Batch Code */}
                <div className="w-32">
                  <input
                    type="text"
                    value={editData.code}
                    onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                    className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                  />
                </div>

                {/* Edit Mode - Department */}
                <div className="w-40">
                  <input
                    type="text"
                    value={editData.department}
                    onChange={(e) =>
                      setEditData({ ...editData, department: e.target.value })
                    }
                    className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                  />
                </div>

                {/* Edit Mode - Capacity */}
                <div className="w-24">
                  <input
                    type="number"
                    value={editData.strength}
                    onChange={(e) =>
                      setEditData({ ...editData, strength: e.target.value })
                    }
                    className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                  />
                </div>

                {/* Edit Mode - Semester */}
                <div className="w-24">
                  <input
                    type="text"
                    value={editData.semester}
                    onChange={(e) =>
                      setEditData({ ...editData, semester: e.target.value })
                    }
                    className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                  />
                </div>

                {/* Section (Read-only) */}
                <div className="w-24 text-center text-[#6C7A90]">
                  {item.name?.split(" - ")[1] || "A"}
                </div>

                {/* Subjects (Read-only) */}
                <div className="flex-1 text-center">
                  <span className="text-[#7FA7BF]">
                    {item.subjects && item.subjects.length > 0 ? "See List" : "None"}
                  </span>
                </div>

                {/* Save / Cancel */}
                <div className="w-24 flex items-center justify-center gap-3">
                  <button
                    onClick={handleUpdate}
                    className="text-[#1A8FE3] hover:text-[#0B6FBF] text-[12px] font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-[#8A96A8] hover:text-[#4C5968] text-[12px] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="w-40 text-center text-[#6C7A90] font-medium">
                  {item.name || "N/A"}
                </div>

                <div className="w-32 text-center text-[#6C7A90]">
                  {item.code || "N/A"}
                </div>

                <div className="w-40 text-center text-[#6C7A90] truncate px-2">
                  {item.department || "N/A"}
                </div>

                <div className="w-24 text-center text-[#6C7A90]">
                  {item.strength || "N/A"}
                </div>

                <div className="w-24 text-center text-[#6C7A90]">
                  {item.semester || "N/A"}
                </div>

                <div className="w-24 text-center text-[#6C7A90]">
                  {item.name?.split(" - ")[1] || "A"}
                </div>

                <div className="flex-1 text-center">
                  <button className="text-[#7FA7BF] hover:underline text-[13px] font-medium">
                    {item.subjects && item.subjects.length > 0 ? "See List" : "None"}
                  </button>
                </div>

                <div className="w-24 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-[#7FA7BF] hover:text-[#1A8FE3] transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-[#7FA7BF] hover:text-[#F04438] transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-6 py-10 text-sm text-[#6C7A90] text-center">
            No results found.
          </div>
        )}
      </div>

      {/* Scrollbar like screenshot */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cfe8ff;
          border-radius: 12px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #1da5ff;
        }
      `}</style>
    </div>
  );
}



















// import React, { useState, useEffect } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import { getBatches, updateBatch, deleteBatch } from "../../api/api";

// export default function Batches({ searchQuery, refreshTrigger }) {
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     fetchBatches();
//   }, [refreshTrigger]);

//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       const response = await getBatches();
//       if (response.success && response.data) {
//         setBatches(response.data);
//       }
//     } catch (err) {
//       console.error("Error fetching batches:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (batchId) => {
//     if (!window.confirm("Are you sure you want to delete this batch?")) {
//       return;
//     }

//     try {
//       const response = await deleteBatch(batchId);
//       if (response.success) {
//         alert("Batch deleted successfully!");
//         fetchBatches();
//       }
//     } catch (err) {
//       console.error("Error deleting batch:", err);
//       alert(err.message || "Failed to delete batch");
//     }
//   };

//   const handleEdit = (batch) => {
//     setEditingId(batch._id);
//     setEditData({ ...batch });
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await updateBatch(editingId, editData);
//       if (response.success) {
//         alert("Batch updated successfully!");
//         setBatches(batches.map((b) => (b._id === editingId ? editData : b)));
//         setEditingId(null);
//         setEditData(null);
//       }
//     } catch (err) {
//       console.error("Error updating batch:", err);
//       alert(err.message || "Failed to update batch");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditData(null);
//   };

//   const q = (searchQuery || "").toLowerCase();
//   const filtered = batches.filter((b) =>
//     (b.name || "").toLowerCase().includes(q) ||
//     (b.code || "").toLowerCase().includes(q) ||
//     (b.department || "").toLowerCase().includes(q)
//   );

//   if (loading) {
//     return (
//       <div
//         className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
//         style={{ maxWidth: "1068px" }}
//       >
//         <div className="px-6 py-6 text-sm text-[#6C7A90] text-center">
//           Loading batches...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
//         style={{ maxWidth: "1068px" }}
//       >
//         <div className="px-6 py-6 text-sm text-red-500 text-center">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white rounded-[10px] border border-[#DFDFDF] w-full overflow-hidden"
//       style={{ maxWidth: "1068px" }}
//     >
//       {/* HEADER ROW */}
//       <div className="relative bg-white px-6 pt-4">
//         <div className="flex items-center text-[13px] font-semibold text-[#265768]">
//           <div className="w-40 text-center">Degree / Course</div>
//           <div className="w-32 text-center">Batch code</div>
//           <div className="w-40 text-center">Department</div>
//           <div className="w-24 text-center">Capacity</div>
//           <div className="w-24 text-center">Semester</div>
//           <div className="w-24 text-center">Section</div>
//           <div className="flex-1 text-center">Assigned Subjects</div>
//           <div className="w-24 text-center">Actions</div>
//         </div>

//         {/* blue underline bar + drop shadow (like screenshot) */}
//         <div className="mt-2 h-[2px] w-full bg-[#1DA5FF] shadow-[0_3px_10px_rgba(29,165,255,0.45)]" />
//       </div>

//       {/* DATA ROWS */}
//       <div className="overflow-y-auto custom-scroll" style={{ maxHeight: "390px" }}>
//         {filtered.map((item, idx) => (
//           <div
//             key={item._id}
//             className={`flex items-center px-6 py-[18px] text-[13px] border-b border-[#E5E7EB] ${
//               idx === filtered.length - 1 ? "border-b-0" : ""
//             }`}
//           >
//             {editingId === item._id ? (
//               <>
//                 {/* Edit Mode - Degree/Course */}
//                 <div className="w-40">
//                   <input
//                     type="text"
//                     value={editData.name}
//                     onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Batch Code */}
//                 <div className="w-32">
//                   <input
//                     type="text"
//                     value={editData.code}
//                     onChange={(e) => setEditData({ ...editData, code: e.target.value })}
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Department */}
//                 <div className="w-40">
//                   <input
//                     type="text"
//                     value={editData.department}
//                     onChange={(e) =>
//                       setEditData({ ...editData, department: e.target.value })
//                     }
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Capacity */}
//                 <div className="w-24">
//                   <input
//                     type="number"
//                     value={editData.strength}
//                     onChange={(e) =>
//                       setEditData({ ...editData, strength: e.target.value })
//                     }
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Semester */}
//                 <div className="w-24">
//                   <input
//                     type="text"
//                     value={editData.semester}
//                     onChange={(e) =>
//                       setEditData({ ...editData, semester: e.target.value })
//                     }
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Section (Read-only) */}
//                 <div className="w-24 text-center text-[#6C7A90]">
//                   {item.name?.split(" - ")[1] || "A"}
//                 </div>

//                 {/* Subjects (Read-only) */}
//                 <div className="flex-1 text-center">
//                   <span className="text-[#7FA7BF]">
//                     {item.subjects && item.subjects.length > 0 ? "See List" : "None"}
//                   </span>
//                 </div>

//                 {/* Save / Cancel */}
//                 <div className="w-24 flex items-center justify-center gap-3">
//                   <button
//                     onClick={handleUpdate}
//                     className="text-[#1A8FE3] hover:text-[#0B6FBF] text-[12px] font-semibold"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelEdit}
//                     className="text-[#8A96A8] hover:text-[#4C5968] text-[12px] font-semibold"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* View Mode */}
//                 <div className="w-40 text-center text-[#6C7A90] font-medium">
//                   {item.name || "N/A"}
//                 </div>

//                 <div className="w-32 text-center text-[#6C7A90]">
//                   {item.code || "N/A"}
//                 </div>

//                 <div className="w-40 text-center text-[#6C7A90] truncate px-2">
//                   {item.department || "N/A"}
//                 </div>

//                 <div className="w-24 text-center text-[#6C7A90]">
//                   {item.strength || "N/A"}
//                 </div>

//                 <div className="w-24 text-center text-[#6C7A90]">
//                   {item.semester || "N/A"}
//                 </div>

//                 <div className="w-24 text-center text-[#6C7A90]">
//                   {item.name?.split(" - ")[1] || "A"}
//                 </div>

//                 <div className="flex-1 text-center">
//                   <button className="text-[#7FA7BF] hover:underline text-[13px] font-medium">
//                     {item.subjects && item.subjects.length > 0 ? "See List" : "None"}
//                   </button>
//                 </div>

//                 <div className="w-24 flex items-center justify-center gap-4">
//                   <button
//                     onClick={() => handleEdit(item)}
//                     className="text-[#7FA7BF] hover:text-[#1A8FE3] transition"
//                     title="Edit"
//                   >
//                     <Edit2 size={16} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id)}
//                     className="text-[#7FA7BF] hover:text-[#F04438] transition"
//                     title="Delete"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}

//         {filtered.length === 0 && (
//           <div className="px-6 py-10 text-sm text-[#6C7A90] text-center">
//             No results found.
//           </div>
//         )}
//       </div>

//       {/* Scrollbar like screenshot */}
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
//           background: #1da5ff;
//         }
//       `}</style>
//     </div>
//   );
// }







// import React, { useState, useEffect } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import { getBatches, updateBatch, deleteBatch } from "../../api/api";

// export default function Batches({ searchQuery, refreshTrigger }) {
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     fetchBatches();
//   }, [refreshTrigger]);

//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       const response = await getBatches();
//       if (response.success && response.data) {
//         setBatches(response.data);
//       }
//     } catch (err) {
//       console.error("Error fetching batches:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (batchId) => {
//     if (!window.confirm("Are you sure you want to delete this batch?")) {
//       return;
//     }

//     try {
//       const response = await deleteBatch(batchId);
//       if (response.success) {
//         alert("Batch deleted successfully!");
//         fetchBatches();
//       }
//     } catch (err) {
//       console.error("Error deleting batch:", err);
//       alert(err.message || "Failed to delete batch");
//     }
//   };

//   const handleEdit = (batch) => {
//     setEditingId(batch._id);
//     setEditData({ ...batch });
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await updateBatch(editingId, editData);
//       if (response.success) {
//         alert("Batch updated successfully!");
//         setBatches(batches.map((b) => (b._id === editingId ? editData : b)));
//         setEditingId(null);
//         setEditData(null);
//       }
//     } catch (err) {
//       console.error("Error updating batch:", err);
//       alert(err.message || "Failed to update batch");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditData(null);
//   };

//   const q = (searchQuery || "").toLowerCase();
//   const filtered = batches.filter((b) =>
//     (b.name || "").toLowerCase().includes(q) ||
//     (b.code || "").toLowerCase().includes(q) ||
//     (b.department || "").toLowerCase().includes(q)
//   );

//   if (loading) {
//     return (
//       <div className="bg-white rounded-[10px] border border-[#DFDFDF] w-full" style={{ maxWidth: "1068px" }}>
//         <div className="px-6 py-6 text-sm text-gray-500 text-center">Loading batches...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-[10px] border border-[#DFDFDF] w-full" style={{ maxWidth: "1068px" }}>
//         <div className="px-6 py-6 text-sm text-red-500 text-center">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white rounded-[10px] border border-[#DFDFDF] w-full"
//       style={{ maxWidth: "1068px" }}
//     >
//       {/* Header row */}
//       <div className="flex items-center border-b border-[#DFDFDF] px-6 py-3 bg-gray-50">
//         <div className="w-36"><span className="text-sm font-medium text-gray-700">Degree / Course</span></div>
//         <div className="w-32"><span className="text-sm font-medium text-gray-700">Batch code</span></div>
//         <div className="w-40"><span className="text-sm font-medium text-gray-700">Department</span></div>
//         <div className="w-24"><span className="text-sm font-medium text-gray-700">Capacity</span></div>
//         <div className="w-24"><span className="text-sm font-medium text-gray-700">Semester</span></div>
//         <div className="w-24"><span className="text-sm font-medium text-gray-700">Section</span></div>
//         <div className="flex-1"><span className="text-sm font-medium text-gray-700">Assigned Subjects</span></div>
//         <div className="w-24 text-center"><span className="text-sm font-medium text-gray-700">Actions</span></div>
//       </div>

//       {/* Data rows */}
//       <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
//         {filtered.map((item) => (
//           <div
//             key={item._id}
//             className="flex items-center px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition"
//           >
//             {editingId === item._id ? (
//               <>
//                 {/* Edit Mode - Degree/Course */}
//                 <div className="w-36">
//                   <input
//                     type="text"
//                     value={editData.name}
//                     onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Batch Code */}
//                 <div className="w-32">
//                   <input
//                     type="text"
//                     value={editData.code}
//                     onChange={(e) => setEditData({ ...editData, code: e.target.value })}
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Department */}
//                 <div className="w-40">
//                   <input
//                     type="text"
//                     value={editData.department}
//                     onChange={(e) => setEditData({ ...editData, department: e.target.value })}
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Capacity */}
//                 <div className="w-24">
//                   <input
//                     type="number"
//                     value={editData.strength}
//                     onChange={(e) => setEditData({ ...editData, strength: e.target.value })}
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Semester */}
//                 <div className="w-24">
//                   <input
//                     type="text"
//                     value={editData.semester}
//                     onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
//                     className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
//                   />
//                 </div>

//                 {/* Edit Mode - Section (Read-only) */}
//                 <div className="w-24 text-sm text-gray-900">{item.name?.split(" - ")[1] || "A"}</div>

//                 {/* Edit Mode - Subjects (Read-only) */}
//                 <div className="flex-1 text-sm text-[#2563EB]">
//                   {item.subjects && item.subjects.length > 0 ? "See List" : "None"}
//                 </div>

//                 {/* Edit Mode - Save/Cancel Buttons */}
//                 <div className="w-24 flex items-center justify-center gap-2">
//                   <button
//                     onClick={handleUpdate}
//                     className="text-[#1A8FE3] hover:text-[#0056b3] text-[12px] font-medium"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelEdit}
//                     className="text-[#8A96A8] hover:text-[#4C5968] text-[12px] font-medium"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* View Mode */}
//                 <div className="w-36 text-sm font-medium text-gray-900">{item.name || "N/A"}</div>
//                 <div className="w-32 text-sm text-gray-900">{item.code || "N/A"}</div>
//                 <div className="w-40 text-sm text-gray-900 truncate">{item.department || "N/A"}</div>
//                 <div className="w-24 text-sm text-gray-900">{item.strength || "N/A"}</div>
//                 <div className="w-24 text-sm text-gray-900">{item.semester || "N/A"}</div>
//                 <div className="w-24 text-sm text-gray-900">{item.name?.split(" - ")[1] || "A"}</div>

//                 <div className="flex-1 text-sm text-[#2563EB] cursor-pointer hover:underline">
//                   {item.subjects && item.subjects.length > 0 ? "See List" : "None"}
//                 </div>

//                 <div className="w-24 flex items-center justify-center gap-3">
//                   <button 
//                     onClick={() => handleEdit(item)}
//                     className="text-gray-400 hover:text-blue-600 transition"
//                   >
//                     <Edit2 size={17} />
//                   </button>
//                   <button 
//                     onClick={() => handleDelete(item._id)}
//                     className="text-gray-400 hover:text-red-600 transition"
//                   >
//                     <Trash2 size={17} />
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}

//         {filtered.length === 0 && (
//           <div className="px-6 py-6 text-sm text-gray-500">No results found.</div>
//         )}
//       </div>
//     </div>
//   );
// }