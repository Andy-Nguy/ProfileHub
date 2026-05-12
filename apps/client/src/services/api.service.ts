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

class ApiClient {
  private baseUrl = '/api';

  private getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = { ...customHeaders };
    try {
      const rawSession = window.localStorage.getItem('profilehub.auth');
      if (rawSession) {
        const session = JSON.parse(rawSession);
        if (session.accessToken) {
          headers['Authorization'] = `Bearer ${session.accessToken}`;
        }
      }
    } catch {
      // Ignore
    }
    return headers;
  }

  async get<T = any>(url: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T = any>(url: string, body?: any): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: this.getHeaders({
        'Content-Type': 'application/json',
      }),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T = any>(url: string, body?: any): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: this.getHeaders({
        'Content-Type': 'application/json',
      }),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T = any>(url: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<{ data: T }> {
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = {}; // Ignore empty body
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
