import z from "zod";

/**
 * Returns a short, clear, one-line error message for users.
 * All error messages are plain, non-technical, and easy to understand.
 */
const GENERIC_CLIENT_ERROR = "Something went wrong. Please try again.";

function makeUserFriendly(msg: string): string {
  const map: { [key: string]: string } = {
    "Validation failed": "Check your input and try again.",
    "Authentication required": "Please log in.",
    "Access denied": "You can't do this.",
    "Resource not found": "Not found.",
    "Invalid request": "Check your input.",
    "Password is required": "Password is required.",
    "User ID is required": "User info missing.",
    "Login failed": "Email or password is incorrect.",
    "Signup failed": "Signup failed. Try again.",
    "Delete failed": "Delete failed. Try again.",
    "Invalid token": "Please log in again.",
    "Session expired": "Session expired. Log in again.",
    "Invalid credentials": "Email or password is incorrect.",
    "No User Found, Please Signup First": "No account found. Please sign up.",
    "Incorrect Password": "Password is incorrect.",
    "Unauthorized Request": "Not authorized.",
    "Invalid refresh token": "Session expired. Log in again.",
    "Duplicate entry": "Already exists.",
    "Email already exists": "Email already registered.",
    "Username already taken": "Username taken.",
    "Invalid data type": "Check your input.",
    "Invalid input": "Check your input.",
    "URL ID is required": "URL info missing.",
    "URL not found": "Link not found.",
    "URL alias is already taken": "Short link taken.",
    "Invalid short URL alias": "Enter a valid short link.",
    "Invalid short URL ID": "Enter a valid link.",
    "Failed to create short URL": "Couldn't create link. Try again.",
    "Failed to update short URL": "Couldn't update link. Try again.",
    "Failed to delete short URL": "Couldn't delete link. Try again.",
    "Failed to fetch short URL": "Couldn't load link. Try again.",
    "Internal server error": GENERIC_CLIENT_ERROR,
    "Server error": GENERIC_CLIENT_ERROR,
    "Something went wrong": GENERIC_CLIENT_ERROR,
  };

  if (msg in map) return map[msg];

  if (
    msg.toLowerCase().includes("validation") ||
    msg.toLowerCase().includes("server") ||
    msg.toLowerCase().includes("error") ||
    msg.toLowerCase().includes("exception") ||
    msg.toLowerCase().includes("failed")
  ) {
    return GENERIC_CLIENT_ERROR;
  }

  return msg;
}

export const errorHandler = (err: unknown): string => {
  if (err instanceof Error) {
    return makeUserFriendly(err.message);
  }

  if (typeof err === "string") {
    return makeUserFriendly(err);
  }

  if (typeof err === "object" && err !== null) {
    // Try to infer Axios-like error shape, but use unknown instead of any
    const maybeAxios = err as { response?: { data?: unknown } };
    if (
      maybeAxios.response &&
      typeof maybeAxios.response === "object" &&
      maybeAxios.response.data
    ) {
      const data = maybeAxios.response.data as Record<string, unknown>;
      if (
        typeof data.statusCode === "number" &&
        data.statusCode >= 400 &&
        data.statusCode < 500
      ) {
        if (typeof data.message === "string" && data.message) {
          return makeUserFriendly(data.message);
        }
        if (typeof data.error === "string" && data.error) {
          return makeUserFriendly(data.error);
        }
        if (Array.isArray(data.error) && data.error.length > 0) {
          return makeUserFriendly(String(data.error[0]));
        }
      }
    }

    // Check for direct error object with statusCode/message/error
    if (
      "statusCode" in err &&
      typeof (err as { statusCode?: unknown }).statusCode === "number" &&
      (err as { statusCode: number }).statusCode >= 400 &&
      (err as { statusCode: number }).statusCode < 500
    ) {
      const e = err as { message?: unknown; error?: unknown };
      if (typeof e.message === "string" && e.message) {
        return makeUserFriendly(e.message);
      }
      if (typeof e.error === "string" && e.error) {
        return makeUserFriendly(e.error);
      }
      if (Array.isArray(e.error) && e.error.length > 0) {
        return makeUserFriendly(String(e.error[0]));
      }
    }

    if (
      "message" in err &&
      typeof (err as { message?: unknown }).message === "string"
    ) {
      return makeUserFriendly((err as { message: string }).message);
    }
  }

  return GENERIC_CLIENT_ERROR;
};

export const handleZodErros = (err: unknown): { [key: string]: string } => {
  const fieldErrors: { [key: string]: string } = {};
  if (err instanceof z.ZodError) {
    for (const error of err.issues) {
      const key =
        typeof error.path[0] === "string"
          ? error.path[0]
          : String(error.path[0]);
      fieldErrors[key] = error.message;
    }
  }
  return fieldErrors;
};
