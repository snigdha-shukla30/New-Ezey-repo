import React from "react";

const LeftAuthBox = ({ children }) => {
  return (
    <div className="relative w-full max-w-[540px] h-[630px] rounded-2xl border border-[#BEE3F8] bg-white shadow-sm flex flex-col justify-between p-6">
      <div className="w-full max-w-md mx-auto flex-1">
        {children}
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#7A8C94]">
        <span>
          Copyright : Ezey, All Right Reserved.
        </span>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <a href="#" className="hover:text-[#4BACCE] transition-colors">
            Terms & Conditions
          </a>
          <span className="text-[#CBD5E0]">|</span>
          <a href="#" className="hover:text-[#4BACCE] transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftAuthBox;




