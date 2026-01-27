"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { getSubjects, deleteSubjectAPI, updateSubjectAPI } from "../../api/api";
import Swal from "sweetalert2";

export default function Subjects({ searchQuery = "", refreshTrigger = 0 }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSubjects();

        const subjectsData = response.data || response;
        const finalData = Array.isArray(subjectsData) ? subjectsData : [];

        setSubjects(finalData);
      } catch (err) {
        console.error("[v0] Error fetching subjects:", err.message);
        setError(
          err.message ||
            "Failed to load subjects. Make sure your backend server is running on http://localhost:5000"
        );
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [refreshTrigger]);

  const query = searchQuery.toLowerCase();
  const filtered = subjects.filter((sub) =>
    `${sub.name || ""} ${sub.code || ""} ${sub.department || ""} ${sub.type || ""} ${sub.hoursPerWeek || ""}`
      .toLowerCase()
      .includes(query)
  );

  // Handle delete
  const handleDelete = async (subjectId) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete this subject?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSubjectAPI(subjectId);
      setSubjects(subjects.filter((s) => s._id !== subjectId));
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Error deleting subject: " + err.message,
        confirmButtonColor: "#4BACCE",
      });
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setEditData({ ...subject });
  };

  const handleUpdate = async () => {
    try {
      await updateSubjectAPI(editingId, editData);
      setSubjects(subjects.map((s) => (s._id === editingId ? editData : s)));
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Error updating subject: " + err.message,
        confirmButtonColor: "#4BACCE",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
      style={{ maxWidth: "1068px", minHeight: "293px" }}
    >
      <div className="px-8 pt-4">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>

          <thead>
            <tr className="text-[13px] font-semibold text-[#6C7A90]">
              <th className="text-center pb-3">Subject Name</th>
              <th className="text-center pb-3">Subject Code</th>
              <th className="text-center pb-3">Department</th>
              <th className="text-center pb-3">Type</th>
              <th className="text-center pb-3">Hrs/Week</th>
              <th className="text-center pb-3">Actions</th>
            </tr>
          </thead>
        </table>

        <div className="h-[3px] w-full bg-[#0077FF] rounded-full shadow-[0px_4px_4px_0px_#00000040]" />
      </div>

      <div
        className="overflow-y-auto custom-scroll px-8 pr-5 mr-1.5"
        style={{ maxHeight: "calc(293px - 76px)" }}
      >
        {loading && (
          <div className="flex items-center justify-center py-10 text-[#8A96A8]">
            Loading subjects...
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center py-10 px-4 text-center">
            <div className="text-red-500 text-sm">
              <p className="font-semibold mb-1">⚠️ Unable to load subjects</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-10 text-[#8A96A8]">
            No subjects found
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "26%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>

            <tbody>
              {filtered.map((sub, idx) => (
                <tr
                  key={sub._id || idx}
                  className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
                    idx === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-5 text-center text-[#4C5968]">
                    {editingId === sub._id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-[220px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      sub.name
                    )}
                  </td>

                  <td className="py-5 text-center">
                    {editingId === sub._id ? (
                      <input
                        type="text"
                        value={editData.code}
                        onChange={(e) =>
                          setEditData({ ...editData, code: e.target.value })
                        }
                        className="w-[160px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
                        {sub.code}
                      </button>
                    )}
                  </td>

                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === sub._id ? (
                      <input
                        type="text"
                        value={editData.department}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            department: e.target.value,
                          })
                        }
                        className="w-[160px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      sub.department
                    )}
                  </td>

                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === sub._id ? (
                      <input
                        type="text"
                        value={editData.type}
                        onChange={(e) =>
                          setEditData({ ...editData, type: e.target.value })
                        }
                        className="w-[140px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      sub.type
                    )}
                  </td>

                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === sub._id ? (
                      <input
                        type="number"
                        value={editData.hoursPerWeek}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            hoursPerWeek: Number.parseInt(e.target.value),
                          })
                        }
                        className="w-[110px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      sub.hoursPerWeek
                    )}
                  </td>

                  <td className="py-5">
                    {editingId === sub._id ? (
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
                          onClick={() => handleEdit(sub)}
                          className="text-[#C0C6D0] hover:text-[#1A8FE3]"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="text-[#C0C6D0] hover:text-[#F04438]"
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











