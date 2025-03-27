import googleLogo from "../../assets/google_logo.png";

const GoogleLoginButton = () => {
  return (
    <button className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg p-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
      <img
        src={googleLogo}
        alt="Google Logo"
        className="w-12 h-5 mr-2"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;