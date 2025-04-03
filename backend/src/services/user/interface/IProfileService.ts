export interface IProfileService {
    getUserProfile(userId: string): Promise<any>;
    updateUserProfile(userId: string, updatedData: any): Promise<any>;
  }
  