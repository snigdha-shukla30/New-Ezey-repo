import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
      className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${
        property1 === "variant-12" ? "top-[214px]" : "top-[146px]"
      } ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${
        className || ""
      }`}
    >
      <p
        className={`[font-family:'Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
          headingClassName || ""
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
          {/* ✅ TOP RIGHT CROSS BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/form")}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
            aria-label="Close"
          >
            <X size={20} color="#265768" />
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

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

              {/* buttons */}
              <div
                style={{
                  position: "absolute",
                  right: 24,
                  top: 40,
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
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

                {/* <button
                  onClick={handleAddFaculty}
                  disabled={loading}
                  style={{
                    minWidth: 170,
                    height: 34,
                    background: "#ffffff",
                    borderRadius: 6,
                    color: "#265768",
                    fontSize: 12,
                    fontFamily: "'Mulish', sans-serif",
                    border: "1px solid #4BACCE",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                    padding: "0 14px",
                  }}
                >
                  {loading
                    ? "Processing..."
                    : editingId
                    ? "Update Faculty"
                    : "Add Faculty"}
                </button> */}
              </div>
            </div>

            {/* title */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <svg
                className="w-[24px] h-[24px]"
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
                className="mt-6 border rounded-lg flex justify-center items-center"
                style={{ height: "320px", borderColor: "#DFDFDF" }}
              >
                <div
                  className="text-[32px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {loading ? "Loading..." : "No Data !"}
                </div>
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















// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import {
//   getFaculties,
//   addFaculty,
//   updateFaculty,
//   deleteFaculty,
//   bulkUploadFaculties,
// } from "../../api/api";

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
//         className={`[font-family:'Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // ✅ FacultyData Component (layout updated like subject/classroom table)
// const FacultyData = ({
//   searchQuery = "",
//   facultyList = [],
//   onEdit,
//   onDelete,
// }) => {
//   const query = searchQuery.toLowerCase();
//   const filtered = facultyList.filter((f) =>
//     `${f.name} ${f.email}`.toLowerCase().includes(query)
//   );

//   return (
//     <div className="mt-6 pb-6">
//       <div
//         className="bg-white w-full relative"
//         style={{
//           width: "100%",
//           height: "460px",
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
//             <div className="flex-[1.7] text-center">Faculty Name</div>
//             <div className="flex-[1.7] text-center">Email</div>
//             <div className="flex-[0.8] text-center">Max load/day</div>
//             <div className="flex-[0.8] text-center">Leaves/month</div>
//             <div className="flex-[1] text-center">Assigned Subjects</div>
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
//           style={{ maxHeight: "400px" }}
//         >
//           <div className="px-8">
//             {filtered.length === 0 ? (
//               <div className="flex items-center justify-center h-[350px] text-gray-400">
//                 No faculties found
//               </div>
//             ) : (
//               filtered.map((f, idx) => (
//                 <div
//                   key={f._id || idx}
//                   className="flex items-center py-3.5 hover:bg-gray-50 transition"
//                   style={{ borderBottom: "3px solid #D9D9D9" }}
//                 >
//                   {/* Faculty Name */}
//                   <div className="flex-[1.7] text-[13px] font-medium text-[#265768] text-center">
//                     {f.name}
//                   </div>

//                   {/* Email */}
//                   <div className="flex-[1.7] text-[13px] text-[#265768] text-center">
//                     {f.email}
//                   </div>

//                   {/* Max load */}
//                   <div className="flex-[0.8] text-[13px] text-[#265768] text-center">
//                     {f.maxLoad} Hrs
//                   </div>

//                   {/* Leaves */}
//                   <div className="flex-[0.8] text-[13px] text-[#265768] text-center">
//                     {f.leavesPerMonth}
//                   </div>

//                   {/* Assigned subjects */}
//                   <div className="flex-[1] text-center">
//                     <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
//                       See List ({f.subjects?.length || 0})
//                     </button>
//                   </div>

//                   {/* Actions */}
//                   <div className="w-20 flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => onEdit(f)}
//                       className="text-[#C0C6D0] hover:text-[#1A8FE3] transition"
//                     >
//                       <Edit2 size={15} />
//                     </button>
//                     <button
//                       onClick={() => onDelete(f._id)}
//                       className="text-[#C0C6D0] hover:text-[#F04438] transition"
//                     >
//                       <Trash2 size={15} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* ✅ same scrollbar as other pages */}
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

// // ✅ Main ManualEntryFaculty Component (converted to same layout as Classroom/Subject)
// export const ManualEntryFaculty = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [facultyName, setFacultyName] = useState("");
//   const [email, setEmail] = useState("");
//   const [maxLoad, setMaxLoad] = useState("");
//   const [leaves, setLeaves] = useState("");
//   const [assignedSubjects, setAssignedSubjects] = useState("");
//   const [facultyList, setFacultyList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadFaculties();
//   }, []);

//   const loadFaculties = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await getFaculties();

//       if (response?.success && response?.data) {
//         setFacultyList(Array.isArray(response.data) ? response.data : []);
//         if (response.data.length > 0) setShowTable(true);
//       } else if (Array.isArray(response)) {
//         setFacultyList(response);
//         if (response.length > 0) setShowTable(true);
//       } else if (response?.faculties) {
//         setFacultyList(response.faculties);
//         if (response.faculties.length > 0) setShowTable(true);
//       } else {
//         setFacultyList([]);
//       }
//     } catch (err) {
//       setError(err.message || "Failed to load faculties");
//       setFacultyList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = () => fileInputRef.current?.click();

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
//       setError("");
//       const response = await bulkUploadFaculties(file);

//       if (response.success) {
//         await loadFaculties();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "faculties"}!`);
//       }
//     } catch (err) {
//       alert("Failed to upload file: " + (err.message || "Unknown error"));
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   const handleAddFaculty = async () => {
//     if (!facultyName || !email || !maxLoad || !leaves) {
//       setError("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const facultyData = {
//         name: facultyName,
//         email: email,
//         maxLoad: parseInt(maxLoad),
//         leavesPerMonth: parseInt(leaves),
//         subjects: assignedSubjects
//           ? assignedSubjects.split(",").map((s) => s.trim())
//           : [],
//       };

//       if (editingId) {
//         const response = await updateFaculty(editingId, facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           alert("Faculty updated successfully!");
//         }
//       } else {
//         const response = await addFaculty(facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           setShowTable(true);
//           alert("Faculty added successfully!");
//         }
//       }
//     } catch (err) {
//       const msg = err.message || "Unknown error occurred";
//       setError(msg);
//       alert("Failed to save faculty: " + msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (faculty) => {
//     setFacultyName(faculty.name);
//     setEmail(faculty.email);
//     setMaxLoad(faculty.maxLoad?.toString() || "");
//     setLeaves(faculty.leavesPerMonth?.toString() || "");
//     setAssignedSubjects(faculty.subjects?.join(", ") || "");
//     setEditingId(faculty._id);
//   };

//   const handleDelete = async (facultyId) => {
//     if (!window.confirm("Are you sure you want to delete this faculty?")) return;

//     try {
//       setLoading(true);
//       setError("");
//       const response = await deleteFaculty(facultyId);
//       if (response.success) {
//         await loadFaculties();
//         alert("Faculty deleted successfully!");
//       }
//     } catch (err) {
//       const msg = err.message || "Unknown error occurred";
//       setError(msg);
//       alert("Failed to delete faculty: " + msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFacultyName("");
//     setEmail("");
//     setMaxLoad("");
//     setLeaves("");
//     setAssignedSubjects("");
//     setEditingId(null);
//     setError("");
//   };

//   const inputStyle = {
//     width: "274.5px",
//     height: "40px",
//     borderRadius: "15px",
//     border: "1.5px solid #DFDFDF",
//     fontSize: "14px",
//     fontFamily: "'Mulish', sans-serif",
//     color: "#000000",
//     background: "#FFFFFF",
//     padding: "0 12px",
//     boxSizing: "border-box",
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F6FB]">
//       <div className="w-full">
//         <div
//           className="bg-white rounded-[10px] shadow-sm border relative w-full"
//           style={{
//             borderColor: "#e8e8e8",
//             minHeight: "100vh",
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

//           {/* Hidden file input */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".csv,.xlsx,.xls"
//             onChange={handleFileChange}
//             className="hidden"
//           />

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

//               {/* ✅ TOP RIGHT BUTTONS (exact classroom style) */}
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
//                   onClick={handleAddFaculty}
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
//                   {loading ? "Processing..." : editingId ? "Update Faculty" : "Add Faculty"}
//                 </button>
//               </div>
//             </div>

//             {/* Title */}
//             <div className="flex items-center gap-2 mt-2 mb-3">
//               {/* Person icon */}
//               <svg
//                 className="w-[24px] h-[24px]"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#265768"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                 <circle cx="12" cy="7" r="4" />
//               </svg>

//               <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
//                 Quick add Faculty
//               </h2>
//             </div>

//             {/* Blue divider */}
//             <div
//               className="w-full h-[3px] bg-[#0b84d6] rounded"
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
//             />

//             {/* ✅ FORM layout exactly like other pages */}
//             <div className="mt-6">
//               <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{ color: "#265768", fontFamily: "'Mulish', sans-serif", fontSize: "14px" }}
//                   >
//                     Faculty Name
//                   </div>
//                   <input
//                     type="text"
//                     value={facultyName}
//                     onChange={(e) => setFacultyName(e.target.value)}
//                     placeholder="e.g. Mrs Pooja Shukla"
//                     disabled={loading}
//                     style={inputStyle}
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{ color: "#265768", fontFamily: "'Mulish', sans-serif", fontSize: "14px" }}
//                   >
//                     Email
//                   </div>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="e.g. poojasunshore@gmail.com"
//                     disabled={loading}
//                     style={inputStyle}
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{ color: "#265768", fontFamily: "'Mulish', sans-serif", fontSize: "14px" }}
//                   >
//                     Max load per day
//                   </div>
//                   <input
//                     type="number"
//                     value={maxLoad}
//                     onChange={(e) => setMaxLoad(e.target.value)}
//                     placeholder="e.g. 5"
//                     disabled={loading}
//                     style={inputStyle}
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{ color: "#265768", fontFamily: "'Mulish', sans-serif", fontSize: "14px" }}
//                   >
//                     Leaves per month
//                   </div>

//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-end",
//                       justifyContent: "space-around",
//                       gap: "5px",
//                     }}
//                   >
//                     <input
//                       type="number"
//                       value={leaves}
//                       onChange={(e) => setLeaves(e.target.value)}
//                       placeholder="e.g 5"
//                       disabled={loading}
//                       style={inputStyle}
//                     />

//                     {/* ✅ small add button (same classroom/subject style) */}
//                     <button
//                       onClick={handleAddFaculty}
//                       disabled={loading}
//                       style={{
//                         fontSize: "12px",
//                         color: "rgb(77, 172, 206)",
//                         background: "transparent",
//                         border: "none",
//                         cursor: "pointer",
//                         fontFamily: "'Mulish', sans-serif",
//                         position: "relative",
//                         top: "50px",
//                         whiteSpace: "nowrap",
//                         opacity: loading ? 0.6 : 1,
//                       }}
//                     >
//                       {loading
//                         ? "Processing..."
//                         : editingId
//                         ? "+ Update faculty"
//                         : "+ Add faculty"}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{ color: "#265768", fontFamily: "'Mulish', sans-serif", fontSize: "14px" }}
//                   >
//                     Assigned subjects
//                   </div>
//                   <input
//                     type="text"
//                     value={assignedSubjects}
//                     onChange={(e) => setAssignedSubjects(e.target.value)}
//                     placeholder="e.g. DAA, OS (comma separated)"
//                     disabled={loading}
//                     style={inputStyle}
//                   />
//                 </div>

//                 {/* Cancel edit button (same row alignment) */}
//                 {editingId && (
//                   <div className="col-span-3 flex items-end justify-end">
//                     <button
//                       onClick={resetForm}
//                       className="text-xs text-[#F04438] hover:underline"
//                       style={{ fontFamily: "'Mulish', sans-serif" }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

//             {/* error */}
//             {error && (
//               <div className="mt-3 text-center text-red-500 text-sm font-medium">
//                 {error}
//               </div>
//             )}

//             {/* table / no data */}
//             {showTable && facultyList.length > 0 ? (
//               <FacultyData
//                 searchQuery=""
//                 facultyList={facultyList}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
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
//                   {loading ? "Loading..." : "No Data !"}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryFaculty;



















// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import {
//   getFaculties,
//   addFaculty,
//   updateFaculty,
//   deleteFaculty,
//   bulkUploadFaculties,
// } from "../../api/api";

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
//         className={`[font-family:'Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // FacultyData Component
// const FacultyData = ({
//   searchQuery = "",
//   facultyList = [],
//   onEdit,
//   onDelete,
// }) => {
//   const query = searchQuery.toLowerCase();
//   const filtered = facultyList.filter((f) =>
//     `${f.name} ${f.email}`.toLowerCase().includes(query)
//   );

//   return (
//     <div
//       className="absolute bg-white border-solid border-[#DFDFDF] shadow-sm overflow-hidden"
//       style={{
//         width: "1306px",
//         height: "320px",
//         top: "330px",
//         left: "27px",
//         borderRadius: "12.23px",
//         borderWidth: "1.83px",
//       }}
//     >
//       {/* Data container with exact positioning */}
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
//           <div className="flex-[1.7]">Faculty Name</div>
//           <div className="flex-[1.7]">Email</div>
//           <div className="flex-[0.8] text-center">Max load per day</div>
//           <div className="flex-[0.8] text-center">Leaves per month</div>
//           <div className="flex-[1] text-center">Assigned Subjects</div>
//           <div className="w-20 text-center">Actions</div>
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll"
//           style={{ height: "calc(327.72px - 56px)" }}
//         >
//           {filtered.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-gray-400">
//               No faculties found
//             </div>
//           ) : (
//             filtered.map((f, idx) => (
//               <div
//                 key={f._id || idx}
//                 className={`flex items-center py-5 text-sm border-b border-[#ECF0F4] ${
//                   idx === filtered.length - 1 ? "border-b-0" : ""
//                 } hover:bg-[#F7FAFF] transition`}
//               >
//                 {/* Faculty Name */}
//                 <div className="flex-[1.7] text-[#4C5968]">{f.name}</div>

//                 {/* Email */}
//                 <div className="flex-[1.7] text-[13px] text-[#8C96A3]">
//                   {f.email}
//                 </div>

//                 {/* Max load */}
//                 <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                   {f.maxLoad} Hrs
//                 </div>

//                 {/* Leaves */}
//                 <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                   {f.leavesPerMonth}
//                 </div>

//                 {/* Assigned Subjects */}
//                 <div className="flex-[1] text-center">
//                   <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
//                     See List ({f.subjects?.length || 0})
//                   </button>
//                 </div>

//                 {/* Actions */}
//                 <div className="w-20 flex items-center justify-center gap-3">
//                   <button
//                     onClick={() => onEdit(f)}
//                     className="text-[#C0C6D0] hover:text-[#1A8FE3]"
//                   >
//                     <Edit2 size={15} />
//                   </button>
//                   <button
//                     onClick={() => onDelete(f._id)}
//                     className="text-[#C0C6D0] hover:text-[#F04438]"
//                   >
//                     <Trash2 size={15} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
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

// // Main QuickAddFacultyScreen Component
// export const ManualEntryFaculty = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [facultyName, setFacultyName] = useState("");
//   const [email, setEmail] = useState("");
//   const [maxLoad, setMaxLoad] = useState("");
//   const [leaves, setLeaves] = useState("");
//   const [assignedSubjects, setAssignedSubjects] = useState("");
//   const [facultyList, setFacultyList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate(); // ✅ added

//   // Fetch faculties on component mount
//   useEffect(() => {
//     loadFaculties();
//   }, []);

//   const loadFaculties = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       console.log("🔄 Loading faculties...");

//       const response = await getFaculties();
//       console.log("📦 Full API Response:", response);

//       // Handle different response structures
//       if (response?.success && response?.data) {
//         console.log("✅ Setting faculties from response.data");
//         setFacultyList(Array.isArray(response.data) ? response.data : []);
//         if (response.data.length > 0) {
//           setShowTable(true);
//         }
//       } else if (Array.isArray(response)) {
//         console.log("✅ Setting faculties from direct array");
//         setFacultyList(response);
//         if (response.length > 0) {
//           setShowTable(true);
//         }
//       } else if (response?.faculties) {
//         console.log("✅ Setting faculties from response.faculties");
//         setFacultyList(response.faculties);
//         if (response.faculties.length > 0) {
//           setShowTable(true);
//         }
//       } else {
//         console.warn("⚠️ Unexpected response structure:", response);
//         setFacultyList([]);
//       }
//     } catch (err) {
//       console.error("❌ Error loading faculties:", err);
//       setError(err.message || "Failed to load faculties");
//       setFacultyList([]);
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
//       setError("");
//       const response = await bulkUploadFaculties(file);

//       if (response.success) {
//         await loadFaculties();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "faculties"}!`);
//       }
//     } catch (err) {
//       const errorMessage = err.message || "Unknown error occurred";
//       alert("Failed to upload file: " + errorMessage);
//       console.error("Upload error:", err);
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   const handleUploadClick2 = () => {
//     fileInputRef.current?.click();
//   };

//   const handleAddFaculty = async () => {
//     if (!facultyName || !email || !maxLoad || !leaves) {
//       setError("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const facultyData = {
//         name: facultyName,
//         email: email,
//         maxLoad: parseInt(maxLoad),
//         leavesPerMonth: parseInt(leaves),
//         subjects: assignedSubjects
//           ? assignedSubjects.split(",").map((s) => s.trim())
//           : [],
//       };

//       console.log("💾 Saving faculty data:", facultyData);

//       if (editingId) {
//         // Update existing faculty
//         const response = await updateFaculty(editingId, facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           alert("Faculty updated successfully!");
//         }
//       } else {
//         // Add new faculty
//         const response = await addFaculty(facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           setShowTable(true);
//           alert("Faculty added successfully!");
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error saving faculty:", err);
//       const errorMessage = err.message || "Unknown error occurred";
//       setError(errorMessage);
//       alert("Failed to save faculty: " + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (faculty) => {
//     console.log("✏️ Editing faculty:", faculty);
//     setFacultyName(faculty.name);
//     setEmail(faculty.email);
//     setMaxLoad(faculty.maxLoad.toString());
//     setLeaves(faculty.leavesPerMonth.toString());
//     setAssignedSubjects(faculty.subjects?.join(", ") || "");
//     setEditingId(faculty._id);
//   };

//   const handleDelete = async (facultyId) => {
//     if (!window.confirm("Are you sure you want to delete this faculty?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       const response = await deleteFaculty(facultyId);
//       if (response.success) {
//         await loadFaculties();
//         alert("Faculty deleted successfully!");
//       }
//     } catch (err) {
//       console.error("❌ Error deleting faculty:", err);
//       const errorMessage = err.message || "Unknown error occurred";
//       setError(errorMessage);
//       alert("Failed to delete faculty: " + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFacultyName("");
//     setEmail("");
//     setMaxLoad("");
//     setLeaves("");
//     setAssignedSubjects("");
//     setEditingId(null);
//     setError("");
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

//       {/* Main centered container */}
//       <div className="relative" style={{ width: "1360px", minHeight: "750px" }}>
//         {/* ✅ TOP RIGHT CROSS BUTTON (ADDED) */}
//         <button
//           type="button"
//           onClick={() => navigate("/form")}
//           className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
//           aria-label="Close"
//         >
//           <X size={20} color="#265768" />
//         </button>

//         {/* Logo - Ezey */}
//         <div
//           className="absolute font-bold text-[#7b7a81] text-center tracking-[0] whitespace-nowrap"
//           style={{
//             fontFamily: "Playfair Display, serif",
//             width: "95px",
//             height: "58px",
//             top: "6px",
//             left: "26px",
//             fontSize: "48px",
//             lineHeight: "120%",
//             textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           Ezey
//         </div>

//         {/* Person logo */}
//         <svg
//           className="absolute"
//           style={{
//             width: "30px",
//             height: "30px",
//             top: "90px",
//             left: "28px",
//           }}
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="black"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//           <circle cx="12" cy="7" r="4" />
//         </svg>

//         {/* Quick add Faculty heading */}
//         <div
//           className="absolute font-bold text-[#265668] text-center tracking-[0] whitespace-nowrap"
//           style={{
//             fontFamily: "Playfair Display, serif",
//             width: "246px",
//             height: "38px",
//             top: "84px",
//             left: "73px",
//             fontSize: "32px",
//             lineHeight: "120%",
//           }}
//         >
//           Quick add Faculty
//         </div>

//         {/* Blue divider line */}
//         <div
//           className="absolute bg-[#0077ff] shadow-[0px_4px_4px_#00000040]"
//           style={{
//             width: "1306px",
//             height: "2px",
//             top: "143px",
//             left: "28px",
//           }}
//         />

//         {/* Upload File Button - Before Click */}
//         {!showTable && (
//           <div
//             className="absolute overflow-hidden"
//             style={{
//               width: "208px",
//               height: "40px",
//               top: "88px",
//               left: "1126px",
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

//         {/* Upload File + Add Faculty Buttons - After Click */}
//         {showTable && (
//           <div
//             className="absolute flex"
//             style={{
//               width: "300px",
//               height: "40px",
//               top: "95px",
//               left: "1040px",
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

//         {/* Error Message */}
//         {error && (
//           <div
//             className="absolute text-red-500 text-sm font-medium"
//             style={{
//               top: "130px",
//               left: "28px",
//               fontFamily: "Mulish, sans-serif",
//             }}
//           >
//             ⚠️ {error}
//           </div>
//         )}

//         {/* Faculty Name Input */}
//         <div className="absolute" style={{ top: "156px", left: "28px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "91px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Faculty Name
//           </div>

//           <input
//             type="text"
//             value={facultyName}
//             onChange={(e) => setFacultyName(e.target.value)}
//             placeholder="e.g. Mrs Pooja Shukla"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Email Input */}
//         <div className="absolute" style={{ top: "156px", left: "327px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "91px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Email
//           </div>

//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="e.g. poojasunshore@gmail.com"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Max load per day Input */}
//         <div className="absolute" style={{ top: "156px", left: "626px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "110px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Max load per day
//           </div>

//           <input
//             type="number"
//             value={maxLoad}
//             onChange={(e) => setMaxLoad(e.target.value)}
//             placeholder="e.g. 5"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Leaves per month Input */}
//         <div className="absolute" style={{ top: "156px", left: "925px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "120px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Leaves per month
//           </div>

//           <input
//             type="number"
//             value={leaves}
//             onChange={(e) => setLeaves(e.target.value)}
//             placeholder="e.g 5"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Assigned subjects Input */}
//         <div className="absolute" style={{ top: "243px", left: "28px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "130px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Assigned subjects
//           </div>

//           <input
//             type="text"
//             value={assignedSubjects}
//             onChange={(e) => setAssignedSubjects(e.target.value)}
//             placeholder="e.g. DAA, OS (comma separated)"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Add/Update faculty button */}
//         <button
//           onClick={handleAddFaculty}
//           disabled={loading}
//           className="absolute flex items-center gap-1 cursor-pointer hover:opacity-70 transition disabled:opacity-40"
//           style={{
//             top: "252px",
//             left: "1220px",
//           }}
//         >
//           <div className="w-2.5 h-2.5 rounded-full bg-[#265768] flex items-center justify-center text-white text-[10px]">
//             +
//           </div>
//           <div
//             className="font-medium text-[#26576880] whitespace-nowrap"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               fontSize: "12px",
//               lineHeight: "14.4px",
//             }}
//           >
//             {loading
//               ? "Processing..."
//               : editingId
//               ? "Update faculty"
//               : "Add faculty"}
//           </div>
//         </button>

//         {/* Cancel Edit Button */}
//         {editingId && (
//           <button
//             onClick={resetForm}
//             className="absolute flex items-center gap-1 cursor-pointer hover:opacity-70 transition"
//             style={{
//               top: "270px",
//               left: "1248px",
//             }}
//           >
//             <div
//               className="font-medium text-[#F04438] whitespace-nowrap text-xs"
//               style={{
//                 fontFamily: "Mulish, sans-serif",
//               }}
//             >
//               Cancel
//             </div>
//           </button>
//         )}

//         {/* Gray divider line */}
//         <div
//           className="absolute bg-[#d9d9d9]"
//           style={{
//             width: "1306px",
//             height: "2px",
//             top: "319px",
//             left: "28px",
//           }}
//         />

//         {/* Main content - conditionally show table or empty state */}
//         {showTable && facultyList.length > 0 ? (
//           <FacultyData
//             searchQuery=""
//             facultyList={facultyList}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         ) : (
//           <div
//             className="absolute flex flex-col bg-white overflow-hidden border-solid border-[#dfdfdf]"
//             style={{
//               width: "1306px",
//               height: "320px",
//               top: "330px",
//               left: "27px",
//               borderRadius: "12.23px",
//               borderWidth: "1.83px",
//             }}
//           >
//             {/* Camera Image */}
//             <div
//               className="absolute shadow-[0px_4px_4px_#00000040] bg-[url(https://c.animaapp.com/mjlb1n9pyRcYDw/img/frame-254.png)] bg-cover bg-center"
//               style={{
//                 width: "284.9px",
//                 height: "169.62px",
//                 top: "63.27px",
//                 left: "503.52px",
//                 borderRadius: "4.96px",
//               }}
//             />

//             {/* No Data Text */}
//             <div
//               className="absolute font-bold text-[#aeadad] text-center tracking-[0] whitespace-nowrap"
//               style={{
//                 fontFamily: "Playfair Display, serif",
//                 width: "101px",
//                 height: "32px",
//                 top: "257px",
//                 left: "602px",
//                 fontSize: "26.48px",
//                 lineHeight: "120%",
//               }}
//             >
//               {loading ? "Loading..." : "No Data !"}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManualEntryFaculty;















// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import {
//   getFaculties,
//   addFaculty,
//   updateFaculty,
//   deleteFaculty,
//   bulkUploadFaculties,
// } from "../../api/api";

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
//         className={`[font-family:'Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${
//           headingClassName || ""
//         }`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // FacultyData Component
// const FacultyData = ({ searchQuery = "", facultyList = [], onEdit, onDelete }) => {
//   const query = searchQuery.toLowerCase();
//   const filtered = facultyList.filter((f) =>
//     `${f.name} ${f.email}`.toLowerCase().includes(query)
//   );

//   return (
//     <div
//       className="absolute bg-white border-solid border-[#DFDFDF] shadow-sm overflow-hidden"
//       style={{
//         width: "1306px",
//         height: "320px",
//         top: "330px",
//         left: "27px",
//         borderRadius: "12.23px",
//         borderWidth: "1.83px",
//       }}
//     >
//       {/* Data container with exact positioning */}
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
//           <div className="flex-[1.7]">Faculty Name</div>
//           <div className="flex-[1.7]">Email</div>
//           <div className="flex-[0.8] text-center">Max load per day</div>
//           <div className="flex-[0.8] text-center">Leaves per month</div>
//           <div className="flex-[1] text-center">Assigned Subjects</div>
//           <div className="w-20 text-center">Actions</div>
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll"
//           style={{ height: "calc(327.72px - 56px)" }}
//         >
//           {filtered.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-gray-400">
//               No faculties found
//             </div>
//           ) : (
//             filtered.map((f, idx) => (
//               <div
//                 key={f._id || idx}
//                 className={`flex items-center py-5 text-sm border-b border-[#ECF0F4] ${
//                   idx === filtered.length - 1 ? "border-b-0" : ""
//                 } hover:bg-[#F7FAFF] transition`}
//               >
//                 {/* Faculty Name */}
//                 <div className="flex-[1.7] text-[#4C5968]">{f.name}</div>

//                 {/* Email */}
//                 <div className="flex-[1.7] text-[13px] text-[#8C96A3]">
//                   {f.email}
//                 </div>

//                 {/* Max load */}
//                 <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                   {f.maxLoad} Hrs
//                 </div>

//                 {/* Leaves */}
//                 <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                   {f.leavesPerMonth}
//                 </div>

//                 {/* Assigned Subjects */}
//                 <div className="flex-[1] text-center">
//                   <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
//                     See List ({f.subjects?.length || 0})
//                   </button>
//                 </div>

//                 {/* Actions */}
//                 <div className="w-20 flex items-center justify-center gap-3">
//                   <button
//                     onClick={() => onEdit(f)}
//                     className="text-[#C0C6D0] hover:text-[#1A8FE3]"
//                   >
//                     <Edit2 size={15} />
//                   </button>
//                   <button
//                     onClick={() => onDelete(f._id)}
//                     className="text-[#C0C6D0] hover:text-[#F04438]"
//                   >
//                     <Trash2 size={15} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
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

// // Main QuickAddFacultyScreen Component
// export const ManualEntryFaculty = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [facultyName, setFacultyName] = useState("");
//   const [email, setEmail] = useState("");
//   const [maxLoad, setMaxLoad] = useState("");
//   const [leaves, setLeaves] = useState("");
//   const [assignedSubjects, setAssignedSubjects] = useState("");
//   const [facultyList, setFacultyList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const fileInputRef = useRef(null);

//   // Fetch faculties on component mount
//   useEffect(() => {
//     loadFaculties();
//   }, []);

//   const loadFaculties = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       console.log("🔄 Loading faculties...");

//       const response = await getFaculties();
//       console.log("📦 Full API Response:", response);

//       // Handle different response structures
//       if (response?.success && response?.data) {
//         console.log("✅ Setting faculties from response.data");
//         setFacultyList(Array.isArray(response.data) ? response.data : []);
//         if (response.data.length > 0) {
//           setShowTable(true);
//         }
//       } else if (Array.isArray(response)) {
//         console.log("✅ Setting faculties from direct array");
//         setFacultyList(response);
//         if (response.length > 0) {
//           setShowTable(true);
//         }
//       } else if (response?.faculties) {
//         console.log("✅ Setting faculties from response.faculties");
//         setFacultyList(response.faculties);
//         if (response.faculties.length > 0) {
//           setShowTable(true);
//         }
//       } else {
//         console.warn("⚠️ Unexpected response structure:", response);
//         setFacultyList([]);
//       }
//     } catch (err) {
//       console.error("❌ Error loading faculties:", err);
//       setError(err.message || "Failed to load faculties");
//       setFacultyList([]);
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
//       setError("");
//       const response = await bulkUploadFaculties(file);

//       if (response.success) {
//         await loadFaculties();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || "faculties"}!`);
//       }
//     } catch (err) {
//       const errorMessage = err.message || "Unknown error occurred";
//       alert("Failed to upload file: " + errorMessage);
//       console.error("Upload error:", err);
//     } finally {
//       setUploading(false);
//       event.target.value = "";
//     }
//   };

//   const handleAddFaculty = async () => {
//     if (!facultyName || !email || !maxLoad || !leaves) {
//       setError("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const facultyData = {
//         name: facultyName,
//         email: email,
//         maxLoad: parseInt(maxLoad),
//         leavesPerMonth: parseInt(leaves),
//         subjects: assignedSubjects
//           ? assignedSubjects.split(",").map((s) => s.trim())
//           : [],
//       };

//       console.log("💾 Saving faculty data:", facultyData);

//       if (editingId) {
//         // Update existing faculty
//         const response = await updateFaculty(editingId, facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           alert("Faculty updated successfully!");
//         }
//       } else {
//         // Add new faculty
//         const response = await addFaculty(facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           setShowTable(true);
//           alert("Faculty added successfully!");
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error saving faculty:", err);
//       const errorMessage = err.message || "Unknown error occurred";
//       setError(errorMessage);
//       alert("Failed to save faculty: " + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (faculty) => {
//     console.log("✏️ Editing faculty:", faculty);
//     setFacultyName(faculty.name);
//     setEmail(faculty.email);
//     setMaxLoad(faculty.maxLoad.toString());
//     setLeaves(faculty.leavesPerMonth.toString());
//     setAssignedSubjects(faculty.subjects?.join(", ") || "");
//     setEditingId(faculty._id);
//   };

//   const handleDelete = async (facultyId) => {
//     if (!window.confirm("Are you sure you want to delete this faculty?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       const response = await deleteFaculty(facultyId);
//       if (response.success) {
//         await loadFaculties();
//         alert("Faculty deleted successfully!");
//       }
//     } catch (err) {
//       console.error("❌ Error deleting faculty:", err);
//       const errorMessage = err.message || "Unknown error occurred";
//       setError(errorMessage);
//       alert("Failed to delete faculty: " + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFacultyName("");
//     setEmail("");
//     setMaxLoad("");
//     setLeaves("");
//     setAssignedSubjects("");
//     setEditingId(null);
//     setError("");
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

//       {/* Main centered container */}
//       <div className="relative" style={{ width: "1360px", minHeight: "750px" }}>
//         {/* Logo - Ezey */}
//         <div
//           className="absolute font-bold text-[#7b7a81] text-center tracking-[0] whitespace-nowrap"
//           style={{
//             fontFamily: "Playfair Display, serif",
//             width: "95px",
//             height: "58px",
//             top: "6px",
//             left: "26px",
//             fontSize: "48px",
//             lineHeight: "120%",
//             textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           Ezey
//         </div>

//         {/* Person logo */}
//         <svg
//           className="absolute"
//           style={{
//             width: "30px",
//             height: "30px",
//             top: "90px",
//             left: "28px",
//           }}
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="black"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//           <circle cx="12" cy="7" r="4" />
//         </svg>

//         {/* Quick add Faculty heading */}
//         <div
//           className="absolute font-bold text-[#265668] text-center tracking-[0] whitespace-nowrap"
//           style={{
//             fontFamily: "Playfair Display, serif",
//             width: "246px",
//             height: "38px",
//             top: "84px",
//             left: "73px",
//             fontSize: "32px",
//             lineHeight: "120%",
//           }}
//         >
//           Quick add Faculty
//         </div>

//         {/* Blue divider line */}
//         <div
//           className="absolute bg-[#0077ff] shadow-[0px_4px_4px_#00000040]"
//           style={{
//             width: "1306px",
//             height: "2px",
//             top: "143px",
//             left: "28px",
//           }}
//         />

//         {/* Upload File Button - Before Click */}
//         {!showTable && (
//           <div
//             className="absolute overflow-hidden"
//             style={{
//               width: "208px",
//               height: "40px",
//               top: "88px",
//               left: "1126px",
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

//         {/* Upload File + Add Faculty Buttons - After Click */}
//         {showTable && (
//           <div
//             className="absolute flex"
//             style={{
//               width: "300px",
//               height: "40px",
//               top: "95px",
//               left: "1040px",
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

        
//         {/* Error Message */}
//         {error && (
//           <div
//             className="absolute text-red-500 text-sm font-medium"
//             style={{
//               top: "130px",
//               left: "28px",
//               fontFamily: "Mulish, sans-serif",
//             }}
//           >
//             ⚠️ {error}
//           </div>
//         )}

//         {/* Faculty Name Input */}
//         <div className="absolute" style={{ top: "156px", left: "28px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "91px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Faculty Name
//           </div>

//           <input
//             type="text"
//             value={facultyName}
//             onChange={(e) => setFacultyName(e.target.value)}
//             placeholder="e.g. Mrs Pooja Shukla"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Email Input */}
//         <div className="absolute" style={{ top: "156px", left: "327px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "91px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Email
//           </div>

//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="e.g. poojasunshore@gmail.com"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Max load per day Input */}
//         <div className="absolute" style={{ top: "156px", left: "626px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "110px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Max load per day
//           </div>

//           <input
//             type="number"
//             value={maxLoad}
//             onChange={(e) => setMaxLoad(e.target.value)}
//             placeholder="e.g. 5"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Leaves per month Input */}
//         <div className="absolute" style={{ top: "156px", left: "925px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "120px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Leaves per month
//           </div>

//           <input
//             type="number"
//             value={leaves}
//             onChange={(e) => setLeaves(e.target.value)}
//             placeholder="e.g 5"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Assigned subjects Input */}
//         <div className="absolute" style={{ top: "243px", left: "28px" }}>
//           <div
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "130px",
//               height: "21px",
//               fontSize: "14px",
//               lineHeight: "150%",
//             }}
//           >
//             Assigned subjects
//           </div>

//           <input
//             type="text"
//             value={assignedSubjects}
//             onChange={(e) => setAssignedSubjects(e.target.value)}
//             placeholder="e.g. DAA, OS (comma separated)"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               width: "274.5px",
//               height: "40px",
//               borderRadius: "15px",
//               borderWidth: "1.5px",
//               borderColor: "#DFDFDF",
//               borderStyle: "solid",
//             }}
//           />
//         </div>

//         {/* Add/Update faculty button */}
//         <button
//           onClick={handleAddFaculty}
//           disabled={loading}
//           className="absolute flex items-center gap-1 cursor-pointer hover:opacity-70 transition disabled:opacity-40"
//           style={{
//             top: "252px",
//             left: "1220px",
//           }}
//         >
//           <div className="w-2.5 h-2.5 rounded-full bg-[#265768] flex items-center justify-center text-white text-[10px]">
//             +
//           </div>
//           <div
//             className="font-medium text-[#26576880] whitespace-nowrap"
//             style={{
//               fontFamily: "Mulish, sans-serif",
//               fontSize: "12px",
//               lineHeight: "14.4px",
//             }}
//           >
//             {loading
//               ? "Processing..."
//               : editingId
//               ? "Update faculty"
//               : "Add faculty"}
//           </div>
//         </button>

//         {/* Cancel Edit Button */}
//         {editingId && (
//           <button
//             onClick={resetForm}
//             className="absolute flex items-center gap-1 cursor-pointer hover:opacity-70 transition"
//             style={{
//               top: "270px",
//               left: "1248px",
//             }}
//           >
//             <div
//               className="font-medium text-[#F04438] whitespace-nowrap text-xs"
//               style={{
//                 fontFamily: "Mulish, sans-serif",
//               }}
//             >
//               Cancel
//             </div>
//           </button>
//         )}

//         {/* Gray divider line */}
//         <div
//           className="absolute bg-[#d9d9d9]"
//           style={{
//             width: "1306px",
//             height: "2px",
//             top: "319px",
//             left: "28px",
//           }}
//         />

//         {/* Main content - conditionally show table or empty state */}
//         {showTable && facultyList.length > 0 ? (
//           <FacultyData
//             searchQuery=""
//             facultyList={facultyList}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         ) : (
//           <div
//             className="absolute flex flex-col bg-white overflow-hidden border-solid border-[#dfdfdf]"
//             style={{
//               width: "1306px",
//               height: "320px",
//               top: "330px",
//               left: "27px",
//               borderRadius: "12.23px",
//               borderWidth: "1.83px",
//             }}
//           >
//             {/* Camera Image */}
//             <div
//               className="absolute shadow-[0px_4px_4px_#00000040] bg-[url(https://c.animaapp.com/mjlb1n9pyRcYDw/img/frame-254.png)] bg-cover bg-center"
//               style={{
//                 width: "284.9px",
//                 height: "169.62px",
//                 top: "63.27px",
//                 left: "503.52px",
//                 borderRadius: "4.96px",
//               }}
//             />

//             {/* No Data Text */}
//             <div
//               className="absolute font-bold text-[#aeadad] text-center tracking-[0] whitespace-nowrap"
//               style={{
//                 fontFamily: "Playfair Display, serif",
//                 width: "101px",
//                 height: "32px",
//                 top: "257px",
//                 left: "602px",
//                 fontSize: "26.48px",
//                 lineHeight: "120%",
//               }}
//             >
//               {loading ? "Loading..." : "No Data !"}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManualEntryFaculty;










// import React, { useState, useEffect, useRef } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import { getFaculties, addFaculty, updateFaculty, deleteFaculty, bulkUploadFaculties } from "../../api/api";

// // Component for Upload Button
// const Component = ({ property1, className, headingClassName, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] w-52 left-2.5 h-10 overflow-hidden rounded-md relative ${property1 === "variant-12" ? "top-[214px]" : "top-[146px]"} ${property1 === "variant-12" ? "shadow-[0px_4px_4px_#00000040]" : ""} ${className}`}
//     >
//       <p
//         className={`[font-family:'Mulish',Helvetica] left-2 tracking-[0] text-base top-[11px] text-white font-medium text-center whitespace-nowrap leading-[19.2px] absolute ${headingClassName}`}
//       >
//         Upload File ( CSV / XLSX )
//       </p>
//     </button>
//   );
// };

// // FacultyData Component
// const FacultyData = ({ searchQuery = "", facultyList = [], onEdit, onDelete }) => {
//   const query = searchQuery.toLowerCase();
//   const filtered = facultyList.filter((f) =>
//     `${f.name} ${f.email}`.toLowerCase().includes(query)
//   );

//   return (
//     <div
//       className="absolute bg-white border-solid border-[#DFDFDF] shadow-sm overflow-hidden"
//       style={{ 
//         width: "1306px", 
//         height: "320px",
//         top: "330px",
//         left: "27px",
//         borderRadius: "12.23px",
//         borderWidth: "1.83px"
//       }}
//     >
//       {/* Data container with exact positioning */}
//       <div 
//         className="absolute"
//         style={{
//           width: "1156.39px",
//           height: "327.72px",
//           top: "18.34px",
//           left: "72.15px"
//         }}
//       >
//         {/* Header row */}
//         <div className="flex items-center text-[13px] font-semibold text-[#6C7A90] border-b-2 border-[#1DA5FF] pb-3">
//           <div className="flex-[1.7]">Faculty Name</div>
//           <div className="flex-[1.7]">Email</div>
//           <div className="flex-[0.8] text-center">Max load per day</div>
//           <div className="flex-[0.8] text-center">Leaves per month</div>
//           <div className="flex-[1] text-center">Assigned Subjects</div>
//           <div className="w-20 text-center">Actions</div>
//         </div>

//         {/* Body rows */}
//         <div
//           className="overflow-y-auto custom-scroll"
//           style={{ height: "calc(327.72px - 56px)" }}
//         >
//           {filtered.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-gray-400">
//               No faculties found
//             </div>
//           ) : (
//             filtered.map((f, idx) => (
//               <div
//                 key={f._id || idx}
//                 className={`flex items-center py-5 text-sm border-b border-[#ECF0F4] ${
//                   idx === filtered.length - 1 ? "border-b-0" : ""
//                 } hover:bg-[#F7FAFF] transition`}
//               >
//                 {/* Faculty Name */}
//                 <div className="flex-[1.7] text-[#4C5968]">{f.name}</div>

//                 {/* Email */}
//                 <div className="flex-[1.7] text-[13px] text-[#8C96A3]">{f.email}</div>

//                 {/* Max load */}
//                 <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                   {f.maxLoad} Hrs
//                 </div>

//                 {/* Leaves */}
//                 <div className="flex-[0.8] text-center text-[13px] text-[#4C5968]">
//                   {f.leavesPerMonth}
//                 </div>

//                 {/* Assigned Subjects */}
//                 <div className="flex-[1] text-center">
//                   <button className="text-[13px] font-medium text-[#1A8FE3] hover:underline">
//                     See List ({f.subjects?.length || 0})
//                   </button>
//                 </div>

//                 {/* Actions */}
//                 <div className="w-20 flex items-center justify-center gap-3">
//                   <button 
//                     onClick={() => onEdit(f)}
//                     className="text-[#C0C6D0] hover:text-[#1A8FE3]"
//                   >
//                     <Edit2 size={15} />
//                   </button>
//                   <button 
//                     onClick={() => onDelete(f._id)}
//                     className="text-[#C0C6D0] hover:text-[#F04438]"
//                   >
//                     <Trash2 size={15} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Custom Scrollbar Track */}
//       <div
//         className="absolute"
//         style={{
//           width: "9.78px",
//           height: "289.87px",
//           top: "16.13px",
//           left: "1274.21px",
//           borderRadius: "44.02px",
//           borderWidth: "1.22px",
//           borderColor: "#E5E5E5",
//           borderStyle: "solid",
//           background: "transparent"
//         }}
//       />

//       {/* Custom Scrollbar Thumb */}
//       <div
//         className="absolute"
//         style={{
//           width: "12.23px",
//           height: "33.97px",
//           top: "16.97px",
//           left: "1272.98px",
//           borderRadius: "4.89px",
//           background: "linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%)"
//         }}
//       />

//       {/* Scrollbar Styles */}
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

// // Main QuickAddFacultyScreen Component
// export const ManualEntryFaculty = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [facultyName, setFacultyName] = useState("");
//   const [email, setEmail] = useState("");
//   const [maxLoad, setMaxLoad] = useState("");
//   const [leaves, setLeaves] = useState("");
//   const [assignedSubjects, setAssignedSubjects] = useState("");
//   const [facultyList, setFacultyList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const fileInputRef = useRef(null);

//   // Fetch faculties on component mount
//   useEffect(() => {
//     loadFaculties();
//   }, []);

//   const loadFaculties = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       console.log("🔄 Loading faculties...");
      
//       const response = await getFaculties();
//       console.log("📦 Full API Response:", response);
      
//       // Handle different response structures
//       if (response?.success && response?.data) {
//         console.log("✅ Setting faculties from response.data");
//         setFacultyList(Array.isArray(response.data) ? response.data : []);
//         if (response.data.length > 0) {
//           setShowTable(true);
//         }
//       } else if (Array.isArray(response)) {
//         console.log("✅ Setting faculties from direct array");
//         setFacultyList(response);
//         if (response.length > 0) {
//           setShowTable(true);
//         }
//       } else if (response?.faculties) {
//         console.log("✅ Setting faculties from response.faculties");
//         setFacultyList(response.faculties);
//         if (response.faculties.length > 0) {
//           setShowTable(true);
//         }
//       } else {
//         console.warn("⚠️ Unexpected response structure:", response);
//         setFacultyList([]);
//       }
//     } catch (err) {
//       console.error("❌ Error loading faculties:", err);
//       setError(err.message || "Failed to load faculties");
//       setFacultyList([]);
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
//       'text/csv',
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     ];
    
//     if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
//       alert("Please upload a valid CSV or XLSX file");
//       event.target.value = '';
//       return;
//     }

//     try {
//       setUploading(true);
//       setError("");
//       const response = await bulkUploadFaculties(file);
      
//       if (response.success) {
//         await loadFaculties();
//         setShowTable(true);
//         alert(`Successfully uploaded ${response.data?.count || 'faculties'}!`);
//       }
//     } catch (err) {
//       const errorMessage = err.message || "Unknown error occurred";
//       alert("Failed to upload file: " + errorMessage);
//       console.error("Upload error:", err);
//     } finally {
//       setUploading(false);
//       event.target.value = '';
//     }
//   };

//   const handleAddFaculty = async () => {
//     if (!facultyName || !email || !maxLoad || !leaves) {
//       setError("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const facultyData = {
//         name: facultyName,
//         email: email,
//         maxLoad: parseInt(maxLoad),
//         leavesPerMonth: parseInt(leaves),
//         subjects: assignedSubjects ? assignedSubjects.split(',').map(s => s.trim()) : []
//       };

//       console.log("💾 Saving faculty data:", facultyData);

//       if (editingId) {
//         // Update existing faculty
//         const response = await updateFaculty(editingId, facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           alert("Faculty updated successfully!");
//         }
//       } else {
//         // Add new faculty
//         const response = await addFaculty(facultyData);
//         if (response.success || response._id) {
//           await loadFaculties();
//           resetForm();
//           setShowTable(true);
//           alert("Faculty added successfully!");
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error saving faculty:", err);
//       const errorMessage = err.message || "Unknown error occurred";
//       setError(errorMessage);
//       alert("Failed to save faculty: " + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (faculty) => {
//     console.log("✏️ Editing faculty:", faculty);
//     setFacultyName(faculty.name);
//     setEmail(faculty.email);
//     setMaxLoad(faculty.maxLoad.toString());
//     setLeaves(faculty.leavesPerMonth.toString());
//     setAssignedSubjects(faculty.subjects?.join(', ') || '');
//     setEditingId(faculty._id);
//   };

//   const handleDelete = async (facultyId) => {
//     if (!window.confirm("Are you sure you want to delete this faculty?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       const response = await deleteFaculty(facultyId);
//       if (response.success) {
//         await loadFaculties();
//         alert("Faculty deleted successfully!");
//       }
//     } catch (err) {
//       console.error("❌ Error deleting faculty:", err);
//       const errorMessage = err.message || "Unknown error occurred";
//       setError(errorMessage);
//       alert("Failed to delete faculty: " + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFacultyName("");
//     setEmail("");
//     setMaxLoad("");
//     setLeaves("");
//     setAssignedSubjects("");
//     setEditingId(null);
//     setError("");
//   };

//   return (
//     <div
//       className="bg-white w-full min-h-screen flex items-center justify-center p-8 overflow-hidden"
//     >
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Mulish:wght@400;500;600;700&display=swap');
          
//           body {
//             overflow: hidden;
//           }
          
//           ::-webkit-scrollbar {
//             display: none;
//           }
          
//           * {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
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

//       {/* Main centered container */}
//       <div className="relative" style={{ width: '1360px', minHeight: '750px' }}>
        
//         {/* Logo - Ezey */}
//         <div 
//           className="absolute font-bold text-[#7b7a81] text-center tracking-[0] whitespace-nowrap"
//           style={{ 
//             fontFamily: 'Playfair Display, serif',
//             width: '95px',
//             height: '58px',
//             top: '6px',
//             left: '26px',
//             fontSize: '48px',
//             lineHeight: '120%',
//             textShadow: '0px 6px 6px rgba(0, 0, 0, 0.25)'
//           }}
//         >
//           Ezey
//         </div>

//         {/* Person logo */}
//         <svg
//           className="absolute"
//           style={{
//             width: '30px',
//             height: '30px',
//             top: '90px',
//             left: '28px'
//           }}
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="black"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//           <circle cx="12" cy="7" r="4" />
//         </svg>

//         {/* Quick add Faculty heading */}
//         <div 
//           className="absolute font-bold text-[#265668] text-center tracking-[0] whitespace-nowrap"
//           style={{ 
//             fontFamily: 'Playfair Display, serif',
//             width: '246px',
//             height: '38px',
//             top: '84px',
//             left: '73px',
//             fontSize: '32px',
//             lineHeight: '120%'
//           }}
//         >
//           Quick add Faculty
//         </div>

//         {/* Blue divider line */}
//         <div 
//           className="absolute bg-[#0077ff] shadow-[0px_4px_4px_#00000040]" 
//           style={{ 
//             width: '1306px',
//             height: '2px',
//             top: '143px', 
//             left: '28px' 
//           }} 
//         />

//         {/* Upload File Button - Before Click */}
//         {!showTable && (
//           <div 
//             className="absolute overflow-hidden"
//             style={{
//               width: '208px',
//               height: '40px',
//               top: '88px',
//               left: '1126px',
//               borderRadius: '6px'
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

//         {/* Upload File + Add Faculty Buttons - After Click */}
//         {showTable && (
//           <div 
//             className="absolute flex"
//             style={{
//               width: '428px',
//               height: '40px',
//               top: '95px',
//               left: '906px',
//               borderRadius: '6px',
//               borderWidth: '1px',
//               borderColor: '#BFBFBF',
//               borderStyle: 'solid'
//             }}
//           >
//             <button
//               onClick={handleUploadClick}
//               disabled={uploading}
//               className="flex-1 bg-[linear-gradient(0deg,rgba(38,87,104,1)_0%,rgba(75,172,206,1)_100%)] text-white font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-50"
//               style={{
//                 fontFamily: 'Mulish, sans-serif',
//                 borderTopLeftRadius: '6px',
//                 borderBottomLeftRadius: '6px'
//               }}
//             >
//               {uploading ? "Uploading..." : "Upload File ( CSV / XLSX )"}
//             </button>
//             <button
//               onClick={handleAddFaculty}
//               disabled={loading}
//               className="flex-1 bg-white text-[#265768] font-medium text-base border-l border-[#BFBFBF] hover:bg-gray-50 transition-colors disabled:opacity-50"
//               style={{
//                 fontFamily: 'Mulish, sans-serif',
//                 borderTopRightRadius: '6px',
//                 borderBottomRightRadius: '6px'
//               }}
//             >
//               {editingId ? "Update Faculty" : "Add Faculty"}
//             </button>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div 
//             className="absolute text-red-500 text-sm font-medium"
//             style={{
//               top: '130px',
//               left: '28px',
//               fontFamily: 'Mulish, sans-serif'
//             }}
//           >
//             ⚠️ {error}
//           </div>
//         )}

//         {/* Faculty Name Input */}
//         <div className="absolute" style={{ top: '156px', left: '28px' }}>
//           <div 
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '91px',
//               height: '21px',
//               fontSize: '14px',
//               lineHeight: '150%'
//             }}
//           >
//             Faculty Name
//           </div>

//           <input
//             type="text"
//             value={facultyName}
//             onChange={(e) => setFacultyName(e.target.value)}
//             placeholder="e.g. Mrs Pooja Shukla"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '274.5px',
//               height: '40px',
//               borderRadius: '15px',
//               borderWidth: '1.5px',
//               borderColor: '#DFDFDF',
//               borderStyle: 'solid'
//             }}
//           />
//         </div>

//         {/* Email Input */}
//         <div className="absolute" style={{ top: '156px', left: '327px' }}>
//           <div 
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '91px',
//               height: '21px',
//               fontSize: '14px',
//               lineHeight: '150%'
//             }}
//           >
//             Email
//           </div>

//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="e.g. poojasunshore@gmail.com"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '274.5px',
//               height: '40px',
//               borderRadius: '15px',
//               borderWidth: '1.5px',
//               borderColor: '#DFDFDF',
//               borderStyle: 'solid'
//             }}
//           />
//         </div>

//         {/* Max load per day Input */}
//         <div className="absolute" style={{ top: '156px', left: '626px' }}>
//           <div 
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '110px',
//               height: '21px',
//               fontSize: '14px',
//               lineHeight: '150%'
//             }}
//           >
//             Max load per day
//           </div>

//           <input
//             type="number"
//             value={maxLoad}
//             onChange={(e) => setMaxLoad(e.target.value)}
//             placeholder="e.g. 5"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '274.5px',
//               height: '40px',
//               borderRadius: '15px',
//               borderWidth: '1.5px',
//               borderColor: '#DFDFDF',
//               borderStyle: 'solid'
//             }}
//           />
//         </div>

//         {/* Leaves per month Input */}
//         <div className="absolute" style={{ top: '156px', left: '925px' }}>
//           <div 
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '120px',
//               height: '21px',
//               fontSize: '14px',
//               lineHeight: '150%'
//             }}
//           >
//             Leaves per month
//           </div>

//           <input
//             type="number"
//             value={leaves}
//             onChange={(e) => setLeaves(e.target.value)}
//             placeholder="e.g 5"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '274.5px',
//               height: '40px',
//               borderRadius: '15px',
//               borderWidth: '1.5px',
//               borderColor: '#DFDFDF',
//               borderStyle: 'solid'
//             }}
//           />
//         </div>

//         {/* Assigned subjects Input */}
//         <div className="absolute" style={{ top: '243px', left: '28px' }}>
//           <div 
//             className="font-semibold text-[#265768] text-center tracking-[0] mb-[5px]"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '130px',
//               height: '21px',
//               fontSize: '14px',
//               lineHeight: '150%'
//             }}
//           >
//             Assigned subjects
//           </div>

//           <input
//             type="text"
//             value={assignedSubjects}
//             onChange={(e) => setAssignedSubjects(e.target.value)}
//             placeholder="e.g. DAA, OS (comma separated)"
//             disabled={loading}
//             className="px-4 bg-white text-[#265768] text-xs outline-none disabled:opacity-50"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               width: '274.5px',
//               height: '40px',
//               borderRadius: '15px',
//               borderWidth: '1.5px',
//               borderColor: '#DFDFDF',
//               borderStyle: 'solid'
//             }}
//           />
//         </div>

//         {/* Add/Update faculty button */}
//         <button 
//           onClick={handleAddFaculty}
//           disabled={loading}
//           className="absolute flex items-center gap-1 cursor-pointer hover:opacity-70 transition disabled:opacity-40"
//           style={{
//             top: '252px',
//             left: '1220px'
//           }}
//         >
//           <div className="w-2.5 h-2.5 rounded-full bg-[#26576880] flex items-center justify-center text-white text-[10px]">
//             +
//           </div>
//           <div 
//             className="font-medium text-[#26576880] whitespace-nowrap"
//             style={{ 
//               fontFamily: 'Mulish, sans-serif',
//               fontSize: '12px',
//               lineHeight: '14.4px'
//             }}
//           >
//             {loading ? 'Processing...' : editingId ? 'Update faculty' : 'Add faculty'}
//           </div>
//         </button>

//         {/* Cancel Edit Button */}
//         {editingId && (
//           <button 
//             onClick={resetForm}
//             className="absolute flex items-center gap-1 cursor-pointer hover:opacity-70 transition"
//             style={{
//               top: '270px',
//               left: '1248px'
//             }}
//           >
//             <div 
//               className="font-medium text-[#F04438] whitespace-nowrap text-xs"
//               style={{ 
//                 fontFamily: 'Mulish, sans-serif'
//               }}
//             >
//               Cancel
//             </div>
//           </button>
//         )}

//         {/* Gray divider line */}
//         <div 
//           className="absolute bg-[#d9d9d9]" 
//           style={{ 
//             width: '1306px',
//             height: '2px',
//             top: '319px', 
//             left: '28px' 
//           }} 
//         />

//         {/* Main content - conditionally show table or empty state */}
//         {showTable && facultyList.length > 0 ? (
//           <FacultyData 
//             searchQuery="" 
//             facultyList={facultyList}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         ) : (
//           <div 
//             className="absolute flex flex-col bg-white overflow-hidden border-solid border-[#dfdfdf]"
//             style={{
//               width: '1306px',
//               height: '320px',
//               top: '330px',
//               left: '27px',
//               borderRadius: '12.23px',
//               borderWidth: '1.83px'
//             }}
//           >
//             {/* Camera Image */}
//             <div 
//               className="absolute shadow-[0px_4px_4px_#00000040] bg-[url(https://c.animaapp.com/mjlb1n9pyRcYDw/img/frame-254.png)] bg-cover bg-center"
//               style={{
//                 width: '284.9px',
//                 height: '169.62px',
//                 top: '63.27px',
//                 left: '503.52px',
//                 borderRadius: '4.96px'
//               }}
//             />

//             {/* No Data Text */}
//             <div 
//               className="absolute font-bold text-[#aeadad] text-center tracking-[0] whitespace-nowrap"
//               style={{ 
//                 fontFamily: 'Playfair Display, serif',
//                 width: '101px',
//                 height: '32px',
//                 top: '257px',
//                 left: '602px',
//                 fontSize: '26.48px',
//                 lineHeight: '120%'
//               }}
//             >
//               {loading ? 'Loading...' : 'No Data !'}
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ManualEntryFaculty;





