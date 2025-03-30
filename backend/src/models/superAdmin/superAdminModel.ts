import { model, Schema } from "mongoose";
import { ISuperAdminDocument } from "./interfaces/superAdminInterface";

const superAdminSchema = new Schema<ISuperAdminDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["user", "driver", "superadmin", "wasteplant"], 
        default: "superadmin" 
    },
    createdAt: { type: Date, default: Date.now, expires: 300 }, 
});

export const SuperAdminModel = model<ISuperAdminDocument>("SuperAdmin", superAdminSchema);
