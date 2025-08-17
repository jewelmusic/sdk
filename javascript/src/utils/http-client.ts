import fetch from 'isomorphic-fetch';
import FormData from 'form-data';
import {
  JewelMusicConfig,
  RequestConfig,
  ApiResponse,
  ApiError,
  JewelMusicError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  ServerError,
  NetworkError,
  UnknownError,
} from '../types';

export class HttpClient {
  private config: Required<Pick<JewelMusicConfig, 'apiKey' | 'baseUrl' | 'timeout' | 'maxRetries' | 'retryDelay'>> & 
    Pick<JewelMusicConfig, 'httpAgent' | 'httpsAgent' | 'proxy' | 'logger' | 'logLevel' | 'userAgent' | 'hooks'>;

  constructor(config: JewelMusicConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || this.getBaseUrl(config.environment || 'production'),
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
    };

    this.validateConfig();
  }

  private getBaseUrl(environment: string): string {
    switch (environment) {
      case 'production':
        return 'https://api.jewelmusic.art/v1';
      case 'sandbox':
        return 'https://api-sandbox.jewelmusic.art/v1';
      default:
        return 'https://api.jewelmusic.art/v1';
    }
  }

  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new AuthenticationError('API key is required');
    }

    if (!this.config.apiKey.startsWith('jml_')) {
      throw new AuthenticationError('Invalid API key format. API keys should start with "jml_"');
    }

    const environment = this.config.apiKey.includes('_live_') ? 'production' : 'sandbox';
    if (environment === 'production' && this.config.baseUrl.includes('sandbox')) {
      this.config.logger?.warn('Using production API key with sandbox environment');
    }
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': this.config.userAgent || `JewelMusic-JS-SDK/2.5.0`,
      'Accept': 'application/json',
    };
  }

  private async makeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    let attempt = 0;
    let lastError: Error;

    while (attempt <= this.config.maxRetries) {
      try {
        // Apply request hook
        if (this.config.hooks?.onRequest) {
          config = await this.config.hooks.onRequest(config);
        }

        const url = config.url.startsWith('http') ? config.url : `${this.config.baseUrl}${config.url}`;
        const headers = { ...this.getDefaultHeaders(), ...config.headers };

        // Remove Content-Type for FormData
        if (config.data instanceof FormData) {
          delete headers['Content-Type'];
        }

        const requestOptions: RequestInit = {
          method: config.method,
          headers,
          signal: AbortSignal.timeout(config.timeout || this.config.timeout),
        };

        // Add body for non-GET requests
        if (config.method !== 'GET' && config.data) {
          if (config.data instanceof FormData) {
            requestOptions.body = config.data as any;
          } else {
            requestOptions.body = JSON.stringify(config.data);
          }
        }

        // Add query parameters for GET requests
        let finalUrl = url;
        if (config.method === 'GET' && config.params) {
          const searchParams = new URLSearchParams();
          Object.entries(config.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });
          finalUrl = `${url}?${searchParams.toString()}`;
        }

        this.log('debug', `Making ${config.method} request to ${finalUrl}`);

        const response = await fetch(finalUrl, requestOptions);
        const responseData = await this.parseResponse(response);

        // Apply response hook
        if (this.config.hooks?.onResponse) {
          return await this.config.hooks.onResponse(responseData);
        }

        return responseData;

      } catch (error) {
        lastError = error as Error;
        this.log('error', `Request attempt ${attempt + 1} failed:`, error);

        // Apply error hook
        if (this.config.hooks?.onError) {
          await this.config.hooks.onError(this.normalizeError(error as Error));
        }

        // Don't retry certain errors
        if (error instanceof AuthenticationError || 
            error instanceof AuthorizationError || 
            error instanceof ValidationError ||
            error instanceof NotFoundError) {
          throw error;
        }

        attempt++;
        
        if (attempt <= this.config.maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          this.log('info', `Retrying request in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw this.normalizeError(lastError!);
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const text = await response.text();
    let data: ApiResponse<T> | ApiError;

    try {
      data = JSON.parse(text);
    } catch {
      // If response is not JSON, wrap it
      if (response.ok) {
        return {
          success: true,
          data: text as any,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: response.headers.get('x-request-id') || 'unknown',
            rateLimit: this.parseRateLimitHeaders(response),
          },
        };
      } else {
        throw new ServerError(`HTTP ${response.status}: ${text}`);
      }
    }

    if (!response.ok || !data.success) {
      const error = data as ApiError;
      throw this.createErrorFromResponse(response.status, error);
    }

    return data as ApiResponse<T>;
  }

  private parseRateLimitHeaders(response: Response) {
    return {
      limit: parseInt(response.headers.get('x-ratelimit-limit') || '0'),
      remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0'),
      reset: parseInt(response.headers.get('x-ratelimit-reset') || '0'),
    };
  }

  private createErrorFromResponse(status: number, errorData: ApiError): JewelMusicError {
    const message = errorData.error?.message || 'Unknown error';
    const requestId = errorData.error?.requestId;

    switch (status) {
      case 401:
        return new AuthenticationError(message, requestId);
      case 403:
        return new AuthorizationError(message, requestId);
      case 404:
        return new NotFoundError(message, requestId);
      case 400:
        if (errorData.error?.details) {
          return new ValidationError(message, errorData.error.details, requestId);
        }
        return new ValidationError(message, {}, requestId);
      case 429:
        const retryAfter = parseInt(errorData.error?.details?.retryAfter || '60');
        return new RateLimitError(message, retryAfter, requestId);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message, requestId);
      default:
        return new UnknownError(message, requestId);
    }
  }

  private normalizeError(error: Error): JewelMusicError {
    if (error instanceof JewelMusicError) {
      return error;
    }

    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new NetworkError('Request timeout');
    }

    if (error.message.includes('fetch')) {
      return new NetworkError('Network error: ' + error.message);
    }

    return new UnknownError(error.message);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(level: string, message: string, ...args: any[]): void {
    if (!this.config.logger) return;

    const shouldLog = this.shouldLog(level);
    if (!shouldLog) return;

    const logMethod = this.config.logger[level as keyof typeof this.config.logger];
    if (typeof logMethod === 'function') {
      logMethod.call(this.config.logger, message, ...args);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevel = this.config.logLevel || 'info';
    const currentIndex = levels.indexOf(level);
    const configIndex = levels.indexOf(configLevel);
    return currentIndex >= configIndex;
  }

  // Public methods
  async get<T>(path: string, params?: Record<string, any>, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'GET',
      url: path,
      params,
      ...options,
    });
  }

  async post<T>(path: string, data?: any, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'POST',
      url: path,
      data,
      ...options,
    });
  }

  async put<T>(path: string, data?: any, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PUT',
      url: path,
      data,
      ...options,
    });
  }

  async patch<T>(path: string, data?: any, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PATCH',
      url: path,
      data,
      ...options,
    });
  }

  async delete<T>(path: string, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'DELETE',
      url: path,
      ...options,
    });
  }

  async upload<T>(path: string, file: File | Buffer, metadata?: any, options?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    
    // Add file
    if (file instanceof Buffer) {
      formData.append('file', file, { filename: 'upload' });
    } else {
      formData.append('file', file);
    }

    // Add metadata
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    return this.makeRequest<T>({
      method: 'POST',
      url: path,
      data: formData,
      ...options,
    });
  }
}