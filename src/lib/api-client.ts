/**
 * API Client with Automatic Token Refresh
 * Based on the Frontend Authentication Guide specifications
 */

import { tokenManager } from './token-manager';
import { handleApiError, getErrorMessage } from './error-handler';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000; // 30 seconds
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Make HTTP request with automatic token refresh
   */
  public async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = tokenManager.getAccessToken();

    const requestConfig: RequestInit = {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
    };

    try {
      let response = await this.fetchWithTimeout(url, requestConfig);

      // Handle token expiration
      if (response.status === 401 && token) {
        const newToken = await tokenManager.refreshAccessToken();
        if (newToken) {
          // Retry request with new token
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await this.fetchWithTimeout(url, requestConfig);
        } else {
          // Refresh failed, redirect to login
          this.redirectToLogin();
          throw new Error('Authentication failed');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data,
          },
        };
      }

      return data;
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * GET request
   */
  public async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  public async post<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  public async put<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number = this.timeout
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Redirect to login page
   */
  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Upload file with progress
   */
  public async uploadFile<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void,
    config: RequestConfig = {}
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const token = tokenManager.getAccessToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject({
              response: {
                status: xhr.status,
                data: errorResponse,
              },
            });
          } catch (error) {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Request timeout'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      xhr.timeout = this.timeout;

      // Set headers
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Set custom headers
      Object.entries(config.headers || {}).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(formData);
    });
  }

  /**
   * Download file
   */
  public async downloadFile(
    endpoint: string,
    filename?: string,
    config: RequestConfig = {}
  ): Promise<void> {
    const token = tokenManager.getAccessToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...config,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Set default headers
   */
  public setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get default headers
   */
  public getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }

  /**
   * Set base URL
   */
  public setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Get base URL
   */
  public getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export default instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api',
  timeout: 30000,
});

// Export class for custom instances
export default ApiClient;
