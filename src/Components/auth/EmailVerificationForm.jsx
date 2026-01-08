import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useSearchParams } from "react-router-dom";


import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";


import { emailVerificationAPI } from "../../api/api";

const EmailVerificationForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const [searchParams] = useSearchParams();
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
          Email Verification
        </h1>

        <p
          style={{
            fontFamily: "sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "150%",
            color: "#7A8C94",
          }}
        >
          We have sent you a verification link to your given gmail
          please open your gmail to verify .
        </p>
      </div>

      
      <div className="mb-10">
        <InputField
          width="450px"
          height="42px"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email Address or Institution Id"
          icon={Mail}
        />
      </div>

      
      <div className="flex justify-center mb-6">
        <Button
          variant="primary"
          onClick={handleSubmit}
          className={loading ? "opacity-70 pointer-events-none" : ""}
        >
          {loading ? "Verifying..." : "Resend Link"}
        </Button>
      </div>
    </>
  );
};

export default EmailVerificationForm;




