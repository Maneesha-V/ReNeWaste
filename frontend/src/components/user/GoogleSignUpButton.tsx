import { useNavigate } from "react-router-dom";
import googleLogo from "../../assets/google_logo.png";
import { useAppDispatch } from "../../redux/hooks";
import { googleSignUp } from "../../redux/slices/user/userSlice";
import { toast } from "react-toastify";

const GoogleSignUpButton = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleGoogleSignUp = async () => {
   try {
    await dispatch(googleSignUp()).unwrap()
    navigate("/home");
   } catch(error: any){
    toast.error(error?.message  || "Google Signup failed. Please try again.");
   }
  };
  return (
    <div className="mt-1">
      <button
        onClick={handleGoogleSignUp}
        className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg p-2 text-sm font-medium text-green-700 hover:bg-gray-50 cursor-pointer"
      >
        Sign up with
        <img
          src={googleLogo}
          alt="Google Logo"
          className="w-12 h-5 ml-2 mt-1"
        />
      </button>
    </div>
  );
};

export default GoogleSignUpButton;
