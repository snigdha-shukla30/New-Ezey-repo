import React from "react";

export default function Splash() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#4ba1c7] to-[#1a425b] flex items-center justify-center">
      <div className="w-[90%] max-w-6xl h-[85%] bg-transparent flex flex-col items-center justify-between py-10 relative overflow-hidden">

        {/* Heading */}
        <h1 className="text-white text-5xl font-serif tracking-wide mt-4 select-none">
          Ezey
        </h1>

        {/* Middle Section */}
        <div className="flex w-full justify-between items-center mt-10 relative z-10">

          {/* Left: Server stack (using Tailwind shapes) */}
          <div className="ml-6 flex flex-col gap-6">
            {[0,1,2].map((i) => (
              <div
                key={i}
                className="w-36 md:w-44 bg-white/10 backdrop-blur-sm rounded-xl shadow-inner p-3 relative"
              >
                {/* small top bar */}
                <div className="h-2 w-16 bg-white/20 rounded-md mb-3" />
                {/* status dot */}
                <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-green-400 shadow-sm" />
                {/* traffic dots */}
                <div className="flex gap-2 items-center mt-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />
                  <span className="h-2 w-2 rounded-full bg-white/40 inline-block" />
                  <span className="h-2 w-2 rounded-full bg-white/30 inline-block" />
                </div>
                {/* footer line */}
                <div className="mt-6 h-2 w-full bg-white/5 rounded-md" />
              </div>
            ))}
          </div>

          {/* Center: Binary marquee */}
          <div className="relative w-[40%] min-w-[220px] text-white font-mono text-xs md:text-lg tracking-widest overflow-hidden">
            <div className="space-y-3">
              <div className="whitespace-nowrap block overflow-hidden">
                <div className="inline-block animate-marquee py-1">
                  <span className="opacity-60 select-none">
                    1010010101011111010100101011010100101010011010101101010100010101101010011011011011111101010101100011110101010101011
                    1010010101011111010100101011010100101010011010101101010100010101101010011011011011111101010101100011110101010101011
                  </span>
                </div>
              </div>

              <div className="whitespace-nowrap block overflow-hidden">
                <div className="inline-block animate-marquee-slow py-1">
                  <span className="opacity-50 select-none">
                    01011011101010011010101011010101001101101010011010101010100101110010111011000110101101010110101011010111101011110100101010
                    01011011101010011010101011010101001101101010011010101010100101110010111011000110101101010110101011010111101011110100101010
                  </span>
                </div>
              </div>

              <div className="whitespace-nowrap block overflow-hidden">
                <div className="inline-block animate-marquee-faster py-1">
                  <span className="opacity-40 select-none">
                    011011010110010010110110110100101110101001110101010010101010101010101010101010101000001010111011001101110110101011010110101001
                    011011010110010010110110110100101110101001110101010010101010101010101010101010101000001010111011001101110110101011010110101001
                  </span>
                </div>
              </div>

              <div className="whitespace-nowrap block overflow-hidden">
                <div className="inline-block animate-marquee-fastest py-1">
                  <span className="opacity-30 select-none">
                    10111010110101111001001010110101101101010101010010000101111011010010101010101111011010111001011101010101010101010101010100110101110101
                    10111010110101111001001010110101101101010101010010000101111011010010101010101111011010111001011101010101010101010101010100110101110101
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Laptop mockup */}
          <div className="mr-6 flex items-center justify-center">
            <div className="w-48 md:w-64 lg:w-72 rounded-2xl shadow-2xl bg-gradient-to-b from-black/50 to-black/30 p-4">
              {/* screen */}
              <div className="bg-gradient-to-tr from-slate-800/80 to-slate-900/70 rounded-lg h-36 md:h-44 overflow-hidden relative">
                <div className="absolute inset-3 flex flex-col justify-center gap-2">
                  <div className="h-1.5 w-20 bg-white/20 rounded-lg" />
                  <div className="h-1.5 w-28 bg-white/10 rounded-lg" />
                  <div className="h-1.5 w-16 bg-white/6 rounded-lg" />
                  <div className="h-1.5 w-24 bg-white/8 rounded-lg" />
                  <div className="h-1.5 w-12 bg-white/5 rounded-lg" />
                </div>
              </div>

              {/* base */}
              <div className="mt-3 h-4 md:h-5 rounded-b-xl bg-gradient-to-b from-slate-700/40 to-slate-800/30" />
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-white text-2xl font-serif tracking-wide mb-6 select-none">
          CONNECTING TO ERP
        </p>

        {/* Inline styles for marquee and small animations (keeps everything component-local) */}
        <style>{`
          /* marquee animations */
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: inline-block;
            padding-right: 100%;
            animation: marquee 12s linear infinite;
          }
          .animate-marquee-slow {
            display: inline-block;
            padding-right: 100%;
            animation: marquee 18s linear infinite;
          }
          .animate-marquee-faster {
            display: inline-block;
            padding-right: 100%;
            animation: marquee 9s linear infinite;
          }
          .animate-marquee-fastest {
            display: inline-block;
            padding-right: 100%;
            animation: marquee 6s linear infinite;
          }

          /* subtle hover/active touches (optional) */
          .server-card-hover:hover {
            transform: translateY(-3px);
            transition: transform 200ms ease;
          }
        `}</style>
      </div>
    </div>
  );
}


