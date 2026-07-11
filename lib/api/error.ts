import { AxiosError } from "axios";

// ─── Normalised error shape ────────────────────────────────────────────────
// Every error that leaves the API layer will have this consistent structure,
// regardless of whether it came from the network, Axios, or plain JS.

export interface NormalisedError {
  /** Human-readable message safe to display in UI. */
  message: string;
  /** HTTP status code, or null for network/client errors. */
  status: number | null;
  /** Machine-readable error code for programmatic handling. */
  code: string;
}

// ─── ApiError class ────────────────────────────────────────────────────────
// A typed subclass of Error so callers can do:
//   catch (err) { if (err instanceof ApiError) { ... } }

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;

  constructor({ message, status, code }: NormalisedError) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;

    // Ensure instanceof works correctly after TypeScript compilation.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── normaliseError ────────────────────────────────────────────────────────
// Converts any thrown value into a typed ApiError.
// Used by both interceptors so error shape is guaranteed at every layer.

export function normaliseError(error: unknown): ApiError {
  // Already normalised — pass through without wrapping twice.
  if (error instanceof ApiError) return error;

  // Axios network / HTTP error.
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null;
    const data = error.response?.data;

    // Try to pull a message from the backend response body.
    // Common shapes: { message: "..." } | { error: "..." } | plain string.
    const responseMessage =
      typeof data === "object" && data !== null
        ? (data as Record<string, unknown>).message ??
          (data as Record<string, unknown>).error
        : typeof data === "string"
        ? data
        : null;

    const message =
      (typeof responseMessage === "string" ? responseMessage : null) ??
      error.message ??
      "An unexpected error occurred.";

    // Try to pull a machine-readable code from the response body.
    const responseCode =
      typeof data === "object" && data !== null
        ? (data as Record<string, unknown>).code
        : null;

    const code = String(
      responseCode ?? error.code ?? statusToCode(status)
    );

    return new ApiError({ message, status, code });
  }

  // Plain JS Error (e.g. thrown manually in a service function).
  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      status: null,
      code: "CLIENT_ERROR",
    });
  }

  // Completely unknown value (string, number, object, etc.)
  return new ApiError({
    message: "An unexpected error occurred.",
    status: null,
    code: "UNKNOWN_ERROR",
  });
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Maps common HTTP status codes to readable codes when the backend doesn't
 *  include a `code` field in its error response body. */
function statusToCode(status: number | null): string {
  const map: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "RATE_LIMITED",
    500: "SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
  };
  return status !== null ? (map[status] ?? "HTTP_ERROR") : "NETWORK_ERROR";
}
