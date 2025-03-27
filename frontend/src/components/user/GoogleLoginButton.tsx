import googleLogo from "../../assets/google_logo.png";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    
  }
  return (
    <button 
    onClick = {handleGoogleLogin}
    className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
      Sign in with
      <img
        src={googleLogo}
        alt="Google Logo"
        className="w-12 h-5 ml-2 mt-1"
      />
    </button>
  );
};

export default GoogleLoginButton;