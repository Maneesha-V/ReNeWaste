import { Request } from "express";

export interface ProfileRequest extends Request {
    user?: { id: string };
  }