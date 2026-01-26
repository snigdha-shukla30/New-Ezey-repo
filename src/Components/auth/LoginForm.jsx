
import React, { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../api/api";
import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ 1) Token available ho to direct dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // ✅ direct dashboard
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI(email, password);

      if (res.success) {
        // ✅ token save
        if (res.token) {
          localStorage.setItem("token", res.token);
        }

        // ✅ 2) New user -> form, else dashboard
       if (res.user?.isNewUser) {
          navigate("/form");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(res.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-lg font-semibold text-[#4A9FB5] text-left mb-8 -ml-6 -mt-2">
          Ezey
        </p>

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
          Welcome to Ezey
        </h1>

        <p className="text-sm text-[#7A8C94]">
          Start your experience with Ezey by signing in
        </p>
        <p className="text-sm text-[#7A8C94]">or signing up</p>
      </div>

      <div className="mb-4">
        <InputField
          width="450px"
          height="42px"
          label="Email Address / Institution Id"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email Address or Institution Id"
          icon={Mail}
        />
      </div>

      <div className="mb-2 mt-3 relative">
        <InputField
          width="450px"
          height="42px"
          label="Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="************"
          icon={Lock}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <span
          className="
            absolute
            right-[40px]
            top-[33px]
            text-[#7A8C94]
            pointer-events-none
          "
        >
          |
        </span>

        <p
          onClick={() => navigate("/forgetpassword")}
          className="
            text-xs text-[#4A9FB5] mt-1 cursor-pointer pr-1 mb-12
            relative w-fit ml-auto
            after:content-['']
            after:absolute after:left-0 after:-bottom-[2px]
            after:h-[1px] after:w-full after:bg-[#4A9FB5]
            after:scale-x-0 after:origin-left
            after:transition-transform after:duration-300
            hover:after:scale-x-100
          "
        >
          Forgot Password?
        </p>
      </div>

      <div className="flex justify-end mb-2 mr-10">
        <p className="text-xs text-[#7A8C94]">
          New user ?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="
              text-[#4A9FB5] cursor-pointer
              relative inline-block
              after:content-['']
              after:absolute after:left-0 after:-bottom-[2px]
              after:h-[1px] after:w-full after:bg-[#4A9FB5]
              after:scale-x-0 after:origin-left
              after:transition-transform after:duration-300
              hover:after:scale-x-100
            "
          >
            Sign Up
          </span>
        </p>
      </div>

      <div className="flex justify-center mb-6 mt-2">
        <Button
          variant="primary"
          onClick={handleSubmit}
          className={loading ? "opacity-70 pointer-events-none" : ""}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </>
  );
};

export default LoginForm;











