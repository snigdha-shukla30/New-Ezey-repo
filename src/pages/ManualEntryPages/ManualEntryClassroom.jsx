import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ added

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

  const res = await fetch(`${BASE_URL}/classrooms/bulk-upload`, {
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
      className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${
        property1 === "variant-12" ? "top-[260px]" : "top-[186px]"
      } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${
        className || ""
      }`}
    >
      <p
        className={`font-['Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
          headingClassName || ""
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
          height: "460px",
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
                className={`flex items-center py-3.5 hover:bg-gray-50 transition ${
                  idx === filtered.length - 1 ? "border-b-0" : ""
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

        {/* Scrollbar CSS */}
        <style>{`
          .custom-scroll::-webkit-scrollbar {
            width: 8.78px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 44.02px;
            border: 1.22px solid #E5E5E5;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
            border-radius: 4.89px;
            width: 13.23px;
            min-height: 70px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
          }
        `}</style>
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
    <div className="min-h-screen bg-[#F3F6FB]">
      <div className="w-full">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full"
          style={{
            borderColor: "#e8e8e8",
            minHeight: "100vh",
          }}
        >
          {/* ✅ TOP RIGHT CROSS BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/form")}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
            aria-label="Close"
          >
            <X size={20} color="#265768" />
          </button>

          <div className="px-6 pt-6">
            {/* Header */}
            <div className="mb-3 relative">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{
                  textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
                }}
              >
                Ezey
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* ✅ Upload button thoda niche shifted */}
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                style={{
                  position: "absolute",
                  right: 24,
                  top: 40, // ✅ SHIFTED NICHE (was 0)
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

            {/* Title */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <img
                className="w-[24px] h-[24px]"
                alt="Classroom icon"
                src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
              />
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                Quick add classroom
              </h2>
            </div>

            <div
              className="w-full h-[3px] bg-[#0b84d6] rounded"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {/* FORM */}
            <div className="mt-6">
              <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
                <div className="col-span-3">
                  <div
                    className="text-xs mb-1"
                    style={{
                      color: "#265768",
                      fontFamily: "'Mulish', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    Enter classroom number
                  </div>

                  <input
                    type="text"
                    value={classroomNumber}
                    onChange={(e) => setClassroomNumber(e.target.value)}
                    placeholder="e.g. B-210"
                    style={{
                      width: "274.5px",
                      height: "40px",
                      borderRadius: "15px",
                      border: "1.5px solid #DFDFDF",
                      fontSize: "14px",
                      fontFamily: "'Mulish', sans-serif",
                      color: "#000000",
                      background: "#FFFFFF",
                      padding: "0 12px",
                      boxSizing: "border-box",
                    }}
                    className="custom-input"

                  />
                </div>

                <div className="col-span-3">
                  <div
                    className="text-xs mb-1"
                    style={{
                      color: "#265768",
                      fontFamily: "'Mulish', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    Classroom type
                  </div>

                  <select
                    value={classroomType}
                    onChange={(e) => setClassroomType(e.target.value)}
                    style={{
                      width: "274.5px",
                      height: "40px",
                      borderRadius: "15px",
                      border: "1.5px solid #DFDFDF",
                      fontSize: "14px",
                      fontFamily: "'Mulish', sans-serif",
                      color: "#000000",
                      background: "#FFFFFF",
                      padding: "0 12px",
                      boxSizing: "border-box",
                    }}
                    className="custom-input"

                  >
                    <option value="lecture">Lecture Hall</option>
                    <option value="lab">Computer Lab</option>
                    <option value="seminar">Seminar Room</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <div
                    className="text-xs mb-1"
                    style={{
                      color: "#265768",
                      fontFamily: "'Mulish', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    Classroom capacity
                  </div>

                  <input
                    type="number"
                    value={classroomCapacity}
                    onChange={(e) => setClassroomCapacity(e.target.value)}
                    placeholder="e.g. 45"
                    style={{
                      width: "274.5px",
                      height: "40px",
                      borderRadius: "15px",
                      border: "1.5px solid #DFDFDF",
                      fontSize: "14px",
                      fontFamily: "'Mulish', sans-serif",
                      color: "#000000",
                      background: "#FFFFFF",
                      padding: "0 12px",
                      boxSizing: "border-box",
                    }}
                    className="custom-input"

                  />
                </div>

                {/* small add button */}
                <div className="col-span-3 flex items-end justify-end">
                  <button
                    onClick={handleAddClassroom}
                    disabled={loading}
                    style={{
                      fontSize: "12px",
                      color: "rgb(77, 172, 206)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Mulish', sans-serif",
                      position: "relative",
                      top: "6px",
                      whiteSpace: "nowrap",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? "Adding..." : "+ Add classroom"}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {(error || uploading) && (
              <div
                className={`mt-3 text-center text-sm font-medium ${
                  error ? "text-red-500" : "text-blue-500"
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
                className="mt-6 border rounded-lg flex justify-center items-center"
                style={{ height: "320px", borderColor: "#DFDFDF" }}
              >
                <div
                  className="text-[32px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  No Data !
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`

                    .custom-input {
  width: 274.5px;
  height: 40px;
  border-radius: 15px;
  border: 1.5px solid #DFDFDF;
  font-size: 14px;
  font-family: 'Mulish', sans-serif;
  color: #000000;
  background: #FFFFFF;
  padding: 0 12px;
  box-sizing: border-box;
  outline: none;
  transition: 0.2s ease;
}

.custom-input:focus {
  border: 1.5px solid #0b84d6;     /* focus border */
  box-shadow: 0 0 0 3px rgba(11,132,214,0.2);  /* glow */
}
 `}</style>
    </div>
  );
};

export default ManualEntryClassroom;

<style>{`

                    .custom-input {
  width: 274.5px;
  height: 40px;
  border-radius: 15px;
  border: 1.5px solid #DFDFDF;
  font-size: 14px;
  font-family: 'Mulish', sans-serif;
  color: #000000;
  background: #FFFFFF;
  padding: 0 12px;
  box-sizing: border-box;
  outline: none;
  transition: 0.2s ease;
}

.custom-input:focus {
  border: 1.5px solid #0b84d6;     /* focus border */
  box-shadow: 0 0 0 3px rgba(11,132,214,0.2);  /* glow */
}
 `}</style>
















// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2, X, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // ✅ added

// // API Configuration
// const BASE_URL = "http://localhost:5000";

// const handleUnauthorized = (res) => {
//   if (res.status === 401) {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("user");
//   }
// };

// // API Functions
// const getClassrooms = async () => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `API Error: ${res.status}`);
//   }

//   return res.json();
// };

// const addClassroom = async (classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to add classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const deleteClassroom = async (classroomId) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to delete classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const updateClassroom = async (classroomId, classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to update classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// // Bulk Upload API
// const bulkUploadClassrooms = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch(`${BASE_URL}/classrooms/bulk-upload`, {
//     method: "POST",
//     credentials: "include",
//     body: formData,
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
//   }

//   return res.json();
// };

// // Component for Upload Button (UNCHANGED)
// const Component = ({ property1, className, headingClassName, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${
//         property1 === "variant-12" ? "top-[260px]" : "top-[186px]"
//       } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${
//         className || ""
//       }`}
//     >
//       <p
//         className={`font-['Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // ClassroomData Component (✅ table height increased)
// const ClassroomData = ({ classrooms, onEdit, onDelete, searchQuery }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: "", type: "", capacity: "" });

//   const filtered = classrooms.filter((c) =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleEditClick = (room) => {
//     setEditingId(room._id);
//     setEditForm({
//       name: room.name,
//       type: room.type,
//       capacity: room.capacity,
//     });
//   };

//   const handleSaveEdit = async (id) => {
//     try {
//       await onEdit(id, editForm);
//       setEditingId(null);
//     } catch (error) {
//       alert("Failed to update classroom: " + error.message);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", type: "", capacity: "" });
//   };

//   return (
//     <div className="mt-6 pb-6">
//       <div
//         className="bg-white w-full relative"
//         style={{
//           width: "100%",
//           height: "460px", // ✅ UPDATED (was 360px)
//           borderRadius: "12.23px",
//           border: "1.83px solid #DFDFDF",
//           overflow: "hidden",
//         }}
//       >
//         {/* Header row */}
//         <div className="px-8 pt-4 pb-2 bg-white mr-3">
//           <div
//             className="flex items-center text-[14px] font-medium"
//             style={{
//               color: "#265768",
//               fontFamily: "'Mulish', sans-serif",
//             }}
//           >
//             <div className="flex-[1.5] text-center">Classroom number</div>
//             <div className="flex-[1.5] text-center">Classroom type</div>
//             <div className="flex-1 text-center">Capacity</div>
//             <div className="w-20 text-center">Actions</div>
//           </div>

//           <div
//             className="mt-3 h-[3px] rounded"
//             style={{
//               background: "#0b84d6",
//               boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
//             }}
//           />
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll mr-3"
//           style={{ maxHeight: "400px" }} // ✅ UPDATED (was 300px)
//         >
//           <div className="px-8">
//             {filtered.map((room, idx) => (
//               <div
//                 key={room._id}
//                 className={`flex items-center py-3.5 hover:bg-gray-50 transition ${
//                   idx === filtered.length - 1 ? "border-b-0" : ""
//                 }`}
//                 style={{ borderBottom: "3px solid #D9D9D9" }}
//               >
//                 {editingId === room._id ? (
//                   <>
//                     <div className="flex-[1.5]">
//                       <input
//                         type="text"
//                         value={editForm.name}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, name: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#4C5968]"
//                       />
//                     </div>

//                     <div className="flex-[1.5] px-2">
//                       <select
//                         value={editForm.type}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, type: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#8C96A3]"
//                       >
//                         <option value="lecture">Lecture Hall</option>
//                         <option value="lab">Computer Lab</option>
//                         <option value="seminar">Seminar Room</option>
//                       </select>
//                     </div>

//                     <div className="flex-1 px-2">
//                       <input
//                         type="number"
//                         value={editForm.capacity}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, capacity: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-center text-[#4C5968]"
//                       />
//                     </div>

//                     <div className="w-20 flex items-center justify-center gap-3">
//                       <button
//                         onClick={() => handleSaveEdit(room._id)}
//                         className="text-[#10B981] hover:text-[#059669]"
//                       >
//                         <Check size={15} />
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="text-[#EF4444] hover:text-[#DC2626]"
//                       >
//                         <X size={15} />
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex-[1.5] text-[13px] text-[#265768] text-center">
//                       {room.name}
//                     </div>

//                     <div className="flex-[1.5] text-center text-[13px] text-[#265768] capitalize">
//                       {room.type}
//                     </div>

//                     <div className="flex-1 text-center text-[13px] text-[#265768]">
//                       {room.capacity}
//                     </div>

//                     <div className="w-20 flex items-center justify-center gap-3">
//                       <button
//                         onClick={() => handleEditClick(room)}
//                         className="text-[#C0C6D0] hover:text-[#1A8FE3] transition"
//                       >
//                         <Edit2 size={15} />
//                       </button>
//                       <button
//                         onClick={() => onDelete(room._id)}
//                         className="text-[#C0C6D0] hover:text-[#F04438] transition"
//                       >
//                         <Trash2 size={15} />
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ✅ Scrollbar EXACT SAME as Subject page */}
//         <style>{`
//           .custom-scroll::-webkit-scrollbar {
//             width: 8.78px;
//           }
//           .custom-scroll::-webkit-scrollbar-track {
//             background: transparent;
//             border-radius: 44.02px;
//             border: 1.22px solid #E5E5E5;
//           }
//           .custom-scroll::-webkit-scrollbar-thumb {
//             background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
//             border-radius: 4.89px;
//             width: 13.23px;
//             min-height: 70px;
//           }
//           .custom-scroll::-webkit-scrollbar-thumb:hover {
//             background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// // Main ManualEntryClassroom Component
// export const ManualEntryClassroom = () => {
//   const [classrooms, setClassrooms] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [classroomNumber, setClassroomNumber] = useState("");
//   const [classroomType, setClassroomType] = useState("lecture");
//   const [classroomCapacity, setClassroomCapacity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchClassrooms();
//   }, []);

//   const fetchClassrooms = async () => {
//     try {
//       setLoading(true);
//       const response = await getClassrooms();
//       if (response.success && response.data) {
//         setClassrooms(response.data);
//         if (response.data.length > 0) setShowTable(true);
//       }
//     } catch (err) {
//       setError("Failed to load classrooms: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClassroom = async () => {
//     if (!classroomNumber || !classroomType || !classroomCapacity) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const newClassroom = {
//         name: classroomNumber,
//         type: classroomType,
//         capacity: parseInt(classroomCapacity, 10),
//       };

//       const response = await addClassroom(newClassroom);

//       if (response.success) {
//         await fetchClassrooms();
//         setClassroomNumber("");
//         setClassroomType("lecture");
//         setClassroomCapacity("");
//         setShowTable(true);
//       }
//     } catch (err) {
//       alert("Failed to add classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClassroom = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this classroom?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await deleteClassroom(id);

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom deleted successfully!");
//       }
//     } catch (err) {
//       alert("Failed to delete classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClassroom = async (id, updatedData) => {
//     try {
//       setLoading(true);
//       const response = await updateClassroom(id, {
//         name: updatedData.name,
//         type: updatedData.type,
//         capacity: parseInt(updatedData.capacity, 10),
//       });

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom updated successfully!");
//       }
//     } catch (err) {
//       alert("Failed to update classroom: " + err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const validTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];

//     if (
//       !validTypes.includes(file.type) &&
//       !file.name.match(/\.(csv|xlsx|xls)$/i)
//     ) {
//       alert("Please upload a valid CSV or XLSX file");
//       event.target.value = "";
//       return;
//     }

//     try {
//       setUploading(true);
//       const response = await bulkUploadClassrooms(file);

//       if (response.success) {
//         await fetchClassrooms();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "classrooms"}!`);
//       }
//     } catch (err) {
//       alert("Failed to upload file: " + err.message);
//       console.error(err);
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F6FB]">
//       <div className="w-full">
//         <div
//           className="bg-white rounded-[10px] shadow-sm border relative w-full"
//           style={{
//             borderColor: "#e8e8e8",
//             minHeight: "100vh", // ✅ FULL HEIGHT without padding
//           }}
//         >
//           {/* ✅ TOP RIGHT CROSS BUTTON */}
//           <button
//             type="button"
//             onClick={() => navigate("/form")}
//             className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
//             aria-label="Close"
//           >
//             <X size={20} color="#265768" />
//           </button>

//           {/* ✅ HEADER + CONTENT */}
//           <div className="px-6 pt-6">
//             {/* Header */}
//             <div className="mb-3 relative">
//               <div
//                 className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
//                 style={{
//                   textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//                 }}
//               >
//                 Ezey
//               </div>

//               {/* Hidden file input */}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />

//               {/* ✅ Buttons aligned like screenshot */}
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 24,
//                   top: 0,
//                   display: "flex",
//                   gap: "12px",
//                   alignItems: "center",
//                 }}
//               >
//                 <button
//                   onClick={handleUploadClick}
//                   disabled={uploading}
//                   style={{
//                     minWidth: 170,
//                     height: 34,
//                     background:
//                       "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
//                     borderRadius: 6,
//                     color: "white",
//                     fontSize: 12,
//                     fontFamily: "'Mulish', sans-serif",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
//                     opacity: uploading ? 0.7 : 1,
//                     cursor: uploading ? "not-allowed" : "pointer",
//                     padding: "0 14px",
//                   }}
//                 >
//                   {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
//                 </button>

//                 <button
//                   onClick={handleAddClassroom}
//                   disabled={loading}
//                   style={{
//                     minWidth: 170,
//                     height: 34,
//                     background: "#ffffff",
//                     borderRadius: 6,
//                     color: "#265768",
//                     fontSize: 12,
//                     fontFamily: "'Mulish', sans-serif",
//                     border: "1px solid #4BACCE",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
//                     opacity: loading ? 0.7 : 1,
//                     cursor: loading ? "not-allowed" : "pointer",
//                     padding: "0 14px",
//                   }}
//                 >
//                   {loading ? "Adding..." : "Add Classroom"}
//                 </button>
//               </div>
//             </div>

//             {/* Title */}
//             <div className="flex items-center gap-2 mt-2 mb-3">
//               <img
//                 className="w-[24px] h-[24px]"
//                 alt="Classroom icon"
//                 src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
//               />
//               <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
//                 Quick add classroom
//               </h2>
//             </div>

//             {/* Blue divider */}
//             <div
//               className="w-full h-[3px] bg-[#0b84d6] rounded"
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
//             />

//             {/* ✅ FORM */}
//             <div className="mt-6">
//               <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Enter classroom number
//                   </div>

//                   <input
//                     type="text"
//                     value={classroomNumber}
//                     onChange={(e) => setClassroomNumber(e.target.value)}
//                     placeholder="e.g. B-210"
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Classroom type
//                   </div>

//                   <select
//                     value={classroomType}
//                     onChange={(e) => setClassroomType(e.target.value)}
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   >
//                     <option value="lecture">Lecture Hall</option>
//                     <option value="lab">Computer Lab</option>
//                     <option value="seminar">Seminar Room</option>
//                   </select>
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Classroom capacity
//                   </div>

//                   <input
//                     type="number"
//                     value={classroomCapacity}
//                     onChange={(e) => setClassroomCapacity(e.target.value)}
//                     placeholder="e.g. 45"
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 {/* small add button remains */}
//                 <div className="col-span-3 flex items-end justify-end">
//                   <button
//                     onClick={handleAddClassroom}
//                     disabled={loading}
//                     style={{
//                       fontSize: "12px",
//                       color: "rgb(77, 172, 206)",
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                       fontFamily: "'Mulish', sans-serif",
//                       position: "relative",
//                       top: "6px",
//                       whiteSpace: "nowrap",
//                       opacity: loading ? 0.6 : 1,
//                     }}
//                   >
//                     {loading ? "Adding..." : "+ Add classroom"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

//             {(error || uploading) && (
//               <div
//                 className={`mt-3 text-center text-sm font-medium ${
//                   error ? "text-red-500" : "text-blue-500"
//                 }`}
//               >
//                 {uploading ? "Uploading file..." : error}
//               </div>
//             )}

//             {/* Table / No data */}
//             {showTable ? (
//               <ClassroomData
//                 classrooms={classrooms}
//                 onEdit={handleEditClassroom}
//                 onDelete={handleDeleteClassroom}
//                 searchQuery=""
//               />
//             ) : (
//               <div
//                 className="mt-6 border rounded-lg flex justify-center items-center"
//                 style={{ height: "320px", borderColor: "#DFDFDF" }}
//               >
//                 <div
//                   className="text-[32px] font-['Playfair_Display'] font-bold text-[#aeadad]"
//                   style={{ fontFamily: "Playfair Display, serif" }}
//                 >
//                   No Data !
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryClassroom;










// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2, X, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // ✅ added

// // API Configuration
// const BASE_URL = "http://localhost:5000";

// const handleUnauthorized = (res) => {
//   if (res.status === 401) {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("user");
//   }
// };

// // API Functions
// const getClassrooms = async () => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `API Error: ${res.status}`);
//   }

//   return res.json();
// };

// const addClassroom = async (classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to add classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const deleteClassroom = async (classroomId) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to delete classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const updateClassroom = async (classroomId, classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to update classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// // Bulk Upload API
// const bulkUploadClassrooms = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch(`${BASE_URL}/classrooms/bulk-upload`, {
//     method: "POST",
//     credentials: "include",
//     body: formData,
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
//   }

//   return res.json();
// };

// // Component for Upload Button (UNCHANGED)
// const Component = ({ property1, className, headingClassName, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${
//         property1 === "variant-12" ? "top-[214px]" : "top-[146px]"
//       } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${
//         className || ""
//       }`}
//     >
//       <p
//         className={`font-['Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // ClassroomData Component (Alignment + scrollbar updated only)
// const ClassroomData = ({ classrooms, onEdit, onDelete, searchQuery }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: "", type: "", capacity: "" });

//   const filtered = classrooms.filter((c) =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleEditClick = (room) => {
//     setEditingId(room._id);
//     setEditForm({
//       name: room.name,
//       type: room.type,
//       capacity: room.capacity,
//     });
//   };

//   const handleSaveEdit = async (id) => {
//     try {
//       await onEdit(id, editForm);
//       setEditingId(null);
//     } catch (error) {
//       alert("Failed to update classroom: " + error.message);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", type: "", capacity: "" });
//   };

//   return (
//     <div className="mt-6 pb-6">
//       <div
//         className="bg-white w-full relative"
//         style={{
//           width: "100%",
//           height: "360px",
//           borderRadius: "12.23px",
//           border: "1.83px solid #DFDFDF",
//           overflow: "hidden",
//         }}
//       >
//         {/* Header row */}
//         <div className="px-8 pt-4 pb-2 bg-white mr-3">
//           <div
//             className="flex items-center text-[14px] font-medium"
//             style={{
//               color: "#265768",
//               fontFamily: "'Mulish', sans-serif",
//             }}
//           >
//             <div className="flex-[1.5] text-center">Classroom number</div>
//             <div className="flex-[1.5] text-center">Classroom type</div>
//             <div className="flex-1 text-center">Capacity</div>
//             <div className="w-20 text-center">Actions</div>
//           </div>

//           <div
//             className="mt-3 h-[3px] rounded"
//             style={{
//               background: "#0b84d6",
//               boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
//             }}
//           />
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll mr-3"
//           style={{ maxHeight: "300px" }}
//         >
//           <div className="px-8">
//             {filtered.map((room, idx) => (
//               <div
//                 key={room._id}
//                 className={`flex items-center py-3.5 hover:bg-gray-50 transition ${
//                   idx === filtered.length - 1 ? "border-b-0" : ""
//                 }`}
//                 style={{ borderBottom: "3px solid #D9D9D9" }}
//               >
//                 {editingId === room._id ? (
//                   <>
//                     <div className="flex-[1.5]">
//                       <input
//                         type="text"
//                         value={editForm.name}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, name: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#4C5968]"
//                       />
//                     </div>

//                     <div className="flex-[1.5] px-2">
//                       <select
//                         value={editForm.type}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, type: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#8C96A3]"
//                       >
//                         <option value="lecture">Lecture Hall</option>
//                         <option value="lab">Computer Lab</option>
//                         <option value="seminar">Seminar Room</option>
//                       </select>
//                     </div>

//                     <div className="flex-1 px-2">
//                       <input
//                         type="number"
//                         value={editForm.capacity}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, capacity: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-center text-[#4C5968]"
//                       />
//                     </div>

//                     <div className="w-20 flex items-center justify-center gap-3">
//                       <button
//                         onClick={() => handleSaveEdit(room._id)}
//                         className="text-[#10B981] hover:text-[#059669]"
//                       >
//                         <Check size={15} />
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="text-[#EF4444] hover:text-[#DC2626]"
//                       >
//                         <X size={15} />
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex-[1.5] text-[13px] text-[#265768] text-center">
//                       {room.name}
//                     </div>

//                     <div className="flex-[1.5] text-center text-[13px] text-[#265768] capitalize">
//                       {room.type}
//                     </div>

//                     <div className="flex-1 text-center text-[13px] text-[#265768]">
//                       {room.capacity}
//                     </div>

//                     <div className="w-20 flex items-center justify-center gap-3">
//                       <button
//                         onClick={() => handleEditClick(room)}
//                         className="text-[#C0C6D0] hover:text-[#1A8FE3] transition"
//                       >
//                         <Edit2 size={15} />
//                       </button>
//                       <button
//                         onClick={() => onDelete(room._id)}
//                         className="text-[#C0C6D0] hover:text-[#F04438] transition"
//                       >
//                         <Trash2 size={15} />
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ✅ Scrollbar EXACT SAME as Subject page */}
//         <style>{`
//           .custom-scroll::-webkit-scrollbar {
//             width: 8.78px;
//           }
//           .custom-scroll::-webkit-scrollbar-track {
//             background: transparent;
//             border-radius: 44.02px;
//             border: 1.22px solid #E5E5E5;
//           }
//           .custom-scroll::-webkit-scrollbar-thumb {
//             background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
//             border-radius: 4.89px;
//             width: 13.23px;
//             min-height: 70px;
//           }
//           .custom-scroll::-webkit-scrollbar-thumb:hover {
//             background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// // Main ManualEntryClassroom Component
// export const ManualEntryClassroom = () => {
//   const [classrooms, setClassrooms] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [classroomNumber, setClassroomNumber] = useState("");
//   const [classroomType, setClassroomType] = useState("lecture");
//   const [classroomCapacity, setClassroomCapacity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchClassrooms();
//   }, []);

//   const fetchClassrooms = async () => {
//     try {
//       setLoading(true);
//       const response = await getClassrooms();
//       if (response.success && response.data) {
//         setClassrooms(response.data);
//         if (response.data.length > 0) setShowTable(true);
//       }
//     } catch (err) {
//       setError("Failed to load classrooms: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClassroom = async () => {
//     if (!classroomNumber || !classroomType || !classroomCapacity) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const newClassroom = {
//         name: classroomNumber,
//         type: classroomType,
//         capacity: parseInt(classroomCapacity, 10),
//       };

//       const response = await addClassroom(newClassroom);

//       if (response.success) {
//         await fetchClassrooms();
//         setClassroomNumber("");
//         setClassroomType("lecture");
//         setClassroomCapacity("");
//         setShowTable(true);
//       }
//     } catch (err) {
//       alert("Failed to add classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClassroom = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this classroom?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await deleteClassroom(id);

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom deleted successfully!");
//       }
//     } catch (err) {
//       alert("Failed to delete classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClassroom = async (id, updatedData) => {
//     try {
//       setLoading(true);
//       const response = await updateClassroom(id, {
//         name: updatedData.name,
//         type: updatedData.type,
//         capacity: parseInt(updatedData.capacity, 10),
//       });

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom updated successfully!");
//       }
//     } catch (err) {
//       alert("Failed to update classroom: " + err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const validTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];

//     if (
//       !validTypes.includes(file.type) &&
//       !file.name.match(/\.(csv|xlsx|xls)$/i)
//     ) {
//       alert("Please upload a valid CSV or XLSX file");
//       event.target.value = "";
//       return;
//     }

//     try {
//       setUploading(true);
//       const response = await bulkUploadClassrooms(file);

//       if (response.success) {
//         await fetchClassrooms();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "classrooms"}!`);
//       }
//     } catch (err) {
//       alert("Failed to upload file: " + err.message);
//       console.error(err);
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F6FB] ">
//       <div className="w-full">
//         <div
//           className="bg-white rounded-[10px] shadow-sm border relative w-full"
//           style={{
//             borderColor: "#e8e8e8",
//             minHeight: "100vh"
//           }}
//         >
//           {/* ✅ TOP RIGHT CROSS BUTTON */}
//           <button
//             type="button"
//             onClick={() => navigate("/form")}
//             className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
//             aria-label="Close"
//           >
//             <X size={20} color="#265768" />
//           </button>

