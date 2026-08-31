import { useState } from "react";
import Signup from "../../pages/user/Signup";
import OtpVerification from "../../pages/user/OtpVerification";
import { SignupRequest } from "../../types/user/userTypes";


const OtpVerificationWrapper = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formData, setFormData] = useState<SignupRequest | null>(null); 

  return (
    <>
      {!isOtpSent ? (
        <Signup
          onSignupSuccess={(data) => {
            setIsOtpSent(true);
            setFormData(data);
          }}
        />
      ) : (      
        formData && <OtpVerification formData={formData} />
      )}
    </>
  );
};

export default OtpVerificationWrapper;
