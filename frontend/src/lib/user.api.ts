import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";

/**
 * Handles user signup.
 * Throws a user-friendly error message on failure.
 */
export const handleSignup = async ({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) => {
  if (!email || !password || !fullName) {
    throw new Error("Please provide email, full name, and password.");
  }

  try {
    const res = await axios.post("/api/signup", { email, password, fullName });
    return res.data;
  } catch (err: unknown) {
    // Pass the whole error to errorHandler, not err.data
    const errorMsg = errorHandler(err);

    throw new Error(errorMsg);
  }
};

/**
 * Handles user login.
 * Throws a user-friendly error message on failure.
 */
export const handleLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!email || !password) {
    throw new Error("Please provide both email and password.");
  }

  try {
    const res = await axios.post("/api/login", { email, password });
    return res.data;
  } catch (err) {
    const errorMsg = errorHandler(err);
    throw new Error(errorMsg);
  }
};

/**
 * Handles user deletion.
 * Throws a user-friendly error message on failure.
 */
export const handleDeleteUser = async (userId: string) => {
  if (!userId) {
    throw new Error("User information is missing.");
  }

  try {
    const res = await axios.delete(`/api/delete/${userId}`);
    return res.data;
  } catch (err) {
    const errorMsg = errorHandler(err);
    throw new Error(errorMsg);
  }
};

/**
 * Handles user logout.
 * Throws a user-friendly error message on failure.
 * @param userId - The ID of the user to log out.
 */
export const handleLogout = async (userId: string) => {
  if (!userId) {
    throw new Error("User information is missing.");
  }
  try {
    const res = await axios.post(`/api/logout/${userId}`);
    return res.data;
  } catch (err) {
    const errorMsg = errorHandler(err);
    throw new Error(errorMsg);
  }
};