//           {/* ✅ HEADER + CONTENT */}
//           <div className="px-6 pt-6">
//             {/* Header */}
//             <div className="mb-3 relative">
//               <div
//                 className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
//                 style={{
//                   textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//                 }}
//               >
//                 Ezey
//               </div>

//               {/* Hidden file input */}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />

//               {/* ✅ Buttons aligned like screenshot */}
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 24,
//                   top: 40,
//                   display: "flex",
//                   gap: "12px",
//                   alignItems: "center",
//                 }}
//               >
//                 <button
//                   onClick={handleUploadClick}
//                   disabled={uploading}
//                   style={{
//                     minWidth: 170,
//                     height: 34,
//                     background:
//                       "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
//                     borderRadius: 6,
//                     color: "white",
//                     fontSize: 12,
//                     fontFamily: "'Mulish', sans-serif",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
//                     opacity: uploading ? 0.7 : 1,
//                     cursor: uploading ? "not-allowed" : "pointer",
//                     padding: "0 14px",
//                   }}
//                 >
//                   {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
//                 </button>

//                 <button
//                   onClick={handleAddClassroom}
//                   disabled={loading}
//                   style={{
//                     minWidth: 170,
//                     height: 34,
//                     background: "#ffffff",
//                     borderRadius: 6,
//                     color: "#265768",
//                     fontSize: 12,
//                     fontFamily: "'Mulish', sans-serif",
//                     border: "1px solid #4BACCE",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
//                     opacity: loading ? 0.7 : 1,
//                     cursor: loading ? "not-allowed" : "pointer",
//                     padding: "0 14px",
//                   }}
//                 >
//                   {loading ? "Adding..." : "Add Classroom"}
//                 </button>
//               </div>
//             </div>

