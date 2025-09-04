import { AddressDTO, UserDTO, UserLoginDTO, UserProfileRespDTO } from "../dtos/user/userDTO";
import { IAddressDocument } from "../models/user/interfaces/addressInterface";
import { IUserDocument } from "../models/user/interfaces/userInterface";

export class UserMapper {
  static mapAddressDTO(doc: IAddressDocument): AddressDTO {
    return {
      _id: doc._id.toString(),
      addressLine1: doc.addressLine1,
      addressLine2: doc.addressLine2,
      taluk: doc.taluk,
      location: doc.location,
      state: doc.state,
      pincode: doc.pincode,
      district: doc.district,
      latitude: doc.latitude,
      longitude: doc.longitude,
    };
  }
  static mapUserDTO(doc: IUserDocument): UserDTO {
    return {
      _id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      agreeToTerms: doc.agreeToTerms,
      role: doc.role,
      phone: doc.phone,
      googleId: doc.googleId || null,
      addresses: doc.addresses.map((addressDoc) =>
        UserMapper.mapAddressDTO(addressDoc)
      ),
      wasteplantId: doc.wasteplantId?.toString() ?? "",
      isBlocked: doc.isBlocked,
    };
  }
  static mapUserLoginDTO(doc: Partial<IUserDocument>): UserLoginDTO {
    return {
      _id: doc._id?.toString() ?? "",
      role: doc.role ?? "user",
    };
  }
  static mapUsersDTO(docs: IUserDocument[]): UserDTO[] {
    return docs.map((doc) => this.mapUserDTO(doc));
  }
}
