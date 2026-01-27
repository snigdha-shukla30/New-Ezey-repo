

import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { getBatches, updateBatch, deleteBatch } from "../../api/api";
import Swal from "sweetalert2";

export default function Batches({ searchQuery, refreshTrigger }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  useEffect(() => {
    fetchBatches();
  }, [refreshTrigger]);

  const fetchBatches = async () => {
    try {
      setLoading(true);

      const response = await getBatches();

      setBatches(response.data || []);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (batchId) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete this batch?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteBatch(batchId);
      if (response.success) {
        fetchBatches();
      }
    } catch (err) {
      console.error("Error deleting batch:", err);
      Swal.fire({
        icon: "error",
        text: err.message || "Failed to delete batch",
        confirmButtonColor: "#4BACCE",
      });
    }
  };

  const handleEdit = (batch) => {
    setEditingId(batch._id);
    setEditData({ ...batch });
  };

  const handleUpdate = async () => {
    try {
      const response = await updateBatch(editingId, editData);

      const updated = response?.data || editData;

      setBatches((prev) =>
        prev.map((b) => (b._id === editingId ? updated : b))
      );

      setEditingId(null);
      setEditData(null);
    } catch (err) {
      console.error("Error updating batch:", err);
      Swal.fire({
        icon: "error",
        text: err.message || "Failed to update batch",
        confirmButtonColor: "#4BACCE",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const q = (searchQuery || "").toLowerCase();
  const filtered = batches.filter(
    (b) =>
      (b.degree || "").toLowerCase().includes(q) ||
      (b.batchCode || "").toLowerCase().includes(q) ||
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

  const openListPopup = (title, items) => {
    setPopupTitle(title);
    setPopupItems(Array.isArray(items) ? items : []);
    setShowPopup(true);
  };

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
              <col style={{ width: "15%" }} />
              <col style={{ width: "13%" }} />
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
                        value={editData.degree}
                        onChange={(e) =>
                          setEditData({ ...editData, degree: e.target.value })
                        }
                        className="w-[180px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.degree || "N/A"
                    )}
                  </td>

                  {/* Batch code */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editData.batchCode}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            batchCode: e.target.value,
                          })
                        }
                        className="w-[120px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.batchCode || "N/A"
                    )}
                  </td>

                  {/* Department */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editData.department}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            department: e.target.value,
                          })
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
                        value={editData.capacity}
                        onChange={(e) =>
                          setEditData({ ...editData, capacity: e.target.value })
                        }
                        className="w-[110px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      item.capacity || item.strength || "N/A"
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
                    {item.batchCode?.split("_")[2] || "A"}
                  </td>

                  {/* Assigned Subjects */}

                  <td className="py-5 text-center">
                    {(item.raw?.subjects || item.subjects || []).length > 0 ? (
                      <button
                        onClick={() =>
                          openListPopup(
                            "Assigned Subjects",
                            (item.raw?.subjects || item.subjects || []).map(
                              (s) =>
                                typeof s.subject === "object" ? s.subject : s,
                            ),
                          )
                        }
                        className="text-[#1A8FE3] hover:underline text-[13px] font-medium"
                      >
                        See List ({(item.raw?.subjects || item.subjects).length}
                        )
                      </button>
                    ) : (
                      "None"
                    )}
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

        {showPopup && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={() => setShowPopup(false)}
          >
            <div
              className="bg-white rounded-[10px] shadow-lg border"
              style={{
                width: "420px",
                maxHeight: "420px",
                overflow: "hidden",
                borderColor: "#e8e8e8",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b">
                <div className="text-[16px] font-semibold text-[#265768]">
                  {popupTitle}
                </div>
                <button onClick={() => setShowPopup(false)}>✕</button>
              </div>

              <div
                className="p-4 overflow-y-auto"
                style={{ maxHeight: "340px" }}
              >
                {popupItems.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">No data</div>
                ) : (
                  <ul className="space-y-2">
                    {popupItems.map((x, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-[#265768] border rounded px-3 py-2"
                        style={{ borderColor: "#DFDFDF" }}
                      >
                        {x?.name || "-"} {x?.code ? `(${x.code})` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
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