//             {/* Title */}
//             <div className="flex items-center gap-2 mt-2 mb-3">
//               <img
//                 className="w-[24px] h-[24px]"
//                 alt="Classroom icon"
//                 src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
//               />
//               <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
//                 Quick add classroom
//               </h2>
//             </div>

//             {/* Blue divider */}
//             <div
//               className="w-full h-[3px] bg-[#0b84d6] rounded"
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
//             />

//             {/* ✅ FORM */}
//             <div className="mt-6">
//               <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Enter classroom number
//                   </div>

//                   <input
//                     type="text"
//                     value={classroomNumber}
//                     onChange={(e) => setClassroomNumber(e.target.value)}
//                     placeholder="e.g. B-210"
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Classroom type
//                   </div>

//                   <select
//                     value={classroomType}
//                     onChange={(e) => setClassroomType(e.target.value)}
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   >
//                     <option value="lecture">Lecture Hall</option>
//                     <option value="lab">Computer Lab</option>
//                     <option value="seminar">Seminar Room</option>
//                   </select>
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Classroom capacity
//                   </div>

//                   <input
//                     type="number"
//                     value={classroomCapacity}
//                     onChange={(e) => setClassroomCapacity(e.target.value)}
//                     placeholder="e.g. 45"
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 {/* ✅ SMALL + Add classroom button BACK (mapping safe) */}
//                 <div className="col-span-3 flex items-end justify-end">
//                   <button
//                     onClick={handleAddClassroom}
//                     disabled={loading}
//                     style={{
//                       fontSize: "12px",
//                       color: "rgb(77, 172, 206)",
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                       fontFamily: "'Mulish', sans-serif",
//                       position: "relative",
//                       top: "6px",
//                       whiteSpace: "nowrap",
//                       opacity: loading ? 0.6 : 1,
//                     }}
//                   >
//                     {loading ? "Adding..." : "+ Add classroom"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

