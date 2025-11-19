const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type ApiOptions = RequestInit & {
  token?: string | null;
  auth?: boolean;
};

const buildHeaders = (options: ApiOptions) => {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if ((options.auth ?? true) && options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }
  return headers;
};

export const apiFetch = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch (error) {
      // ignore parsing failure
    }
    const message =
      (errorBody as { error?: string })?.error || response.statusText || "Request failed";
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export { API_URL };
