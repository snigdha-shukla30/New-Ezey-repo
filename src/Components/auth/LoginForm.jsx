import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../api/api";
import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";
import { useAlert } from "../ui/Modal";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useAlert();

  const handleSubmit = async () => {
    if (!email || !password) {
      showAlert({
        title: 'Missing Information',
        message: 'Please enter email and password',
        type: 'warning'
      });
      return;
    }
    
    setLoading(true);
    try {
      const res = await loginAPI(email, password);

      if (res.success) {
        showAlert({
          title: 'Success!',
          message: 'Login successful',
          type: 'success'
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        showAlert({
          title: 'Login Failed',
          message: res.message || "Login failed",
          type: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      showAlert({
        title: 'Error',
        message: error.message || "Something went wrong",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header - More Compact */}
      <div className="mb-6 text-center">
        <p className="text-sm text-[#4A9FB5] text-left mb-4">Ezey</p>

        <h1
          className="mb-2"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "120%",
            color: "#265768",
          }}
        >
          Welcome to Ezey
        </h1>

        <p className="text-xs text-[#7A8C94]">
          Start your experience with Ezey by signing in or signing up
        </p>
      </div>

      {/* Email Input - Compact */}
      <div className="mb-3">
        <InputField
          width="100%"
          height="40px"
          label="Email Address / Institution Id"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email Address or Institution Id"
          icon={Mail}
        />
      </div>

      {/* Password Input - Compact */}
      <div className="mb-3">
        <InputField
          width="100%"
          height="40px"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          icon={Lock}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      {/* Sign In Button - Compact */}
      <div className="flex justify-center mb-4 mt-6">
        <Button
          variant="primary"
          onClick={handleSubmit}
          className={loading ? "opacity-70 pointer-events-none" : ""}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </div>

      <AlertComponent />
    </>
  );
};

export default LoginForm;
