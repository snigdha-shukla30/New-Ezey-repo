import React, { useEffect, useState } from "react";
import { Search, Mail, Bell } from "lucide-react";

const placeholderTexts = [
  "Search time table",
  "Search faculty",
  "Search classroom",
  "Search subject",
];

const Header = () => {
  const [placeholder, setPlaceholder] = useState(placeholderTexts[0]);
  const [index, setIndex] = useState(0);

  // 🔁 Auto change placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholderTexts.length);
      setPlaceholder(placeholderTexts[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="flex items-center justify-between gap-6 flex-1">
      {/* Search bar – layout unchanged */}
      <div className="flex-1 max-w-[400px]">
        <div className="relative bg-[#F7FAFD] border border-[#BFBFBF] rounded-[16px] px-4 py-2.5">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5B6]"
          />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-transparent pl-7 pr-3 text-sm text-[#374151] placeholder:text-[#265768] focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-full bg-white border border-[#BFBFBF] flex items-center justify-center">
          <Mail size={16} className="text-[#4B5C73]" />
        </button>

        <button className="relative w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center">
          <Bell size={16} className="text-[#4B5C73]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#EF4444]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#DFDFDF]">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <img
              src="logo.png"
              alt="Maharishi University"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-[#0F566B]">
              Maharishi University
            </div>
            <div className="text-[11px] text-[#6B7280]">Lucknow,UP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
