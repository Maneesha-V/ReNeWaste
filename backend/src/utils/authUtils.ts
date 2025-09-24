import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
type GenTokenPayload = {
  userId: string;
  role: string;
};
export const generateToken = ({ userId, role }: GenTokenPayload) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "15min" });
};
export const generateRefreshToken = ({ userId, role }: GenTokenPayload) => {
  return jwt.sign({ userId, role }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
