import bcrypt from "bcrypt";
import { IUser, IUserDocument } from "../../models/user/interfaces/userInterface"
import { createUser, deleteOtp, findOtpByEmail, findUserByEmail, findUserByEmailGoogleId, saveOtp } from "../../repositories/user/userRepository";
import { generateToken } from "../../utils/authUtils";
import { SignupResponse, LoginRequest, LoginResponse, GoogleLoginReq, GoogleLoginResp } from "../../types/user/authTypes";
import { generateOtp } from "../../utils/otpUtils";
import { sendEmail } from "../../utils/mailerUtils";

export const signupUser = async (userData: IUser): Promise<SignupResponse> => {
  const existingUser = await findUserByEmail(userData.email);
  if(existingUser){
    throw new Error("Email already exists. Please use a different email.");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = userData.password ? await bcrypt.hash(userData.password, salt) : undefined;
  const newUserData: IUser = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashedPassword,
    agreeToTerms: userData.agreeToTerms,
    role: userData.role,
    phone: userData.phone,
    googleId: userData.googleId || "",
    addresses: userData.addresses || []
  };
  const newUser:IUserDocument  = await createUser(newUserData);
  const token = generateToken(newUser._id.toString());
  return { user:newUser,token }
};

export const loginUser = async ({email, password}:LoginRequest): Promise<LoginResponse> => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  const isPasswordValid = user.password ? await bcrypt.compare(password, user.password) : false;
  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }
  const token = generateToken(user._id.toString());
  return { user, token };
};

export const sendOtpService = async (email: string) => {
  const otp = generateOtp(); 

  console.log(`Generated OTP for ${email}:`, otp);

  await saveOtp(email, otp); 
  const subject = "Your OTP Code";
  const text = `Your OTP code is: ${otp}. It will expire in 5 minutes.`;
  await sendEmail(email, subject, text);
  
  return { message: "OTP sent successfully", otp };
};
export const verifyOtpService = async (email: string, otp: string): Promise<boolean> => {
  const storedOtp = await findOtpByEmail(email);

  if (!storedOtp || storedOtp.otp !== otp) {
    return false; 
  }
  const createdAt = storedOtp?.createdAt;

  if (!createdAt) {
    throw new Error("OTP creation date is missing.");
  }
  const otpAge = (new Date().getTime() - new Date(createdAt).getTime()) / 1000;

  if (otpAge > 300) { // 300 seconds = 5 minutes expiry
    return false; 
  }

  await deleteOtp(email); 

  return true; 
};
export const resetPasswordService = async (email: string, newPassword: string):Promise<void> => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
}
export const googleSignUpService = async (email: string, displayName: string, uid: string):Promise<{ user: IUserDocument; token: string }> => {
  let user = await findUserByEmail(email);
  if (user) {
    const token = generateToken(user._id.toString());
    return { user, token };
  }
  const newUserData: IUser = {
    firstName: displayName.split(" ")[0] || "", 
    lastName: displayName.split(" ")[1] || "", 
    email,
    password: undefined,
    agreeToTerms: true, 
    role: "user",
    phone: undefined,
    googleId: uid, 
    addresses: []
  };
  const newUser: IUserDocument = await createUser(newUserData);
  const token = generateToken(newUser._id.toString());

  return { user: newUser, token };

}
export const googleLoginService = async ({email, googleId, token}:GoogleLoginReq): Promise<GoogleLoginResp> => {
  let user = await findUserByEmailGoogleId(email,googleId);
  console.log("user",user);
  if (!user) {
    throw new Error("User could not be created or found");
  }
  const authToken = generateToken(user._id.toString()); 

  return { user, token: authToken };
}