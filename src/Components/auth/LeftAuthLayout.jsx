import React from "react";

const LeftAuthBox = ({ children }) => {
  return (
    <div className="relative w-[540px] h-[650px] mt-4 rounded-[10px] p-[1px] bg-gradient-to-b from-[rgba(38,87,104,0.5)] to-[rgba(75,172,206,0.5)]">
      
      
      <div className="bg-[#F8F8F8] rounded-[9px] p-6 flex flex-col justify-between h-full ">
        
        
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>

        
        <div className="mt-4 flex items-center justify-between text-[11px] text-[#265768]/50">
          <span>
            Copyright : Ezey. All Right Reserved.
          </span>

          <div>
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




