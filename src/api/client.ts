// src/api/client.ts - Generic API Handler Class
import { APIResponse, APIError } from '../types';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

interface APIClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  defaultHeaders: Record<string, string>;
}

export class APIClient {
  private config: APIClientConfig;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: Partial<APIClientConfig> = {}) {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
      timeout: 30000,
      retries: 3,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    };
  }

  /**
   * Generic request method with retry logic and error handling
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries,
      cache = 'no-cache',
    } = config;

    const url = this.buildURL(endpoint);
    const requestId = this.generateRequestId();
    
    // Create abort controller for this request
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

    const requestHeaders = {
      ...this.config.defaultHeaders,
      ...headers,
    };

    // Add CSRF token if available
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      requestHeaders['X-CSRF-Token'] = csrfToken;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: abortController.signal,
      cache,
      credentials: 'same-origin',
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    // Set timeout
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, timeout);

    try {
      let lastError: Error | null = null;

      // Retry logic
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          this.logRequest(method, url, attempt + 1);

          const response = await fetch(url, requestOptions);
          clearTimeout(timeoutId);

          // Handle different response types
          const result = await this.handleResponse<T>(response);
          
          this.logResponse(method, url, response.status, true);
          this.abortControllers.delete(requestId);
          
          return result;

        } catch (error) {
          lastError = error as Error;
          
          // Don't retry on certain errors
          if (this.shouldNotRetry(error as Error, attempt, retries)) {
            break;
          }

          // Wait before retry (exponential backoff)
          if (attempt < retries) {
            await this.delay(Math.pow(2, attempt) * 1000);
          }
        }
      }

      // If we get here, all retries failed
      this.logResponse(method, url, 0, false);
      throw this.createAPIError(lastError);

    } finally {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, body?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, body?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, body?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * Cancel a specific request or all requests
   */
  cancelRequest(requestId?: string): void {
    if (requestId) {
      const controller = this.abortControllers.get(requestId);
      if (controller) {
        controller.abort();
        this.abortControllers.delete(requestId);
      }
    } else {
      // Cancel all requests
      this.abortControllers.forEach((controller) => controller.abort());
      this.abortControllers.clear();
    }
  }

  /**
   * Update default headers
   */
  setDefaultHeader(key: string, value: string): void {
    this.config.defaultHeaders[key] = value;
  }

  /**
   * Remove default header
   */
  removeDefaultHeader(key: string): void {
    delete this.config.defaultHeaders[key];
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.setDefaultHeader('Authorization', `Bearer ${token}`);
  }

  /**
   * Clear authorization header
   */
  clearAuthToken(): void {
    this.removeDefaultHeader('Authorization');
  }

  // Private methods
  private buildURL(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.config.baseURL}/api${cleanEndpoint}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCSRFToken(): string | null {
    // Get CSRF token from meta tag or cookie
    const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return metaTag?.content || null;
  }

  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    let data: any;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new APIError(
        data.error || 'REQUEST_FAILED',
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data.details
      );
    }

    // Ensure consistent API response format
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as APIResponse<T>;
    }

    // Wrap non-API responses
    return {
      success: true,
      message: 'Request successful',
      data: data as T,
      timestamp: new Date().toISOString(),
    };
  }

  private shouldNotRetry(error: Error, attempt: number, maxRetries: number): boolean {
    // Don't retry on certain conditions
    if (attempt >= maxRetries) return true;
    if (error.name === 'AbortError') return true;
    if (error instanceof APIError) {
      // Don't retry client errors (4xx)
      if (error.status >= 400 && error.status < 500) return true;
      // Don't retry certain server errors
      if ([501, 502, 503, 504].includes(error.status)) return false;
    }
    return false;
  }

  private createAPIError(error: Error | null): APIError {
    if (error instanceof APIError) {
      return error;
    }

    if (error?.name === 'AbortError') {
      return new APIError('REQUEST_TIMEOUT', 'Request was cancelled or timed out', 408);
    }

    return new APIError(
      'NETWORK_ERROR',
      error?.message || 'Network request failed',
      0
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logRequest(method: string, url: string, attempt: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${method} ${url} (attempt ${attempt})`);
    }
  }

  private logResponse(method: string, url: string, status: number, success: boolean): void {
    if (process.env.NODE_ENV === 'development') {
      const statusText = success ? '✅' : '❌';
      console.log(`[API] ${statusText} ${method} ${url} - ${status}`);
    }
  }
}

// Create singleton instance
export const apiClient = new APIClient();

// Custom API Error class
export class APIError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(code: string, message: string, status: number = 0, details?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }

  public isNetworkError(): boolean {
    return this.status === 0;
  }
}