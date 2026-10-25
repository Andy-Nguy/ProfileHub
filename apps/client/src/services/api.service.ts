import {
  getStoredAuthSession,
  setStoredAuthSession,
  removeStoredAuthSession,
} from './auth-session.service';

export class ApiError extends Error {
  response?: {
    data?: any;
    status?: number;
  };
  constructor(message: string, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    const errorMessage = error.response?.data?.message || error.message;
    return Array.isArray(errorMessage)
      ? errorMessage.join(', ')
      : errorMessage || 'Unknown Error';
  }
  return 'Unknown Error';
};

// ── API Configuration ──────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ── Token Refresh Mutex ─────────────────────────────────────────────────────
// One in-flight /auth/refresh for the whole app (interceptor + AuthProvider
// bootstrap + React Strict Mode). Two parallel refreshes rotate the same cookie
// and the loser looks like a logout.
let refreshInFlight: Promise<string> | null = null;
let pendingAccessToken: string | null = null;

export function setPendingAccessToken(token: string | null) {
  pendingAccessToken = token;
}

const MAX_REFRESH_RACE_RETRIES = 3;

function isRefreshRace(data: any): boolean {
  return (
    data?.code === 'REFRESH_RACE' ||
    data?.message?.code === 'REFRESH_RACE'
  );
}

async function doRefreshOnce(retryCount = 0): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (response.status === 409) {
    const data = await response.json().catch(() => ({}));
    if (isRefreshRace(data) && retryCount < MAX_REFRESH_RACE_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return doRefreshOnce(retryCount + 1);
    }
    throw new ApiError(
      (typeof data?.message === 'string' && data.message) || 'Refresh race',
      {
        status: 409,
        data,
      },
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Refresh failed', {
      status: response.status,
      data: errorData,
    });
  }

  const data = await response.json();
  const newToken: string = data.accessToken;

  const existing = getStoredAuthSession();
  if (existing && newToken) {
    setStoredAuthSession({ ...existing, accessToken: newToken });
  } else if (newToken) {
    pendingAccessToken = newToken;
  }

  return newToken;
}

/**
 * Rotate the refresh cookie and return a new access token.
 * Concurrent callers share one request.
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = doRefreshOnce().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

class ApiClient {
  private baseUrl = API_BASE_URL;

  private getAccessToken(): string | null {
    try {
      const session = getStoredAuthSession();
      return session?.accessToken ?? pendingAccessToken;
    } catch {
      return null;
    }
  }

  private getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = { ...customHeaders };
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private buildFetchOptions(method: string, body?: any): RequestInit {
    const customHeaders: Record<string, string> = {};
    const isFormData = body instanceof FormData;

    if (body && !isFormData) {
      customHeaders['Content-Type'] = 'application/json';
    }
    return {
      method,
      headers: this.getHeaders(customHeaders),
      credentials: 'include',
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    };
  }

  async get<T = any>(url: string): Promise<{ data: T }> {
    return this.requestWithRetry<T>(url, 'GET');
  }

  async post<T = any>(url: string, body?: any): Promise<{ data: T }> {
    return this.requestWithRetry<T>(url, 'POST', body);
  }

  async put<T = any>(url: string, body?: any): Promise<{ data: T }> {
    return this.requestWithRetry<T>(url, 'PUT', body);
  }

  async patch<T = any>(url: string, body?: any): Promise<{ data: T }> {
    return this.requestWithRetry<T>(url, 'PATCH', body);
  }

  async delete<T = any>(url: string): Promise<{ data: T }> {
    return this.requestWithRetry<T>(url, 'DELETE');
  }

  /**
   * Core fetch with 401 → refresh → retry.
   * Does not hard-redirect to /login; AuthProvider / ProtectedRoute own that.
   */
  private async requestWithRetry<T>(
    url: string,
    method: string,
    body?: any,
  ): Promise<{ data: T }> {
    const isAuthEndpoint =
      url.includes('/auth/refresh') ||
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/verify-email');

    const makeRequest = () =>
      fetch(`${this.baseUrl}${url}`, this.buildFetchOptions(method, body));

    let response = await makeRequest();

    if (response.status === 401 && !isAuthEndpoint) {
      try {
        await refreshAccessToken();
        response = await makeRequest();
      } catch (err) {
        if (err instanceof ApiError && err.response?.status === 401) {
          removeStoredAuthSession();
        }
        throw err;
      }
    }

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<{ data: T }> {
    let data: any;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      const errorMessage = Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message || response.statusText || 'Request failed';

      throw new ApiError(errorMessage, {
        status: response.status,
        data,
      });
    }

    return { data };
  }
}

export const apiClient = new ApiClient();
