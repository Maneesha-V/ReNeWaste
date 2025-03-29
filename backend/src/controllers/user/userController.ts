import { Request, Response } from "express";
import { googleSignUpService, loginUser, resetPasswordService, sendOtpService, signupUser, verifyOtpService } from "../../services/user/authService";
import { IUser } from "../../models/user/interfaces/userInterface"
import { UserModel } from "../../models/user/userModel"; 
import { findUserByEmail } from "../../repositories/user/userRepository"


export const signup = async (req: Request, res: Response): Promise<void> => {
  console.log("body",req.body);
  try {
    const userData: IUser = req.body;
    const {user, token} = await signupUser(userData);
    console.log("user",user);
    
    res.status(201).json({user, token});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    console.log("err",error);
  }
};
export const login = async (req: Request, res: Response):Promise<void> => {
  try {
    console.log("body",req.body);
    const { email, password } = req.body
    const { user, token } = await loginUser({email, password});
    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
export const logout = async (req: Request, res: Response):Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ error: "Logout failed. Please try again." });
  }
}
export const sendOtp = async(req: Request, res: Response):Promise<void> => {
  try {
    console.log("otp-body",req.body);
    const { email } = req.body;
      const user = await findUserByEmail(email)
      console.log("user",user);
      
      if (!user) {
        res.status(400).json({ error: "User not found. Please register first." });
        return;
      }
    const otpResponse = await sendOtpService(email);

    res.status(200).json(otpResponse);
  } catch (error: any){
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: error});
  }
}
export const verifyOtp = async(req: Request, res: Response):Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required" });
      return;
    }

    const isValid = await verifyOtpService(email, otp);

    if (!isValid) {
      res.status(400).json({ error: "Invalid or expired OTP" });
      return;
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Something went wrong!" });
  } 
}
export const resetPassword = async (req: Request, res: Response):Promise<void> => {
try{
  console.log("body", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }
  await resetPasswordService(email,password)
  res.status(200).json({ message: "Password reset successfully" });
} catch(error: any){
  console.error(error);
  res.status(500).json({ message: "Server error" });
}
}
export const googleSignUp = async (req: Request, res: Response):Promise<void> => {
try {
  console.log("body",req.body);
  const { email, displayName, uid } = req.body;
  if (!email || !uid) {
    res.status(400).json({ message: "Email and UID are required" });
    return;
  }
  const {user, token} = await googleSignUpService(email, displayName, uid)
  res.status(200).json({ message: "User signed in successfully", user, token });
} catch(error: any){
  console.error("Google Sign-Up Error:", error);
  res.status(500).json({ message: error.message || "Internal Server Error" });
}
}