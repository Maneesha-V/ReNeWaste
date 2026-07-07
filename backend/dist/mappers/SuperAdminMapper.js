"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminMapper = void 0;
class SuperAdminMapper {
    static mapSuperAdminDTO(doc) {
        return {
            _id: doc._id.toString(),
            username: doc.username,
            email: doc.email,
            role: doc.role,
        };
    }
}
exports.SuperAdminMapper = SuperAdminMapper;
