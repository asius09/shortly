import axios from "axios";
import { UrlType } from "@/types/url.type";

// Helper to get API base URL (adjust as needed)
const API_BASE = "/api/urls";

// Get all URLs (optionally by userId)
export async function getUrls(userId?: string): Promise<UrlType[]> {
  try {
    let url = API_BASE;
    if (userId) {
      url += `/user=${userId}`;
    }
    const res = await axios.get<UrlType[]>(url);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch URLs");
  }
}

// Get a URL by id (optionally by userId)
export async function getUrlById(
  id: string,
  userId?: string,
): Promise<UrlType> {
  try {
    let url = `${API_BASE}/id=${id}`;
    if (userId) {
      url += `&user=${userId}`;
    }
    const res = await axios.get<UrlType>(url);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch URL");
  }
}

// Create a new shortened URL
export async function createUrl(data: {
  originalUrl: string;
  alias?: string;
  userId: string;
}): Promise<UrlType> {
  try {
    // userId is required for the endpoint
    const { userId, ...rest } = data;
    const res = await axios.post<UrlType>(`${API_BASE}/user=${userId}`, rest);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to create URL");
  }
}

// Update an existing shortened URL
export async function updateUrl(
  id: string,
  userId: string,
  data: Partial<Pick<UrlType, "originalUrl" | "alias">>,
): Promise<UrlType> {
  try {
    const res = await axios.put<UrlType>(
      `${API_BASE}/user=${userId}&id=${id}`,
      data,
    );
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update URL");
  }
}

// Delete a shortened URL
export async function deleteUrl(
  id: string,
  userId: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await axios.delete<{ success: boolean; message?: string }>(
      `${API_BASE}/user=${userId}&id=${id}`,
    );
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to delete URL");
  }
}
