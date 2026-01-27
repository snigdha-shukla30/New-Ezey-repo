import { useNavigate } from "react-router-dom";
import {  X } from "lucide-react";


function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);      // peeche jao
    } else {
      navigate("/");    // warna home bhej do
    }
  };

  return <button onClick={handleBack}><X size={28} color="#265768" strokeWidth={3} /></button>;
}

export default BackButton;
