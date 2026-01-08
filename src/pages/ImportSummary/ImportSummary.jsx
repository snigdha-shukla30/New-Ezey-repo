import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";

import Tabs from "../../Components/ImportedData/Tabs";
import PaginationDots from "../../Components/ImportedData/PagnitionDots";
import ClassroomTable from "../../Components/ImportedData/Classroomtable";
import BatchesTable from "../../Components/ImportedData/Batchestable";
import SubjectsTable from "../../Components/ImportedData/Subjectstable";
import FacultyTable from "../../Components/ImportedData/Facultytable";

const ImportSummary = () => {
  const [activeTab, setActiveTab] = useState("Classroom");
  const [currentPage, setCurrentPage] = useState(0);

  const [classrooms, setClassrooms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);

  // 🔥 API CALLS (replace URLs later)
  useEffect(() => {
    fetch("/api/classrooms").then(r => r.json()).then(setClassrooms);
    fetch("/api/batches").then(r => r.json()).then(setBatches);
    fetch("/api/subjects").then(r => r.json()).then(setSubjects);
    fetch("/api/faculty").then(r => r.json()).then(setFaculty);
  }, []);

  const tabs = ["Classroom", "Batches", "Subjects", "Faculty"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Import Data Summary</h1>
          <p className="text-gray-600">
            Review the imported details before proceeding.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          {/* Tabs */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="flex gap-3">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Edit className="w-5 h-5 text-gray-600" />
              </button>

              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg">
                Continue
              </button>
            </div>
          </div>

          {/* Dynamic Table */}
          <div className="p-6">
            {activeTab === "Classroom" && <ClassroomTable data={classrooms} />}
            {activeTab === "Batches" && <BatchesTable data={batches} />}
            {activeTab === "Subjects" && <SubjectsTable data={subjects} />}
            {activeTab === "Faculty" && <FacultyTable data={faculty} />}
          </div>

          {/* Pagination */}
          <PaginationDots
            total={4}
            current={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportSummary;
