// import React, { useRef, useState } from "react";
// import group167 from "../../assets/images/Group 167.png";
// import BatchTable from "./BatchTable";


// export default function QuickAddBatch() {
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [parsedData, setParsedData] = useState(null);
//   const [parseError, setParseError] = useState(null);

//   // Local state for manual entry rows
//   const [batches, setBatches] = useState([]);
//   const [form, setForm] = useState({
//     degree: "",
//     batchCode: "",
//     department: "",
//     capacity: "",
//     semester: "",
//     section: "",
//     subjects: "",
//   });

//   const triggerFile = () => fileInputRef.current?.click();

//   const handleFileChange = (e) => {
//     const f = e.target.files && e.target.files[0];
//     if (!f) return;
//     setSelectedFile(f.name);
//     setParsedData(null);
//     setParseError(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const addBatch = () => {
//     // basic validation – at least degree + batch code
//     if (!form.degree || !form.batchCode) return;

//     setBatches((prev) => [...prev, form]);

//     // clear form after adding
//     setForm({
//       degree: "",
//       batchCode: "",
//       department: "",
//       capacity: "",
//       semester: "",
//       section: "",
//       subjects: "",
//     });
//   };

//   const inputStyle = {
//     width: "274.5px",
//     height: "40px",
//     borderRadius: "15px",
//     border: "1.5px solid #DFDFDF",
//     fontSize: "14px",
//     fontFamily: "'Mulish', sans-serif",
//     color: "#000000", // pure black text when typing; placeholder color handled via CSS
//     padding: "0 12px",
//     boxSizing: "border-box",
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f3f3]">
//       <div
//         className="bg-white p-6 rounded shadow-sm border relative w-full"
//         style={{ borderColor: "#e8e8e8", height: "100vh" }}
//       >
//         {/* Header */}
//         <div className="mb-2">
//           <div
//             className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
//             style={{
//               // approximate SVG drop shadow: dy=6, blur=3, opacity=0.25
//               textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
//             }}
//           >
//             Ezey
//           </div>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".csv,.xlsx,.xls"
//             onChange={handleFileChange}
//             hidden
//           />

//           <button
//             onClick={triggerFile}
//             style={{
//               position: "absolute",
//               right: batches.length > 0 ? 220 : 20,
//               top: 56,
//               minWidth: 160,
//               height: 34,
//               background: "linear-gradient(0deg, #265768 0%, #4BACCE 100%)",
//               borderRadius: 6,
//               color: "white",
//               fontSize: 12,
//               fontFamily: "'Mulish', sans-serif",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
//             }}
//           >
//             Upload File ( CSV / XLSX )
//           </button>

//           {/* Top-right Add Batch button – appears only after at least one row is added (table visible) */}
//           {batches.length > 0 && (
//             <button
//               onClick={addBatch}
//               style={{
//                 position: "absolute",
//                 right: 40,
//                 top: 56,
//                 minWidth: 140,
//                 height: 34,
//                 borderRadius: 6,
//                 border: "1px solid #4BACCE",
//                 background: "#ffffff",
//                 color: "#4BACCE",
//                 fontSize: 12,
//                 fontFamily: "'Mulish', sans-serif",
//               }}
//             >
//               Add Batch
//             </button>
//           )}
//         </div>

//         {/* 🔹 TITLE + ICON*/}
//         <div className="flex items-center gap-2 mb-4">
//           {/* Icon */}
//           <svg
//             width="25"
//             height="25"
//             viewBox="0 0 25 25"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M11.3393 0.894531H22.5928C23.4303 0.894531 24.1089 1.5731 24.1089 2.4106V14.5142C24.1089 15.3535 23.4303 16.032 22.5928 16.032H13.3929M5.62321 7.14632C6.45225 7.14632 7.24733 6.81698 7.83355 6.23076C8.41977 5.64455 8.7491 4.84946 8.7491 4.02042C8.7491 3.19139 8.41977 2.3963 7.83355 1.81008C7.24733 1.22387 6.45225 0.894531 5.62321 0.894531C4.79417 0.894531 3.99909 1.22387 3.41287 1.81008C2.82665 2.3963 2.49731 3.19139 2.49731 4.02042C2.49731 4.84946 2.82665 5.64455 3.41287 6.23076C3.99909 6.81698 4.79417 7.14632 5.62321 7.14632Z"
//               stroke="#265768"
//               strokeWidth="1.8"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M16.0714 9.86908C16.0714 8.85658 15.25 8.03516 14.2375 8.03516H5.62318C4.36876 8.03563 3.16585 8.53416 2.27883 9.42117C1.39182 10.3082 0.893296 11.5111 0.892822 12.7655V16.9637H2.91961L3.59639 24.1066H7.64996L9.20711 11.7048H14.2375C15.25 11.7048 16.0714 10.8834 16.0714 9.86908Z"
//               stroke="#265768"
//               strokeWidth="1.8"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>

