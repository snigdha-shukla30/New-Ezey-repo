import React from "react";

export const StepNavigation = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: "ERP Connection" },
    { number: 2, label: "Loadchart" },
    { number: 3, label: "Manual Entry" },
  ];

  return (
    <>
      {/* BACKGROUND STRIP */}
      <div
        className="
          hidden lg:block
          fixed right-0 top-0 h-screen w-[450px]
          bg-[linear-gradient(270deg,#265768_0%,#4BACCE_100%)]
          z-0
          pointer-events-none
        "
      />

      {/* CIRCLES */}
      <div
        className="
          hidden lg:flex
          fixed right-0 top-0 h-screen w-[450px]
          flex-col justify-center gap-8 pl-8
          z-50
          pointer-events-auto
        "
      >
        {steps.map((step) => {
          const isActive = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="flex items-center gap-3 cursor-pointer relative"
              onClick={() => onStepClick(step.number)}
            >
              <div
                className={`
                  w-[85px] h-[85px] rounded-full flex items-center justify-center
                  font-[600] text-[60px] leading-[120%] text-center
                  shadow-[0px_4.57px_4.57px_0px_#00000040]
                  font-[Playfair]
                  ${isActive ? "bg-[#336696] text-white" : "bg-[#E6E6E6] text-[#336696]"}
                `}
              >
                {step.number}
              </div>

              <span className="font-semibold text-[25px] text-white">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};













// import React from "react";

// export const StepNavigation = ({ currentStep, onStepClick }) => {
//   const steps = [
//     { number: 1, label: "ERP Connection" },
//     { number: 2, label: "Loadchart" },
//     { number: 3, label: "Manual Entry" },
//   ];

//   return (
//     <>
//       {/* 🔵 BACKGROUND STRIP (LOW LAYER + no click) */}
//       <div
//         className="
//           fixed right-0 top-0 h-screen w-[450px]
//           bg-[linear-gradient(270deg,#265768_0%,#4BACCE_100%)]
//           z-0
//           pointer-events-none
//         "
//       />

//       {/* ⚪ CIRCLES (TOP LAYER) */}
//       <div
//         className="
//           fixed right-0 top-0 h-screen w-[450px]
//           flex flex-col justify-center gap-8 pl-8
//           z-50
//           pointer-events-auto
//         "
//       >
//         {steps.map((step, index) => {
//           const isActive = currentStep === step.number;

//           return (
//             <div
//               key={step.number}
//               className="flex items-center gap-3 cursor-pointer relative"
//               onClick={() => onStepClick(step.number)}
//             >
//               {/* Circle */}
//               <div
//                 className={`
//                   w-[85px] h-[85px] rounded-full flex items-center justify-center
//                   font-[600] text-[60px] leading-[120%] text-center
//                   shadow-[0px_4.57px_4.57px_0px_#00000040]
//                   font-[Playfair]
//                   ${isActive ? "bg-[#336696] text-white" : "bg-[#E6E6E6] text-[#336696]"}
//                 `}
//               >
//                 {step.number}
//               </div>

//               {/* Label */}
//               <span className="font-semibold text-[25px] text-white">
//                 {step.label}
//               </span>

//               {/* Connector */}
//               {/* {index < steps.length - 1 && (
//                 <div className="absolute left-[37px] top-[79px] w-[5px] h-[33px] bg-white/40" />
//               )} */}
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// };









