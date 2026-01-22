import React, { useRef, useState, useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import nodata from "../../assets/images/nodata.jpeg";
import { useNavigate } from "react-router-dom";

// =============================
// API Configuration
// =============================
const BASE_URL = "http://localhost:5000";

const handleUnauthorized = (res) => {
  if (res.status === 401) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  }
};

// =============================
// API FUNCTIONS
// =============================
const getSubjects = async () => {
  const res = await fetch(`${BASE_URL}/api/subjects`, {
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

const addSubjectAPI = async (subjectData) => {
  const res = await fetch(`${BASE_URL}/api/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(subjectData),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to add subject: ${res.status}`);
  }

  return res.json();
};

const deleteSubjectAPI = async (subjectId) => {
  const res = await fetch(`${BASE_URL}/api/subjects/${subjectId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete subject: ${res.status}`
    );
  }

  return res.json();
};

const updateSubjectAPI = async (subjectId, subjectData) => {
  const res = await fetch(`${BASE_URL}/api/subjects/${subjectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(subjectData),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update subject: ${res.status}`
    );
  }

  return res.json();
};

// =============================
// COMPONENT
// =============================
export default function ManualEntrySubject() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    department: "",
    section: "",
    semester: "",
    hrsWeek: "",
    type: "",
  });

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

  const triggerFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSubjects();

      const mapped = (response?.data || []).map((s) => ({
        _id: s._id,
        name: s.name,
        code: s.code,
        department: s.department,
        semester: s.semester || "--",
        section: s.section || "--",
        type: s.type,
        hrsWeek: s.hoursPerWeek,
      }));

      setSubjects(mapped);
    } catch (err) {
      setError(err.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const saveSubject = async () => {
    if (!form.name || !form.code) {
      setError("Please enter Subject name and Subject code");
      return;
    }

    if (!form.type || !["theory", "lab"].includes(form.type)) {
      setError("Please select valid type (Theory / Practical)");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: form.name,
        code: form.code,
        department: form.department,
        section: form.section,
        semester: form.semester,
        type: form.type,
        hoursPerWeek: Number(form.hrsWeek || 0),
      };

      let response;
      if (editingId) response = await updateSubjectAPI(editingId, payload);
      else response = await addSubjectAPI(payload);

      if (response?.success || response?._id) {
        await fetchSubjects();
        setForm({
          name: "",
          code: "",
          department: "",
          section: "",
          semester: "",
          hrsWeek: "",
          type: "",
        });
        setEditingId(null);
      } else {
        setError(response.message || "Failed to save subject");
      }
    } catch (err) {
      setError(err.message || "Failed to save subject");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      code: item.code || "",
      department: item.department || "",
      section: item.section === "--" ? "" : item.section || "",
      semester: item.semester === "--" ? "" : item.semester || "",
      hrsWeek: item.hrsWeek?.toString?.() || "",
      type: item.type || "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      code: "",
      department: "",
      section: "",
      semester: "",
      hrsWeek: "",
      type: "",
    });
    setError("");
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      setLoading(true);
      setError("");

      const response = await deleteSubjectAPI(id);

      if (response.success) await fetchSubjects();
    } catch (err) {
      alert("Failed to delete subject: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      <div className="w-full">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full"
          style={{
            borderColor: "#e8e8e8",
            minHeight: "calc(100vh - 48px)",
          }}
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={() => navigate("/form")}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
            aria-label="Close"
          >
            <X size={20} color="#265768" />
          </button>

          <div className="px-6 pt-6">
            {/* HEADER */}
            <div className="mb-3">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}
              >
                Ezey
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                hidden
              />

              <button
                onClick={triggerFile}
                style={{
                  position: "absolute",
                  right: 24,
                  top: 70,
                  minWidth: 160,
                  height: 34,
                  background: "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
                  borderRadius: 6,
                  color: "white",
                  fontSize: 12,
                  fontFamily: "'Mulish', sans-serif",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                }}
              >
                Upload File ( CSV / XLSX )
              </button>
            </div>

            {/* TITLE */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <path
                  d="M16 16H6C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14V2C4 1.46957 4.21071 0.960859 4.58579 0.585786C4.96086 0.210714 5.46957 0 6 0H7V5L9 3.5L11 5V0H16C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16ZM14 18V20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V4H2V18H14Z"
                  fill="#265768"
                />
              </svg>

              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                Quick add subject
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
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Subject name
                  </div>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. DAA" style={inputStyle} className="custom-input"/>
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Subject code
                  </div>
                  <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. CS201" style={inputStyle} className="custom-input" />
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Department
                  </div>
                  <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. CSE" style={inputStyle} className="custom-input" />
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Section
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: "5px" }}>
                    <input name="section" value={form.section} onChange={handleChange} placeholder="e.g. A" style={inputStyle} className="custom-input" />

                    <button
                      onClick={saveSubject}
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
                      {editingId ? (loading ? "Updating..." : "+ Update subject") : loading ? "Adding..." : "+ Add subject"}
                    </button>
                  </div>

                  {editingId && (
                    <button
                      onClick={cancelEdit}
                      style={{
                        fontSize: "12px",
                        color: "#F04438",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Mulish', sans-serif",
                        marginTop: "8px",
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Semester
                  </div>
                  <input name="semester" value={form.semester} onChange={handleChange} placeholder="e.g. I" style={inputStyle}  className="custom-input" />
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Hrs/Week
                  </div>
                  <input name="hrsWeek" value={form.hrsWeek} onChange={handleChange} placeholder="e.g. 4" style={inputStyle} className="custom-input" />
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Type
                  </div>
                  <select name="type" value={form.type} onChange={handleChange} style={inputStyle} className="custom-input">
                    <option value="">Select Type</option>
                    <option value="theory">Theory</option>
                    <option value="lab">Practical / Lab</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {error && (
              <div className="mt-3 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {/* TABLE */}
            {subjects.length === 0 ? (
              <div className="mt-6 border rounded-lg flex justify-center items-center" style={{ height: "320px", borderColor: "#DFDFDF" }}>
                <img src={nodata} alt="No Data" />
              </div>
            ) : (
              <div className="mt-6 pb-6">
                <div
                  className="bg-white w-full relative"
                  style={{
                    width: "100%",
                    height: "360px",
                    borderRadius: "12.23px",
                    border: "1.83px solid #DFDFDF",
                    overflow: "hidden",
                  }}
                >
                  <div className="px-8 pt-4 pb-2 bg-white mr-3">
                    <div className="flex items-center text-[14px] font-medium" style={{ color: "#265768", fontFamily: "'Mulish', sans-serif" }}>
                      <div className="flex-1 text-center">Subject Name</div>
                      <div className="flex-1 text-center">Subject Code</div>
                      <div className="flex-1 text-center">Department</div>
                      <div className="flex-1 text-center">Semester</div>
                      <div className="flex-1 text-center">Section</div>
                      <div className="flex-1 text-center">Type</div>
                      <div className="flex-1 text-center">Hrs/Week</div>
                      <div className="flex-1 text-center">Actions</div>
                    </div>

                    <div className="mt-3 h-[3px] rounded" style={{ background: "#0b84d6", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }} />
                  </div>

                  <div className="overflow-y-auto custom-scroll mr-3" style={{ maxHeight: "300px" }}>
                    <div className="px-8">
                      {subjects.map((item, idx) => (
                        <div key={item._id || idx} className="flex items-center py-3.5 hover:bg-gray-50 transition" style={{ borderBottom: "3px solid #D9D9D9" }}>
                          <div className="flex-1 text-[13px] font-medium text-[#265768] text-center">{item.name}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.code}</div>
                          <div className="flex-1 text-[13px] text-[#265768] truncate text-center">{item.department}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.semester}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.section}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.type}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.hrsWeek}</div>

                          <div className="flex-1 flex items-center justify-center gap-3">
                            <button onClick={() => handleEditSubject(item)} className="text-[#C0C6D0] hover:text-[#1A8FE3] transition" title="Edit">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => handleDeleteSubject(item._id)} className="text-[#C0C6D0] hover:text-[#F04438] transition" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
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

                    .custom-scroll::-webkit-scrollbar { width: 8.78px; }
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}












