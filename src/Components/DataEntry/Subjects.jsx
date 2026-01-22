"use client"

import { useState, useEffect } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { getSubjects, deleteSubject, updateSubject } from "../../api/api"

export default function Subjects({ searchQuery = "", refreshTrigger = 0 }) {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState(null)

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getSubjects()

        const subjectsData = response.data || response
        const finalData = Array.isArray(subjectsData) ? subjectsData : []

        setSubjects(finalData)
      } catch (err) {
        console.error("[v0] Error fetching subjects:", err.message)
        setError(
          err.message || "Failed to load subjects. Make sure your backend server is running on http://localhost:5000",
        )
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [refreshTrigger]) // Refetch when refreshTrigger changes

  // Filter subjects based on search query
  const query = searchQuery.toLowerCase()
  const filtered = subjects.filter((sub) =>
    `${sub.name || ""} ${sub.code || ""} ${sub.department || ""} ${sub.type || ""} ${sub.hoursPerWeek || ""}`
      .toLowerCase()
      .includes(query),
  )

  // Handle delete
  const handleDelete = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return

    try {
      await deleteSubject(subjectId)
      setSubjects(subjects.filter((s) => s._id !== subjectId))
      alert("Subject deleted successfully!")
    } catch (err) {
      alert("Error deleting subject: " + err.message)
    }
  }

  // Handle edit
  const handleEdit = (subject) => {
    setEditingId(subject._id)
    setEditData({ ...subject })
  }

  // Handle update
  const handleUpdate = async () => {
    try {
      await updateSubject(editingId, editData)
      setSubjects(subjects.map((s) => (s._id === editingId ? editData : s)))
      setEditingId(null)
      setEditData(null)
      alert("Subject updated successfully!")
    } catch (err) {
      alert("Error updating subject: " + err.message)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData(null)
  }

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
      style={{ maxWidth: "1068px", minHeight: "293px" }}
    >
      {/* Header row */}
      <div className="flex items-center px-8 py-3 text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF]">
        <div className="flex-[1.6]">Subject Name</div>
        <div className="flex-[1.1]">Subject Code</div>
        <div className="flex-[1.1]">Department</div>
        <div className="flex-[1.1]">Type</div>
        <div className="flex-[0.9] text-center">Hrs/Week</div>
        <div className="w-20 text-center">Actions</div>
      </div>

      {/* Body rows */}
      <div className="overflow-y-auto custom-scroll" style={{ maxHeight: "calc(293px - 56px)" }}>
        {loading && <div className="flex items-center justify-center py-8 text-[#8A96A8]">Loading subjects...</div>}

        {error && (
          <div className="flex items-center justify-center py-8 px-4 text-center">
            <div className="text-red-500 text-sm">
              <p className="font-semibold mb-1">⚠️ Unable to load subjects</p>
              <p className="text-xs">{error}</p>
              <p className="text-xs mt-2 text-gray-600">
                👉 Make sure your backend server is running:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded inline-block mt-1">
                  npm start (in your backend folder)
                </code>
              </p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          (filtered.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-[#8A96A8]">No subjects found</div>
          ) : (
            filtered.map((sub, idx) => (
              <div
                key={sub._id || idx}
                className={`flex items-center px-8 py-3 text-sm border-b border-[#ECF0F4] ${
                  idx === filtered.length - 1 ? "border-b-0" : ""
                } hover:bg-[#F7FAFF] transition`}
              >
                {editingId === sub._id ? (
                  <>
                    {/* Edit Mode - Subject Name */}
                    <div className="flex-[1.6]">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    </div>

                    {/* Edit Mode - Subject Code */}
                    <div className="flex-[1.1]">
                      <input
                        type="text"
                        value={editData.code}
                        onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                        className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    </div>

                    {/* Edit Mode - Department */}
                    <div className="flex-[1.1]">
                      <input
                        type="text"
                        value={editData.department}
                        onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                        className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    </div>

                    {/* Edit Mode - Type */}
                    <div className="flex-[1.1]">
                      <input
                        type="text"
                        value={editData.type}
                        onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                        className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    </div>

                    {/* Edit Mode - Hours */}
                    <div className="flex-[0.9] text-center">
                      <input
                        type="number"
                        value={editData.hoursPerWeek}
                        onChange={(e) => setEditData({ ...editData, hoursPerWeek: Number.parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    </div>

                    {/* Edit Mode - Save/Cancel Buttons */}
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
                    {/* View Mode - Subject Name */}
                    <div className="flex-[1.6] text-[#4C5968] leading-snug">{sub.name}</div>

                    {/* View Mode - Subject Code */}
                    <div className="flex-[1.1]">
                      <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">{sub.code}</button>
                    </div>

                    {/* View Mode - Department */}
                    <div className="flex-[1.1] text-[#8A96A8]">{sub.department}</div>

                    {/* View Mode - Type */}
                    <div className="flex-[1.1] text-[#8A96A8]">{sub.type}</div>

                    {/* View Mode - Hours/Week */}
                    <div className="flex-[0.9] text-center text-[#8A96A8]">{sub.hoursPerWeek}</div>

                    {/* View Mode - Actions */}
                    <div className="w-20 flex items-center justify-center gap-3">
                      <button onClick={() => handleEdit(sub)} className="text-[#C0C6D0] hover:text-[#1A8FE3]">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(sub._id)} className="text-[#C0C6D0] hover:text-[#F04438]">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ))}
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
  )
}