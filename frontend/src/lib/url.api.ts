import axios from "axios";
import { UrlType } from "@/types/url.type";

// Use the same API base as in next.config.js rewrites
const API_BASE = "/api/urls";

// All requests to /api/* will be proxied to the backend by Next.js rewrites

export async function getUrls(userId?: string) {
  try {
    const url = userId
      ? `${API_BASE}?user=${encodeURIComponent(userId)}`
      : API_BASE;
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch URLs");
  }
}

export async function getUrlById(id: string, userId: string) {
  try {
    const url = `${API_BASE}?user=${encodeURIComponent(userId)}&id=${encodeURIComponent(id)}`;
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch URL");
  }
}

export async function createUrl(data: {
  originalUrl: string;
  alias?: string;
  userId: string;
  createdAt?: string;
}) {
  try {
    const { userId, ...rest } = data;
    const url = `${API_BASE}?user=${encodeURIComponent(userId)}`;
    const res = await axios.post(url, rest, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to create URL");
  }
}

export async function updateUrl(
  id: string,
  userId: string,
  data: Partial<Pick<UrlType, "originalUrl" | "alias">>,
) {
  try {
    const url = `${API_BASE}?user=${encodeURIComponent(userId)}&id=${encodeURIComponent(id)}`;
    const res = await axios.put(url, data, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update URL");
  }
}

export async function deleteUrl(id: string, userId: string) {
  try {
    const url = `${API_BASE}?user=${encodeURIComponent(userId)}&id=${encodeURIComponent(id)}`;
    const res = await axios.delete(url, { withCredentials: true });
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to delete URL");
  }
}
