"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static mapAddressDTO(doc) {
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
    static mapUserDTO(doc) {
        return {
            _id: doc._id.toString(),
            firstName: doc.firstName,
            lastName: doc.lastName,
            email: doc.email,
            agreeToTerms: doc.agreeToTerms,
            role: doc.role,
            phone: doc.phone,
            googleId: doc.googleId || null,
            addresses: doc.addresses.map((addressDoc) => UserMapper.mapAddressDTO(addressDoc)),
            wasteplantId: doc.wasteplantId?.toString() ?? "",
            isBlocked: doc.isBlocked,
        };
    }
    static mapUserLoginDTO(doc) {
        return {
            _id: doc._id?.toString() ?? "",
            role: doc.role ?? "user",
        };
    }
    static mapUsersDTO(docs) {
        return docs.map((doc) => this.mapUserDTO(doc));
    }
}
exports.UserMapper = UserMapper;
