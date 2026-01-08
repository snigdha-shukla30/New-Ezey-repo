import React from "react";
import { User } from "lucide-react";

const FacultyStatus = () => {
  const faculty = [
    { name: "Dr Rakesh Kumar Yadav", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80" },
    { name: "Dr Shweta Vikram", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80" },
    { name: "Dr Kalayan Acharya", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80" },
    { name: "Mrs Pooja Shukal", avatar: "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=160&q=80" },
    { name: "Prof Anupam Kumar Gautam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80" },
    { name: "Mrs Preeti Naval", avatar: "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=160&q=80" },
  ];

  return (
    <div 
      className="bg-white rounded-[10px] border border-[#CACACA] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      style={{
        width: '340px',
        height: '391px',
        borderRadius: '10px',
        borderWidth: '1px',
        opacity: 1
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[14px] font-semibold text-[#265768]" style={{ fontFamily: 'Playfair Display, serif' }}>Faculty</h3>
        <User size={16} className="text-[#94A3B8]" />
      </div>

      {/* Faculty List Container */}
      <div 
        className="rounded-[10px] border border-[#E5E7EB]"
        style={{
          width: '320px',
          height: '318px',
          margin: '10px',
          borderRadius: '10px',
          borderWidth: '1px',
          opacity: 1
        }}
      >
        {faculty.map((member, index) => (
          <div
            key={index}
            className="relative flex items-center border-b border-[#F3F4F6] last:border-b-0 group hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            style={{
              height: '53px'
            }}
          >
            {/* Hover Line - Left Side */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 bg-[#413E7D] opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full"
              style={{
                width: '4px'
              }}
            />
            
            {/* Profile Image */}
            <div 
              className="rounded-full overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB] absolute"
              style={{
                width: '40px',
                height: '40px',
                top: '8px',
                left: '16px',
                borderRadius: '57.86px',
                opacity: 1
              }}
            >
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            </div>
            
            {/* Name */}
            <div 
              className="text-[#6B7280] absolute overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                width: '240px',
                height: '18px',
                top: '19px',
                left: '64px',
                fontFamily: 'Mulish, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '150%',
                letterSpacing: '0%',
                textAlign: 'left',
                opacity: 1
              }}
            >
              {member.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyStatus;