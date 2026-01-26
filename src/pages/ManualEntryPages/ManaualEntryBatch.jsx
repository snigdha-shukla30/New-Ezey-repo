

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

// ============================================
// MULTISELECT COMPONENT
// ============================================
function MultiSelect({
  label,
  placeholder,
  options,
  selectedItems,
  onToggle,
  onRemove,
  displayKey = "name",
  secondaryKey = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    const isSelected = selectedItems.some((item) => item._id === option._id);
    if (!isSelected) {
      onToggle(option);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) => {
    const isNotSelected = !selectedItems.some((item) => item._id === option._id);
    const matchesSearch =
      option[displayKey]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (secondaryKey && option[secondaryKey]?.toLowerCase().includes(searchTerm.toLowerCase()));
    return isNotSelected && matchesSearch;
  });

  const labelStyle = {
    color: "#265768",
    fontFamily: "'Mulish', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px",
  };

  const selectStyle = {
    width: "100%",
    height: "40px",
    borderRadius: "8px",
    border: "1.5px solid #DFDFDF",
    fontSize: "14px",
    fontFamily: "'Mulish', sans-serif",
    color: "#000000",
    padding: "0 12px",
    boxSizing: "border-box",
    cursor: "pointer",
    background: "white",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: "35px",
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <div style={labelStyle}>{label}</div>

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...selectStyle,
          display: "flex",
          alignItems: "center",
          color: selectedItems.length === 0 ? "#999" : "#000",
        }}
      >
        {selectedItems.length === 0 ? placeholder : `${selectedItems.length} selected`}
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "white",
            border: "1.5px solid #4BACCE",
            borderRadius: "8px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              padding: "8px",
              borderBottom: "1px solid #f0f0f0",
              position: "sticky",
              top: 0,
              background: "white",
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              autoFocus
              style={{
                width: "100%",
                padding: "6px 10px",
                border: "1px solid #DFDFDF",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "'Mulish', sans-serif",
                outline: "none",
              }}
            />
          </div>

          <div>
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#999",
                  fontSize: "13px",
                  fontFamily: "'Mulish', sans-serif",
                }}
              >
                No options available
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option._id}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f5f5f5",
                    fontFamily: "'Mulish', sans-serif",
                    fontSize: "14px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E8F4F8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <div style={{ fontWeight: "500", color: "#333" }}>
                    {option[displayKey]}
                  </div>
                  {secondaryKey && option[secondaryKey] && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      {option[secondaryKey]}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedItems.length > 0 && (
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          {selectedItems.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#E8F4F8",
                color: "#265768",
                padding: "5px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontFamily: "'Mulish', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid #D0E8F0",
              }}
            >
              <span>
                {item[displayKey]}
                {secondaryKey && item[secondaryKey] && ` (${item[secondaryKey]})`}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item._id);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#265768",
                  cursor: "pointer",
                  padding: "0",
                  fontSize: "18px",
                  lineHeight: "1",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ManualEntryBatch() {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const [batches, setBatches] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [facultiesList, setFacultiesList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  const [form, setForm] = useState({
    course: "",
    department: "",
    name: "",
    strength: "",
    semester: "",
    subjects: [],
    faculties: [],
  });

  const navigate = useNavigate();

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

  const openListPopup = (title, items) => {
    console.log("🔍 Opening popup:", title);
    console.log("📋 Items received:", items);
    console.log("📊 Items count:", items?.length);
    
    setPopupTitle(title);
    setPopupItems(Array.isArray(items) ? items : []);
    setShowPopup(true);
  };

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
      const batchesData = normalizeArrayResponse(res);
      
      console.log("📦 Raw API Response:", res);
      console.log("📊 Normalized Batches:", batchesData);
      
      if (batchesData.length > 0) {
        console.log("🔍 First Batch Structure:", batchesData[0]);
      }
      
      setBatches(batchesData);
    } catch (err) {
      setError(err.message || "Failed to load batches");
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

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

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const exists = prev.subjects.find((s) => s._id === subject._id);
      if (exists) {
        return {
          ...prev,
          subjects: prev.subjects.filter((s) => s._id !== subject._id),
        };
      } else {
        return { ...prev, subjects: [...prev.subjects, subject] };
      }
    });
  };

  const toggleFaculty = (faculty) => {
    setForm((prev) => {
      const exists = prev.faculties.find((f) => f._id === faculty._id);
      if (exists) {
        return {
          ...prev,
          faculties: prev.faculties.filter((f) => f._id !== faculty._id),
        };
      } else {
        return { ...prev, faculties: [...prev.faculties, faculty] };
      }
    });
  };

  const removeSubject = (subjectId) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s._id !== subjectId),
    }));
  };

  const removeFaculty = (facultyId) => {
    setForm((prev) => ({
      ...prev,
      faculties: prev.faculties.filter((f) => f._id !== facultyId),
    }));
  };

  const handleAddBatch = async () => {
    if (!form.course || !form.department || !form.name || !form.strength || !form.semester) {
      setError("Please fill all required fields");
      return;
    }

    if (form.subjects.length === 0 || form.faculties.length === 0) {
      setError("Please select at least one subject and one faculty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const code = `${form.department}_${Number(form.semester)}_${form.name}_2025`;

      const subjectsPayload = form.subjects.map((subject, index) => ({
        subject: subject._id,
        faculty: form.faculties[index % form.faculties.length]._id,
        isElective: subject.isElective || false,
      }));

      const payload = {
        name: form.name,
        course: form.course,
        code,
        semester: Number(form.semester),
        department: form.department,
        strength: Number(form.strength),
        subjects: subjectsPayload,
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
    // Get subjects from raw object
    const subjects = batch.raw?.subjects || batch.subjects || [];
    
    const subjectsFromBatch = Array.isArray(subjects)
      ? subjects.map((s) => (typeof s.subject === "object" ? s.subject : s)).filter(Boolean)
      : [];

    const facultiesFromBatch = Array.isArray(subjects)
      ? subjects.map((s) => (typeof s.faculty === "object" ? s.faculty : s)).filter(Boolean)
      : [];

    setForm({
      course: batch.course || batch.degree || "",
      department: batch.department || "",
      name: batch.section || batch.name || batch.raw?.name || "",
      strength: (batch.capacity || batch.strength || batch.raw?.strength)?.toString?.() || "",
      semester: batch.semester?.toString?.() || "",
      subjects: subjectsFromBatch,
      faculties: facultiesFromBatch,
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
      subjects: [],
      faculties: [],
    });
    setEditingId(null);
    setError("");
  };

  const inputStyle = {
    width: "100%",
    height: "40px",
    borderRadius: "8px",
    border: "1.5px solid #DFDFDF",
    fontSize: "14px",
    fontFamily: "'Mulish', sans-serif",
    color: "#000000",
    background: "#FFFFFF",
    padding: "0 12px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    color: "#265768",
    fontFamily: "'Mulish', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px",
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      <div className="w-full pb-8">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full"
          style={{ borderColor: "#e8e8e8", minHeight: "100vh" }}
        >
          {/* CLOSE BUTTON */}
<button
  type="button"
  onClick={() => navigate("/form")}
  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 z-50"
>
  <X size={20} color="#265768" />
</button>

{/* HEADER */}
<div className="mb-2 relative">
  {/* Ezey */}
  <div
    className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
    style={{ textShadow: "0px 6px 6px rgba(0,0,0,0.25)" }}
  >
    Ezey
  </div>

  {/* Upload */}
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
      right: 0,
      top: 48,
      minWidth: 180,
      height: 36,
      background: "linear-gradient(0deg,#265768 0%,#4BACCE 100%)",
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

          {/* <button
            type="button"
            onClick={() => navigate("/form")}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition z-50"
            aria-label="Close"
          >
            <X size={20} color="#265768" />
          </button>

          <div className="px-6 pt-6 pb-8">
            <div className="mb-6 flex items-center justify-between">
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
                  minWidth: 180,
                  height: 40,
                  background: "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
                  borderRadius: 8,
                  color: "white",
                  fontSize: 13,
                  fontWeight: "600",
                  fontFamily: "'Mulish', sans-serif",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Upload File ( CSV / XLSX )
              </button>
            </div> */}
<div className="px-6 pt-6 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                Quick add batch
              </h2>
            </div>

            <div
              className="w-full h-[3px] bg-[#0b84d6] mb-6 rounded"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {error && (
              <div className="mb-4 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <div style={labelStyle}>Degree</div>
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

              <div>
                <div style={labelStyle}>Department</div>
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

              <div>
                <div style={labelStyle}>Section</div>
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

              <div>
                <div style={labelStyle}>Strength</div>
                <input
                  name="strength"
                  value={form.strength}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  type="number"
                  disabled={loading}
                  style={inputStyle}
                  className="custom-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <div style={labelStyle}>Semester</div>
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

              <MultiSelect
                label="Assigned subjects"
                placeholder="Select subjects"
                options={subjectsList}
                selectedItems={form.subjects}
                onToggle={toggleSubject}
                onRemove={removeSubject}
                displayKey="name"
                secondaryKey="code"
              />

              <MultiSelect
                label="Assigned faculty"
                placeholder="Select faculty"
                options={facultiesList}
                selectedItems={form.faculties}
                onToggle={toggleFaculty}
                onRemove={removeFaculty}
                displayKey="name"
                secondaryKey="email"
              />
              <div className="flex justify-end mb-6">
              <button
                onClick={handleAddBatch}
                disabled={loading}
                style={{
                  padding: "10px 32px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#4BACCE",
                  background: "white",
                  border: "1.5px solid #4BACCE",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Mulish', sans-serif",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Processing..." : editingId ? "Update batch" : "+ Add batch"}
              </button>
            </div>
            </div>

            {/* <div className="flex justify-end mb-6">
              <button
                onClick={handleAddBatch}
                disabled={loading}
                style={{
                  padding: "10px 32px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#4BACCE",
                  background: "white",
                  border: "1.5px solid #4BACCE",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Mulish', sans-serif",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Processing..." : editingId ? "Update batch" : "+ Add batch"}
              </button>
            </div> */}

            <div className="w-full h-[2px] bg-[#D9D9D9] mb-6" />

            {loading && batches.length === 0 ? (
              <div
                className="mt-6 border rounded-lg flex justify-center items-center"
                style={{ height: "320px", borderColor: "#DFDFDF" }}
              >
                <div className="text-gray-500">Loading batches...</div>
              </div>
            ) : batches.length === 0 ? (
              <div
                className="mt-6 border rounded-lg flex justify-center items-center"
                style={{ height: "320px", borderColor: "#DFDFDF" }}
              >
                <img src={nodata} alt="No Data" />
              </div>
            ) : (
              <div
                style={{
                  border: "1.5px solid #DFDFDF",
                  borderRadius: "12px",
                  overflow: "auto",
                  background: "white",
                  maxHeight: "500px",
                }}
              >
                <div style={{ minWidth: "1200px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1.2fr 1.2fr 100px",
                      background: "#F8F9FA",
                      borderBottom: "2px solid #4BACCE",
                      fontFamily: "'Mulish', sans-serif",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#265768",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    <div style={{ padding: "14px 16px" }}>Degree / Course</div>
                    <div style={{ padding: "14px 16px" }}>Department</div>
                    <div style={{ padding: "14px 16px" }}>Capacity</div>
                    <div style={{ padding: "14px 16px" }}>Semester</div>
                    <div style={{ padding: "14px 16px" }}>Section</div>
                    <div style={{ padding: "14px 16px" }}>Assigned Subjects</div>
                    <div style={{ padding: "14px 16px" }}>Assigned Faculty</div>
                    <div style={{ padding: "14px 16px", textAlign: "center" }}>Actions</div>
                  </div>

                  <div>
                    {batches.map((batch, index) => {
                      const subjects = batch.raw?.subjects || batch.subjects || [];
                      
                      return (
                        <div
                          key={batch._id || `batch-${index}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1.2fr 1.2fr 100px",
                            borderBottom: index < batches.length - 1 ? "1px solid #E8E8E8" : "none",
                            fontFamily: "'Mulish', sans-serif",
                            fontSize: "13px",
                            color: "#333",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ padding: "14px 16px" }}>
                            {batch.course || batch.degree || "-"}
                          </div>
                          <div style={{ padding: "14px 16px" }}>
                            {batch.department || "-"}
                          </div>
                          <div style={{ padding: "14px 16px" }}>
                            {batch.capacity || batch.strength || batch.raw?.strength || "-"}
                          </div>
                          <div style={{ padding: "14px 16px" }}>
                            {batch.semester || "-"}
                          </div>
                          <div style={{ padding: "14px 16px" }}>
                            {batch.section || batch.name || batch.raw?.name || "-"}
                          </div>
                          <div style={{ padding: "14px 16px" }}>
                            {subjects.length > 0 ? (
                              <button
                                onClick={() =>
                                  openListPopup(
                                    "Assigned Subjects",
                                    subjects.map((p) => p.subject)
                                  )
                                }
                                style={{
                                  color: "#4BACCE",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  fontFamily: "'Mulish', sans-serif",
                                  textDecoration: "underline",
                                }}
                              >
                                See List ({subjects.length})
                              </button>
                            ) : (
                              "-"
                            )}
                          </div>
                          <div style={{ padding: "14px 16px" }}>
                            {subjects.length > 0 ? (
                              <button
                                onClick={() =>
                                  openListPopup(
                                    "Assigned Faculty",
                                    subjects.map((p) => p.faculty)
                                  )
                                }
                                style={{
                                  color: "#4BACCE",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  fontFamily: "'Mulish', sans-serif",
                                  textDecoration: "underline",
                                }}
                              >
                                See List ({subjects.length})
                              </button>
                            ) : (
                              "-"
                            )}
                          </div>
                          <div
                            style={{
                              padding: "14px 16px",
                              display: "flex",
                              justifyContent: "center",
                              gap: "12px",
                            }}
                          >
                            <button
                              onClick={() => handleEdit(batch)}
                              disabled={loading}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                              }}
                              title="Edit"
                            >
                              <Edit2 size={16} color="#4BACCE" />
                            </button>

                            <button
                              onClick={() => handleDeleteBatch(batch._id)}
                              disabled={loading}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                              }}
                              title="Delete"
                            >
                              <Trash2 size={16} color="#DC3545" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

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
                  <div className="text-[16px] font-semibold text-[#265768]">{popupTitle}</div>
                  <button onClick={() => setShowPopup(false)}>
                    <X size={18} color="#265768" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto" style={{ maxHeight: "340px" }}>
                  {popupItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No data</div>
                  ) : (
                    <ul className="space-y-2">
                      {popupItems.map((x, i) => (
                        <li
                          key={`${x?._id || 'item'}-${i}`}
                          className="text-[13px] text-[#265768] border rounded px-3 py-2"
                          style={{ borderColor: "#DFDFDF" }}
                        >
                          {popupTitle === "Assigned Subjects"
                            ? `${x?.name || "-"}${x?.code ? ` (${x.code})` : ""}`
                            : `${x?.name || "-"}${x?.email ? ` (${x.email})` : ""}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <style>{`
            .custom-input:focus {
              border: 1.5px solid #0b84d6 !important;
              box-shadow: 0 0 0 3px rgba(11, 132, 214, 0.2);
              outline: none;
            }

            input::placeholder,
            select::placeholder {
              color: #999999;
              opacity: 1;
            }

            select option {
              padding: 8px;
            }

            /* Custom Scrollbar for Table */
            div[style*="overflow: auto"]::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            div[style*="overflow: auto"]::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }

            div[style*="overflow: auto"]::-webkit-scrollbar-thumb {
              background: #4BACCE;
              border-radius: 4px;
            }

            div[style*="overflow: auto"]::-webkit-scrollbar-thumb:hover {
              background: #265768;
            }

            div[style*="overflow: auto"]::-webkit-scrollbar-corner {
              background: #f1f1f1;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