//           {/* Text */}
//           <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
//             Quick add batch
//           </h2>
//         </div>

//         <div
//           className="w-full h-[3px] bg-[#0b84d6] mb-6 rounded"
//           style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
//         />

//         {/* FORM */}
//         <div className="grid grid-cols-12 gap-6">
//           <div className="col-span-3">
//             <div
//               className="text-xs mb-1"
//               style={{
//                 color: "#265768",
//                 fontFamily: "'Mulish', sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               Degree
//             </div>
//             <input
//               name="degree"
//               value={form.degree}
//               onChange={handleChange}
//               placeholder="e.g. B.Tech"
//               style={inputStyle}
//             />
//           </div>

//           <div className="col-span-3">
//             <div
//               className="text-xs mb-1"
//               style={{
//                 color: "#265768",
//                 fontFamily: "'Mulish', sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               Batch code
//             </div>
//             <input
//               name="batchCode"
//               value={form.batchCode}
//               onChange={handleChange}
//               placeholder="e.g. CSE01"
//               style={inputStyle}
//             />
//           </div>

//           <div className="col-span-3">
//             <div
//               className="text-xs mb-1"
//               style={{
//                 color: "#265768",
//                 fontFamily: "'Mulish', sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               Department
//             </div>
//             <input
//               name="department"
//               value={form.department}
//               onChange={handleChange}
//               placeholder="e.g. CSE"
//               style={inputStyle}
//             />
//           </div>

//           <div className="col-span-3">
//             <div
//               className="text-xs mb-1"
//               style={{
//                 color: "#265768",
//                 fontFamily: "'Mulish', sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               Capacity
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-end",
//                 justifyContent: "space-between",
//                 gap: "8px",
//               }}
//             >
//               <input
//                 name="capacity"
//                 value={form.capacity}
//                 onChange={handleChange}
//                 placeholder="e.g. 56"
//                 style={inputStyle}
//               />
//               <button
//                 onClick={addBatch}
//                 style={{
//                   fontSize: "12px",
//                   color: "rgb(77, 172, 206)",
//                   background: "transparent",
//                   border: "none",
//                   cursor: "pointer",
//                   position: "relative",
//                   top: "20px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 + Add batch
//               </button>
//             </div>
//           </div>

//           <div className="col-span-3">
//             <div
//               className="text-xs mb-1"
//               style={{
//                 color: "#265768",
//                 fontFamily: "'Mulish', sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               Semester
//             </div>
//             <input
//               name="semester"
//               value={form.semester}
//               onChange={handleChange}
//               placeholder="e.g. I"
//               style={inputStyle}
//             />
//           </div>

//           <div className="col-span-3">
//             <div
//               className="text-xs mb-1"
//               style={{
//                 color: "#265768",
//                 fontFamily: "'Mulish', sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               Section
//             </div>
//             <input
//               name="section"
//               value={form.section}
//               onChange={handleChange}
//               placeholder="e.g. A"
//               style={inputStyle}
//             />
//           </div>

//           <div className="col-span-6">
//             <div
//               className="text-xs mb-1"
//               style={{
//                 color: "#265768",
//                 fontFamily: "'Mulish', sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               Assigned subjects
//             </div>
//             <input
//               name="subjects"
//               value={form.subjects}
//               onChange={handleChange}
//               placeholder="e.g. Computer Networks"
//               style={inputStyle}
//             />
//           </div>
//         </div>

//         <div className="w-full h-[2px] bg-[#D9D9D9] mt-6" />

//         {/* If batches added show table, else No Data image */}
//         {batches.length === 0 ? (
//           <div
//             className="mt-6 border rounded-lg flex justify-center items-center"
//             style={{ height: "320px", borderColor: "#DFDFDF" }}
//           >
//             <img src={group167} alt="No Data" />
//           </div>
//         ) : (
//           <div className="mt-6">
//             <BatchTable data={batches} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