//             {(error || uploading) && (
//               <div
//                 className={`mt-3 text-center text-sm font-medium ${
//                   error ? "text-red-500" : "text-blue-500"
//                 }`}
//               >
//                 {uploading ? "Uploading file..." : error}
//               </div>
//             )}

//             {/* Table / No data */}
//             {showTable ? (
//               <ClassroomData
//                 classrooms={classrooms}
//                 onEdit={handleEditClassroom}
//                 onDelete={handleDeleteClassroom}
//                 searchQuery=""
//               />
//             ) : (
//               <div
//                 className="mt-6 border rounded-lg flex justify-center items-center"
//                 style={{ height: "320px", borderColor: "#DFDFDF" }}
//               >
//                 <div
//                   className="text-[32px] font-['Playfair_Display'] font-bold text-[#aeadad]"
//                   style={{ fontFamily: "Playfair Display, serif" }}
//                 >
//                   No Data !
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryClassroom;























// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2, X, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // ✅ added

// // API Configuration
// const BASE_URL = "http://localhost:5000";

// const handleUnauthorized = (res) => {
//   if (res.status === 401) {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("user");
//   }
// };

// // API Functions
// const getClassrooms = async () => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `API Error: ${res.status}`);
//   }

//   return res.json();
// };

// const addClassroom = async (classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to add classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const deleteClassroom = async (classroomId) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to delete classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const updateClassroom = async (classroomId, classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to update classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// // Bulk Upload API
// const bulkUploadClassrooms = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch(`${BASE_URL}/classrooms/bulk-upload`, {
//     method: "POST",
//     credentials: "include",
//     body: formData,
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
//   }

//   return res.json();
// };

// // Component for Upload Button (UNCHANGED)
// const Component = ({ property1, className, headingClassName, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${
//         property1 === "variant-12" ? "top-[214px]" : "top-[146px]"
//       } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${
//         className || ""
//       }`}
//     >
//       <p
//         className={`font-['Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // ClassroomData Component (Alignment + scrollbar updated only)
// const ClassroomData = ({ classrooms, onEdit, onDelete, searchQuery }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: "", type: "", capacity: "" });

//   const filtered = classrooms.filter((c) =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleEditClick = (room) => {
//     setEditingId(room._id);
//     setEditForm({
//       name: room.name,
//       type: room.type,
//       capacity: room.capacity,
//     });
//   };

//   const handleSaveEdit = async (id) => {
//     try {
//       await onEdit(id, editForm);
//       setEditingId(null);
//     } catch (error) {
//       alert("Failed to update classroom: " + error.message);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", type: "", capacity: "" });
//   };

//   return (
//     <div className="mt-6 pb-6 h-full">
//       <div
//         className="bg-white w-full relative"
//         style={{
//           width: "100%",
//           height: "360px",
//           borderRadius: "12.23px",
//           border: "1.83px solid #DFDFDF",
//           overflow: "hidden",
//         }}
//       >
//         {/* Header row */}
//         <div className="px-8 pt-4 pb-2 bg-white mr-3">
//           <div
//             className="flex items-center text-[14px] font-medium"
//             style={{
//               color: "#265768",
//               fontFamily: "'Mulish', sans-serif",
//             }}
//           >
//             <div className="flex-[1.5] text-center">Classroom number</div>
//             <div className="flex-[1.5] text-center">Classroom type</div>
//             <div className="flex-1 text-center">Capacity</div>
//             <div className="w-20 text-center">Actions</div>
//           </div>

//           <div
//             className="mt-3 h-[3px] rounded"
//             style={{
//               background: "#0b84d6",
//               boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
//             }}
//           />
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll mr-3"
//           style={{ maxHeight: "300px" }}
//         >
//           <div className="px-8">
//             {filtered.map((room, idx) => (
//               <div
//                 key={room._id}
//                 className={`flex items-center py-3.5 hover:bg-gray-50 transition ${
//                   idx === filtered.length - 1 ? "border-b-0" : ""
//                 }`}
//                 style={{ borderBottom: "3px solid #D9D9D9" }}
//               >
//                 {editingId === room._id ? (
//                   <>
//                     <div className="flex-[1.5]">
//                       <input
//                         type="text"
//                         value={editForm.name}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, name: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#4C5968]"
//                       />
//                     </div>

//                     <div className="flex-[1.5] px-2">
//                       <select
//                         value={editForm.type}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, type: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#8C96A3]"
//                       >
//                         <option value="lecture">Lecture Hall</option>
//                         <option value="lab">Computer Lab</option>
//                         <option value="seminar">Seminar Room</option>
//                       </select>
//                     </div>

//                     <div className="flex-1 px-2">
//                       <input
//                         type="number"
//                         value={editForm.capacity}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, capacity: e.target.value })
//                         }
//                         className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-center text-[#4C5968]"
//                       />
//                     </div>

//                     <div className="w-20 flex items-center justify-center gap-3">
//                       <button
//                         onClick={() => handleSaveEdit(room._id)}
//                         className="text-[#10B981] hover:text-[#059669]"
//                       >
//                         <Check size={15} />
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="text-[#EF4444] hover:text-[#DC2626]"
//                       >
//                         <X size={15} />
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex-[1.5] text-[13px] text-[#265768] text-center">
//                       {room.name}
//                     </div>

//                     <div className="flex-[1.5] text-center text-[13px] text-[#265768] capitalize">
//                       {room.type}
//                     </div>

//                     <div className="flex-1 text-center text-[13px] text-[#265768]">
//                       {room.capacity}
//                     </div>

//                     <div className="w-20 flex items-center justify-center gap-3">
//                       <button
//                         onClick={() => handleEditClick(room)}
//                         className="text-[#C0C6D0] hover:text-[#1A8FE3] transition"
//                       >
//                         <Edit2 size={15} />
//                       </button>
//                       <button
//                         onClick={() => onDelete(room._id)}
//                         className="text-[#C0C6D0] hover:text-[#F04438] transition"
//                       >
//                         <Trash2 size={15} />
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ✅ Scrollbar EXACT SAME as Subject page */}
//         <style>{`
//           .custom-scroll::-webkit-scrollbar {
//             width: 8.78px;
//           }
//           .custom-scroll::-webkit-scrollbar-track {
//             background: transparent;
//             border-radius: 44.02px;
//             border: 1.22px solid #E5E5E5;
//           }
//           .custom-scroll::-webkit-scrollbar-thumb {
//             background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
//             border-radius: 4.89px;
//             width: 13.23px;
//             min-height: 70px;
//           }
//           .custom-scroll::-webkit-scrollbar-thumb:hover {
//             background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// // Main ManualEntryClassroom Component
// export const ManualEntryClassroom = () => {
//   const [classrooms, setClassrooms] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [classroomNumber, setClassroomNumber] = useState("");
//   const [classroomType, setClassroomType] = useState("lecture");
//   const [classroomCapacity, setClassroomCapacity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchClassrooms();
//   }, []);

//   const fetchClassrooms = async () => {
//     try {
//       setLoading(true);
//       const response = await getClassrooms();
//       if (response.success && response.data) {
//         setClassrooms(response.data);
//         if (response.data.length > 0) setShowTable(true);
//       }
//     } catch (err) {
//       setError("Failed to load classrooms: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClassroom = async () => {
//     if (!classroomNumber || !classroomType || !classroomCapacity) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const newClassroom = {
//         name: classroomNumber,
//         type: classroomType,
//         capacity: parseInt(classroomCapacity, 10),
//       };

//       const response = await addClassroom(newClassroom);

//       if (response.success) {
//         await fetchClassrooms();
//         setClassroomNumber("");
//         setClassroomType("lecture");
//         setClassroomCapacity("");
//         setShowTable(true);
//       }
//     } catch (err) {
//       alert("Failed to add classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClassroom = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this classroom?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await deleteClassroom(id);

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom deleted successfully!");
//       }
//     } catch (err) {
//       alert("Failed to delete classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClassroom = async (id, updatedData) => {
//     try {
//       setLoading(true);
//       const response = await updateClassroom(id, {
//         name: updatedData.name,
//         type: updatedData.type,
//         capacity: parseInt(updatedData.capacity, 10),
//       });

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom updated successfully!");
//       }
//     } catch (err) {
//       alert("Failed to update classroom: " + err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const validTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];

