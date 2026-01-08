export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 mb-6 border-b border-gray-200">
      {["generate", "preview"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 px-1 font-medium text-sm relative ${
            activeTab === tab ? "text-teal-600" : "text-gray-500"
          }`}
        >
          {tab === "generate" ? "Generate Timetable" : "Preview Timetable"}
          {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
        </button>
      ))}
    </div>
  );
}
