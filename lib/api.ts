import axios, { AxiosError } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ListParams } from "./types";

/** Same-origin client: requests go to /api and are proxied to Express by next.config rewrites. */
export const api = axios.create({ baseURL: "/api", withCredentials: true, timeout: 15_000 });

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    // Session expired mid-use: send the user to log in and come back afterwards.
    const isAuthCall = error.config?.url?.startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthCall && typeof window !== "undefined") {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`/login?next=${next}`);
    }
    return Promise.reject(error);
  },
);

type ApiErrorBody = { error?: { message?: string; details?: { field: string; message: string }[] } };

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error instanceof AxiosError) {
    if (!error.response) return "Can't reach the server. Check your connection.";
    const message = (error.response.data as ApiErrorBody)?.error?.message;
    if (message) return message;
    // A 5xx with no API error body comes from the Next.js proxy itself: the backend is down.
    if (error.response.status >= 500) return "The API server isn't responding. Make sure the backend is running.";
    return fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

/** Shows field-level API validation errors (e.g. duplicate email) next to the right inputs. */
export function applyServerErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  if (!(error instanceof AxiosError)) return false;
  const details = (error.response?.data as ApiErrorBody)?.error?.details;
  if (!details?.length) return false;
  for (const d of details) setError(d.field as Path<T>, { type: "server", message: d.message });
  return true;
}

/** Drops empty values so the URL and the request stay clean. */
export function cleanParams(params: ListParams) {
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
}
