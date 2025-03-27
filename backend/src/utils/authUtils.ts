import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, {expiresIn: "1h"})
}