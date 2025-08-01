import { Response } from "express";
import { AxiosError } from "axios";

export function handleControllerError(error: unknown, res: Response, status: number): void {
  if (isAxiosError(error)) {
    console.error("Axios Error:", error.message);
    res.status(status).json({ message: error.message });
  } else if (error instanceof Error) {
    console.error("Unhandled Error:", error.message);
    res.status(status).json({ message: error.message });
  } else {
    console.error("Unknown Error:", error);
    res.status(status).json({ message: "An unknown error occurred" });
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}
