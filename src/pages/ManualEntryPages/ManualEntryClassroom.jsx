import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ added
import '../../custom-scrollbar.css';
import noDataImage from '../../assets/images/nodataa.png';



// API Configuration
const BASE_URL = "http://localhost:5000";

const handleUnauthorized = (res) => {
  if (res.status === 401) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  }
};

// API Functions
const getClassrooms = async () => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }

  return res.json();
};

const addClassroom = async (classroomData) => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(classroomData),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to add classroom: ${res.status}`
    );
  }

  return res.json();
};

const deleteClassroom = async (classroomId) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete classroom: ${res.status}`
    );
  }

  return res.json();
};

const updateClassroom = async (classroomId, classroomData) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(classroomData),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update classroom: ${res.status}`
    );
  }

  return res.json();
};

// Bulk Upload API
const bulkUploadClassrooms = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("📤 Uploading file:", file.name);

  const res = await fetch(`${BASE_URL}/api/classrooms/bulk-upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
  }

  return res.json();
};

// Component for Upload Button (UNCHANGED)
const Component = ({ property1, className, headingClassName, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${property1 === "variant-12" ? "top-[260px]" : "top-[186px]"
        } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${className || ""
        }`}
    >
      <p
        className={`font-['Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${headingClassName || ""
          }`}
      >
        Upload File ( CSV / XLSX )
      </p>
    </button>
  );
};

// ClassroomData Component (✅ Edit/Delete mapping fixed)
const ClassroomData = ({ classrooms, onEdit, onDelete, searchQuery }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", type: "", capacity: "" });

  const filtered = classrooms.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (room) => {
    setEditingId(room._id);
    setEditForm({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await onEdit(id, editForm); // ✅ correct mapping
      setEditingId(null);
    } catch (error) {
      alert("Failed to update classroom: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", type: "", capacity: "" });
  };

  return (
    <div className="mt-6 pb-6">
      <div
        className="bg-white w-full relative"
        style={{
          width: "100%",
          height: "410px",
          borderRadius: "12.23px",
          border: "1.83px solid #DFDFDF",
          overflow: "hidden",
        }}
      >
        {/* Header row */}
        <div className="px-8 pt-4 pb-2 bg-white mr-3">
          <div
            className="flex items-center text-[14px] font-medium"
            style={{
              color: "#265768",
              fontFamily: "'Mulish', sans-serif",
            }}
          >
            <div className="flex-[1.5] text-center">Classroom number</div>
            <div className="flex-[1.5] text-center">Classroom type</div>
            <div className="flex-1 text-center">Capacity</div>
            <div className="w-20 text-center">Actions</div>
          </div>

          <div
            className="mt-3 h-[3px] rounded"
            style={{
              background: "#0b84d6",
              boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
            }}
          />
        </div>

        {/* Body rows */}
        <div
          className="overflow-y-auto custom-scroll mr-3"
          style={{ maxHeight: "400px" }}
        >
          <div className="px-8">
            {filtered.map((room, idx) => (
              <div
                key={room._id || idx}
                className={`flex items-center py-3.5 hover:bg-gray-50 transition ${idx === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                style={{ borderBottom: "3px solid #D9D9D9" }}
              >
                {editingId === room._id ? (
                  <>
                    <div className="flex-[1.5]">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#4C5968]"
                      />
                    </div>

                    <div className="flex-[1.5] px-2">
                      <select
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#8C96A3]"
                      >
                        <option value="lecture">Lecture Hall</option>
                        <option value="lab">Computer Lab</option>
                        <option value="seminar">Seminar Room</option>
                      </select>
                    </div>

                    <div className="flex-1 px-2">
                      <input
                        type="number"
                        value={editForm.capacity}
                        onChange={(e) =>
                          setEditForm({ ...editForm, capacity: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-center text-[#4C5968]"
                      />
                    </div>

                    <div className="w-20 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleSaveEdit(room._id)}
                        className="text-[#10B981] hover:text-[#059669]"
                      >
                        <Check size={15} />
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="text-[#EF4444] hover:text-[#DC2626]"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-[1.5] text-[13px] text-[#265768] text-center">
                      {room.name}
                    </div>

                    <div className="flex-[1.5] text-center text-[13px] text-[#265768] capitalize">
                      {room.type}
                    </div>

                    <div className="flex-1 text-center text-[13px] text-[#265768]">
                      {room.capacity}
                    </div>

                    <div className="w-20 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(room)}
                        className="text-[#C0C6D0] hover:text-[#1A8FE3] transition"
                      >
                        <Edit2 size={15} />
                      </button>

                      {/* ✅ Delete mapping fixed */}
                      <button
                        onClick={() => onDelete(room._id)}
                        className="text-[#C0C6D0] hover:text-[#F04438] transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

// Main ManualEntryClassroom Component
export const ManualEntryClassroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [classroomNumber, setClassroomNumber] = useState("");
  const [classroomType, setClassroomType] = useState("lecture");
  const [classroomCapacity, setClassroomCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await getClassrooms();
      if (response.success && response.data) {
        setClassrooms(response.data);
        if (response.data.length > 0) setShowTable(true);
      }
    } catch (err) {
      setError("Failed to load classrooms: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClassroom = async () => {
    if (!classroomNumber || !classroomType || !classroomCapacity) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const newClassroom = {
        name: classroomNumber,
        type: classroomType,
        capacity: parseInt(classroomCapacity, 10),
      };

      const response = await addClassroom(newClassroom);

      if (response.success) {
        await fetchClassrooms();
        setClassroomNumber("");
        setClassroomType("lecture");
        setClassroomCapacity("");
        setShowTable(true);
      }
    } catch (err) {
      alert("Failed to add classroom: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClassroom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this classroom?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await deleteClassroom(id);

      if (response.success) {
        await fetchClassrooms();

      }
    } catch (err) {
      alert("Failed to delete classroom: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClassroom = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await updateClassroom(id, {
        name: updatedData.name,
        type: updatedData.type,
        capacity: parseInt(updatedData.capacity, 10),
      });

      if (response.success) {
        await fetchClassrooms();
      }
    } catch (err) {
      alert("Failed to update classroom: " + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(csv|xlsx|xls)$/i)
    ) {
      alert("Please upload a valid CSV or XLSX file");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      const response = await bulkUploadClassrooms(file);

      if (response.success) {
        await fetchClassrooms();
        setShowTable(true);
        alert(`Successfully uploaded ${response.data?.count || "classrooms"}!`);
      }
    } catch (err) {
      alert("Failed to upload file: " + err.message);
      console.error(err);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
          style={{
            borderColor: "#e8e8e8",
          }}
        >
          <div className="px-6 pt-4 pb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{
                  textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
                }}
              >
                Ezey
              </div>
              <button
                type="button"
                onClick={() => navigate("/form")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X size={28} color="#265768" strokeWidth={3} />
              </button>
            </div>

            <div className="flex justify-between items-end mb-3">
              {/* Title */}
              <div className="flex items-center gap-2">
                <img
                  className="w-[24px] h-[24px]"
                  alt="Classroom icon"
                  src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
                />
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                  Quick add classroom
                </h2>
              </div>

              {/* Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  style={{
                    minWidth: 170,
                    height: 34,
                    background: "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
                    borderRadius: 6,
                    color: "white",
                    fontSize: 12,
                    fontFamily: "'Mulish', sans-serif",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                    opacity: uploading ? 0.7 : 1,
                    cursor: uploading ? "not-allowed" : "pointer",
                    padding: "0 14px",
                  }}
                >
                  {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
                </button>
              </div>
            </div>

            <div
              className="h-[3px] bg-[#0b84d6] rounded w-[calc(100%+48px)] -mx-6"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {/* FORM */}
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-6 mr-0 lg:mr-8">
                <div className="lg:col-span-3">
                  <div className="text-[#265768] font-['Mulish'] text-[14px] mb-1">
                    Enter classroom number
                  </div>
                  <input
                    type="text"
                    value={classroomNumber}
                    onChange={(e) => setClassroomNumber(e.target.value)}
                    placeholder="e.g. B-210"
                    className="w-full h-[40px] rounded-[15px] border-[1.5px] border-[#DFDFDF] px-3 text-[14px] font-['Mulish'] text-black bg-white focus:outline-none focus:border-[#4BACCE]"
                  />
                </div>

                <div className="lg:col-span-3">
                  <div className="text-[#265768] font-['Mulish'] text-[14px] mb-1">
                    Classroom type
                  </div>
                  <select
                    value={classroomType}
                    onChange={(e) => setClassroomType(e.target.value)}
                    className="w-full h-[40px] rounded-[15px] border-[1.5px] border-[#DFDFDF] px-3 text-[14px] font-['Mulish'] text-black bg-white focus:outline-none focus:border-[#4BACCE]"
                  >
                    <option value="lecture">Lecture Hall</option>
                    <option value="lab">Computer Lab</option>
                    <option value="seminar">Seminar Room</option>
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <div className="text-[#265768] font-['Mulish'] text-[14px] mb-1">
                    Classroom capacity
                  </div>
                  <input
                    type="number"
                    value={classroomCapacity}
                    onChange={(e) => setClassroomCapacity(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full h-[40px] rounded-[15px] border-[1.5px] border-[#DFDFDF] px-3 text-[14px] font-['Mulish'] text-black bg-white focus:outline-none focus:border-[#4BACCE]"
                  />
                </div>

                {/* Add Button */}
                <div className="lg:col-span-3 flex items-end justify-start lg:justify-end">
                  <button
                    onClick={handleAddClassroom}
                    disabled={loading}
                    className="h-[40px] flex items-center text-[12px] font-['Mulish'] text-[#9CA3AF] hover:text-[#4BACCE] whitespace-nowrap transition-colors"
                  >
                    {loading ? "Adding..." : "+ Add classroom"}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {(error || uploading) && (
              <div
                className={`mt-3 text-center text-sm font-medium ${error ? "text-red-500" : "text-blue-500"
                  }`}
              >
                {uploading ? "Uploading file..." : error}
              </div>
            )}

            {/* Table / No data */}
            {showTable ? (
              <ClassroomData
                classrooms={classrooms}
                onEdit={handleEditClassroom}
                onDelete={handleDeleteClassroom}
                searchQuery=""
              />
            ) : (
              <div
                className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4"
                style={{ height: "450px", borderColor: "#DFDFDF" }}
              >
                <img
                  src={noDataImage}
                  alt="No Data"
                  className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]"
                />
                <div
                  className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  No Data !
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div >
  );
};

export default ManualEntryClassroom;









