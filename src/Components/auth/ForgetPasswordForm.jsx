import React, { useState } from "react";
import { Mail } from "lucide-react";
import { forgotPasswordAPI } from "../../api/api";

// ✅ shared components
import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const payload = { email };
      const response = await forgotPasswordAPI(payload);

      console.log("Forgot Password Response:", response);

      if (response.success) {
        alert("Reset link sent to your email");
      } else {
        alert(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="mb-8 text-center justify-center align-center ">
        <p className="text-md text-[#4A9FB5] text-left mb-8">Ezey</p>

        <h1
          className="mb-3 mt-30"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "28px",
            lineHeight: "120%",
            color: "#265768",
          }}
        >
          Forgot Password
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
          Forgot password ? No issues we got your back .
        </p>
      </div>

    
      <div className="mb-10">
        <InputField
          width="450px"
          height="42px"
          label="Email Address / Institution Id"
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
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </div>
    </>
  );
};

export default ForgotPasswordForm;





