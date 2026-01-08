import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Button } from "../../Components/ui/Button";
import { emailVerificationAPI } from "../../api/api";

const EmailVerifiedForm = () => {
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async () => {
    if (!token) {
      alert("Invalid or missing verification token");
      return;
    }

    try {
      setLoading(true);

      const res = await emailVerificationAPI(token);

      if (res.success) {
        alert("Email verified successfully");
        navigate("/login"); 
      } else {
        alert(res.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-md text-[#4A9FB5] text-left mb-8">Ezey</p>

        <h1
          className="mb-3"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "28px",
            lineHeight: "120%",
            color: "#265768",
          }}
        >
          Email Verification Completed
        </h1>
      </div>

      {/* Image */}
      <div className="mb-10 flex justify-center">
        <img
          src="/envelope.png"
          alt="Email Verified"
          className="w-[180px] h-auto"
        />
      </div>

      {/* Text */}
      <div className="mb-8 text-center">
        <p
          style={{
            fontFamily: "sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "150%",
            color: "#7A8C94",
          }}
        >
          Verification process completed start creating <br></br> schedules . 
        </p>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mb-6">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Continue"}
        </Button>
      </div>
    </>
  );
};

export default EmailVerifiedForm;






// import React, { useState, useEffect } from "react";


// import { Button } from "../../Components/ui/Button";
// import { emailVerificationAPI } from "../../api/api";
// import { useSearchParams } from "react-router-dom";


// const EmailVerifiedForm = () => {

//   const [loading, setLoading] = useState(false);


//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");

//   const handleSubmit = async () => {
//     if (!token) {
//       alert("Invalid or missing verification token");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await emailVerificationAPI(token);

//       if (res.success) {
//         alert("Email verified successfully");
//       } else {
//         alert(res.message || "Verification failed");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <>
    
//       <div className="mb-8 text-center">
//         <p className="text-md text-[#4A9FB5] text-left mb-8">Ezey</p>

//         <h1
//           className="mb-3"
//           style={{
//             fontFamily: "Georgia, serif",
//             fontWeight: 700,
//             fontSize: "28px",
//             lineHeight: "120%",
//             color: "#265768",
//           }}
//         >
//           Email Verification
//         </h1>

        
//       </div>

     
//       <div className="mb-10 flex justify-center">
//         <img
//           src="/open-mail.png"  
//           alt="Email Verified"
//           className="w-[180px] h-auto"
//         />
//       </div>

//       <div className="mb-8 text-center">
        

//         <p
//           style={{
//             fontFamily: "sans-serif",
//             fontWeight: 400,
//             fontSize: "14px",
//             lineHeight: "150%",
//             color: "#7A8C94",
//           }}
//         >
//           We have sent you a verification link to your given gmail
//           please open your gmail to verify .
//         </p>
//       </div>


      
//       <div className="flex justify-center mb-6">
//         <Button variant="primary" onClick={handleSubmit}>
//           Continue
//         </Button>
//       </div>
//     </>
//   );
// };

// export default EmailVerifiedForm;





