import React, { useState } from "react";
import { CardContainer } from "./CardContainer";
import { Button } from "../../Components/ui/Button";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";

export const LoadchartScreen = ({ onNext }) => {
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <CardContainer title="Ready to upload the loadchart? We'll extract faculty assignments and class loads for scheduling">
      <div className="max-w-md mx-auto">
        {/* ✅ Smaller dotted box */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-[6px]
            px-6 py-6 text-center transition-all duration-300
            w-[320px] mx-auto mb-5
            ${dragActive ? "border-[#4BACCE] bg-[#F3FBFF]" : "border-[#87BFD2] bg-white"}
          `}
        >
          {/* ✅ Image style block */}
          <div className="flex justify-center mb-8 pb-5">
            <div className="relative w-[150px] h-[50px] drop-shadow-[0px_4px_4px_#00000040]">
              {/* 🔘 BIG GREY IMAGE (background box) */}
              <img
                src="/rectangle.png"
                alt="grey box"
                className="absolute left-0 top-0 w-[170px] h-[70px] object-contain hover:drop-shadow-[0px_4px_4px_#00000040]"
              />

              {/* 🔹 Small top box 1 */}
              <img
                src="/box.png"
                alt="small box 1"
                className="
                  absolute left-[4px] top-[10px]
                  w-[90px] h-[40px] object-contain
                  hover:drop-shadow-[0px_4px_4px_#00000040]
                "
              />

              {/* 🔹 Small top box 2 */}
              <img
                src="/box.png"
                alt="small box 2"
                className="
                  absolute left-[75px] top-[40px]
                  w-[90px] h-[40px] object-contain
                  hover:drop-shadow-[0px_4px_4px_#00000040]
                "
              />
            </div>
          </div>

          <p className="text-[#265768] font-medium mb-2 text-[12px]">
            Drag and drop loadset file to upload
          </p>

          <p className="text-[#8AA6B1] text-[10px] mb-3">
            Upload file in Excel / Word form
          </p>

          <Button variant="secondary" className="w-[110px] mx-auto mt-5 text-[12px] py-1">
            Browse File
          </Button>
        </div>
      </div>

      <div className="flex justify-center mr-4">
        <Button onClick={() => navigate("/dashboard")}>Connect ERP</Button>
      </div>

      <Footer />
    </CardContainer>
  );
};








