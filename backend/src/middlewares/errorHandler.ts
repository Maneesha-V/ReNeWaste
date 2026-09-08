import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AxiosError } from "axios";
import axios from "axios";
import { ApiError } from "../utils/ApiError";
import { STATUS_CODES } from "../utils/constantUtils";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (axios.isAxiosError(err)) {
    res
      .status(STATUS_CODES.BAD_GATEWAY)
      .json({ message: "External API error", detail: err.message });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    console.error("Unexpected error:", err);
    res.status(STATUS_CODES.SERVER_ERROR).json({ message: err.message });
    return;
  }

  res.status(STATUS_CODES.SERVER_ERROR).json({ message: "An unknown error occurred" });
};

