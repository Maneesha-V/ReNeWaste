import { useState } from "react";
import Signup from "../../pages/user/Signup";
import OtpVerification from "../../pages/user/OtpVerification";


const OtpVerificationWrapper = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formData, setFormData] = useState<any>(null); 

  return (
    <>
      {!isOtpSent ? (
        <Signup
          onSignupSuccess={(data: any) => {
            setIsOtpSent(true);
            setFormData(data);
          }}
        />
      ) : (
        <OtpVerification formData={formData} />
      )}
    </>
  );
};

export default OtpVerificationWrapper;
