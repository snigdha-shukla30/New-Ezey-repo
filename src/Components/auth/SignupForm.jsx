import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { signupAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";

// ✅ shared components
import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";
import Swal from "sweetalert2";

import EmailVerificationForm from "./EmailVerificationForm";

const SignupForm = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);

  const popup = (text, icon = "error") => {
    Swal.fire({
      text,
      icon,
      confirmButtonColor: "#4BACCE",
    });
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword || !accountType) {
      popup("Please fill all required fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      popup("Passwords do not match", "error");
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
        Swal.fire({
          text: "Signup successful",
          icon: "success",
          confirmButtonColor: "#4BACCE",
        }).then(() => {
          setShowVerification(true);
        });
      } else {
        popup(res.message || "Signup failed", "error");
      }
    } catch (error) {
      console.error(error);
      popup("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return <EmailVerificationForm initialEmail={email} />;
  }

  return (
    <>
      <div className="mb-2 text-center">
        <p className="text-sm text-[#4A9FB5] text-left mb-2">Ezey</p>

        <h1
          className="mb-1"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "110%",
            color: "#265768",
          }}
        >
          Welcome to Ezey
        </h1>

        <p className="text-[13px] text-[#7A8C94]">
          Start your experience with Ezey by signing in
        </p>
        <p className="text-[13px] text-[#7A8C94]">or signing up</p>
      </div>

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

      <div className="mb-2">
        <InputField
          width="100%"
          height="38px"
          label="Create Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your passwod"
          icon={Lock}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      <div className="mb-3">
        <InputField
          width="100%"
          height="38px"
          label="Re-Enter Password*"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          icon={Lock}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />
      </div>

      <div className="mb-4">
        <div className="relative w-1/2 mx-auto">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0] w-4 h-4" />
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full h-[40px] pl-10 pr-5 rounded-[10px] border-[1.5px] border-[#DFDFDF] text-[13px] text-[#7A8C94] outline-none focus:border-[#4BACCE] transition-colors appearance-none bg-white"
          >
            <option value="">Account Type</option>
            <option value="staff">staff</option>
            <option value="coordinator">coordinator</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>

      <div className="w-full max-w-[280px] mx-auto">
        <p className="text-right text-[11px] text-[#7A8C94] mb-2 mt-2 font-medium">
          Already a user ?{" "}
          <span
            className="text-[#4BACCE] cursor-pointer hover:underline pl-1"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>

        <div className="mb-4">
          <Button
            variant="primary"
            onClick={handleSubmit}
            className={`w-full h-[40px] rounded-[10px] bg-gradient-to-b from-[#3D8B9F] to-[#265768] text-white font-serif text-lg hover:opacity-90 transition-opacity shadow-lg ${loading ? "opacity-70 pointer-events-none" : ""}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignupForm;








