import React from "react";

const LeftAuthBox = ({ children }) => {
  return (
    <div className="relative w-full max-w-[420px] h-[650px] rounded-[10px] p-[1px] bg-gradient-to-b from-[rgba(38,87,104,0.5)] to-[rgba(75,172,206,0.5)]">
      
      <div className="bg-[#F8F8F8] rounded-[9px] p-5 flex flex-col justify-between h-full">
        
        {/* Form Content */}
        <div className="w-full mx-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col gap-2 text-[10px] text-[#265768]/50">
          <span className="text-center">
            Copyright : Ezey. All Right Reserved.
          </span>

          <div className="text-center">
            <a href="#" className="text-[#4BACCE] hover:underline">
              Terms & Conditions
            </a>
            <span className="mx-1 text-[#CBD5E0]">|</span>
            <a href="#" className="text-[#4BACCE] hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeftAuthBox;
