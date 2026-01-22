import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Button } from "../../Components/ui/Button";
import { emailVerificationAPI } from "../../api/api";
import { useAlert } from "../../Components/ui/Modal";

const EmailVerifiedForm = () => {
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
          message: 'Email verified successfully. Redirecting to login...',
          type: 'success'
        });
        setTimeout(() => navigate("/login"), 2000);
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

      <AlertComponent />
    </>
  );
};

export default EmailVerifiedForm;