// import React from "react";

// export default function Splash() {
//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-[#4ba1c7] to-[#1a425b] flex items-center justify-center">
//       <div className="w-[90%] max-w-6xl h-[85%] bg-transparent flex flex-col items-center justify-between py-10 relative overflow-hidden">

//         {/* Heading */}
//         <h1 className="text-white text-5xl font-serif tracking-wide mt-4">
//           Ezey
//         </h1>

//         {/* Middle Section */}
//         <div className="flex w-full justify-between items-center mt-10 relative z-[1]">

//           {/* Left Server Stack */}
//           <div className="ml-10">
//             <div className="server-stack-wrapper">
//               <div className="server-card server-row-1">
//                 <div className="server-card-bar" />
//                 <div className="server-status-dot" />
//                 <div className="server-traffic-dots">
//                   <span className="server-traffic-dot-red" />
//                   <span className="server-traffic-dot-light second" />
//                   <span className="server-traffic-dot-light third" />
//                 </div>
//                 <div className="server-card-foot" />
//               </div>
//               <div className="server-card server-row-2">
//                 <div className="server-card-bar" />
//                 <div className="server-status-dot" />
//                 <div className="server-traffic-dots">
//                   <span className="server-traffic-dot-red" />
//                   <span className="server-traffic-dot-light second" />
//                   <span className="server-traffic-dot-light third" />
//                 </div>
//                 <div className="server-card-foot" />
//               </div>
//               <div className="server-card server-row-3">
//                 <div className="server-card-bar" />
//                 <div className="server-status-dot" />
//                 <div className="server-traffic-dots">
//                   <span className="server-traffic-dot-red" />
//                   <span className="server-traffic-dot-light second" />
//                   <span className="server-traffic-dot-light third" />
//                 </div>
//                 <div className="server-card-foot" />
//               </div>
//             </div>
//           </div>

//           {/* Binary Code (center faint text + motion) */}
//           <div className="relative w-[40%] text-white font-mono text-xl tracking-widest">
//             <div className="binary-lines">
//               <div className="binary-line">
//                 <span className="binary-line-inner">
//                   1010010101011111010100101011010100101010011010101101010100010101101010011011011011111101010101100011110101010101011
//                   1010010101011111010100101011010100101010011010101101010100010101101010011011011011111101010101100011110101010101011
//                 </span>
//               </div>
//               <div className="binary-line speed-2">
//                 <span className="binary-line-inner">
//                   01011011101010011010101011010101001101101010011010101010100101110010111011000110101101010110101011010111101011110100101010
//                   01011011101010011010101011010101001101101010011010101010100101110010111011000110101101010110101011010111101011110100101010
//                 </span>
//               </div>
//               <div className="binary-line speed-3">
//                 <span className="binary-line-inner">
//                   011011010110010010110110110100101110101001110101010010101010101010101010101010101000001010111011001101110110101011010110101001
//                   011011010110010010110110110100101110101001110101010010101010101010101010101010101000001010111011001101110110101011010110101001
//                 </span>
//               </div>
//               <div className="binary-line speed-4">
//                 <span className="binary-line-inner">
//                   10111010110101111001001010110101101101010101010010000101111011010010101010101111011010111001011101010101010101010101010100110101110101
//                   10111010110101111001001010110101101101010101010010000101111011010010101010101111011010111001011101010101010101010101010100110101110101
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Laptop (CSS) */}
//           <div className="mr-10 relative">
//             <div className="splash-laptop-wrapper">
//               <div className="splash-laptop-body">
//                 <div className="splash-laptop-shell">
//                   <div className="splash-laptop-inner">
//                     <div className="laptop-code-line line-1" />
//                     <div className="laptop-code-line line-2" />
//                     <div className="laptop-code-line line-3" />
//                     <div className="laptop-code-line line-4" />
//                     <div className="laptop-code-line line-5" />
//                   </div>
//                 </div>
//               </div>
//               <div className="splash-laptop-base">
//                 <div className="splash-laptop-base-inner" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Text */}
//         <p className="text-white text-2xl font-serif tracking-wide mb-6">
//           CONNECTING TO ERP
//         </p>

//       </div>
//     </div>
//   );
// }