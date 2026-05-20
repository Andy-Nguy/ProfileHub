import { getStoredAuthSession, setStoredAuthSession, removeStoredAuthSession } from './auth-session.service';

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

// ── Token Refresh Mutex ─────────────────────────────────────────────────────
// Prevents multiple concurrent 401s from each triggering a separate /auth/refresh call.
// The first one calls refresh; subsequent ones queue up and reuse the same promise.
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeToTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function notifyRefreshSubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function doRefresh(): Promise<string> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include', // send httpOnly refresh-token cookie
  });

  if (!response.ok) {
    throw new Error('Refresh failed');
  }

  const data = await response.json();
  const newToken: string = data.accessToken;

  // Persist new token while keeping existing user data
  const existing = getStoredAuthSession();
  if (existing && newToken) {
    setStoredAuthSession({ ...existing, accessToken: newToken });
  }

  return newToken;
}

// ── ApiClient ───────────────────────────────────────────────────────────────
class ApiClient {
  private baseUrl = '/api';

  // ── Token Management ──────────────────────────────────────────────────

  private getAccessToken(): string | null {
    try {
      const session = getStoredAuthSession();
      return session?.accessToken ?? null;
    } catch {
      return null;
    }
  }

  // ── Request Headers ───────────────────────────────────────────────────

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

  // ── Public HTTP Methods ───────────────────────────────────────────────

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
   * Core fetch logic with automatic 401 → refresh → retry.
   *
   * Flow:
   *  1. Make the request.
   *  2. If response is 401 AND this is not the refresh/login endpoint:
   *     a. If a refresh is already in-flight, queue this request behind it.
   *     b. Otherwise start a refresh, notify all waiting requests on success,
   *        clear the session on failure, and redirect to /login.
   *  3. Retry the original request once with the new token.
   */
  private async requestWithRetry<T>(
    url: string,
    method: string,
    body?: any,
  ): Promise<{ data: T }> {
    const isAuthEndpoint = url.includes('/auth/refresh') || url.includes('/auth/login');

    const makeRequest = () =>
      fetch(`${this.baseUrl}${url}`, this.buildFetchOptions(method, body));

    let response = await makeRequest();

    if (response.status === 401 && !isAuthEndpoint) {
      if (isRefreshing) {
        // Wait for the ongoing refresh, then retry with the new token
        await new Promise<string>((resolve, reject) => {
          subscribeToTokenRefresh((token) => {
            if (token) resolve(token);
            else reject(new Error('Refresh failed'));
          });
        });
        response = await makeRequest();
      } else {
        isRefreshing = true;
        try {
          const newToken = await doRefresh();
          notifyRefreshSubscribers(newToken);
          response = await makeRequest(); // retry with new token in localStorage
        } catch {
          notifyRefreshSubscribers(''); // unblock waiting requests
          removeStoredAuthSession();
          window.location.href = '/login';
          throw new ApiError('Session expired. Redirecting to login.');
        } finally {
          isRefreshing = false;
        }
      }
    }

    return this.handleResponse<T>(response);
  }

  // ── Response Handler ──────────────────────────────────────────────────

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
