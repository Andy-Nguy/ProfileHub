/**
 * ApiError — typed error thrown by ApiClient for non-2xx responses.
 */
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

const AUTH_STORAGE_KEY = 'profilehub.auth';
const AUTH_SESSION_EVENT = 'profilehub-auth-changed';

class ApiClient {
  private baseUrl = '/api';

  /**
   * Tracks whether a token refresh is currently in-flight.
   * If true, subsequent 401s queue up rather than each firing their own refresh.
   */
  private isRefreshing = false;

  /**
   * Queue of resolve/reject callbacks for requests waiting on a refresh.
   */
  private pendingRefreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  // ── Token Management ──────────────────────────────────────────────────

  private getAccessToken(): string | null {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      return session?.accessToken ?? null;
    } catch {
      return null;
    }
  }

  private persistNewAccessToken(accessToken: string): void {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      const session = raw ? JSON.parse(raw) : {};
      session.accessToken = accessToken;
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      // Notify all useAuthSession subscribers across tabs
      window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
    } catch {
      // Ignore storage errors
    }
  }

  private clearSession(): void {
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
    } catch {
      // Ignore
    }
  }

  // ── Request Headers ───────────────────────────────────────────────────

  private getHeaders(
    token: string | null,
    customHeaders: Record<string, string> = {},
  ): HeadersInit {
    const headers: Record<string, string> = { ...customHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // ── Token Refresh Logic ───────────────────────────────────────────────

  /**
   * Attempts to refresh the access token using the httpOnly refresh cookie.
   *
   * If a refresh is already in-flight, new callers queue up and receive
   * the same result — preventing a thundering-herd of concurrent refresh calls.
   *
   * On failure, the session is cleared and the user is redirected to /login.
   */
  private async refreshAccessToken(): Promise<string> {
    // If a refresh is already running, queue this caller to wait for it
    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.pendingRefreshQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Required to send the httpOnly refresh cookie
      });

      if (!res.ok) {
        throw new ApiError('Session expired. Please log in again.', {
          status: res.status,
        });
      }

      const data = await res.json();
      const newAccessToken: string = data.accessToken;

      // Persist the new token so subsequent requests pick it up
      this.persistNewAccessToken(newAccessToken);

      // Resolve all queued callers with the new token
      this.pendingRefreshQueue.forEach(({ resolve }) => resolve(newAccessToken));
      this.pendingRefreshQueue = [];

      return newAccessToken;
    } catch (err) {
      // Refresh failed — reject all queued callers and clear the session
      this.pendingRefreshQueue.forEach(({ reject }) => reject(err));
      this.pendingRefreshQueue = [];
      this.clearSession();

      // Redirect to login (only if not already there)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }

      throw err;
    } finally {
      this.isRefreshing = false;
    }
  }

  // ── Core Request Method ───────────────────────────────────────────────

  /**
   * Executes a fetch request. On 401, attempts one silent token refresh
   * and retries the original request exactly once with the new access token.
   */
  private async request<T>(
    url: string,
    init: RequestInit,
  ): Promise<{ data: T }> {
    const token = this.getAccessToken();

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...init,
      credentials: 'include', // Always send cookies (needed for refresh/logout)
      headers: this.getHeaders(token, init.headers as Record<string, string>),
    });

    // 401 → try to refresh the token and retry the original request once.
    // refreshAccessToken() handles the queue: if a refresh is already in-flight,
    // this call will wait for it rather than firing a second one.
    if (response.status === 401) {
      const newToken = await this.refreshAccessToken();

      // Retry with the new token. If this also returns 401, handleResponse
      // will throw an ApiError — no infinite loop.
      const retryResponse = await fetch(`${this.baseUrl}${url}`, {
        ...init,
        credentials: 'include',
        headers: this.getHeaders(
          newToken,
          init.headers as Record<string, string>,
        ),
      });

      return this.handleResponse<T>(retryResponse);
    }

    return this.handleResponse<T>(response);
  }

  // ── Public HTTP Methods ───────────────────────────────────────────────

  async get<T = any>(url: string): Promise<{ data: T }> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T = any>(url: string, body?: any): Promise<{ data: T }> {
    return this.request<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(url: string, body?: any): Promise<{ data: T }> {
    return this.request<T>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T = any>(url: string, body?: any): Promise<{ data: T }> {
    return this.request<T>(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(url: string): Promise<{ data: T }> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // ── Response Handler ──────────────────────────────────────────────────

  private async handleResponse<T>(response: Response): Promise<{ data: T }> {
    let data;
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
