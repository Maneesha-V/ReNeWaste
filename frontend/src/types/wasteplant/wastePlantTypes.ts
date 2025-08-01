export type WastePlant = {
  _id?: string;
  plantName: string;
  ownerName: string;
  location: string;
  district: string;
  taluk: string;
  pincode: string;
  state: string;
  contactInfo: string;
  contactNo: string;
  email: string;
  licenseNumber: string;
  capacity: number;
  services: string[];
  status: "Pending" | "Active" | "Inactive" | "Rejected";
  licenseDocumentPath?: string;
  cloudinaryPublicId?: string;
  subscriptionPlan?: string;
  password: string;
  role: "wasteplant";
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type updateProfilePayload = {
  plantName: string;
  ownerName: string;
  location: string;
  taluk: string;
  pincode: string;
  contactInfo: string;
  contactNo: string;
  email: string;
  capacity: number;
  licenseDocumentPath?: string;
  cloudinaryPublicId?: string;
}
export type PostOffice = {
  name: string;
  taluk: string;
}
