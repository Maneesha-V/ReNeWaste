import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AxiosError } from "axios";
import { ApiError } from "../utils/ApiError";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void  => {
  if (isAxiosError(err)) {
    res.status(502).json({ message: "External API error", detail: err.message });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "An unknown error occurred" });
};

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}
