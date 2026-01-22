// src/pages/DataEntry/DataEntry.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../Components/ui/Sidebar";
import Header from "../../Components/ui/Header";
import { CardContainer } from "../../Components/ui/Card";

import ClassroomData from "../../Components/DataEntry/ClassroomData";
import Batches from "../../Components/DataEntry/Batches";
import Subjects from "../../Components/DataEntry/Subjects";
import Faculty from "../../Components/DataEntry/Faculty";
import { Search } from "lucide-react";

// ✅ API import (uncomment if you are using it)
// import { getClassrooms } from "../../api/api";

const DataEntry = () => {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("dataentry");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Classroom");

  const [classrooms, setClassrooms] = useState([]);
  const [classroomsLoading, setClassroomsLoading] = useState(false);
  const [classroomsError, setClassroomsError] = useState("");

  const tabs = ["Classroom", "Batches", "Subjects", "Faculty"];

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setClassroomsLoading(true);
        setClassroomsError("");

        // ✅ API hit (make sure getClassrooms is imported)
        // const data = await getClassrooms();
        // setClassrooms(Array.isArray(data) ? data : []);

        // ✅ If API not connected yet
        setClassrooms([]);
      } catch (err) {
        console.error(err);
        setClassroomsError("Failed to fetch classrooms");
      } finally {
        setClassroomsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const getAddButtonLabel = () => {
    switch (activeTab) {
      case "Classroom":
        return "Add Classroom";
      case "Batches":
        return "Add Batch";
      case "Subjects":
        return "Add Subject";
      case "Faculty":
        return "Add Faculty";
      default:
        return "Add Item";
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "Classroom":
        return "Search classrooms";
      case "Batches":
        return "Search batches";
      case "Subjects":
        return "Search subjects";
      case "Faculty":
        return "Search faculty";
      default:
        return "Search";
    }
  };

  // ✅ Navigation based on active tab
  const handleAddNavigate = () => {
    switch (activeTab) {
      case "Classroom":
        navigate("/manual/classroom");
        break;
      case "Batches":
        navigate("/manual/batches");
        break;
      case "Subjects":
        navigate("/manual/subjects");
        break;
      case "Faculty":
        navigate("/manual/faculty");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="min-h-screen h-screen bg-[#FFFFFF] flex px-2 py-4 gap-4 overflow-hidden"
      style={{ fontFamily: "Mulish, sans-serif" }}
    >
      {/* Sidebar */}
      <div className="shrink-0">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex pt-2 overflow-y-auto">
        <div className="w-full max-w-[1170px] space-y-2">
          {/* Header */}
          <div className="w-full bg-white border border-[#BFBFBF] rounded-[10px] px-6 py-3 shadow-[0_4px_14px_rgba(148,163,184,0.18)] flex items-center gap-6">
            <Header />
          </div>

          {/* Card */}
          <CardContainer className="min-h-[calc(100vh-150px)] flex flex-col">
            {/* Title */}
            <section className="mb-4 flex items-start justify-between gap-8">
              <div className="ml-4">
                <h1 className="text-[32px] leading-tight font-semibold text-[#265768]/90 mb-1">
                  Data Management
                </h1>
                <p className="text-sm text-[#265768]/50 max-w-3xl">
                  Manage your academic resources and constraints
                </p>
              </div>
            </section>

            {/* Tabs + Search + Add */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[1068px]">
                {/* Tabs */}
                {/* Tabs */}
<div className="flex items-center gap-10 mb-5 border-b-[2px] border-[#D1D5DB] relative">
  <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-white" />

  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-3 text-[14px] font-medium relative transition-colors ${
        activeTab === tab
          ? "text-[#265768]/90"
          : "text-[#9CA3AF] hover:text-[#265768]"
      }`}
    >
      {tab}
      {activeTab === tab && (
        <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[140%] h-[8px] rounded-full bg-[#0077FF] border-[2px] border-white" />
      )}
    </button>
  ))}
</div>


                {/* Search + Add */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex-1 max-w-[400px]">
                    <div className="relative bg-[#F7FAFD] border border-[#BFBFBF] rounded-[16px] px-4 py-2.5">
                      <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5B6]"
                      />
                      <input
                        type="text"
                        placeholder={getSearchPlaceholder()}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent pl-7 pr-3 text-sm text-[#374151] placeholder:text-[#9AA5B6] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* ✅ Add Button now navigates */}
                  <button
                    onClick={handleAddNavigate}
                    className="h-[40px] px-5 text-sm font-medium text-white rounded-[6px] flex items-center gap-2 hover:opacity-90 transition-opacity 
      bg-[linear-gradient(0deg,#265768_0%,#4BACCE_100%)]
      drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
      hover:drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
      hover:shadow-[inset_0px_4px_10px_rgba(0,0,0,0.35)]
      font-playfair
      leading-[120%]"
                  >
                    <span className="text-lg leading-none">+</span>
                    {getAddButtonLabel()}
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="mt-1.5 flex justify-center">
              {activeTab === "Classroom" && (
                <ClassroomData
                  searchQuery={searchQuery}
                  classrooms={classrooms}
                  loading={classroomsLoading}
                  error={classroomsError}
                />
              )}

              {activeTab === "Batches" && <Batches searchQuery={searchQuery} />}

              {activeTab === "Subjects" && (
                <Subjects searchQuery={searchQuery} />
              )}

              {activeTab === "Faculty" && <Faculty searchQuery={searchQuery} />}
            </div>
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;