//     if (
//       !validTypes.includes(file.type) &&
//       !file.name.match(/\.(csv|xlsx|xls)$/i)
//     ) {
//       alert("Please upload a valid CSV or XLSX file");
//       event.target.value = "";
//       return;
//     }

//     try {
//       setUploading(true);
//       const response = await bulkUploadClassrooms(file);

//       if (response.success) {
//         await fetchClassrooms();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "classrooms"}!`);
//       }
//     } catch (err) {
//       alert("Failed to upload file: " + err.message);
//       console.error(err);
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F6FB]">
//       <div className="w-full">
//         <div
//           className="bg-white rounded-[10px] shadow-sm border relative w-full"
//           style={{
//             borderColor: "#e8e8e8",
//             minHeight: "calc(100vh - 48px)",
//           }}
//         >
//           {/* ✅ TOP RIGHT CROSS BUTTON */}
//           <button
//             type="button"
//             onClick={() => navigate("/form")}
//             className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
//             aria-label="Close"
//           >
//             <X size={20} color="#265768" />
//           </button>

//           {/* ✅ HEADER + CONTENT */}
//           <div className="px-6 pt-6">
//             {/* Header */}
//             <div className="mb-3 relative">
//               <div
//                 className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
//                 style={{
//                   textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//                 }}
//               >
//                 Ezey
//               </div>

//               {/* Hidden file input */}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />

//               {/* ✅ Buttons aligned like screenshot */}
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 30,
//                   top: 40,
//                   display: "flex",
//                   gap: "12px",
//                   alignItems: "center",
//                 }}
//               >
//                 <button
//                   onClick={handleUploadClick}
//                   disabled={uploading}
//                   style={{
//                     minWidth: 170,
//                     height: 34,
//                     background:
//                       "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
//                     borderRadius: 6,
//                     color: "white",
//                     fontSize: 12,
//                     fontFamily: "'Mulish', sans-serif",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
//                     opacity: uploading ? 0.7 : 1,
//                     cursor: uploading ? "not-allowed" : "pointer",
//                     padding: "0 14px",
//                   }}
//                 >
//                   {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
//                 </button>

//                 <button
//                   onClick={handleAddClassroom}
//                   disabled={loading}
//                   style={{
//                     minWidth: 170,
//                     height: 34,
//                     background: "#ffffff",
//                     borderRadius: 6,
//                     color: "#265768",
//                     fontSize: 12,
//                     fontFamily: "'Mulish', sans-serif",
//                     border: "1px solid #4BACCE",
//                     boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
//                     opacity: loading ? 0.7 : 1,
//                     cursor: loading ? "not-allowed" : "pointer",
//                     padding: "0 14px",
//                   }}
//                 >
//                   {loading ? "Adding..." : "Add Classroom"}
//                 </button>
//               </div>
//             </div>

//             {/* Title */}
//             <div className="flex items-center gap-2 mt-2 mb-3">
//               <img
//                 className="w-[24px] h-[24px]"
//                 alt="Classroom icon"
//                 src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
//               />
//               <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
//                 Quick add classroom
//               </h2>
//             </div>

//             {/* Blue divider */}
//             <div
//               className="w-full h-[3px] bg-[#0b84d6] rounded"
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
//             />

//             {/* ✅ FORM */}
//             <div className="mt-6">
//               <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Enter classroom number
//                   </div>

//                   <input
//                     type="text"
//                     value={classroomNumber}
//                     onChange={(e) => setClassroomNumber(e.target.value)}
//                     placeholder="e.g. B-210"
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Classroom type
//                   </div>

//                   <select
//                     value={classroomType}
//                     onChange={(e) => setClassroomType(e.target.value)}
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   >
//                     <option value="lecture">Lecture Hall</option>
//                     <option value="lab">Computer Lab</option>
//                     <option value="seminar">Seminar Room</option>
//                   </select>
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Classroom capacity
//                   </div>

//                   <input
//                     type="number"
//                     value={classroomCapacity}
//                     onChange={(e) => setClassroomCapacity(e.target.value)}
//                     placeholder="e.g. 45"
//                     style={{
//                       width: "274.5px",
//                       height: "40px",
//                       borderRadius: "15px",
//                       border: "1.5px solid #DFDFDF",
//                       fontSize: "14px",
//                       fontFamily: "'Mulish', sans-serif",
//                       color: "#000000",
//                       background: "#FFFFFF",
//                       padding: "0 12px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

//             {(error || uploading) && (
//               <div
//                 className={`mt-3 text-center text-sm font-medium ${
//                   error ? "text-red-500" : "text-blue-500"
//                 }`}
//               >
//                 {uploading ? "Uploading file..." : error}
//               </div>
//             )}

//             {/* Table / No data */}
//             {showTable ? (
//               <ClassroomData
//                 classrooms={classrooms}
//                 onEdit={handleEditClassroom}
//                 onDelete={handleDeleteClassroom}
//                 searchQuery=""
//               />
//             ) : (
//               <div
//                 className="mt-6 border rounded-lg flex justify-center items-center"
//                 style={{ height: "320px", borderColor: "#DFDFDF" }}
//               >
//                 <div
//                   className="text-[32px] font-['Playfair_Display'] font-bold text-[#aeadad]"
//                   style={{ fontFamily: "Playfair Display, serif" }}
//                 >
//                   No Data !
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryClassroom;














// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2, X, Check, Upload } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // ✅ added

// // API Configuration
// const BASE_URL = "http://localhost:5000";

// const handleUnauthorized = (res) => {
//   if (res.status === 401) {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("user");
//   }
// };

// // API Functions
// const getClassrooms = async () => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `API Error: ${res.status}`);
//   }

//   return res.json();
// };

// const addClassroom = async (classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to add classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const deleteClassroom = async (classroomId) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to delete classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const updateClassroom = async (classroomId, classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to update classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// // Bulk Upload API
// const bulkUploadClassrooms = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch(`${BASE_URL}/classrooms/bulk-upload`, {
//     method: "POST",
//     credentials: "include",
//     body: formData,
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
//   }

//   return res.json();
// };

// // Component for Upload Button
// const Component = ({ property1, className, headingClassName, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${
//         property1 === "variant-12" ? "top-[214px]" : "top-[146px]"
//       } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${
//         className || ""
//       }`}
//     >
//       <p
//         className={`font-['Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // ClassroomData Component
// const ClassroomData = ({ classrooms, onEdit, onDelete, searchQuery }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: "", type: "", capacity: "" });

//   const filtered = classrooms.filter((c) =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleEditClick = (room) => {
//     setEditingId(room._id);
//     setEditForm({
//       name: room.name,
//       type: room.type,
//       capacity: room.capacity,
//     });
//   };

//   const handleSaveEdit = async (id) => {
//     try {
//       await onEdit(id, editForm);
//       setEditingId(null);
//     } catch (error) {
//       alert("Failed to update classroom: " + error.message);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", type: "", capacity: "" });
//   };

//   return (
//     <div
//       className="absolute bg-white border-solid border-[#DFDFDF] shadow-sm overflow-hidden"
//       style={{
//         width: "1306px",
//         height: "320px",
//         top: "300px",
//         left: "0px",
//         borderRadius: "12.23px",
//         borderWidth: "1.83px",
//       }}
//     >
//       <div
//         className="absolute"
//         style={{
//           width: "1156.39px",
//           height: "327.72px",
//           top: "18.34px",
//           left: "72.15px",
//         }}
//       >
//         {/* Header row */}
//         <div className="flex items-center text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF] pb-3">
//           <div className="flex-[1.5]">Classroom number</div>
//           <div className="flex-[1.5] text-center">Classroom type</div>
//           <div className="flex-1 text-center">Capacity</div>
//           <div className="w-20 text-center">Actions</div>
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll"
//           style={{ height: "calc(327.72px - 56px)" }}
//         >
//           {filtered.map((room, idx) => (
//             <div
//               key={room._id}
//               className={`flex items-center py-5 text-sm border-b border-[#ECF0F4] ${
//                 idx === filtered.length - 1 ? "border-b-0" : ""
//               } hover:bg-[#F7FAFF] transition`}
//             >
//               {editingId === room._id ? (
//                 <>
//                   {/* Edit Mode */}
//                   <div className="flex-[1.5]">
//                     <input
//                       type="text"
//                       value={editForm.name}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, name: e.target.value })
//                       }
//                       className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#4C5968]"
//                     />
//                   </div>
//                   <div className="flex-[1.5] px-2">
//                     <select
//                       value={editForm.type}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, type: e.target.value })
//                       }
//                       className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#8C96A3]"
//                     >
//                       <option value="lecture">Lecture Hall</option>
//                       <option value="lab">Computer Lab</option>
//                       <option value="seminar">Seminar Room</option>
//                     </select>
//                   </div>
//                   <div className="flex-1 px-2">
//                     <input
//                       type="number"
//                       value={editForm.capacity}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, capacity: e.target.value })
//                       }
//                       className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-center text-[#4C5968]"
//                     />
//                   </div>
//                   <div className="w-20 flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => handleSaveEdit(room._id)}
//                       className="text-[#10B981] hover:text-[#059669]"
//                     >
//                       <Check size={15} />
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       className="text-[#EF4444] hover:text-[#DC2626]"
//                     >
//                       <X size={15} />
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* View Mode */}
//                   <div className="flex-[1.5] text-[#4C5968]">{room.name}</div>
//                   <div className="flex-[1.5] text-center text-[13px] text-[#8C96A3] capitalize">
//                     {room.type}
//                   </div>
//                   <div className="flex-1 text-center text-[13px] text-[#4C5968]">
//                     {room.capacity}
//                   </div>
//                   <div className="w-20 flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => handleEditClick(room)}
//                       className="text-[#C0C6D0] hover:text-[#1A8FE3]"
//                     >
//                       <Edit2 size={15} />
//                     </button>
//                     <button
//                       onClick={() => onDelete(room._id)}
//                       className="text-[#C0C6D0] hover:text-[#F04438]"
//                     >
//                       <Trash2 size={15} />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Only ONE blue working scrollbar */}
//       <style>{`
//         .custom-scroll::-webkit-scrollbar {
//           width: 9.78px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: transparent;
//           border-radius: 44.02px;
//           border: 1.22px solid #E5E5E5;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
//           border-radius: 4.89px;
//           width: 12.23px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
//         }
//       `}</style>
//     </div>
//   );
// };

