export const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  marginClass = "", // ✅ NEW PROP
}) => {
  const baseStyle = "flex items-center justify-center gap-2";

  const variants = {
    primary: `
      w-[371px]
      h-[42px]
      rounded-[6px]
      bg-[linear-gradient(0deg,#265768_0%,#4BACCE_100%)]

      drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
      hover:drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]

      hover:shadow-[inset_0px_4px_10px_rgba(0,0,0,0.35)]

      font-playfair
      font-semibold
      text-[24px]
      leading-[120%]
      text-white
    `,

    secondary: `
      w-[80px]
      h-[40px]
      rounded-[4px]
      bg-white
      border-[3px]
      border-[#DFDFDF]
      font-mulish
      font-medium
      text-[12px]
      leading-[150%]
      text-[#265768]
    `,

    // secondaryIcon: `
    //   w-[170px]
    //   h-[50px]
    //   rounded-[5px]
    //   bg-white
    //   border-[2px]
    //   border-[#26576833]
    //   font-mulish
    //   font-semibold
    //   text-[20px]
    //   leading-[150%]
    //   bg-gradient-to-t from-[#265768] to-[#4BACCE] bg-clip-text text-transparent
    // `,

    secondaryIcon: `
  w-[170px]
  h-[50px]
  rounded-[5px]
  bg-white
  border-[2px]
  border-[#26576833]
  hover:border-[#265768]
  transition-all
  duration-200

  font-mulish
  font-semibold
  text-[20px]
  leading-[150%]
  bg-gradient-to-t from-[#265768] to-[#4BACCE] bg-clip-text text-transparent

  opacity-50
  hover:opacity-100
  hover:border-[#265768]/50
`,


  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${marginClass} ${className}`}
    >
      {children}
    </button>
  );
};














// export const Button = ({
//   children,
//   onClick,
//   variant = "primary",
//   className = "",
//   marginClass = "",   // ✅ NEW PROP
// }) => {
//   const baseStyle = "flex items-center justify-center gap-2";

//   const variants = {
//     primary: `
//   w-[371px]
//   h-[42px]
//   rounded-[6px]
//   bg-[linear-gradient(0deg,#265768_0%,#4BACCE_100%)]
//   drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
//   hover:drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
//   hover:shadow-inner
//   font-playfair
//   font-semibold
//   text-[24px]
//   leading-[120%]
//   text-white
// `,


//     secondary: `
//       w-[80px]
//       h-[40px]
//       rounded-[4px]
//       bg-white
//       border-[3px]
//       border-[#DFDFDF]
//       font-mulish
//       font-medium
//       text-[12px]
//       leading-[150%]
//       text-[#265768]
//     `,

//     secondaryIcon: `
//       w-[170px]
//       h-[50px]
//       rounded-[5px]
//       bg-white
//       border-[2px]
//       border-[#26576833]
//       font-mulish
//       font-semibold
//       text-[20px]
//       leading-[150%]
//       bg-gradient-to-t from-[#265768] to-[#4BACCE] bg-clip-text text-transparent
//     `,
//   };

//   return (
//     <button
//       onClick={onClick}
//       className={`${baseStyle} ${variants[variant]} ${marginClass} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };








