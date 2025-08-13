import { AxiosError } from "axios";

export function getAxiosErrorMessage(error: unknown): string {
  // AxiosError check
  if (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError
  ) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Something went wrong. Please try again."
    );
  }

  // Native JS Error
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }

  // Custom object with `message` or `error`
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof (error as Record<string, unknown>).message === "string") {
      return (error as { message: string }).message;
    }
    if ("error" in error && typeof (error as Record<string, unknown>).error === "string") {
      return (error as { error: string }).error;
    }
  }

  return "Something went wrong. Please try again.";
}