// // Main ManualEntryClassroom Component
// export const ManualEntryClassroom = () => {
//   const [classrooms, setClassrooms] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [classroomNumber, setClassroomNumber] = useState("");
//   const [classroomType, setClassroomType] = useState("lecture");
//   const [classroomCapacity, setClassroomCapacity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate(); // ✅ added

//   // Fetch classrooms on component mount
//   useEffect(() => {
//     fetchClassrooms();
//   }, []);

//   const fetchClassrooms = async () => {
//     try {
//       setLoading(true);
//       const response = await getClassrooms();
//       if (response.success && response.data) {
//         setClassrooms(response.data);
//         if (response.data.length > 0) {
//           setShowTable(true);
//         }
//       }
//     } catch (err) {
//       setError("Failed to load classrooms: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClassroom = async () => {
//     if (!classroomNumber || !classroomType || !classroomCapacity) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const newClassroom = {
//         name: classroomNumber,
//         type: classroomType,
//         capacity: parseInt(classroomCapacity, 10),
//       };

//       const response = await addClassroom(newClassroom);

//       if (response.success) {
//         await fetchClassrooms();
//         setClassroomNumber("");
//         setClassroomType("lecture");
//         setClassroomCapacity("");
//         setShowTable(true);
        
//       }
//     } catch (err) {
//       alert("Failed to add classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClassroom = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this classroom?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await deleteClassroom(id);

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom deleted successfully!");
//       }
//     } catch (err) {
//       alert("Failed to delete classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClassroom = async (id, updatedData) => {
//     try {
//       setLoading(true);
//       const response = await updateClassroom(id, {
//         name: updatedData.name,
//         type: updatedData.type,
//         capacity: parseInt(updatedData.capacity, 10),
//       });

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom updated successfully!");
//       }
//     } catch (err) {
//       alert("Failed to update classroom: " + err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     const validTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];

//     if (
//       !validTypes.includes(file.type) &&
//       !file.name.match(/\.(csv|xlsx|xls)$/i)
//     ) {
//       alert("Please upload a valid CSV or XLSX file");
//       event.target.value = "";
//       return;
//     }

//     try {
//       setUploading(true);
//       const response = await bulkUploadClassrooms(file);

//       if (response.success) {
//         await fetchClassrooms();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "classrooms"}!`);
//       }
//     } catch (err) {
//       alert("Failed to upload file: " + err.message);
//       console.error(err);
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   return (
//     <div className="bg-white w-full min-h-screen flex items-center justify-center p-8 overflow-hidden">
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Mulish:wght@400;500;600;700&display=swap');
          
//           body {
//             overflow: hidden;
//           }
//         `}
//       </style>

//       {/* ✅ TOP RIGHT CROSS BUTTON (ADDED) */}
//       <button
//         type="button"
//         onClick={() => navigate("/form")}
//         className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
//         aria-label="Close"
//       >
//         <X size={20} color="#265768" />
//       </button>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".csv,.xlsx,.xls"
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       <div className="relative" style={{ width: "1306px", minHeight: "680px" }}>
//         {/* Logo - Ezey */}
//         <div
//           className="absolute font-bold text-[#7b7a81] text-center tracking-[0] whitespace-nowrap"
//           style={{
//             fontFamily: "Playfair Display, serif",
//             width: "95px",
//             height: "58px",
//             top: "6px",
//             left: "0px",
//             fontSize: "48px",
//             lineHeight: "120%",
//             textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           Ezey
//         </div>

//         {/* Quick add classroom heading with icon */}
//         <div className="absolute top-[91px] left-0 w-[332px] h-[38px]">
//           <div
//             className="absolute top-0 left-[calc(50%-119px)] font-bold text-[#265668] text-[32px] text-center tracking-[0] leading-[38.4px] whitespace-nowrap"
//             style={{ fontFamily: "Playfair Display, serif" }}
//           >
//             Quick add classroom
//           </div>

//           <img
//             className="absolute top-0.5 left-0 w-[35px] h-[35px]"
//             alt="Arcticons classroom"
//             src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
//           />
//         </div>

//         {/* Blue divider line */}
//         <div
//           className="absolute bg-[#0077ff] shadow-[0px_4px_4px_#00000040] w-full h-0.5"
//           style={{ top: "150px", left: "0" }}
//         />

//         {/* Upload File Button - Before Click */}
//         {!showTable && (
//           <div
//             className="absolute overflow-hidden"
//             style={{
//               width: "208px",
//               height: "40px",
//               top: "88px",
//               left: "1098px",
//               borderRadius: "6px",
//             }}
//           >
//             <Component
//               onClick={handleUploadClick}
//               className="!w-full !h-full !relative !top-0 !left-0"
//               headingClassName="!h-[19px] !mt-[11px] !ml-[7.5px] ![position:unset] !left-[unset] !w-48 !top-[unset]"
//               property1="variant-11"
//             />
//           </div>
//         )}

//         {/* Upload File + Add Classroom Buttons - After Click */}
//         {showTable && (
//           <div
//             className="absolute flex"
//             style={{
//               width: "300px",
//               height: "40px",
//               top: "95px",
//               left: "995px",
//               borderRadius: "6px",
//               borderWidth: "1px",
//               borderColor: "#BFBFBF",
//               borderStyle: "solid",
//             }}
//           >
//             <button
//               onClick={handleUploadClick}
//               disabled={uploading}
//               className="flex-1 bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] text-white font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-50"
//               style={{
//                 fontFamily: "Mulish, sans-serif",
//                 borderTopLeftRadius: "6px",
//                 borderBottomLeftRadius: "6px",
//               }}
//             >
//               {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
//             </button>
//           </div>
//         )}

//         {/* Form fields container */}
//         <div className="absolute top-44 left-0 w-[276px] h-[66px] flex flex-col gap-[3.5px]">
//           <div
//             className="ml-[-116.5px] h-[21px] w-40 self-center font-semibold text-[#265768] text-sm text-center tracking-[0] leading-[21px] whitespace-nowrap"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             Enter classroom number
//           </div>

//           <input
//             type="text"
//             value={classroomNumber}
//             onChange={(e) => setClassroomNumber(e.target.value)}
//             placeholder="e.g. B-210"
//             className="-ml-px w-[277px] h-[43px] px-4 bg-white rounded-[15px] border-[1.5px] border-solid border-[#dfdfdf] font-medium text-[#265768] text-xs outline-none"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           />
//         </div>

//         <div className="absolute top-44 left-[299px] w-[276px] h-[66px] flex flex-col gap-[3.5px]">
//           <div
//             className="ml-[-173.5px] h-[21px] w-[103px] self-center font-semibold text-[#265768] text-sm leading-[21px] text-center tracking-[0] whitespace-nowrap"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             Classroom type
//           </div>

//           <select
//             value={classroomType}
//             onChange={(e) => setClassroomType(e.target.value)}
//             className="ml-[-1.5px] w-[277.5px] h-[43px] px-4 bg-white rounded-[15px] border-[1.5px] border-solid border-[#dfdfdf] font-medium text-[#265768] text-xs outline-none"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             <option value="lecture">Lecture Hall</option>
//             <option value="lab">Computer Lab</option>
//             <option value="seminar">Seminar Room</option>
//           </select>
//         </div>

//         <div className="absolute top-44 left-[598px] w-[276px] h-[66px] flex flex-col gap-[3.5px]">
//           <div
//             className="ml-[-147.5px] h-[21px] w-[129px] self-center font-semibold text-[#265768] text-sm leading-[21px] text-center tracking-[0] whitespace-nowrap"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             Classroom capacity
//           </div>

//           <input
//             type="number"
//             value={classroomCapacity}
//             onChange={(e) => setClassroomCapacity(e.target.value)}
//             placeholder="e.g. 45"
//             className="ml-[-1.5px] w-[277.5px] h-[43px] px-4 bg-white rounded-[15px] border-[1.5px] border-solid border-[#dfdfdf] font-medium text-[#265768] text-xs outline-none"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           />
//         </div>

//         {/* Add classroom button */}
//         <button
//           onClick={handleAddClassroom}
//           disabled={loading}
//           className="absolute items-center justify-center flex cursor-pointer hover:opacity-80 transition disabled:opacity-50"
//           style={{
//             width: "101px",
//             height: "18px",
//             top: "213px",
//             left: "1098px",
//           }}
//         >
//           <div className="inline-flex -mt-px h-3.5 w-24 relative items-center gap-0.5">
//             <img
//               className="relative w-2.5 h-2.5"
//               alt="Mingcute add fill"
//               src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/mingcute-add-fill.svg"
//             />

//             <div
//               className="relative w-fit -mt-px font-medium text-[#265768] text-xs leading-[14.4px] text-center tracking-[0] whitespace-nowrap"
//               style={{ fontFamily: "Mulish, sans-serif" }}
//             >
//               {loading ? "Adding..." : "Add classroom"}
//             </div>
//           </div>
//         </button>

//         {/* Gray divider line */}
//         <div
//           className="absolute bg-[#d9d9d9] w-full h-0.5"
//           style={{ top: "270px", left: "0" }}
//         />

//         {/* Error/Upload status message */}
//         {(error || uploading) && (
//           <div
//             className={`absolute top-[280px] left-0 w-full text-center text-sm ${
//               error ? "text-red-500" : "text-blue-500"
//             }`}
//           >
//             {uploading ? "Uploading file..." : error}
//           </div>
//         )}

//         {/* Main content - conditionally show table or empty state */}
//         {showTable ? (
//           <ClassroomData
//             classrooms={classrooms}
//             onEdit={handleEditClassroom}
//             onDelete={handleDeleteClassroom}
//             searchQuery=""
//           />
//         ) : (
//           <div
//             className="absolute flex flex-col items-center justify-center"
//             style={{
//               width: "1306px",
//               height: "352px",
//               top: "300px",
//               left: "0",
//             }}
//           >
//             <div
//               className="flex flex-col bg-white overflow-hidden border-solid border-[#dfdfdf]"
//               style={{
//                 width: "1306px",
//                 height: "352px",
//                 borderRadius: "10px",
//                 borderWidth: "1.5px",
//               }}
//             >
//               <div className="ml-[441px] w-[423px] h-[274px] relative mt-5">
//                 <div className="absolute top-0 left-36 w-[39px] h-[39px] bg-[#d9d9d9] rounded-[19.5px] shadow-[0px_4px_4px_#00000040]" />

//                 <div className="absolute top-[39px] left-[calc(50%-180px)] w-[344px] h-[205px] rounded-md shadow-[0px_4px_4px_#00000040] bg-[url(https://c.animaapp.com/mjlb1n9pyRcYDw/img/frame-254.png)] bg-cover bg-center" />

//                 <div className="absolute top-[60px] left-0 w-5 h-5 bg-[#6fa3f1] rounded-[10px]" />

//                 <div className="absolute top-[244px] left-[393px] w-[30px] h-[30px] bg-[#d9d9d9] rounded-[15px]" />

//                 <div className="absolute top-5 left-[335px] w-[30px] h-[30px] bg-[#6fa3f1] rounded-[15px] shadow-[0px_4px_4px_#00000040]" />
//               </div>

//               <div
//                 className="ml-[-3px] h-[38px] w-[122px] self-center font-bold text-[#aeadad] text-[32px] leading-[38.4px] text-center tracking-[0] whitespace-nowrap"
//                 style={{ fontFamily: "Playfair Display, serif" }}
//               >
//                 No Data !
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManualEntryClassroom;












// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2, X, Check, Upload } from "lucide-react";

// // API Configuration
// const BASE_URL = "http://localhost:5000";

// const handleUnauthorized = (res) => {
//   if (res.status === 401) {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("user");
//   }
// };

// // API Functions
// const getClassrooms = async () => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `API Error: ${res.status}`);
//   }

//   return res.json();
// };

// const addClassroom = async (classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to add classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const deleteClassroom = async (classroomId) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to delete classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// const updateClassroom = async (classroomId, classroomData) => {
//   const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(classroomData),
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Failed to update classroom: ${res.status}`
//     );
//   }

//   return res.json();
// };

// // Bulk Upload API
// const bulkUploadClassrooms = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch(`${BASE_URL}/classrooms/bulk-upload`, {
//     method: "POST",
//     credentials: "include",
//     body: formData,
//   });

//   if (!res.ok) {
//     handleUnauthorized(res);
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
//   }

//   return res.json();
// };

// // Component for Upload Button
// const Component = ({ property1, className, headingClassName, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${
//         property1 === "variant-12" ? "top-[214px]" : "top-[146px]"
//       } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${
//         className || ""
//       }`}
//     >
//       <p
//         className={`font-['Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // ClassroomData Component
// const ClassroomData = ({ classrooms, onEdit, onDelete, searchQuery }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: "", type: "", capacity: "" });

