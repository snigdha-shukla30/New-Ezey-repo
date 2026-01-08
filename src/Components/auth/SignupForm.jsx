import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { signupAPI } from "../../api/api";

// ✅ shared components
import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword || !accountType) {
      alert("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
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
        alert("Signup successful");
      } else {
        alert(res.message || "Signup failed");
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
      <div className="mb-4 text-center">
        <p className="text-md text-[#4A9FB5] text-left mb-4">Ezey</p>

        <h1
          className="mb-2"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "28px",
            lineHeight: "120%",
            color: "#265768",
          }}
        >
          Welcome to Ezey
        </h1>

        <p className="text-[14px] text-[#7A8C94]">
          Start your experience with Ezey by signing in
        </p>
        <p className="text-[14px] text-[#7A8C94]">or signing up</p>
      </div>

      
      <div className="mb-2">
        <InputField
          width="450px"
          height="42px"
          label="Full Name*"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          icon={User}
        />
      </div>

     
      <div className="mb-2">
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

   
      <div className="mb-2">
        <InputField
          width="450px"
          height="42px"
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

    
      <div className="mb-4">
        <InputField
          width="450px"
          height="42px"
          label="Re-Enter Password*"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••"
          icon={Lock}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />
      </div>

     
      <div className="mb-6 ml-33">
        <div className="relative w-[160px]">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0] w-4 h-4" />
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full h-[40px] pl-10 pr-5 rounded-[10px] border-[1.5px] border-[#DFDFDF] text-[13px] text-[#7A8C94]"
          >
            <option value="">Account Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      
      <div className="flex justify-center mb-4">
        <Button
          variant="primary"
          onClick={handleSubmit}
          className={loading ? "opacity-70 pointer-events-none" : ""}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </div>

      
      <p className="text-center text-[12px] text-[#7A8C94] mb-4">
        Already a user ?{" "}
        <span className="text-[#4BACCE] cursor-pointer">
          Sign In
        </span>
      </p>
    </>
  );
};

export default SignupForm;



