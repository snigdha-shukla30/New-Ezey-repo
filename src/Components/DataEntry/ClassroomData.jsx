import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { getClassrooms, deleteClassroom, updateClassroom } from "../../api/api";

export default function ClassroomData({ searchQuery, refreshTrigger }) {
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchClassrooms();
  }, [refreshTrigger]);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getClassrooms();
      if (response.success) {
        setClassrooms(response.data || []);
      } else {
        setError("Failed to load classrooms");
      }
    } catch (err) {
      console.error("Error fetching classrooms:", err);
      setError(err.message || "Failed to load classrooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (classroomId, classroomName) => {
    if (!window.confirm(`Are you sure you want to delete "${classroomName}"?`)) {
      return;
    }

    try {
      const response = await deleteClassroom(classroomId);
      if (response.success) {
        setClassrooms(classrooms.filter((c) => c._id !== classroomId));
        
      } else {
        alert(response.message || "Failed to delete classroom");
      }
    } catch (err) {
      console.error("Error deleting classroom:", err);
      alert(err.message || "Failed to delete classroom");
    }
  };

  const handleEdit = (room) => {
    setEditingId(room._id);
    setEditData({ ...room });
  };

  const handleUpdate = async () => {
    if (!editData.type.trim()) {
      alert("Classroom type is required");
      return;
    }
    if (!editData.capacity || editData.capacity <= 0) {
      alert("Valid capacity is required");
      return;
    }

    try {
      const response = await updateClassroom(editingId, {
        capacity: Number(editData.capacity),
        type: editData.type.trim(),
      });

      if (response.success) {
        setClassrooms(
          classrooms.map((c) =>
            c._id === editingId ? { ...c, ...response.data } : c
          )
        );
        setEditingId(null);
        setEditData(null);
       
      } else {
        alert(response.message || "Failed to update classroom");
      }
    } catch (err) {
      console.error("Error updating classroom:", err);
      alert(err.message || "Failed to update classroom");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const filtered = classrooms.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="bg-white rounded-[10px] border border-[#DFDFDF] w-full shadow-sm"
      style={{ maxWidth: "1068px", minHeight: "293px" }}
    >
      <div className="px-8 pt-4">
        {/* TABLE HEADER (Fixed column widths) */}
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          <thead>
            <tr className="text-[13px] font-semibold text-[#6C7A90]">
              <th className="text-center pb-3">Classroom Name</th>
              <th className="text-center pb-3">Classroom Type</th>
              <th className="text-center pb-3">Capacity</th>
              <th className="text-center pb-3">Actions</th>
            </tr>
          </thead>
        </table>

        {/* Blue Divider (aligned with table width) */}
        <div className="h-[3px] w-full bg-[#0077FF] rounded-full shadow-[0px_4px_4px_0px_#00000040]
" />
      </div>

      {/* BODY */}
      <div
        className="overflow-y-auto custom-scroll px-8 pr-5 mr-1.5"
        style={{ maxHeight: "calc(293px - 76px)" }}
      >
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-10 text-[#8A96A8]">
            Loading classrooms...
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="flex items-center justify-center py-10 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-10 text-[#8A96A8]">
            {searchQuery ? "No classrooms found" : "No classrooms added yet"}
          </div>
        )}

        {/* Table Body */}
        {!isLoading && !error && filtered.length > 0 && (
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>

            <tbody>
              {filtered.map((room, idx) => (
                <tr
                  key={room._id}
                  className={`text-sm border-b border-[#ECF0F4] hover:bg-[#F7FAFF] transition ${
                    idx === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Classroom Name */}
                  <td className="py-5 text-center text-[#4C5968]">
                    {room.name}
                  </td>

                  {/* Type */}
                  <td className="py-5 text-center text-[#8A96A8] capitalize">
                    {editingId === room._id ? (
                      <input
                        type="text"
                        value={editData.type}
                        onChange={(e) =>
                          setEditData({ ...editData, type: e.target.value })
                        }
                        className="w-[220px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      room.type
                    )}
                  </td>

                  {/* Capacity */}
                  <td className="py-5 text-center text-[#8A96A8]">
                    {editingId === room._id ? (
                      <input
                        type="number"
                        min="1"
                        value={editData.capacity}
                        onChange={(e) =>
                          setEditData({ ...editData, capacity: e.target.value })
                        }
                        className="w-[110px] px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                      />
                    ) : (
                      room.capacity
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-5">
                    {editingId === room._id ? (
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
                          onClick={() => handleEdit(room)}
                          className="text-[#C0C6D0] hover:text-[#1A8FE3]"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(room._id, room.name)}
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

      {/* Scrollbar Styling */}
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















