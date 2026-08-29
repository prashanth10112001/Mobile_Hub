// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window === "undefined" ? "http://localhost:8080/api" : "");

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const formattedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${formattedEndpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `API request failed with status ${response.status}`,
    );
  }

  // Handle empty 204 No Content responses safely
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
