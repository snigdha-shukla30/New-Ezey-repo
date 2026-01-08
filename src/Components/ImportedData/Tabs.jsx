import React from "react";

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex gap-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === tab
              ? "text-cyan-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}

          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
