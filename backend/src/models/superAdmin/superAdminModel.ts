import { model, Schema } from "mongoose";
import { ISuperAdminDocument } from "./interfaces/superAdminInterface";

const superAdminSchema = new Schema<ISuperAdminDocument>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["user", "driver", "superadmin", "wasteplant"], 
        default: "superadmin" 
    },
    createdAt: { type: Date, default: Date.now }, 
});

export const SuperAdminModel = model<ISuperAdminDocument>("SuperAdmin", superAdminSchema);
