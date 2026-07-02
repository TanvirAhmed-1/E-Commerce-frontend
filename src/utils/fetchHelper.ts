export interface FetchOptions extends RequestInit {
  token?: string;
  queryParams?: Record<string, string | number | boolean>;
  retries?: number;
  retryDelay?: number; // in milliseconds
  retryOnStatuses?: number[];
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
    retryDelay = 1000,
    retryOnStatuses = [500, 502, 503, 504],
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

  const fetchConfig: RequestInit = {
    ...initOptions,
    headers,
  };

  let attempt = 0;
  
  while (true) {
    try {
      const response = await fetch(url, fetchConfig);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: data.message,
          data: data.data,
        };
      }

      // If response is not ok and we have retries left
      if (attempt < retries && (retryOnStatuses.includes(response.status) || response.status >= 500)) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      // No retries left or non-retryable status code
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (_) {
        // Fallback to text or default message if JSON parsing fails
      }

      return {
        success: false,
        error: {
          status: response.status,
          message: errorMessage,
        },
      };
    } catch (err: any) {
      if (attempt < retries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      return {
        success: false,
        error: {
          status: 500,
          message: err.message || "Network request failed",
        },
      };
    }
  }
}
