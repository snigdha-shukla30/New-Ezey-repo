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
        setClassrooms(classrooms.filter(c => c._id !== classroomId));
        alert("Classroom deleted successfully!");
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
    // Validation
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
        type: editData.type.trim()
      });

      if (response.success) {
        setClassrooms(classrooms.map(c => 
          c._id === editingId 
            ? { ...c, ...response.data }
            : c
        ));
        setEditingId(null);
        setEditData(null);
        alert("Classroom updated successfully!");
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
      {/* Header row */}
      <div className="flex items-center px-8 py-3 text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF]">
        <div className="flex-[1.5]">Classroom Name</div>
        <div className="flex-[1.5] text-center">Classroom Type</div>
        <div className="flex-[1] text-center">Capacity</div>
        <div className="w-20 text-center">Actions</div>
      </div>

      {/* Body rows */}
      <div className="overflow-y-auto custom-scroll" style={{ maxHeight: "calc(293px - 56px)" }}>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-[#8A96A8]">
            Loading classrooms...
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex items-center justify-center py-8 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-8 text-[#8A96A8]">
            {searchQuery ? "No classrooms found" : "No classrooms added yet"}
          </div>
        )}

        {/* Data Rows */}
        {!isLoading && !error && filtered.map((room, idx) => (
          <div
            key={room._id}
            className={`flex items-center px-8 py-3 text-sm border-b border-[#ECF0F4] ${
              idx === filtered.length - 1 ? "border-b-0" : ""
            } hover:bg-[#F7FAFF] transition`}
          >
            {editingId === room._id ? (
              <>
                {/* Edit Mode - Classroom Name (Read-only) */}
                <div className="flex-[1.5] text-[#4C5968] leading-snug">{room.name}</div>

                {/* Edit Mode - Classroom Type */}
                <div className="flex-[1.5] text-center">
                  <input
                    type="text"
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                    placeholder="e.g., Lab, Lecture Hall"
                  />
                </div>

                {/* Edit Mode - Capacity */}
                <div className="flex-[1] text-center">
                  <input
                    type="number"
                    value={editData.capacity}
                    onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                    className="w-full px-2 py-1 border border-[#BFBFBF] rounded text-[13px] text-center focus:outline-none focus:ring-1 focus:ring-[#1DA5FF]"
                    placeholder="Capacity"
                    min="1"
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
                {/* View Mode - Classroom Name */}
                <div className="flex-[1.5] text-[#4C5968] leading-snug">{room.name}</div>

                {/* View Mode - Classroom Type */}
                <div className="flex-[1.5] text-center text-[#8A96A8] capitalize">{room.type}</div>

                {/* View Mode - Capacity */}
                <div className="flex-[1] text-center text-[#8A96A8]">{room.capacity}</div>

                {/* View Mode - Actions */}
                <div className="w-20 flex items-center justify-center gap-3">
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
              </>
            )}
          </div>
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
  );
}