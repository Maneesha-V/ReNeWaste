import { findUserById, updateUserProfileById } from "../../repositories/user/userRepository";

export const getUserProfile = async (userId: string) => {
    const user = await findUserById(userId)
    if (!user) throw new Error("User not found");
    return user;
  };

export const updateUserProfile = async (userId: string,updatedData: any) => {
  try {
    const user = await findUserById(userId)
    if (!user) throw new Error("User not found");

    return await updateUserProfileById(userId, updatedData);
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
}