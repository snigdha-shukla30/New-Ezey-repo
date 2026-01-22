import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";
import { useAlert } from "../../Components/ui/Modal";

import { emailVerificationAPI } from "../../api/api";

const EmailVerificationForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { showAlert, AlertComponent } = useAlert();

  const handleSubmit = async () => {
    if (!token) {
      showAlert({
        title: 'Invalid Token',
        message: 'Invalid or missing verification token',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);

      const res = await emailVerificationAPI(token);

      if (res.success) {
        showAlert({
          title: 'Success!',
          message: 'Email verified successfully',
          type: 'success'
        });
        setTimeout(() => navigate("/verified"), 2000);
      } else {
        showAlert({
          title: 'Verification Failed',
          message: res.message || "Verification failed",
          type: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      showAlert({
        title: 'Error',
        message: 'Something went wrong. Please try again.',
        type: 'error'
      });
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

      <AlertComponent />
    </>
  );
};

export default EmailVerificationForm;
