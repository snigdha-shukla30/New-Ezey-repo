import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import nodata from "../../assets/images/nodataa.png";
import {
  getFaculties,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  bulkUploadFaculties,
} from "../../api/api";

// Component for Upload Button (UNCHANGED)
const Component = ({ property1, className, headingClassName, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${property1 === "variant-12" ? "top-[214px]" : "top-[146px]"
        } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${className || ""
        }`}
    >
      <p
        className={`[font-family:'Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${headingClassName || ""
          }`}
      >
        Upload File ( CSV / XLSX )
      </p>
    </button>
  );
};

// ✅ FacultyData Component (table/list height SMALL)
const FacultyData = ({
  searchQuery = "",
  facultyList = [],
  onEdit,
  onDelete,
}) => {
  const query = searchQuery.toLowerCase();
  const filtered = facultyList.filter((f) =>
    `${f.name} ${f.email}`.toLowerCase().includes(query)
  );

  return (
    <div className="mt-6 pb-4">
      <div
        className="bg-white w-full relative"
        style={{
          width: "100%",
          height: "calc(100vh - 420px)", // ✅ SMALLER table box height
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
            <div className="flex-[1.7] text-center">Faculty Name</div>
            <div className="flex-[1.7] text-center">Email</div>
            <div className="flex-[0.8] text-center">Max load/day</div>
            <div className="flex-[0.8] text-center">Leaves/month</div>
            <div className="flex-[1] text-center">Assigned Subjects</div>
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
          style={{
            maxHeight: "calc(100vh - 500px)", // ✅ SMALLER scroll area
          }}
        >
          <div className="px-8">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-gray-400">
                No faculties found
              </div>
            ) : (
              filtered.map((f, idx) => (
                <div
                  key={f._id || idx}
                  className="flex items-center py-3.5 hover:bg-gray-50 transition"
                  style={{ borderBottom: "3px solid #D9D9D9" }}
                >
                  <div className="flex-[1.7] text-[13px] font-medium text-[#265768] text-center">
                    {f.name}
                  </div>

                  <div className="flex-[1.7] text-[13px] text-[#265768] text-center">
                    {f.email}
                  </div>

                  <div className="flex-[0.8] text-[13px] text-[#265768] text-center">
                    {f.maxLoad} Hrs
                  </div>

                  <div className="flex-[0.8] text-[13px] text-[#265768] text-center">
                    {f.leavesPerMonth}
                  </div>

                  <div className="flex-[1] text-center">
                    <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
                      See List ({f.subjects?.length || 0})
                    </button>
                  </div>

                  <div className="w-20 flex items-center justify-center gap-3">
                    <button
                      onClick={() => onEdit(f)}
                      className="text-[#C0C6D0] hover:text-[#1A8FE3] transition"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(f._id)}
                      className="text-[#C0C6D0] hover:text-[#F04438] transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✅ Scrollbar styling */}
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

// Main ManualEntryFaculty Component
export const ManualEntryFaculty = () => {
  const [showTable, setShowTable] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const [email, setEmail] = useState("");
  const [maxLoad, setMaxLoad] = useState("");
  const [leaves, setLeaves] = useState("");
  const [assignedSubjects, setAssignedSubjects] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFaculties();

      if (response?.success && response?.data) {
        setFacultyList(Array.isArray(response.data) ? response.data : []);
        if (response.data.length > 0) setShowTable(true);
      } else if (Array.isArray(response)) {
        setFacultyList(response);
        if (response.length > 0) setShowTable(true);
      } else if (response?.faculties) {
        setFacultyList(response.faculties);
        if (response.faculties.length > 0) setShowTable(true);
      } else {
        setFacultyList([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load faculties");
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

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
      const response = await bulkUploadFaculties(file);

      if (response.success) {
        await loadFaculties();
        setShowTable(true);
        alert(`Successfully uploaded ${response.data?.count || "faculties"}!`);
      }
    } catch (err) {
      alert("Failed to upload file: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleAddFaculty = async () => {
    if (!facultyName || !email || !maxLoad || !leaves) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const facultyData = {
        name: facultyName,
        email: email,
        maxLoad: parseInt(maxLoad),
        leavesPerMonth: parseInt(leaves),
        subjects: assignedSubjects
          ? assignedSubjects.split(",").map((s) => s.trim())
          : [],
      };

      if (editingId) {
        const response = await updateFaculty(editingId, facultyData);
        if (response.success || response._id) {
          await loadFaculties();
          resetForm();
          // alert("Faculty updated successfully!");
        }
      } else {
        const response = await addFaculty(facultyData);
        if (response.success || response._id) {
          await loadFaculties();
          resetForm();
          setShowTable(true);
          // alert("Faculty added successfully!");
        }
      }
    } catch (err) {
      const msg = err.message || "Unknown error occurred";
      setError(msg);
      alert("Failed to save faculty: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faculty) => {
    setFacultyName(faculty.name);
    setEmail(faculty.email);
    setMaxLoad(faculty.maxLoad?.toString() || "");
    setLeaves(faculty.leavesPerMonth?.toString() || "");
    setAssignedSubjects(faculty.subjects?.join(", ") || "");
    setEditingId(faculty._id);
  };

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;

    try {
      setLoading(true);
      setError("");
      const response = await deleteFaculty(facultyId);
      if (response.success) {
        await loadFaculties();
        // alert("Faculty deleted successfully!");
      }
    } catch (err) {
      const msg = err.message || "Unknown error occurred";
      setError(msg);
      alert("Failed to delete faculty: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFacultyName("");
    setEmail("");
    setMaxLoad("");
    setLeaves("");
    setAssignedSubjects("");
    setEditingId(null);
    setError("");
  };

  const inputStyle = {
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
  };

  return (
    <div className="h-screen bg-[#F3F6FB] overflow-hidden">
      <div className="w-full h-full">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
          style={{
            borderColor: "#e8e8e8",
          }}
        >
          <div className="px-6 pt-4 pb-4">
            {/* HEADER (Row 1: Logo + Close) */}
            <div className="flex justify-between items-start mb-6">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}
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

            {/* TITLE ROW (Row 2: Title + Upload) */}
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-[20px] h-[20px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#265768"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                  Quick add Faculty
                </h2>
              </div>

              <div>
                {/* Hidden file input */}
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
                    background:
                      "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
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



            {/* blue line */}
            <div
              className="w-full h-[3px] bg-[#0b84d6] rounded"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {/* form */}
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
                    Faculty Name
                  </div>
                  <input
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="e.g. Mrs Pooja Shukla"
                    disabled={loading}
                    style={inputStyle}
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
                    Email
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. poojasunshore@gmail.com"
                    disabled={loading}
                    style={inputStyle}
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
                    Max load per day
                  </div>
                  <input
                    type="number"
                    value={maxLoad}
                    onChange={(e) => setMaxLoad(e.target.value)}
                    placeholder="e.g. 5"
                    disabled={loading}
                    style={inputStyle}
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
                    Leaves per month
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-around",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="number"
                      value={leaves}
                      onChange={(e) => setLeaves(e.target.value)}
                      placeholder="e.g 5"
                      disabled={loading}
                      style={inputStyle}
                      className="custom-input"
                    />

                    <button
                      onClick={handleAddFaculty}
                      disabled={loading}
                      style={{
                        fontSize: "12px",
                        color: "rgb(77, 172, 206)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Mulish', sans-serif",
                        position: "relative",
                        top: "50px",
                        whiteSpace: "nowrap",
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      {loading
                        ? "Processing..."
                        : editingId
                          ? "+ Update faculty"
                          : "+ Add faculty"}
                    </button>
                  </div>
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
                    Assigned subjects
                  </div>
                  <input
                    type="text"
                    value={assignedSubjects}
                    onChange={(e) => setAssignedSubjects(e.target.value)}
                    placeholder="e.g. DAA, OS (comma separated)"
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>

                {editingId && (
                  <div className="col-span-3 flex items-end justify-end">
                    <button
                      onClick={resetForm}
                      className="text-xs text-[#F04438] hover:underline"
                      style={{ fontFamily: "'Mulish', sans-serif" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {error && (
              <div className="mt-3 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {showTable && facultyList.length > 0 ? (
              <FacultyData
                searchQuery=""
                facultyList={facultyList}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div
                className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4"
                style={{ height: "380px", borderColor: "#DFDFDF" }}
              >
                {loading ? (
                  <div
                    className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Loading...
                  </div>
                ) : (
                  <>
                    <img
                      src={nodata}
                      alt="No Data"
                      className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]"
                    />
                    <div
                      className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      No Data !
                    </div>
                  </>
                )}
              </div>

            )}
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
      </div>
    </div>
  );
};

export default ManualEntryFaculty;

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







