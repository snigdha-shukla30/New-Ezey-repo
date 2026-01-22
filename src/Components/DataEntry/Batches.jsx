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
  const filtered = batches.filter(
    (b) =>
      (b.name || "").toLowerCase().includes(q) ||
      (b.code || "").toLowerCase().includes(q) ||
      (b.department || "").toLowerCase().includes(q)
  );

  if (loading) {
    return (
      <div
        className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm flex items-center justify-center"
        style={{ maxWidth: "1068px", height: "293px" }}
      >
        <p className="text-[#6C7A90]">Loading batches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm flex items-center justify-center"
        style={{ maxWidth: "1068px", height: "293px" }}
      >
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
      style={{ maxWidth: "1068px", minHeight: "293px" }}
    >
      {/* HEADER (ClassroomData style -> table-fixed + colgroup) */}
      <div className="px-8 pt-4">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>

          <thead>
            <tr className="text-[13px] font-semibold text-[#6C7A90]">
              <th className="text-center pb-3">Degree / Course</th>
              <th className="text-center pb-3">Batch code</th>
              <th className="text-center pb-3">Department</th>
              <th className="text-center pb-3">Capacity</th>
              <th className="text-center pb-3">Semester</th>
              <th className="text-center pb-3">Section</th>
              <th className="text-center pb-3">Assigned Subjects</th>
              <th className="text-center pb-3">Actions</th>
            </tr>
          </thead>
        </table>

        {/* Blue Divider (same as ClassroomData) */}
        <div className="h-[3px] w-full bg-[#0077FF] rounded-full shadow-[0px_4px_4px_0px_#00000040]" />
      </div>

      {/* BODY */}
      <div
        className="overflow-y-auto custom-scroll px-8 pr-5 mr-1.5"
        style={{ maxHeight: "calc(293px - 76px)" }}
      >
        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-[#8A96A8]">
            No results found.
          </div>
        ) : (
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>

            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={item._id}
                  className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
                    idx === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Degree / Course */}
                  <td className="py-5 text-center text-[#4C5968]">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-[180px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.name || "N/A"
                    )}
                  </td>

                  {/* Batch code */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editData.code}
                        onChange={(e) =>
                          setEditData({ ...editData, code: e.target.value })
                        }
                        className="w-[120px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.code || "N/A"
                    )}
                  </td>

                  {/* Department */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editData.department}
                        onChange={(e) =>
                          setEditData({ ...editData, department: e.target.value })
                        }
                        className="w-[180px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.department || "N/A"
                    )}
                  </td>

                  {/* Capacity */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editData.strength}
                        onChange={(e) =>
                          setEditData({ ...editData, strength: e.target.value })
                        }
                        className="w-[110px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.strength || "N/A"
                    )}
                  </td>

                  {/* Semester */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editData.semester}
                        onChange={(e) =>
                          setEditData({ ...editData, semester: e.target.value })
                        }
                        className="w-[110px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.semester || "N/A"
                    )}
                  </td>

                  {/* Section (Read-only) */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {item.name?.split(" - ")[1] || "A"}
                  </td>

                  {/* Assigned Subjects */}
                  <td className="py-5 text-center">
                    <button className="text-[#1A8FE3] hover:underline text-[13px] font-medium">
                      {item.subjects && item.subjects.length > 0
                        ? "See List"
                        : "None"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-5">
                    {editingId === item._id ? (
                      <div className="flex items-center justify-center gap-2">
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
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#C0C6D0] hover:text-[#1A8FE3]"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-[#C0C6D0] hover:text-[#F04438]"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Scrollbar Styling (exact ClassroomData) */}
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





