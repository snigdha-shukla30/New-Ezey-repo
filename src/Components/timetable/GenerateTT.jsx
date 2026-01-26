

import React, { useEffect, useState } from "react";
import {
  getBatches,
  getTimetablePreviewAPI,
  getTimetableVisualHTML,
} from "../../api/api";
import { Button } from "../../Components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function GenerateTT() {
  const [activeTab, setActiveTab] = useState("generate");

  // ✅ dropdown input text
  const [searchText, setSearchText] = useState("");

  // ✅ selected batchId (this is what backend needs)
  const [selectedBatchId, setSelectedBatchId] = useState("");

  // ✅ dropdown control
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ batches list from API
  const [batchOptions, setBatchOptions] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // generate api loader
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ preview api states
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewData, setPreviewData] = useState(null);

  // =====================================================
  // ✅ Fetch batches from API (for dropdown)
  // =====================================================
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setBatchLoading(true);
        const res = await getBatches();

        if (res?.success) {
          setBatchOptions(res.data || []);
        } else {
          setBatchOptions([]);
        }
      } catch (err) {
        console.error("Failed to fetch batches:", err);
        setBatchOptions([]);
      } finally {
        setBatchLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const handleGenerate = async () => {
  if (!selectedBatchId) {
    alert("Please select batch from dropdown");
    return;
  }

  try {
    setLoading(true);

    const url = `http://localhost:5000/timetable/visual/${selectedBatchId}`;

    // ✅ new tab/window open
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to open timetable");
  } finally {
    setLoading(false);
  }
};


  // =====================================================
  // ✅ Preview Tab fetch old timetable list
  // =====================================================
  const handlePreviewTabClick = async () => {
    setActiveTab("preview");

    try {
      setPreviewLoading(true);
      setPreviewError("");

      const res = await getTimetablePreviewAPI();
      setPreviewData(res);
    } catch (err) {
      console.error(err);
      setPreviewError("Failed to fetch preview timetable");
    } finally {
      setPreviewLoading(false);
    }
  };

  // =====================================================
  // ✅ helper for display label
  // =====================================================
  // const formatBatchLabel = (b) => {
  //   const name = b?.name || "-";
  //   const code = b?.code || "-";
  //   const semester = b?.semester ?? "-";
  //   return `${name} - ${code} (Semester ${semester})`;
  // };

  const formatBatchLabel = (b) => {
  const degree = b?.degree || "-";
  const batchCode = b?.batchCode || "-";
  const semester = b?.semester ?? "-";
  return `${degree} - ${batchCode} (Semester ${semester})`;
};


  return (
    // ✅ CardContainer wrapper removed (to avoid double card)
    <div className="w-full h-full min-h-[calc(95vh-180px)] flex flex-col">
      {/* ===== Header ===== */}
      <section className="mb-6 flex items-start justify-between gap-8">
        <div>
          <h1
            className="text-[32px] leading-tight font-bold text-[#265768] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            View / Edit generated schedules
          </h1>

          <p
            className="text-sm text-[#265768] max-w-3xl"
            style={{ fontFamily: "Mulish, sans-serif" }}
          >
            Generate and preview timetables using batch ID
          </p>
        </div>
      </section>

      {/* ===== Tabs ===== */}
      <div className="flex gap-8 border-b border-[#E5E7EB] mb-6 relative">
        {/* Generate Tab */}
        <button
          onClick={() => setActiveTab("generate")}
          className={`relative px-4 pb-3 text-[14px] font-medium leading-[150%] text-center font-mulish
          ${activeTab === "generate" ? "text-[#265768]" : "text-[#9CA3AF]"}`}
        >
          Generate Timetable
          {activeTab === "generate" && (
            <span
              className="absolute left-1/2 -translate-x-1/2 -bottom-[2px]
              w-[149px] h-[4px] border-2 border-[#0891B2] bg-[#0077FF]
              rounded-[27px]"
            />
          )}
        </button>

        {/* Preview Tab */}
        <button
          onClick={handlePreviewTabClick}
          className={`relative px-4 pb-3 text-[14px] font-medium leading-[150%] text-center font-mulish
          ${activeTab === "preview" ? "text-[#265768]" : "text-[#9CA3AF]"}`}
        >
          Preview Timetable
          {activeTab === "preview" && (
            <span
              className="absolute left-1/2 -translate-x-1/2 -bottom-[2px]
              w-[149px] h-[4px] border-2 border-[#0891B2] bg-[#0077FF]
              rounded-[27px]"
            />
          )}
        </button>
      </div>

      {/* ============================= */}
      {/* ✅ Generate tab (UI SAME) */}
      {/* ============================= */}
      {activeTab === "generate" && (
        <>
          {/* Search + Generate */}
          <div className="mb-6 flex items-end gap-10">
            {/* Search */}
            <div className="flex-1 max-w-[900px]">
              {/* <label className="block text-xs font-medium text-[#374151] mb-2">
                Search Batch
              </label> */}

              <div className="relative bg-[#F7FAFD] border border-[#BFBFBF] rounded-[16px] px-4 py-2.5 mr-20">
                {/* Search Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA5B6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowDropdown(true);

                    // ✅ IMPORTANT: if user edits manually, clear selected id
                    setSelectedBatchId("");
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Search batch (course / code / semester)"
                  className="w-full bg-transparent pl-7 pr-3 text-sm text-[#374151]
                  placeholder:text-[#265768] focus:outline-none"
                />

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    className="absolute left-0 right-0 top-full mt-2 bg-white
                    border border-[#E5E7EB] rounded-[10px] shadow-lg z-10 
                    max-h-40 overflow-y-auto"
                  >
                    {batchLoading && (
                      <div className="px-4 py-2 text-xs text-[#9CA3AF]">
                        Loading batches...
                      </div>
                    )}

                    {!batchLoading &&
                      batchOptions
                        .filter((b) => {
                          const label = formatBatchLabel(b).toLowerCase();
                          return label.includes(searchText.toLowerCase());
                        })
                        .map((b) => (
                          <div
                            key={b._id}
                            onClick={() => {
                              // ✅ show label to user
                              setSearchText(formatBatchLabel(b));

                              // ✅ backend ko sirf id jayegi
                              setSelectedBatchId(b._id);

                              setShowDropdown(false);
                            }}
                            className="px-4 py-2 text-sm cursor-pointer
                            hover:bg-[#F7FAFD] text-[#374151]"
                          >
                            {formatBatchLabel(b)}
                          </div>
                        ))}

                    {!batchLoading &&
                      batchOptions.filter((b) =>
                        formatBatchLabel(b)
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-2 text-xs text-[#9CA3AF]">
                          No results found
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              variant="primary"
              onClick={handleGenerate}
              className="!w-[250px] !h-[42px] !text-[16px]"
            >
              {loading ? "Generating..." : "Generate Timetable"}
            </Button>
          </div>
        </>
      )}

      {/* ============================= */}
      {/* ✅ Preview tab (TABLE UI) */}
      {/* ============================= */}
      {activeTab === "preview" && (
        <div className="mt-4">
          {previewLoading && (
            <p className="text-[#265768] font-semibold">Loading preview...</p>
          )}

          {previewError && (
            <p className="text-red-500 font-semibold">{previewError}</p>
          )}

          {!previewLoading &&
            !previewError &&
            previewData?.data?.length === 0 && (
              <p className="text-[#9CA3AF] font-semibold">
                No generated timetable found.
              </p>
            )}

          {!previewLoading &&
            !previewError &&
            previewData?.data?.length > 0 && (
              <div
                className="bg-white w-full relative mt-6"
                style={{
                  width: "100%",
                  borderRadius: "12.23px",
                  border: "1.83px solid #DFDFDF",
                  overflow: "hidden",
                  backgroundColor: "white",
                }}
              >
                {/* Header */}
                <div className="px-8 pt-3 pb-1 bg-white">
                  <div
                    className="flex items-center text-[14px] font-medium"
                    style={{
                      color: "#265768",
                      fontFamily: "'Mulish', sans-serif",
                    }}
                  >
                    <div className="flex-1 text-left">Degree / Course</div>
                    <div className="flex-1 text-center">Department</div>
                    <div className="flex-1 text-center">Semester</div>
                    <div className="flex-1 text-center">Section</div>
                    <div className="flex-1 text-center">Preview Timetable</div>
                  </div>

                  {/* Blue underline */}
                  <div
                    className="mt-2 h-[1.5px] rounded"
                    style={{
                      background: "#0b84d6",
                      boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
                    }}
                  />
                </div>

                {/* Rows */}
                <div className="px-8">
                  {previewData.data.map((tt) => {
                    const batch = tt?.batch;
                    const section =
                      typeof batch?.code === "string" && batch.code.length > 0
                        ? batch.code.slice(-1)
                        : "-";

                    return (
                      <div
                        key={tt._id}
                        className="flex items-center py-3.5 hover:bg-gray-50 transition"
                        style={{ borderBottom: "3px solid #D9D9D9" }}
                      >
                        <div className="flex-1 text-[13px] font-medium text-[#265768]/60 text-left">
                          {batch?.name || "-"}
                        </div>

                        <div className="flex-1 text-[13px] text-[#265768]/60 text-center">
                          {batch?.department || "-"}
                        </div>

                        <div className="flex-1 text-[13px] text-[#265768]/60 text-center">
                          {batch?.semester ?? "-"}
                        </div>

                        <div className="flex-1 text-[13px] text-[#265768]/60 text-center">
                          {section}
                        </div>

                        <div
                          className="flex-1 text-[13px] text-[#4BACCE]/60 cursor-pointer hover:underline text-center"
                          title="Preview Timetable"
                          onClick={() =>
                            navigate(`/timetable/preview/${batch?._id}`)
                          }
                        >
                          📅
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}














