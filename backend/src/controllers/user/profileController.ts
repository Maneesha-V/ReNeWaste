import { Request, Response } from "express";
import { getUserProfile, updateUserProfile } from "../../services/user/profileService";
import { CustomRequest } from "../../types/user/profileTypes";

export const getProfile = async (req: CustomRequest, res: Response):Promise<void> => {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }    
      const user = await getUserProfile(userId);
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
export const getEditProfile = async (req: CustomRequest, res: Response):Promise<void> => {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }    
      const user = await getUserProfile(userId);
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
export const updateUserProfileHandler = async (req: CustomRequest, res: Response):Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
     res.status(400).json({ message: "User ID is required" });
     return;
    }
    const updatedData = req.body;

    const updatedUser = await updateUserProfile(userId, updatedData);

    if (!updatedUser) {
     res.status(404).json({ message: "User not found" });
     return;
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
