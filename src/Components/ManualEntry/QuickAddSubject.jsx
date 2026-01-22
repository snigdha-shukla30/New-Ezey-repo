// import React, { useRef, useState } from "react";
// import group167 from "../../assets/images/Group 167.png";
// import SubjectTable from "./SubjectTable";

// export default function QuickAddSubject() {
//   const fileInputRef = useRef(null);

//   const [subjects, setSubjects] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     code: "",
//     department: "",
//     section: "",
//     semester: "",
//     hrsWeek: "",
//     type: "",
//   });

//   const triggerFile = () => fileInputRef.current?.click();

//   const handleFileChange = (e) => {
//     const f = e.target.files && e.target.files[0];
//     if (!f) return;
//   };

//   const inputStyle = {
//     width: "274.5px",
//     height: "40px",
//     borderRadius: "15px",
//     border: "1.5px solid #DFDFDF",
//     fontSize: "14px",
//     fontFamily: "'Mulish', sans-serif",
//     color: "#000000", // pure black text when typing; placeholder color handled via CSS
//     background: "#FFFFFF",
//     padding: "0 12px",
//     boxSizing: "border-box",
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const addSubject = () => {
//     if (!form.name || !form.code) return;
//     setSubjects((prev) => [...prev, form]);
//     setForm({
//       name: "",
//       code: "",
//       department: "",
//       section: "",
//       semester: "",
//       hrsWeek: "",
//       type: "",
//     });
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
//               right: subjects.length > 0 ? 220 : 20,
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

//           {subjects.length > 0 && (
//             <button
//               onClick={addSubject}
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
//               Add Subject
//             </button>
//           )}
//         </div>

//         {/* Title */}
//         <div className="flex items-center gap-2 mb-4">
//           {/* ICON */}
//           <svg
//             width="18"
//             height="20"
//             viewBox="0 0 18 20"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M16 16H6C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14V2C4 1.46957 4.21071 0.960859 4.58579 0.585786C4.96086 0.210714 5.46957 0 6 0H7V5L9 3.5L11 5V0H16C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16ZM14 18V20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V4H2V18H14Z"
//               fill="#265768"
//             />
//           </svg>

//           <h2
//             className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]"
//           >
//             Quick add subject
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
//               Subject name
//             </div>
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="e.g. DAA"
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
//               Subject code
//             </div>
//             <input
//               name="code"
//               value={form.code}
//               onChange={handleChange}
//               placeholder="e.g. CS201"
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
//               Section
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
//                 name="section"
//                 value={form.section}
//                 onChange={handleChange}
//                 placeholder="e.g. A"
//                 style={inputStyle}
//               />
//               <button
//                 onClick={addSubject}
//                 style={{
//                   fontSize: "12px",
//                   color: "rgb(77, 172, 206)",
//                   background: "transparent",
//                   border: "none",
//                   cursor: "pointer",
//                   fontFamily: "'Mulish', sans-serif",
//                   position: "relative",
//                   top: "20px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 + Add subject
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
//               Hrs/Week
//             </div>
//             <input
//               name="hrsWeek"
//               value={form.hrsWeek}
//               onChange={handleChange}
//               placeholder="e.g. 4"
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
//               Type
//             </div>
//             <input
//               name="type"
//               value={form.type}
//               onChange={handleChange}
//               placeholder="e.g. Theory"
//               style={inputStyle}
//             />
//           </div>
//         </div>

//         <div className="w-full h-[2px] bg-[#D9D9D9] mt-6" />

//         {subjects.length === 0 ? (
//           <div
//             className="mt-6 border rounded-lg flex justify-center items-center"
//             style={{ height: "320px", borderColor: "#DFDFDF" }}
//           >
//             <img src={group167} alt="No Data" />
//           </div>
//         ) : (
//           <div className="mt-6">
//             <SubjectTable data={subjects} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
