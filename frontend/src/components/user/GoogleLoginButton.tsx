import { useNavigate } from "react-router-dom";
import googleLogo from "../../assets/google_logo.png";
import { useAppDispatch } from "../../redux/hooks";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { toast } from "react-toastify";
import { googleLogin } from "../../redux/slices/user/userSlice";

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      if (!user.email) {
        console.error("Google login failed: Email is missing.");
        toast.error("Login failed. Please try again.");
        return;
      }   

      const response = await dispatch(
        googleLogin({
          email: user.email,
          googleId: user.uid

        })
      );


       if (googleLogin.rejected.match(response)) {
      const errorMessage =
        response.payload ||
        response.error?.message ||
        "Google Login failed.";

      console.error("Google login failed:", errorMessage);

      if (errorMessage.includes("blocked")) {
        toast.error("Your account has been blocked.");
      } else {
        toast.error(errorMessage);
      }

      return;
    }
      toast.success("Login successful!");
      navigate("/home");
    } catch(error: any){
      console.log("error",error);   
      toast.error(error?.message || "Google Login failed.");
    }
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