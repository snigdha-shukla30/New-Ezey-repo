








import React from "react";


export const CardContainer = ({
  children,
  title,
  className = "",
}) => {
  return (
    <div
      className={`w-full bg-white rounded-[10px] border border-[#BFBFBF] 
      shadow-[0_16px_40px_rgba(148,163,184,0.22)]
      px-8 pt-6 pb-8 ${className}`}
    >
      {title && (
        <h1
          className="text-[20px] font-semibold text-[#1F2937] mb-1"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {title}
        </h1>
      )}
      {children}
    </div>
  );
};