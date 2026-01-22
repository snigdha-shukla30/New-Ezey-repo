import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { signupAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";

import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";
import { useAlert } from "../ui/Modal";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useAlert();

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword || !accountType) {
      showAlert({
        title: 'Missing Information',
        message: 'Please fill all required fields',
        type: 'warning'
      });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({
        title: 'Password Mismatch',
        message: 'Passwords do not match',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await signupAPI({
        name,
        email,
        password,
        accountType,
      });

      if (res.success) {
        showAlert({
          title: 'Success!',
          message: 'Signup successful. Please check your email for verification.',
          type: 'success'
        });
        setTimeout(() => navigate("/verification"), 2000);
      } else {
        showAlert({
          title: 'Signup Failed',
          message: res.message || "Signup failed",
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
      {/* Header - Compact */}
      <div className="mb-4 text-center">
        <p className="text-sm text-[#4A9FB5] text-left mb-3">Ezey</p>

        <h1
          className="mb-2"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "22px",
            lineHeight: "120%",
            color: "#265768",
          }}
        >
          Welcome to Ezey
        </h1>

        <p className="text-xs text-[#7A8C94]">
          Start your experience with Ezey by signing up
        </p>
      </div>

      {/* Full Name - Compact */}
      <div className="mb-2">
        <InputField
          width="100%"
          height="38px"
          label="Full Name*"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          icon={User}
        />
      </div>

      {/* Email - Compact */}
      <div className="mb-2">
        <InputField
          width="100%"
          height="38px"
          label="Email Address / Institution Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email Address or Institution Id"
          icon={Mail}
        />
      </div>

      {/* Password - Compact */}
      <div className="mb-2">
        <InputField
          width="100%"
          height="38px"
          label="Create Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          icon={Lock}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      {/* Confirm Password - Compact */}
      <div className="mb-2">
        <InputField
          width="100%"
          height="38px"
          label="Re-Enter Password*"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••"
          icon={Lock}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </div>

      {/* Account Type - Compact */}
      <div className="mb-4">
        <div className="relative w-full">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0] w-4 h-4" />
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full h-[38px] pl-10 pr-5 rounded-[10px] border-[1.5px] border-[#DFDFDF] text-xs text-[#7A8C94]"
          >
            <option value="">Account Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Sign Up Button */}
      <div className="flex justify-center mb-3">
        <Button
          variant="primary"
          onClick={handleSubmit}
          className={loading ? "opacity-70 pointer-events-none" : ""}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </div>

      {/* Sign In Link */}
      <p className="text-center text-xs text-[#7A8C94] mb-2">
        Already a user ?{" "}
        <span 
          className="text-[#4BACCE] cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Sign In
        </span>
      </p>

      <AlertComponent />
    </>
  );
};

export default SignupForm;
