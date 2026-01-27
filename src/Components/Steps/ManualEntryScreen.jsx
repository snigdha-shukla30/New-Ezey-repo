import React, { useState } from "react";
import { School, Users, BookOpen, Layers, Settings } from "lucide-react";
import { CardContainer } from "./CardContainer";
import { Button } from "../../Components/ui/Button";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";

export const ManualEntryScreen = () => {
  const [activeTab, setActiveTab] = useState("classroom");
  const navigate = useNavigate();

  const tabs = [
    {
      id: "classroom",
      label: "Classroom",
      icon: School,
      path: "/manual/classroom",
    },
    {
      id: "subjects",
      label: "Subjects",
      icon: BookOpen,
      path: "/manual/subjects",
    },
    { id: "faculty", label: "Faculty", icon: Users, path: "/manual/faculty" },
    { id: "batches", label: "Batches", icon: Layers, path: "/manual/batches" },
    // { id: 'constraints', label: 'Constraints', icon: Settings, path: '/manual/constraints' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path); // ✅ navigation here
  };

  return (
    <CardContainer title="No file? No problem — you can manually input all required data at your own pace">
      <div className="flex justify-center flex-wrap gap-6 mb-14 ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant="secondaryIcon"
              onClick={() => handleTabClick(tab)}
              className={`
                flex items-center gap-2
                px-5 py-2
                rounded-lg w-80
                ${isActive ? "border-[#265768] text-[#265768]" : ""}
              `}
            >
              <Icon className="w-6 h-6 shrink-0 text-[#265768]" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      <div className="flex justify-center items-center ">
        <Button onClick={() => navigate("/dashboard")}>Submit Data</Button>
      </div>

      <Footer />
    </CardContainer>
  );
};
