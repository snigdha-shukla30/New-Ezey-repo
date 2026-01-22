
import React, { useState } from "react";
import { generateTimetable } from "../../api/api";
import { CardContainer } from "../../Components/ui/Card";
import { Button } from "../../Components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../Components/ui/Modal";

/* Dummy batch options (later API se replace ho sakta hai) */
const batchOptions = [
  "6935b915c69e593823bf5828",
  "6935b915c69e593823bf5829",
  "6935b915c69e593823bf5830",
  "6935b915c69e593823bf5831",
];

export default function GenerateTT() {
  const [activeTab, setActiveTab] = useState("generate");
  const [batchId, setBatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const { showAlert, AlertComponent } = useAlert();

  const handleGenerate = async () => {
    if (!batchId) {
      showAlert({
        title: 'Missing Information',
        message: 'Please enter Batch ID',
        type: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await generateTimetable(batchId);

      if (res.success && res.options?.length) {
        setTimetableData({
          batchInfo: res.batchInfo,
          option: res.options[0],
        });
        showAlert({
          title: 'Success!',
          message: 'Timetable generated successfully',
          type: 'success'
        });
      } else {
        showAlert({
          title: 'Generation Failed',
          message: 'No timetable options found for this batch',
          type: 'error'
        });
      }
    } catch (err) {
      console.error(err);
      showAlert({
        title: 'Error',
        message: err.message || 'Failed to generate timetable',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    navigate(`/timetable/preview/${batchId}`);
  };

  return (
    <CardContainer>
      {/* ===== Header (Dashboard-style) ===== */}
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

        <div className="text-right">
          <div
            className="text-[16px] font-semibold mb-1"
            style={{ color: "#265768", fontFamily: "Playfair Display, serif" }}
          >
            ERP Last Sync:
          </div>

          <div
            className="text-[12px] text-[#9CA3AF] mb-2"
            style={{ fontFamily: "Mulish, sans-serif" }}
          >
            Last synced at 12:40 PM
          </div>

          <button
            className="w-[60px] h-5 text-[11px] font-medium text-white rounded-[3.21px]
            flex items-center justify-center hover:opacity-90 transition-opacity ml-auto"
            style={{
              background: "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
              fontFamily: "Mulish, sans-serif",
            }}
          >
            Sync
          </button>
        </div>
      </section>

      {/* ===== Tabs ===== */}

      <div className="flex gap-8 border-b border-[#E5E7EB] mb-6 relative">
        {/* Generate Tab */}
        <button
          onClick={() => setActiveTab("generate")}
          className={`relative px-4 pb-3 text-[14px] font-semibold
    leading-[150%] text-center font-mulish
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
          onClick={() => setActiveTab("preview")}
          className={`relative px-4 pb-3 text-[14px] font-semibold
    leading-[150%] text-center font-mulish
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

      {/* ===== Generate Tab ===== */}
      {activeTab === "generate" && (
        <>
          {/* ===== Search + Generate (SAME LINE) ===== */}
          <div className="mb-6 flex items-end gap-10">
            {/* Search */}
            <div className="flex-1 max-w-[900px]">
              <label className="block text-xs font-medium text-[#374151] mb-2">
                Enter Batch ID
              </label>

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
                  value={batchId}
                  onChange={(e) => {
                    setBatchId(e.target.value);
                    setShowDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Search batch ID"
                  className="w-full bg-transparent pl-7 pr-3  text-sm text-[#374151]
                  placeholder:text-[#265768] focus:outline-none"
                />

                {/* Dropdown */}
                {showDropdown && batchId && (
                  <div
                    className="absolute left-0 right-0 top-full mt-2 bg-white
                    border border-[#E5E7EB] rounded-[10px] shadow-lg z-10 
                    max-h-40 overflow-y-auto"
                  >
                    {batchOptions
                      .filter((id) =>
                        id.toLowerCase().includes(batchId.toLowerCase())
                      )
                      .map((id) => (
                        <div
                          key={id}
                          onClick={() => {
                            setBatchId(id);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-2 text-sm cursor-pointer
                          hover:bg-[#F7FAFD] text-[#374151]"
                        >
                          {id}
                        </div>
                      ))}

                    {batchOptions.filter((id) =>
                      id.toLowerCase().includes(batchId.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-xs text-[#9CA3AF]">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button (Imported Primary) */}
            <Button
              variant="primary"
              onClick={handleGenerate}
              className="!w-[250px] !h-[42px] !text-[16px]"
            >
              {loading ? "Generating..." : "Generate Timetable"}
            </Button>
          </div>

          {/* ===== Result Table ===== */}

          {timetableData && (
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
                  <div className="flex-1 text-left">Batch</div>
                  <div className="flex-1 text-center">Code</div>
                  <div className="flex-1 text-center">Subjects</div>
                  <div className="flex-1 text-center">Strength</div>
                  <div className="flex-1 text-center">Preview</div>
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

              {/* Data Row */}
              <div className="px-8">
                <div
                  className="flex items-center py-3.5 hover:bg-gray-50 transition"
                  style={{ borderBottom: "3px solid #D9D9D9" }}
                >
                  <div className="flex-1 text-[13px] font-medium text-[#265768]/60 text-left">
                    {timetableData.batchInfo.batchName}
                  </div>

                  <div className="flex-1 text-[13px] text-[#265768]/60 text-center">
                    {timetableData.batchInfo.batchCode}
                  </div>

                  <div className="flex-1 text-[13px] text-[#265768]/60 text-center">
                    {timetableData.batchInfo.subjects}
                  </div>

                  <div className="flex-1 text-[13px] text-[#265768]/60 text-center">
                    {timetableData.batchInfo.strength}
                  </div>

                  <div
                    className="flex-1 text-[13px] text-[#4BACCE]/60 cursor-pointer
                       hover:underline text-center"
                    onClick={handlePreview}
                    title="Preview Timetable"
                  >
                    📅
                  </div>
                </div>
              </div>
            </div>
          )}

         
        </>
      )}

      <AlertComponent />
    </CardContainer>
  );
}
