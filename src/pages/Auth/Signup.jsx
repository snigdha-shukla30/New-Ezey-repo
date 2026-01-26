import LeftAuthLayout from "../../Components/auth/LeftAuthLayout";
import RightAuthSlider from "../../Components/auth/RightAuthSlider";
import SignupForm from "../../Components/auth/SignupForm";

const EzeySignupPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F5F5] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <LeftAuthLayout>
          <SignupForm />
        </LeftAuthLayout>

        <RightAuthSlider />
      </div>
    </div>
  );
};

export default EzeySignupPage;




