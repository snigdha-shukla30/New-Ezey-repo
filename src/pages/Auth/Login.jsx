import LeftAuthLayout from "../../Components/auth/LeftAuthLayout";
import RightAuthSlider from "../../Components/auth/RightAuthSlider";
import LoginForm from "../../Components/auth/LoginForm";

const EzeyLoginPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <LeftAuthLayout>
          <LoginForm />
        </LeftAuthLayout>

        <RightAuthSlider />
      </div>
    </div>
  );
};

export default EzeyLoginPage;






