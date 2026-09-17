export interface FetchOptions extends RequestInit {
  token?: string;
  queryParams?: Record<string, string | number | boolean>;
  retries?: number;
  retryDelay?: number; // in milliseconds
  retryOnStatuses?: number[];
  timeout?: number; // in milliseconds, default 8000ms
  revalidate?: number; // Next.js ISR revalidation in seconds
  tags?: string[]; // Next.js Cache tags
}

export interface FetchResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    status: number;
    message: string;
  };
}

export async function customFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const {
    token,
    queryParams,
    retries = 2,
    retryDelay = 800,
    retryOnStatuses = [500, 502, 503, 504, 408],
    timeout = 8000,
    revalidate,
    tags,
    ...initOptions
  } = options;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

  // Construct URL with query params
  let url = `${backendUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  if (queryParams) {
    const urlObj = new URL(url);
    Object.entries(queryParams).forEach(([key, val]) => {
      urlObj.searchParams.set(key, String(val));
    });
    url = urlObj.toString();
  }

  // Set headers
  const headers = new Headers(initOptions.headers);
  if (!headers.has("Content-Type") && !(initOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Build Next.js caching configuration
  const nextConfig: { revalidate?: number; tags?: string[] } = {
    ...(initOptions as any)?.next,
  };
  if (typeof revalidate === "number") {
    nextConfig.revalidate = revalidate;
  }
  if (Array.isArray(tags)) {
    nextConfig.tags = tags;
  }

  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...initOptions,
        headers,
        signal: controller.signal,
        next: Object.keys(nextConfig).length > 0 ? nextConfig : undefined,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        return {
          success: true,
          message: json.message,
          data: json.data !== undefined ? json.data : json,
        };
      }

      // If status is retryable and attempts remain
      if (attempt < retries && (retryOnStatuses.includes(response.status) || response.status >= 500)) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (_) {}

      return {
        success: false,
        error: {
          status: response.status,
          message: errorMessage,
        },
      };
    } catch (err: any) {
      clearTimeout(timeoutId);

      const isAbortError = err?.name === "AbortError";
      const isTimeout = isAbortError || err?.message?.includes("timeout");

      if (attempt < retries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      return {
        success: false,
        error: {
          status: isTimeout ? 408 : 500,
          message: isTimeout
            ? `Request timed out after ${timeout}ms`
            : err?.message || "Network request failed",
        },
      };
    }
  }

  return {
    success: false,
    error: {
      status: 500,
      message: "Max fetch retries exceeded",
    },
  };
}

/**
 * Server-side slider fetching helper with 1-minute revalidation, 2 retries, 8000ms timeout, and cache tags
 */
export async function getHomeSlidersServer() {
  return customFetch<any[]>("/sliders", {
    revalidate: 60, // 1 minute revalidation
    tags: ["sliders", "home-sliders"],
    timeout: 8000, // 8000ms timeout
    retries: 2, // 2 retries on failure
  });
}
