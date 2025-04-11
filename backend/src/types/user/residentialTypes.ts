import { Request } from "express";

export interface ResidentialRequest extends Request {
    user?: { id: string };
  }