//   const filtered = classrooms.filter((c) =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleEditClick = (room) => {
//     setEditingId(room._id);
//     setEditForm({
//       name: room.name,
//       type: room.type,
//       capacity: room.capacity,
//     });
//   };

//   const handleSaveEdit = async (id) => {
//     try {
//       await onEdit(id, editForm);
//       setEditingId(null);
//     } catch (error) {
//       alert("Failed to update classroom: " + error.message);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", type: "", capacity: "" });
//   };

//   return (
//     <div
//       className="absolute bg-white border-solid border-[#DFDFDF] shadow-sm overflow-hidden"
//       style={{
//         width: "1306px",
//         height: "320px",
//         top: "300px",
//         left: "0px",
//         borderRadius: "12.23px",
//         borderWidth: "1.83px",
//       }}
//     >
//       <div
//         className="absolute"
//         style={{
//           width: "1156.39px",
//           height: "327.72px",
//           top: "18.34px",
//           left: "72.15px",
//         }}
//       >
//         {/* Header row */}
//         <div className="flex items-center text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF] pb-3">
//           <div className="flex-[1.5]">Classroom number</div>
//           <div className="flex-[1.5] text-center">Classroom type</div>
//           <div className="flex-1 text-center">Capacity</div>
//           <div className="w-20 text-center">Actions</div>
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll"
//           style={{ height: "calc(327.72px - 56px)" }}
//         >
//           {filtered.map((room, idx) => (
//             <div
//               key={room._id}
//               className={`flex items-center py-5 text-sm border-b border-[#ECF0F4] ${
//                 idx === filtered.length - 1 ? "border-b-0" : ""
//               } hover:bg-[#F7FAFF] transition`}
//             >
//               {editingId === room._id ? (
//                 <>
//                   {/* Edit Mode */}
//                   <div className="flex-[1.5]">
//                     <input
//                       type="text"
//                       value={editForm.name}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, name: e.target.value })
//                       }
//                       className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#4C5968]"
//                     />
//                   </div>
//                   <div className="flex-[1.5] px-2">
//                     <select
//                       value={editForm.type}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, type: e.target.value })
//                       }
//                       className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-[#8C96A3]"
//                     >
//                       <option value="lecture">Lecture Hall</option>
//                       <option value="lab">Computer Lab</option>
//                       <option value="seminar">Seminar Room</option>
//                     </select>
//                   </div>
//                   <div className="flex-1 px-2">
//                     <input
//                       type="number"
//                       value={editForm.capacity}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, capacity: e.target.value })
//                       }
//                       className="w-full px-2 py-1 border border-[#1DA5FF] rounded text-center text-[#4C5968]"
//                     />
//                   </div>
//                   <div className="w-20 flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => handleSaveEdit(room._id)}
//                       className="text-[#10B981] hover:text-[#059669]"
//                     >
//                       <Check size={15} />
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       className="text-[#EF4444] hover:text-[#DC2626]"
//                     >
//                       <X size={15} />
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* View Mode */}
//                   <div className="flex-[1.5] text-[#4C5968]">{room.name}</div>
//                   <div className="flex-[1.5] text-center text-[13px] text-[#8C96A3] capitalize">
//                     {room.type}
//                   </div>
//                   <div className="flex-1 text-center text-[13px] text-[#4C5968]">
//                     {room.capacity}
//                   </div>
//                   <div className="w-20 flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => handleEditClick(room)}
//                       className="text-[#C0C6D0] hover:text-[#1A8FE3]"
//                     >
//                       <Edit2 size={15} />
//                     </button>
//                     <button
//                       onClick={() => onDelete(room._id)}
//                       className="text-[#C0C6D0] hover:text-[#F04438]"
//                     >
//                       <Trash2 size={15} />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Only ONE blue working scrollbar */}
//       <style>{`
//         .custom-scroll::-webkit-scrollbar {
//           width: 9.78px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: transparent;
//           border-radius: 44.02px;
//           border: 1.22px solid #E5E5E5;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
//           border-radius: 4.89px;
//           width: 12.23px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
//         }
//       `}</style>
//     </div>
//   );
// };

// // Main ManualEntryClassroom Component
// export const ManualEntryClassroom = () => {
//   const [classrooms, setClassrooms] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [classroomNumber, setClassroomNumber] = useState("");
//   const [classroomType, setClassroomType] = useState("lecture");
//   const [classroomCapacity, setClassroomCapacity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   // Fetch classrooms on component mount
//   useEffect(() => {
//     fetchClassrooms();
//   }, []);

//   const fetchClassrooms = async () => {
//     try {
//       setLoading(true);
//       const response = await getClassrooms();
//       if (response.success && response.data) {
//         setClassrooms(response.data);
//         if (response.data.length > 0) {
//           setShowTable(true);
//         }
//       }
//     } catch (err) {
//       setError("Failed to load classrooms: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClassroom = async () => {
//     if (!classroomNumber || !classroomType || !classroomCapacity) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const newClassroom = {
//         name: classroomNumber,
//         type: classroomType,
//         capacity: parseInt(classroomCapacity, 10),
//       };

//       const response = await addClassroom(newClassroom);

//       if (response.success) {
//         await fetchClassrooms();
//         setClassroomNumber("");
//         setClassroomType("lecture");
//         setClassroomCapacity("");
//         setShowTable(true);
//         alert("Classroom added successfully!");
//       }
//     } catch (err) {
//       alert("Failed to add classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClassroom = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this classroom?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await deleteClassroom(id);

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom deleted successfully!");
//       }
//     } catch (err) {
//       alert("Failed to delete classroom: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClassroom = async (id, updatedData) => {
//     try {
//       setLoading(true);
//       const response = await updateClassroom(id, {
//         name: updatedData.name,
//         type: updatedData.type,
//         capacity: parseInt(updatedData.capacity, 10),
//       });

