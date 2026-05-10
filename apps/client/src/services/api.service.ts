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

  async get<T = any>(url: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`);
    return this.handleResponse<T>(response);
  }

  async post<T = any>(url: string, body?: any): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T = any>(url: string, body?: any): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T = any>(url: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
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
      throw new ApiError(data?.message || response.statusText || 'Request failed', {
        status: response.status,
        data,
      });
    }

    return { data };
  }
}

export const apiClient = new ApiClient();
