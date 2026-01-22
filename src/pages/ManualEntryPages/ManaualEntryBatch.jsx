import React, { useRef, useState, useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import nodata from "../../assets/images/nodata.jpeg";
import {
  getBatches,
  addBatch as addBatchAPI,
  updateBatch,
  deleteBatch,
  getSubjects,
  getFaculties,
} from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function ManualEntryBatch() {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const [batches, setBatches] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [facultiesList, setFacultiesList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ✅ popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  const [form, setForm] = useState({
    course: "",
    department: "",
    name: "",
    strength: "",
    semester: "",
    subject: "",
    faculty: "",
  });

  const navigate = useNavigate();

  // =============================
  // Helpers
  // =============================
  const normalizeArrayResponse = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res?.success && Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.subjects)) return res.subjects;
    if (Array.isArray(res?.faculties)) return res.faculties;
    if (Array.isArray(res?.batches)) return res.batches;
    return [];
  };

  // ✅ Resolve subject display name using getSubjects API list
  const resolveSubjectText = (subjectValue) => {
    // subjectValue can be: string id OR populated object
    const subjectId =
      typeof subjectValue === "string"
        ? subjectValue
        : subjectValue?._id || subjectValue?.subjectId || "";

    if (typeof subjectValue === "object" && subjectValue?.name) {
      return `${subjectValue.name}${subjectValue.code ? ` (${subjectValue.code})` : ""}`;
    }

    const found = subjectsList.find((s) => s?._id === subjectId);
    if (found) return `${found.name}${found.code ? ` (${found.code})` : ""}`;

    return subjectId || "Subject";
  };

  // ✅ Resolve faculty display name using getFaculties API list
  const resolveFacultyText = (facultyValue) => {
    const facultyId =
      typeof facultyValue === "string"
        ? facultyValue
        : facultyValue?._id || facultyValue?.facultyId || "";

    if (typeof facultyValue === "object" && facultyValue?.name) {
      return `${facultyValue.name}${facultyValue.email ? ` (${facultyValue.email})` : ""}`;
    }

    const found = facultiesList.find((f) => f?._id === facultyId);
    if (found) return `${found.name}${found.email ? ` (${found.email})` : ""}`;

    return facultyId || "Faculty";
  };

  const openListPopup = (title, items) => {
    setPopupTitle(title);
    setPopupItems(Array.isArray(items) ? items : []);
    setShowPopup(true);
  };

  // =============================
  // Load all data
  // =============================
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([loadSubjects(), loadFaculties(), loadBatches()]);
  };

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      const list = normalizeArrayResponse(res);
      setSubjectsList(list);
    } catch (err) {
      console.log("❌ getSubjects failed:", err?.message);
      setSubjectsList([]);
    }
  };

  const loadFaculties = async () => {
    try {
      const res = await getFaculties();
      const list = normalizeArrayResponse(res);
      setFacultiesList(list);
    } catch (err) {
      console.log("❌ getFaculties failed:", err?.message);
      setFacultiesList([]);
    }
  };

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getBatches();
      setBatches(normalizeArrayResponse(res));
    } catch (err) {
      setError(err.message || "Failed to load batches");
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Form Handlers
  // =============================
  const triggerFile = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    console.log("File selected:", f.name);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =============================
  // Add/Update Batch
  // =============================
  const handleAddBatch = async () => {
    if (
      !form.course ||
      !form.department ||
      !form.name ||
      !form.strength ||
      !form.semester
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (!form.subject || !form.faculty) {
      setError("Please select Assigned subject and Assigned faculty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const code = `CSE_${Number(form.semester)}_${form.name}_2025`;

      const payload = {
        name: form.name,
        course: form.course,
        code,
        semester: Number(form.semester),
        department: form.department,
        strength: Number(form.strength),
        subjects: [{ subject: form.subject, faculty: form.faculty }],
      };

      let res;
      if (editingId) res = await updateBatch(editingId, payload);
      else res = await addBatchAPI(payload);

      if (res?.success || res?._id) {
        await loadBatches();
        resetForm();
      } else {
        throw new Error(res?.message || "Failed to save batch");
      }
    } catch (err) {
      setError(err.message || "Failed to save batch");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch) => {
    const firstPair = Array.isArray(batch.subjects) ? batch.subjects[0] : null;

    setForm({
      course: batch.course || "",
      department: batch.department || "",
      name: batch.name || "",
      strength: batch.strength?.toString?.() || "",
      semester: batch.semester?.toString?.() || "",
      subject:
        typeof firstPair?.subject === "object"
          ? firstPair?.subject?._id
          : firstPair?.subject || "",
      faculty:
        typeof firstPair?.faculty === "object"
          ? firstPair?.faculty?._id
          : firstPair?.faculty || "",
    });

    setEditingId(batch._id);
    setError("");
  };

  const handleDeleteBatch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;

    try {
      setLoading(true);
      setError("");
      const res = await deleteBatch(id);
      if (res?.success) await loadBatches();
    } catch (err) {
      setError(err.message || "Failed to delete batch");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      course: "",
      department: "",
      name: "",
      strength: "",
      semester: "",
      subject: "",
      faculty: "",
    });
    setEditingId(null);
    setError("");
  };

  // =============================
  // Styles (unchanged)
  // =============================
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
          style={{ borderColor: "#e8e8e8" }}
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
            {/* Header */}
            <div className="mb-3 relative">
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
                  right: 30,
                  top: 38,
                  minWidth: 170,
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

            {/* Title */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                Quick add batch
              </h2>
            </div>

            {/* Divider */}
            <div
              className="w-full h-[3px] bg-[#0b84d6] rounded"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {error && (
              <div className="mt-4 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {/* FORM */}
            <div className="mt-6">
              <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Degree
                  </div>
                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="e.g. BCA"
                    disabled={loading}
                    style={inputStyle}
                    className="custom-input"
                  />
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Department
                  </div>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    disabled={loading}
                    style={inputStyle}
                    className="custom-input"
                  />
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Section
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. A"
                    disabled={loading}
                    style={inputStyle}
                    className="custom-input"
                  />
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Strength
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: "5px" }}>
                    <input
                      name="strength"
                      value={form.strength}
                      onChange={handleChange}
                      placeholder="e.g. 60"
                      disabled={loading}
                      style={inputStyle}
                      className="custom-input"
                    />

                    <button
                      onClick={handleAddBatch}
                      disabled={loading}
                      style={{
                        fontSize: "12px",
                        color: "rgb(77, 172, 206)",
                        background: "transparent",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "'Mulish', sans-serif",
                        position: "relative",
                        top: "50px",
                        whiteSpace: "nowrap",
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      {loading ? "Processing..." : editingId ? "+ Update batch" : "+ Add batch"}
                    </button>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Semester
                  </div>
                  <input
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    disabled={loading}
                    style={inputStyle}
                    className="custom-input"
                  />
                </div>

                {/* ✅ dropdown subject */}
                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Assigned subjects
                  </div>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                    className="custom-input"
                  >
                    <option value="">Default</option>
                    {subjectsList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} {s.code ? `(${s.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ dropdown faculty */}
                <div className="col-span-3">
                  <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
                    Assigned faculty
                  </div>
                  <select
                    name="faculty"
                    value={form.faculty}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                    className="custom-input"
                  >
                    <option value="">Default</option>
                    {facultiesList.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name} {f.email ? `(${f.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {/* TABLE */}
            {loading && batches.length === 0 ? (
              <div className="mt-6 border rounded-lg flex justify-center items-center" style={{ height: "320px", borderColor: "#DFDFDF" }}>
                <div className="text-gray-500">Loading batches...</div>
              </div>
            ) : batches.length === 0 ? (
              <div className="mt-6 border rounded-lg flex justify-center items-center" style={{ height: "320px", borderColor: "#DFDFDF" }}>
                <img src={nodata} alt="No Data" />
              </div>
            ) : (
              <div className="mt-6 pb-4">
                <div
                  className="bg-white w-full relative"
                  style={{
                    width: "100%",
                    height: "calc(100vh - 420px)",
                    borderRadius: "12.23px",
                    border: "1.83px solid #DFDFDF",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div className="px-8 pt-4 pb-2 bg-white mr-3">
                    <div className="flex items-center text-[14px] font-medium" style={{ color: "#265768", fontFamily: "'Mulish', sans-serif" }}>
                      <div className="flex-1 text-center">Degree / Course</div>
                      <div className="flex-1 text-center">Department</div>
                      <div className="flex-1 text-center">Capacity</div>
                      <div className="flex-1 text-center">Semester</div>
                      <div className="flex-1 text-center">Section</div>
                      <div className="flex-1 text-center">Assigned Subjects</div>
                      <div className="flex-1 text-center">Assigned Faculty</div>
                      <div className="flex-1 text-center">Actions</div>
                    </div>

                    <div className="mt-3 h-[3px] rounded" style={{ background: "#0b84d6", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }} />
                  </div>

                  <div ref={scrollRef} className="overflow-y-auto custom-scroll mr-3" style={{ maxHeight: "calc(100vh - 500px)" }}>
                    <div className="px-8">
                      {batches.map((item, idx) => (
                        <div
                          key={item._id || idx}
                          className="flex items-center py-3.5 hover:bg-gray-50 transition"
                          style={{ borderBottom: "3px solid #D9D9D9" }}
                        >
                          <div className="flex-1 text-[13px] font-medium text-[#265768] text-center">{item.course || "-"}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.department || "-"}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.strength || "-"}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.semester || "-"}</div>
                          <div className="flex-1 text-[13px] text-[#265768] text-center">{item.name || "-"}</div>

                          {/* ✅ Subjects: pass ONLY subject list */}
                          {/* <div
                            onClick={() =>
                              openListPopup(
                                "Assigned Subjects",
                                Array.isArray(item.subjects)
                                  ? item.subjects.map((p) => p.subject)
                                  : []
                              )
                            }
                            className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center"
                          >
                            {Array.isArray(item.subjects)
                              ? `See List (${item.subjects.length})`
                              : "See List (0)"}
                          </div> */}

                          {/* ✅ Faculty: pass ONLY faculty list */}
                          {/* <div
                            onClick={() =>
                              openListPopup(
                                "Assigned Faculty",
                                Array.isArray(item.subjects)
                                  ? item.subjects.map((p) => p.faculty)
                                  : []
                              )
                            }
                            className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center"
                          >
                            {Array.isArray(item.subjects)
                              ? `See List (${item.subjects.length})`
                              : "See List (0)"}
                          </div> */}

                          {/* Assigned Subjects */}
                          {/* Assigned Subjects */}
<div
  onClick={() =>
    openListPopup(
      "Assigned Subjects",
      Array.isArray(item.subjects) ? item.subjects.map((p) => p.subject) : []
    )
  }
  className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center"
>
  {Array.isArray(item.subjects)
    ? `See List (${item.subjects.length})`
    : "See List (0)"}
</div>

{/* Assigned Faculty */}
<div
  onClick={() =>
    openListPopup(
      "Assigned Faculty",
      Array.isArray(item.subjects) ? item.subjects.map((p) => p.faculty) : []
    )
  }
  className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center"
>
  {Array.isArray(item.subjects)
    ? `See List (${item.subjects.length})`
    : "See List (0)"}
</div>




                          <div className="flex-1 flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              disabled={loading}
                              className="text-[#C0C6D0] hover:text-[#1A8FE3] transition disabled:opacity-40"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteBatch(item._id)}
                              disabled={loading}
                              className="text-[#C0C6D0] hover:text-[#F04438] transition disabled:opacity-40"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scrollbar + focus css */}
                  <style>{`
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
                    .custom-input:focus {
                      border: 1.5px solid #0b84d6 !important;
                      box-shadow: 0 0 0 3px rgba(11,132,214,0.2);
                      outline: none;
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Popup */}
          {showPopup && (
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.35)" }}
              onClick={() => setShowPopup(false)}
            >
              <div
                className="bg-white rounded-[10px] shadow-lg border"
                style={{
                  width: "420px",
                  maxHeight: "420px",
                  overflow: "hidden",
                  borderColor: "#e8e8e8",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b">
                  <div className="text-[16px] font-semibold text-[#265768]">
                    {popupTitle}
                  </div>
                  <button onClick={() => setShowPopup(false)}>
                    <X size={18} color="#265768" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto" style={{ maxHeight: "340px" }}>
                  {popupItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                      No data
                    </div>
                  ) : (
                    <ul className="space-y-2">
  {popupItems.map((x, i) => (
    <li
      key={x?._id || i}
      className="text-[13px] text-[#265768] border rounded px-3 py-2"
      style={{ borderColor: "#DFDFDF" }}
    >
      {popupTitle === "Assigned Subjects"
        ? `${x?.name || "-"}${x?.code ? ` (${x.code})` : ""}`
        : `${x?.name || "-"}${x?.email ? ` (${x.email})` : ""}`}
    </li>
  ))}
</ul>
                    // <ul className="space-y-2">
                    //   {popupItems.map((it, i) => (
                    //     <li
                    //       key={it?._id || i}
                    //       className="text-[13px] text-[#265768] border rounded px-3 py-2"
                    //       style={{ borderColor: "#DFDFDF" }}
                    //     >
                    //       {popupTitle === "Assigned Subjects"
                    //         ? resolveSubjectText(it)
                    //         : resolveFacultyText(it)}
                    //     </li>
                    //   ))}
                    // </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






















// import React, { useRef, useState, useEffect } from "react";
// import { Edit2, Trash2, X } from "lucide-react";
// import nodata from "../../assets/images/nodata.jpeg";
// import {
//   getBatches,
//   addBatch as addBatchAPI,
//   updateBatch,
//   deleteBatch,
//   getSubjects,
//   getFaculties,
// } from "../../api/api";
// import { useNavigate } from "react-router-dom";

// export default function ManualEntryBatch() {
//   const scrollRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [batches, setBatches] = useState([]);
//   const [subjectsList, setSubjectsList] = useState([]);
//   const [facultiesList, setFacultiesList] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   // ✅ Popup
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupTitle, setPopupTitle] = useState("");
//   const [popupItems, setPopupItems] = useState([]);

//   const [form, setForm] = useState({
//     degree: "",
//     department: "",
//     capacity: "",
//     semester: "",
//     section: "",
//     subjects: [], // ✅ always array of subjectIds
//     faculty: "", // ✅ facultyId
//   });

//   const navigate = useNavigate();

//   // =============================
//   // Load data
//   // =============================
//   useEffect(() => {
//     loadBatches();
//     loadSubjects();
//     loadFaculties();
//   }, []);

//   const normalizeArrayResponse = (res) => {
//     if (!res) return [];
//     if (Array.isArray(res)) return res;
//     if (res?.success && Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.subjects)) return res.subjects;
//     if (Array.isArray(res?.faculties)) return res.faculties;
//     if (Array.isArray(res?.batches)) return res.batches;
//     return [];
//   };

//   const loadBatches = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await getBatches();
//       setBatches(normalizeArrayResponse(res));
//     } catch (err) {
//       setError(err.message || "Failed to load batches");
//       setBatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadSubjects = async () => {
//     try {
//       const res = await getSubjects();
//       setSubjectsList(normalizeArrayResponse(res));
//     } catch (err) {
//       console.log("Subjects fetch failed:", err?.message);
//       setSubjectsList([]);
//     }
//   };

//   const loadFaculties = async () => {
//     try {
//       const res = await getFaculties();
//       setFacultiesList(normalizeArrayResponse(res));
//     } catch (err) {
//       console.log("Faculties fetch failed:", err?.message);
//       setFacultiesList([]);
//     }
//   };

//   // =============================
//   // Helpers
//   // =============================
//   const resolveSubjectName = (sub) => {
//     // sub can be object, id string, or {subjectId}
//     const id =
//       typeof sub === "string"
//         ? sub
//         : sub?._id || sub?.subjectId || sub?.id || "";

//     // if object already has name
//     if (typeof sub === "object" && sub?.name) {
//       return `${sub.name}${sub.code ? ` (${sub.code})` : ""}`;
//     }

//     const found = subjectsList.find((s) => s?._id === id);
//     if (found) return `${found.name}${found.code ? ` (${found.code})` : ""}`;

//     return id || "Subject";
//   };

//   const resolveFacultyName = (fac) => {
//     // fac can be object, id string, or {facultyId}
//     const id =
//       typeof fac === "string" ? fac : fac?._id || fac?.facultyId || fac?.id || "";

//     if (typeof fac === "object" && fac?.name) {
//       return `${fac.name}${fac.email ? ` (${fac.email})` : ""}`;
//     }

//     const found = facultiesList.find((f) => f?._id === id);
//     if (found) return `${found.name}${found.email ? ` (${found.email})` : ""}`;

//     return id || "Faculty";
//   };

//   const openListPopup = (title, items) => {
//     setPopupTitle(title);
//     setPopupItems(Array.isArray(items) ? items : []);
//     setShowPopup(true);
//   };

//   // =============================
//   // Form Handlers
//   // =============================
//   const triggerFile = () => fileInputRef.current?.click();

//   const handleFileChange = (e) => {
//     const f = e.target.files && e.target.files[0];
//     if (!f) return;
//     console.log("File selected:", f.name);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // ✅ assigned subjects dropdown
//     if (name === "subjects") {
//       setForm((prev) => ({
//         ...prev,
//         subjects: value ? [value] : [],
//       }));
//       return;
//     }

//     // ✅ assigned faculty dropdown
//     if (name === "faculty") {
//       setForm((prev) => ({
//         ...prev,
//         faculty: value || "",
//       }));
//       return;
//     }

//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // =============================
//   // Save
//   // =============================
//   const handleAddBatch = async () => {
//     if (!form.degree || !form.department || !form.capacity) {
//       setError("Please fill required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       // ✅ Convert subjectIds -> embedded objects (fix cast error)
//       const embeddedSubjects = (form.subjects || [])
//         .map((sid) => {
//           const s = subjectsList.find((x) => x._id === sid);
//           if (!s) return null;
//           return {
//             subjectId: s._id,
//             name: s.name,
//             code: s.code,
//             department: s.department,
//             semester: s.semester,
//           };
//         })
//         .filter(Boolean);

//       // ✅ Convert facultyId -> embedded object (safe for backend)
//       const selectedFaculty = facultiesList.find((f) => f._id === form.faculty);
//       const embeddedFaculty = selectedFaculty
//         ? {
//             facultyId: selectedFaculty._id,
//             name: selectedFaculty.name,
//             email: selectedFaculty.email,
//           }
//         : undefined;

//       // ✅ auto fields backend requires
//       const batchCode = `${form.degree}-${form.department}-${form.section || "A"}-${form.semester || "1"}`;
//       const batchName = `${form.degree} ${form.department} ${form.section || "A"}`;

//       const batchData = {
//         degree: form.degree,
//         department: form.department,

//         batchCode, // ✅ required by backend
//         batchName, // ✅ required by backend

//         capacity: form.capacity ? parseInt(form.capacity) : undefined,
//         semester: form.semester || undefined,
//         section: form.section || undefined,

//         // ✅ important
//         subjects: embeddedSubjects,
//         faculty: embeddedFaculty,
//       };

//       let response;
//       if (editingId) response = await updateBatch(editingId, batchData);
//       else response = await addBatchAPI(batchData);

//       if (response?.success || response?._id) {
//         await loadBatches();
//         resetForm();
//       } else {
//         throw new Error(response?.message || "Save failed");
//       }
//     } catch (err) {
//       setError(err.message || "Failed to save batch");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (batch) => {
//     // subjects can be objects -> convert to ids
//     const subjectIds = Array.isArray(batch.subjects)
//       ? batch.subjects.map((s) => s?._id || s?.subjectId || s).filter(Boolean)
//       : [];

//     setForm({
//       degree: batch.degree || "",
//       department: batch.department || "",
//       capacity: batch.capacity?.toString() || "",
//       semester: batch.semester || "",
//       section: batch.section || "",
//       subjects: subjectIds,
//       faculty: batch.faculty?._id || batch.faculty?.facultyId || batch.faculty || "",
//     });

//     setEditingId(batch._id);
//   };

//   const handleDeleteBatch = async (batchId) => {
//     if (!window.confirm("Are you sure you want to delete this batch?")) return;

//     try {
//       setLoading(true);
//       setError("");
//       const response = await deleteBatch(batchId);
//       if (response.success) {
//         await loadBatches();
//       }
//     } catch (err) {
//       setError(err.message || "Failed to delete batch");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       degree: "",
//       department: "",
//       capacity: "",
//       semester: "",
//       section: "",
//       subjects: [],
//       faculty: "",
//     });
//     setEditingId(null);
//     setError("");
//   };

//   // =============================
//   // Styles
//   // =============================
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
//     <div className="h-screen bg-[#F3F6FB] overflow-hidden">
//       <div className="w-full h-full">
//         <div
//           className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
//           style={{ borderColor: "#e8e8e8" }}
//         >
//           {/* CLOSE */}
//           <button
//             type="button"
//             onClick={() => navigate("/form")}
//             className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
//             aria-label="Close"
//           >
//             <X size={20} color="#265768" />
//           </button>

//           {/* HEADER + CONTENT */}
//           <div className="px-6 pt-6">
//             <div className="mb-3 relative">
//               <div
//                 className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
//                 style={{
//                   textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//                 }}
//               >
//                 Ezey
//               </div>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={handleFileChange}
//                 hidden
//               />

//               <button
//                 onClick={triggerFile}
//                 style={{
//                   position: "absolute",
//                   right: 30,
//                   top: 38,
//                   minWidth: 170,
//                   height: 34,
//                   background: "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
//                   borderRadius: 6,
//                   color: "white",
//                   fontSize: 12,
//                   fontFamily: "'Mulish', sans-serif",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
//                 }}
//               >
//                 Upload File ( CSV / XLSX )
//               </button>
//             </div>

//             {/* TITLE */}
//             <div className="flex items-center gap-2 mt-2 mb-3">
//               <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
//                 Quick add batch
//               </h2>
//             </div>

//             {/* Divider */}
//             <div
//               className="w-full h-[3px] bg-[#0b84d6] rounded"
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
//             />

//             {error && (
//               <div className="mt-4 text-center text-red-500 text-sm font-medium">
//                 {error}
//               </div>
//             )}

//             {/* FORM */}
//             <div className="mt-6">
//               <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
//                 <div className="col-span-3">
//                   <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
//                     Degree
//                   </div>
//                   <input
//                     name="degree"
//                     value={form.degree}
//                     onChange={handleChange}
//                     placeholder="e.g. B.Tech"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
//                     Department
//                   </div>
//                   <input
//                     name="department"
//                     value={form.department}
//                     onChange={handleChange}
//                     placeholder="e.g. CSE"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
//                     Section
//                   </div>
//                   <input
//                     name="section"
//                     value={form.section}
//                     onChange={handleChange}
//                     placeholder="e.g. A"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div>

//                 <div className="col-span-3">
//                   <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
//                     Strength
//                   </div>

//                   <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: "5px" }}>
//                     <input
//                       name="capacity"
//                       value={form.capacity}
//                       onChange={handleChange}
//                       placeholder="e.g. 56"
//                       disabled={loading}
//                       style={inputStyle}
//                       className="custom-input"
//                     />

//                     <button
//                       onClick={handleAddBatch}
//                       disabled={loading}
//                       style={{
//                         fontSize: "12px",
//                         color: "rgb(77, 172, 206)",
//                         background: "transparent",
//                         border: "none",
//                         cursor: loading ? "not-allowed" : "pointer",
//                         fontFamily: "'Mulish', sans-serif",
//                         position: "relative",
//                         top: "50px",
//                         whiteSpace: "nowrap",
//                         opacity: loading ? 0.6 : 1,
//                       }}
//                     >
//                       {loading ? "Processing..." : editingId ? "+ Update batch" : "+ Add batch"}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="col-span-3">
//                   <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
//                     Semester
//                   </div>
//                   <input
//                     name="semester"
//                     value={form.semester}
//                     onChange={handleChange}
//                     placeholder="e.g. 1"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div>

//                 {/* ✅ dropdown subjects */}
//                 <div className="col-span-3">
//                   <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
//                     Assigned subjects
//                   </div>
//                   <select
//                     name="subjects"
//                     value={form.subjects?.[0] || ""}
//                     onChange={handleChange}
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   >
//                     <option value="">Default</option>
//                     {subjectsList.map((s) => (
//                       <option key={s._id} value={s._id}>
//                         {s.name} {s.code ? `(${s.code})` : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* ✅ dropdown faculty */}
//                 <div className="col-span-3">
//                   <div className="text-xs mb-1" style={{ color: "#265768", fontSize: "14px" }}>
//                     Assigned faculty
//                   </div>
//                   <select
//                     name="faculty"
//                     value={form.faculty || ""}
//                     onChange={handleChange}
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   >
//                     <option value="">Default</option>
//                     {facultiesList.map((f) => (
//                       <option key={f._id} value={f._id}>
//                         {f.name} {f.email ? `(${f.email})` : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {editingId && (
//               <div className="mt-2">
//                 <button
//                   onClick={resetForm}
//                   className="text-xs text-[#F04438] hover:underline"
//                   style={{ fontFamily: "'Mulish', sans-serif" }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}

//             <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

//             {/* TABLE */}
//             {loading && batches.length === 0 ? (
//               <div
//                 className="mt-6 border rounded-lg flex justify-center items-center"
//                 style={{ height: "320px", borderColor: "#DFDFDF" }}
//               >
//                 <div className="text-gray-500" style={{ fontFamily: "'Mulish', sans-serif" }}>
//                   Loading batches...
//                 </div>
//               </div>
//             ) : batches.length === 0 ? (
//               <div
//                 className="mt-6 border rounded-lg flex justify-center items-center"
//                 style={{ height: "320px", borderColor: "#DFDFDF" }}
//               >
//                 <img src={nodata} alt="No Data" />
//               </div>
//             ) : (
//               <div className="mt-6 pb-4">
//                 <div
//                   className="bg-white w-full relative"
//                   style={{
//                     width: "100%",
//                     height: "calc(100vh - 420px)",
//                     borderRadius: "12.23px",
//                     border: "1.83px solid #DFDFDF",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Header */}
//                   <div className="px-8 pt-4 pb-2 bg-white mr-3">
//                     <div
//                       className="flex items-center text-[14px] font-medium"
//                       style={{ color: "#265768", fontFamily: "'Mulish', sans-serif" }}
//                     >
//                       <div className="flex-1 text-center">Degree / Course</div>
//                       <div className="flex-1 text-center">Department</div>
//                       <div className="flex-1 text-center">Capacity</div>
//                       <div className="flex-1 text-center">Semester</div>
//                       <div className="flex-1 text-center">Section</div>
//                       <div className="flex-1 text-center">Assigned Subjects</div>
//                       <div className="flex-1 text-center">Assigned Faculty</div>
//                       <div className="flex-1 text-center">Actions</div>
//                     </div>

//                     <div
//                       className="mt-3 h-[3px] rounded"
//                       style={{
//                         background: "#0b84d6",
//                         boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
//                       }}
//                     />
//                   </div>

//                   {/* Rows */}
//                   <div
//                     ref={scrollRef}
//                     className="overflow-y-auto custom-scroll mr-3"
//                     style={{ maxHeight: "calc(100vh - 500px)" }}
//                   >
//                     <div className="px-8">
//                       {batches.map((item, idx) => (
//                         <div
//                           key={item._id || idx}
//                           className="flex items-center py-3.5 hover:bg-gray-50 transition"
//                           style={{ borderBottom: "3px solid #D9D9D9" }}
//                         >
//                           <div className="flex-1 text-[13px] font-medium text-[#265768] text-center">
//                             {item.degree || "-"}
//                           </div>

//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.department || "-"}
//                           </div>

//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.capacity || "-"}
//                           </div>

//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.semester || "-"}
//                           </div>

//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.section || "-"}
//                           </div>

//                           {/* Subjects */}
//                           <div
//                             className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center"
//                             onClick={() => openListPopup("Assigned Subjects", item.subjects || [])}
//                           >
//                             {Array.isArray(item.subjects)
//                               ? `See List (${item.subjects.length})`
//                               : "See List (0)"}
//                           </div>

//                           {/* Faculty */}
//                           <div
//                             className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center"
//                             onClick={() =>
//                               openListPopup(
//                                 "Assigned Faculty",
//                                 item.faculty ? [item.faculty] : []
//                               )
//                             }
//                           >
//                             {item.faculty ? "See List (1)" : "See List (0)"}
//                           </div>

//                           {/* Actions */}
//                           <div className="flex-1 flex items-center justify-center gap-3">
//                             <button
//                               onClick={() => handleEdit(item)}
//                               disabled={loading}
//                               className="text-[#C0C6D0] hover:text-[#1A8FE3] transition disabled:opacity-40"
//                             >
//                               <Edit2 size={15} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteBatch(item._id)}
//                               disabled={loading}
//                               className="text-[#C0C6D0] hover:text-[#F04438] transition disabled:opacity-40"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Scrollbar + Focus CSS */}
//                   <style>{`
//                     .custom-scroll::-webkit-scrollbar { width: 8.78px; }
//                     .custom-scroll::-webkit-scrollbar-track {
//                       background: transparent;
//                       border-radius: 44.02px;
//                       border: 1.22px solid #E5E5E5;
//                     }
//                     .custom-scroll::-webkit-scrollbar-thumb {
//                       background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
//                       border-radius: 4.89px;
//                       width: 13.23px;
//                       min-height: 70px;
//                     }
//                     .custom-scroll::-webkit-scrollbar-thumb:hover {
//                       background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
//                     }

//                     .custom-input:focus {
//                       border: 1.5px solid #0b84d6 !important;
//                       box-shadow: 0 0 0 3px rgba(11,132,214,0.2);
//                       outline: none;
//                     }
//                   `}</style>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ✅ POPUP */}
//           {showPopup && (
//             <div
//               className="fixed inset-0 z-[999] flex items-center justify-center"
//               style={{ background: "rgba(0,0,0,0.35)" }}
//               onClick={() => setShowPopup(false)}
//             >
//               <div
//                 className="bg-white rounded-[10px] shadow-lg border"
//                 style={{
//                   width: "420px",
//                   maxHeight: "420px",
//                   overflow: "hidden",
//                   borderColor: "#e8e8e8",
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between px-5 py-3 border-b">
//                   <div className="text-[16px] font-semibold text-[#265768]">
//                     {popupTitle}
//                   </div>
//                   <button onClick={() => setShowPopup(false)}>
//                     <X size={18} color="#265768" />
//                   </button>
//                 </div>

//                 <div className="p-4 overflow-y-auto" style={{ maxHeight: "340px" }}>
//                   {popupItems.length === 0 ? (
//                     <div className="text-center text-gray-400 py-10">
//                       No data
//                     </div>
//                   ) : (
//                     <ul className="space-y-2">
//                       {popupItems.map((it, i) => (
//                         <li
//                           key={it?._id || it?.subjectId || it?.facultyId || i}
//                           className="text-[13px] text-[#265768] border rounded px-3 py-2"
//                           style={{ borderColor: "#DFDFDF" }}
//                         >
//                           {popupTitle === "Assigned Subjects"
//                             ? resolveSubjectName(it)
//                             : resolveFacultyName(it)}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }














// import React, { useRef, useState, useEffect } from "react";
// import { Edit2, Trash2, X } from "lucide-react";
// import nodata from "../../assets/images/nodata.jpeg";
// import {
//   getBatches,
//   addBatch as addBatchAPI,
//   updateBatch,
//   deleteBatch,
// } from "../../api/api";
// import { useNavigate } from "react-router-dom";

// export default function ManualEntryBatch() {
//   // =============================
//   // State Management
//   // =============================
//   const scrollRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     degree: "",
//     batchCode: "",
//     department: "",
//     capacity: "",
//     semester: "",
//     section: "",
//     subjects: "",
//   });

//   const navigate = useNavigate();

//   // =============================
//   // Load Batches on Mount
//   // =============================
//   useEffect(() => {
//     loadBatches();
//   }, []);

//   const loadBatches = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await getBatches();

//       if (response?.success && response?.data) {
//         setBatches(Array.isArray(response.data) ? response.data : []);
//       } else if (Array.isArray(response)) {
//         setBatches(response);
//       } else if (response?.batches) {
//         setBatches(response.batches);
//       } else {
//         setBatches([]);
//       }
//     } catch (err) {
//       console.error("❌ Error loading batches:", err);
//       setError(err.message || "Failed to load batches");
//       setBatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =============================
//   // Form Handlers
//   // =============================
//   const triggerFile = () => fileInputRef.current?.click();

//   const handleFileChange = (e) => {
//     const f = e.target.files && e.target.files[0];
//     if (!f) return;
//     console.log("File selected:", f.name);
//     // TODO: Implement CSV/XLSX upload logic
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddBatch = async () => {
//     if (!form.degree || !form.batchCode) {
//       setError("Please fill in at least Degree and Batch Code");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const batchData = {
//         degree: form.degree,
//         batchCode: form.batchCode,
//         department: form.department || undefined,
//         capacity: form.capacity ? parseInt(form.capacity) : undefined,
//         semester: form.semester || undefined,
//         section: form.section || undefined,
//         subjects: form.subjects
//           ? form.subjects.split(",").map((s) => s.trim())
//           : [],
//       };

//       if (editingId) {
//         const response = await updateBatch(editingId, batchData);
//         if (response?.success || response?._id) {
//           await loadBatches();
//           resetForm();
//         } else {
//           throw new Error("Update failed");
//         }
//       } else {
//         const response = await addBatchAPI(batchData);
//         if (response?.success || response?._id) {
//           await loadBatches();
//           resetForm();
//         } else {
//           throw new Error("Add failed");
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error saving batch:", err);
//       setError(err.message || "Failed to save batch");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (batch) => {
//     setForm({
//       degree: batch.degree,
//       batchCode: batch.batchCode,
//       department: batch.department || "",
//       capacity: batch.capacity?.toString() || "",
//       semester: batch.semester || "",
//       section: batch.section || "",
//       subjects: Array.isArray(batch.subjects)
//         ? batch.subjects.join(", ")
//         : batch.subjects || "",
//     });
//     setEditingId(batch._id);
//   };

//   const handleDeleteBatch = async (batchId) => {
//     if (!window.confirm("Are you sure you want to delete this batch?")) return;

//     try {
//       setLoading(true);
//       setError("");
//       const response = await deleteBatch(batchId);
//       if (response.success) {
//         await loadBatches();
//       }
//     } catch (err) {
//       console.error("Error deleting batch:", err);
//       setError(err.message || "Failed to delete batch");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       degree: "",
//       batchCode: "",
//       department: "",
//       capacity: "",
//       semester: "",
//       section: "",
//       subjects: "",
//     });
//     setEditingId(null);
//     setError("");
//   };

//   // =============================
//   // Styles
//   // =============================
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
//     <div className="h-screen bg-[#F3F6FB] overflow-hidden">
//       <div className="w-full h-full">
//         <div
//           className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
//           style={{
//             borderColor: "#e8e8e8",
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

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={handleFileChange}
//                 hidden
//               />

//               {/* ✅ Upload button (thoda niche) */}
//               <button
//                 onClick={triggerFile}
//                 style={{
//                   position: "absolute",
//                   right: 30,
//                   top: 38, // ✅ FIXED (niche)
//                   minWidth: 170,
//                   height: 34,
//                   background: "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
//                   borderRadius: 6,
//                   color: "white",
//                   fontSize: 12,
//                   fontFamily: "'Mulish', sans-serif",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
//                 }}
//               >
//                 Upload File ( CSV / XLSX )
//               </button>
//             </div>

//             {/* Title */}
//             <div className="flex items-center gap-2 mt-2 mb-3">
//               <svg
//                 width="25"
//                 height="25"
//                 viewBox="0 0 25 25"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M11.3393 0.894531H22.5928C23.4303 0.894531 24.1089 1.5731 24.1089 2.4106V14.5142C24.1089 15.3535 23.4303 16.032 22.5928 16.032H13.3929M5.62321 7.14632C6.45225 7.14632 7.24733 6.81698 7.83355 6.23076C8.41977 5.64455 8.7491 4.84946 8.7491 4.02042C8.7491 3.19139 8.41977 2.3963 7.83355 1.81008C7.24733 1.22387 6.45225 0.894531 5.62321 0.894531C4.79417 0.894531 3.99909 1.22387 3.41287 1.81008C2.82665 2.3963 2.49731 3.19139 2.49731 4.02042C2.49731 4.84946 2.82665 5.64455 3.41287 6.23076C3.99909 6.81698 4.79417 7.14632 5.62321 7.14632Z"
//                   stroke="#265768"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M16.0714 9.86908C16.0714 8.85658 15.25 8.03516 14.2375 8.03516H5.62318C4.36876 8.03563 3.16585 8.53416 2.27883 9.42117C1.39182 10.3082 0.893296 11.5111 0.892822 12.7655V16.9637H2.91961L3.59639 24.1066H7.64996L9.20711 11.7048H14.2375C15.25 11.7048 16.0714 10.8834 16.0714 9.86908Z"
//                   stroke="#265768"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>

//               <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
//                 Quick add batch
//               </h2>
//             </div>

//             {/* Blue divider */}
//             <div
//               className="w-full h-[3px] bg-[#0b84d6] rounded"
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
//             />

//             {/* Error */}
//             {error && (
//               <div className="mt-4 text-center text-red-500 text-sm font-medium">
//                 {error}
//               </div>
//             )}

//             {/* FORM */}
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
//                     Degree
//                   </div>
//                   <input
//                     name="degree"
//                     value={form.degree}
//                     onChange={handleChange}
//                     placeholder="e.g. B.Tech"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div>

//                 {/* <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Batch code
//                   </div>
//                   <input
//                     name="batchCode"
//                     value={form.batchCode}
//                     onChange={handleChange}
//                     placeholder="e.g. CSE01"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div> */}

//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Department
//                   </div>
//                   <input
//                     name="department"
//                     value={form.department}
//                     onChange={handleChange}
//                     placeholder="e.g. CSE"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
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
//                     Strength
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
//                       name="capacity"
//                       value={form.capacity}
//                       onChange={handleChange}
//                       placeholder="e.g. 56"
//                       disabled={loading}
//                       style={inputStyle}
//                       className="custom-input"
//                     />

//                     <button
//                       onClick={handleAddBatch}
//                       disabled={loading}
//                       style={{
//                         fontSize: "12px",
//                         color: "rgb(77, 172, 206)",
//                         background: "transparent",
//                         border: "none",
//                         cursor: loading ? "not-allowed" : "pointer",
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
//                         ? "+ Update batch"
//                         : "+ Add batch"}
//                     </button>
//                   </div>
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
//                     Semester
//                   </div>
//                   <input
//                     name="semester"
//                     value={form.semester}
//                     onChange={handleChange}
//                     placeholder="e.g. I"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
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
//                     Section
//                   </div>
//                   <input
//                     name="section"
//                     value={form.section}
//                     onChange={handleChange}
//                     placeholder="e.g. A"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div>

//                 {/* ✅ Assigned subjects - FIXED small size */}
//                 <div className="col-span-3">
//                   <div
//                     className="text-xs mb-1"
//                     style={{
//                       color: "#265768",
//                       fontFamily: "'Mulish', sans-serif",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Assigned subjects
//                   </div>
//                   <input
//                     name="subjects"
//                     value={form.subjects}
//                     onChange={handleChange}
//                     placeholder="e.g. Computer Networks, DAA (comma separated)"
//                     disabled={loading}
//                     style={inputStyle}
//                     className="custom-input"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Cancel */}
//             {editingId && (
//               <div className="mt-2">
//                 <button
//                   onClick={resetForm}
//                   className="text-xs text-[#F04438] hover:underline"
//                   style={{ fontFamily: "'Mulish', sans-serif" }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}

//             <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

//             {/* TABLE / NO DATA */}
//             {loading && batches.length === 0 ? (
//               <div
//                 className="mt-6 border rounded-lg flex justify-center items-center"
//                 style={{ height: "320px", borderColor: "#DFDFDF" }}
//               >
//                 <div
//                   className="text-gray-500"
//                   style={{ fontFamily: "'Mulish', sans-serif" }}
//                 >
//                   Loading batches...
//                 </div>
//               </div>
//             ) : batches.length === 0 ? (
//               <div
//                 className="mt-6 border rounded-lg flex justify-center items-center"
//                 style={{ height: "320px", borderColor: "#DFDFDF" }}
//               >
//                 <img src={nodata} alt="No Data" />
//               </div>
//             ) : (
//               <div className="mt-6 pb-4">
//                 <div
//                   className="bg-white w-full relative"
//                   style={{
//                     width: "100%",
//                     height: "calc(100vh - 420px)",
//                     borderRadius: "12.23px",
//                     border: "1.83px solid #DFDFDF",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Header */}
//                   <div className="px-8 pt-4 pb-2 bg-white mr-3">
//                     <div
//                       className="flex items-center text-[14px] font-medium"
//                       style={{
//                         color: "#265768",
//                         fontFamily: "'Mulish', sans-serif",
//                       }}
//                     >
//                       <div className="flex-1 text-center">Degree / Course</div>
//                       <div className="flex-1 text-center">Batch code</div>
//                       <div className="flex-1 text-center">Department</div>
//                       <div className="flex-1 text-center">Capacity</div>
//                       <div className="flex-1 text-center">Semester</div>
//                       <div className="flex-1 text-center">Section</div>
//                       <div className="flex-1 text-center">
//                         Assigned Subjects
//                       </div>
//                       <div className="flex-1 text-center">Actions</div>
//                     </div>

//                     <div
//                       className="mt-3 h-[3px] rounded"
//                       style={{
//                         background: "#0b84d6",
//                         boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
//                       }}
//                     />
//                   </div>

//                   {/* Rows */}
//                   <div
//                     ref={scrollRef}
//                     className="overflow-y-auto custom-scroll mr-3"
//                     style={{
//                       maxHeight: "calc(100vh - 500px)",
//                     }}
//                   >
//                     <div className="px-8">
//                       {batches.map((item, idx) => (
//                         <div
//                           key={item._id || idx}
//                           className="flex items-center py-3.5 hover:bg-gray-50 transition"
//                           style={{ borderBottom: "3px solid #D9D9D9" }}
//                         >
//                           <div className="flex-1 text-[13px] font-medium text-[#265768] text-center">
//                             {item.degree || "-"}
//                           </div>
//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.batchCode || "-"}
//                           </div>
//                           <div className="flex-1 text-[13px] text-[#265768] truncate text-center">
//                             {item.department || "-"}
//                           </div>
//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.capacity || "-"}
//                           </div>
//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.semester || "-"}
//                           </div>
//                           <div className="flex-1 text-[13px] text-[#265768] text-center">
//                             {item.section || "-"}
//                           </div>
//                           <div className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center">
//                             {Array.isArray(item.subjects)
//                               ? `See List (${item.subjects.length})`
//                               : "See List"}
//                           </div>

//                           <div className="flex-1 flex items-center justify-center gap-3">
//                             <button
//                               onClick={() => handleEdit(item)}
//                               disabled={loading}
//                               className="text-[#C0C6D0] hover:text-[#1A8FE3] transition disabled:opacity-40"
//                             >
//                               <Edit2 size={15} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteBatch(item._id)}
//                               disabled={loading}
//                               className="text-[#C0C6D0] hover:text-[#F04438] transition disabled:opacity-40"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Scrollbar CSS */}
//                   <style>{`
//                     .custom-scroll::-webkit-scrollbar {
//                       width: 8.78px;
//                     }
//                     .custom-scroll::-webkit-scrollbar-track {
//                       background: transparent;
//                       border-radius: 44.02px;
//                       border: 1.22px solid #E5E5E5;
//                     }
//                     .custom-scroll::-webkit-scrollbar-thumb {
//                       background: linear-gradient(180deg, #575757 -93.33%, #75CBF6 100%);
//                       border-radius: 4.89px;
//                       width: 13.23px;
//                       min-height: 70px;
//                     }
//                     .custom-scroll::-webkit-scrollbar-thumb:hover {
//                       background: linear-gradient(180deg, #575757 -93.33%, #5BB8E8 100%);
//                     }

//                     .custom-input {
//   width: 274.5px;
//   height: 40px;
//   border-radius: 15px;
//   border: 1.5px solid #DFDFDF;
//   font-size: 14px;
//   font-family: 'Mulish', sans-serif;
//   color: #000000;
//   background: #FFFFFF;
//   padding: 0 12px;
//   box-sizing: border-box;
//   outline: none;
//   transition: 0.2s ease;
// }

// .custom-input:focus {
//   border: 1.5px solid #0b84d6;     /* focus border */
//   box-shadow: 0 0 0 3px rgba(11,132,214,0.2);  /* glow */
// }
//                   `}</style>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