//       if (response.success) {
//         await fetchClassrooms();
//         alert("Classroom updated successfully!");
//       }
//     } catch (err) {
//       alert("Failed to update classroom: " + err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     const validTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];

//     if (
//       !validTypes.includes(file.type) &&
//       !file.name.match(/\.(csv|xlsx|xls)$/i)
//     ) {
//       alert("Please upload a valid CSV or XLSX file");
//       event.target.value = "";
//       return;
//     }

//     try {
//       setUploading(true);
//       const response = await bulkUploadClassrooms(file);

//       if (response.success) {
//         await fetchClassrooms();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "classrooms"}!`);
//       }
//     } catch (err) {
//       alert("Failed to upload file: " + err.message);
//       console.error(err);
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   return (
//     <div className="bg-white w-full min-h-screen flex items-center justify-center p-8 overflow-hidden">
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Mulish:wght@400;500;600;700&display=swap');
          
//           body {
//             overflow: hidden;
//           }
//         `}
//       </style>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".csv,.xlsx,.xls"
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       <div className="relative" style={{ width: "1306px", minHeight: "680px" }}>
//         {/* Logo - Ezey */}
//         <div
//           className="absolute font-bold text-[#7b7a81] text-center tracking-[0] whitespace-nowrap"
//           style={{
//             fontFamily: "Playfair Display, serif",
//             width: "95px",
//             height: "58px",
//             top: "6px",
//             left: "0px",
//             fontSize: "48px",
//             lineHeight: "120%",
//             textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           Ezey
//         </div>

//         {/* Quick add classroom heading with icon */}
//         <div className="absolute top-[91px] left-0 w-[332px] h-[38px]">
//           <div
//             className="absolute top-0 left-[calc(50%-119px)] font-bold text-[#265668] text-[32px] text-center tracking-[0] leading-[38.4px] whitespace-nowrap"
//             style={{ fontFamily: "Playfair Display, serif" }}
//           >
//             Quick add classroom
//           </div>

//           <img
//             className="absolute top-0.5 left-0 w-[35px] h-[35px]"
//             alt="Arcticons classroom"
//             src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/arcticons-classroom.svg"
//           />
//         </div>

//         {/* Blue divider line */}
//         <div
//           className="absolute bg-[#0077ff] shadow-[0px_4px_4px_#00000040] w-full h-0.5"
//           style={{ top: "150px", left: "0" }}
//         />

//         {/* Upload File Button - Before Click */}
//         {!showTable && (
//           <div
//             className="absolute overflow-hidden"
//             style={{
//               width: "208px",
//               height: "40px",
//               top: "88px",
//               left: "1098px",
//               borderRadius: "6px",
//             }}
//           >
//             <Component
//               onClick={handleUploadClick}
//               className="!w-full !h-full !relative !top-0 !left-0"
//               headingClassName="!h-[19px] !mt-[11px] !ml-[7.5px] ![position:unset] !left-[unset] !w-48 !top-[unset]"
//               property1="variant-11"
//             />
//           </div>
//         )}

//         {/* Upload File + Add Classroom Buttons - After Click */}
//         {showTable && (
//           <div
//             className="absolute flex"
//             style={{
//               width: "300px",
//               height: "40px",
//               top: "95px",
//               left: "995px",
//               borderRadius: "6px",
//               borderWidth: "1px",
//               borderColor: "#BFBFBF",
//               borderStyle: "solid",
//             }}
//           >
//             <button
//               onClick={handleUploadClick}
//               disabled={uploading}
//               className="flex-1 bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] text-white font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-50"
//               style={{
//                 fontFamily: "Mulish, sans-serif",
//                 borderTopLeftRadius: "6px",
//                 borderBottomLeftRadius: "6px",
//               }}
//             >
//               {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
//             </button>
            
//           </div>
//         )}

//         {/* Form fields container */}
//         <div className="absolute top-44 left-0 w-[276px] h-[66px] flex flex-col gap-[3.5px]">
//           <div
//             className="ml-[-116.5px] h-[21px] w-40 self-center font-semibold text-[#265768] text-sm text-center tracking-[0] leading-[21px] whitespace-nowrap"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             Enter classroom number
//           </div>

//           <input
//             type="text"
//             value={classroomNumber}
//             onChange={(e) => setClassroomNumber(e.target.value)}
//             placeholder="e.g. B-210"
//             className="-ml-px w-[277px] h-[43px] px-4 bg-white rounded-[15px] border-[1.5px] border-solid border-[#dfdfdf] font-medium text-[#265768] text-xs outline-none"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           />
//         </div>

//         <div className="absolute top-44 left-[299px] w-[276px] h-[66px] flex flex-col gap-[3.5px]">
//           <div
//             className="ml-[-173.5px] h-[21px] w-[103px] self-center font-semibold text-[#265768] text-sm leading-[21px] text-center tracking-[0] whitespace-nowrap"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             Classroom type
//           </div>

//           <select
//             value={classroomType}
//             onChange={(e) => setClassroomType(e.target.value)}
//             className="ml-[-1.5px] w-[277.5px] h-[43px] px-4 bg-white rounded-[15px] border-[1.5px] border-solid border-[#dfdfdf] font-medium text-[#265768] text-xs outline-none"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             <option value="lecture">Lecture Hall</option>
//             <option value="lab">Computer Lab</option>
//             <option value="seminar">Seminar Room</option>
//           </select>
//         </div>

//         <div className="absolute top-44 left-[598px] w-[276px] h-[66px] flex flex-col gap-[3.5px]">
//           <div
//             className="ml-[-147.5px] h-[21px] w-[129px] self-center font-semibold text-[#265768] text-sm leading-[21px] text-center tracking-[0] whitespace-nowrap"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           >
//             Classroom capacity
//           </div>

//           <input
//             type="number"
//             value={classroomCapacity}
//             onChange={(e) => setClassroomCapacity(e.target.value)}
//             placeholder="e.g. 45"
//             className="ml-[-1.5px] w-[277.5px] h-[43px] px-4 bg-white rounded-[15px] border-[1.5px] border-solid border-[#dfdfdf] font-medium text-[#265768] text-xs outline-none"
//             style={{ fontFamily: "Mulish, sans-serif" }}
//           />
//         </div>

//         {/* Add classroom button */}
//         <button
//           onClick={handleAddClassroom}
//           disabled={loading}
//           className="absolute items-center justify-center flex cursor-pointer hover:opacity-80 transition disabled:opacity-50"
//           style={{
//             width: "101px",
//             height: "18px",
//             top: "213px",
//             left: "1098px",
//           }}
//         >
//           <div className="inline-flex -mt-px h-3.5 w-24 relative items-center gap-0.5">
//             <img
//               className="relative w-2.5 h-2.5"
//               alt="Mingcute add fill"
//               src="https://c.animaapp.com/mjlb1n9pyRcYDw/img/mingcute-add-fill.svg"
//             />

//             <div
//               className="relative w-fit -mt-px font-medium text-[#265768] text-xs leading-[14.4px] text-center tracking-[0] whitespace-nowrap"
//               style={{ fontFamily: "Mulish, sans-serif" }}
//             >
//               {loading ? "Adding..." : "Add classroom"}
//             </div>
//           </div>
//         </button>

//         {/* Gray divider line */}
//         <div
//           className="absolute bg-[#d9d9d9] w-full h-0.5"
//           style={{ top: "270px", left: "0" }}
//         />

//         {/* Error/Upload status message */}
//         {(error || uploading) && (
//           <div
//             className={`absolute top-[280px] left-0 w-full text-center text-sm ${
//               error ? "text-red-500" : "text-blue-500"
//             }`}
//           >
//             {uploading ? "Uploading file..." : error}
//           </div>
//         )}

//         {/* Main content - conditionally show table or empty state */}
//         {showTable ? (
//           <ClassroomData
//             classrooms={classrooms}
//             onEdit={handleEditClassroom}
//             onDelete={handleDeleteClassroom}
//             searchQuery=""
//           />
//         ) : (
//           <div
//             className="absolute flex flex-col items-center justify-center"
//             style={{
//               width: "1306px",
//               height: "352px",
//               top: "300px",
//               left: "0",
//             }}
//           >
//             <div
//               className="flex flex-col bg-white overflow-hidden border-solid border-[#dfdfdf]"
//               style={{
//                 width: "1306px",
//                 height: "352px",
//                 borderRadius: "10px",
//                 borderWidth: "1.5px",
//               }}
//             >
//               <div className="ml-[441px] w-[423px] h-[274px] relative mt-5">
//                 <div className="absolute top-0 left-36 w-[39px] h-[39px] bg-[#d9d9d9] rounded-[19.5px] shadow-[0px_4px_4px_#00000040]" />

//                 <div className="absolute top-[39px] left-[calc(50%-180px)] w-[344px] h-[205px] rounded-md shadow-[0px_4px_4px_#00000040] bg-[url(https://c.animaapp.com/mjlb1n9pyRcYDw/img/frame-254.png)] bg-cover bg-center" />

//                 <div className="absolute top-[60px] left-0 w-5 h-5 bg-[#6fa3f1] rounded-[10px]" />

//                 <div className="absolute top-[244px] left-[393px] w-[30px] h-[30px] bg-[#d9d9d9] rounded-[15px]" />

//                 <div className="absolute top-5 left-[335px] w-[30px] h-[30px] bg-[#6fa3f1] rounded-[15px] shadow-[0px_4px_4px_#00000040]" />
//               </div>

//               <div
//                 className="ml-[-3px] h-[38px] w-[122px] self-center font-bold text-[#aeadad] text-[32px] leading-[38.4px] text-center tracking-[0] whitespace-nowrap"
//                 style={{ fontFamily: "Playfair Display, serif" }}
//               >
//                 No Data !
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManualEntryClassroom;








