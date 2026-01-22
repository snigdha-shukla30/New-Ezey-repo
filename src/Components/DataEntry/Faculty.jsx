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
      {/* HEADER (ClassroomData style -> table-fixed + colgroup) */}
      <div className="px-8 pt-4">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "23%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>

          <thead>
            <tr className="text-[13px] font-semibold text-[#6C7A90]">
              <th className="text-center pb-3">Faculty Name</th>
              <th className="text-center pb-3">Email</th>
              <th className="text-center pb-3">Max load per day</th>
              <th className="text-center pb-3">Leaves per month</th>
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
            No faculties found
          </div>
        ) : (
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>

            <tbody>
              {filtered.map((f, idx) => (
                <tr
                  key={f._id}
                  className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
                    idx === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Faculty Name */}
                  <td className="py-5 text-center text-[#4C5968]">{f.name}</td>

                  {/* Email */}
                  <td className="py-5 text-center text-[13px] text-[#8C96A3]">
                    {f.email}
                  </td>

                  {/* Max load */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === f._id ? (
                      <input
                        type="number"
                        value={editData.maxLoad}
                        onChange={(e) =>
                          setEditData({ ...editData, maxLoad: e.target.value })
                        }
                        className="w-[110px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      `${f.maxLoad} Hrs`
                    )}
                  </td>

                  {/* Leaves */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === f._id ? (
                      <input
                        type="number"
                        value={editData.leavesPerMonth}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            leavesPerMonth: e.target.value,
                          })
                        }
                        className="w-[110px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      f.leavesPerMonth
                    )}
                  </td>

                  {/* Subjects */}
                  <td className="py-5 text-center">
                    {editingId === f._id ? (
                      <input
                        type="text"
                        value={editData.subjects}
                        onChange={(e) =>
                          setEditData({ ...editData, subjects: e.target.value })
                        }
                        placeholder="IDs, comma separated"
                        className="w-[220px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
                        See List ({f.subjects?.length || 0})
                      </button>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-5">
                    {editingId === f._id ? (
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










