export const Footer = () => {
  return (
    <div className="mt-10 text-sm text-gray-500 flex flex-col sm:flex-row items-center sm:justify-between px-4">
      {/* LEFT */}
      <span className="mb-2 sm:mb-0">
        Copyright : Ezey. All Right Reserved.
      </span>

      {/* RIGHT */}
      <span className="flex gap-2">
        <a href="#" className="text-teal-600 hover:underline">
          Terms & Conditions
        </a>
        <span>|</span>
        <a href="#" className="text-teal-600 hover:underline">
          Privacy Policy
        </a>
      </span>
    </div>
  );
};








// export const Footer = () => {
//   return (
//     <div className="mt-10 text-center text-sm text-gray-500">
//       Copyright : Ezey. All Right Reserved.
//       <span className="ml-58">
//         <a href="#" className="text-teal-600 hover:underline">
//           Terms & Conditions
//         </a>{" "}
//         <span className="mx-2">|</span>
//         <a href="#" className="text-teal-600 hover:underline">
//           Privacy Policy
//         </a>
//       </span>
//     </div>
//   );
// };
















