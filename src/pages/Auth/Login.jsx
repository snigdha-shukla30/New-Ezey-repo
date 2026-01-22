import LeftAuthLayout from "../../Components/auth/LeftAuthLayout";
import RightAuthSlider from "../../Components/auth/RightAuthSlider";
import LoginForm from "../../Components/auth/LoginForm";

const EzeyLoginPage = () => {
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
        {/* Left Side - Login Form */}
        <div style={{ flexShrink: 0 }}>
          <LeftAuthLayout>
            <LoginForm />
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

export default EzeyLoginPage;
