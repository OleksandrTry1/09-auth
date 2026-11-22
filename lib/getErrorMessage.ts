import { isAxiosError } from "axios";

interface ApiErrorResponse {
  error?: string;
  response?: {
    message?: string;
  };
}

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.response?.message ??
      error.response?.data?.error ??
      error.message
    );
  }

  return "Something went wrong. Please try again.";
};
