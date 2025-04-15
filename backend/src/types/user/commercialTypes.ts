import { Request } from "express";

export interface CommercialRequest extends Request {
    user?: { id: string };
  }