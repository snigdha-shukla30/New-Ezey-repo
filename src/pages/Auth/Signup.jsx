import LeftAuthLayout from "../../Components/auth/LeftAuthLayout";
import RightAuthSlider from "../../Components/auth/RightAuthSlider";
import SignupForm from "../../Components/auth/SignupForm";

const EzeySignupPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F5F5F5', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '30px',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '1200px',
        width: '100%'
      }}>
        {/* Left Side - Signup Form */}
        <div style={{ flexShrink: 0 }}>
          <LeftAuthLayout>
            <SignupForm />
          </LeftAuthLayout>
        </div>

        {/* Right Side - Banner */}
        <div style={{ flexShrink: 0 }}>
          <RightAuthSlider />
        </div>
      </div>
    </div>
  );
};

export default EzeySignupPage;
