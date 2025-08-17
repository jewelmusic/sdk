import { HttpClient } from '../utils/http-client';
import { ApiResponse } from '../types';

/**
 * Base class for all API resource managers
 * 
 * Provides common functionality and utilities for making API requests
 * and handling responses in a consistent way across all resources.
 */
export abstract class BaseResource {
  protected httpClient: HttpClient;
  protected basePath: string;

  constructor(httpClient: HttpClient, basePath: string) {
    this.httpClient = httpClient;
    this.basePath = basePath;
  }

  /**
   * Build a full URL path for the resource
   * 
   * @param path - The path segment to append to the base path
   * @returns The complete path
   */
  protected buildPath(path: string = ''): string {
    const cleanBasePath = this.basePath.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    
    if (!cleanPath) {
      return cleanBasePath;
    }
    
    return `${cleanBasePath}/${cleanPath}`;
  }

  /**
   * Make a GET request to the resource
   * 
   * @param path - The path to request (relative to base path)
   * @param params - Query parameters
   * @returns Promise resolving to the response data
   */
  protected async get<T>(path: string = '', params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.httpClient.get<T>(this.buildPath(path), params);
  }

  /**
   * Make a POST request to the resource
   * 
   * @param path - The path to request (relative to base path)
   * @param data - Request body data
   * @returns Promise resolving to the response data
   */
  protected async post<T>(path: string = '', data?: any): Promise<ApiResponse<T>> {
    return this.httpClient.post<T>(this.buildPath(path), data);
  }

  /**
   * Make a PUT request to the resource
   * 
   * @param path - The path to request (relative to base path)
   * @param data - Request body data
   * @returns Promise resolving to the response data
   */
  protected async put<T>(path: string = '', data?: any): Promise<ApiResponse<T>> {
    return this.httpClient.put<T>(this.buildPath(path), data);
  }

  /**
   * Make a PATCH request to the resource
   * 
   * @param path - The path to request (relative to base path)
   * @param data - Request body data
   * @returns Promise resolving to the response data
   */
  protected async patch<T>(path: string = '', data?: any): Promise<ApiResponse<T>> {
    return this.httpClient.patch<T>(this.buildPath(path), data);
  }

  /**
   * Make a DELETE request to the resource
   * 
   * @param path - The path to request (relative to base path)
   * @returns Promise resolving to the response data
   */
  protected async delete<T>(path: string = ''): Promise<ApiResponse<T>> {
    return this.httpClient.delete<T>(this.buildPath(path));
  }

  /**
   * Upload a file to the resource
   * 
   * @param path - The path to upload to (relative to base path)
   * @param file - The file to upload
   * @param metadata - Additional metadata to include
   * @returns Promise resolving to the response data
   */
  protected async upload<T>(path: string = '', file: File | Buffer, metadata?: any): Promise<ApiResponse<T>> {
    return this.httpClient.upload<T>(this.buildPath(path), file, metadata);
  }

  /**
   * Extract data from API response
   * 
   * @param response - The API response
   * @returns The data portion of the response
   */
  protected extractData<T>(response: ApiResponse<T>): T {
    return response.data;
  }

  /**
   * Extract pagination info from API response
   * 
   * @param response - The API response
   * @returns Pagination information if available
   */
  protected extractPagination(response: ApiResponse<any>): PaginationInfo | null {
    const meta = response.meta as any;
    if (meta && meta.pagination) {
      return {
        page: meta.pagination.page,
        perPage: meta.pagination.perPage,
        total: meta.pagination.total,
        totalPages: meta.pagination.totalPages,
        hasNext: meta.pagination.hasNext,
        hasPrevious: meta.pagination.hasPrevious,
      };
    }
    return null;
  }

  /**
   * Validate required parameters
   * 
   * @param params - Object containing parameters to validate
   * @param required - Array of required parameter names
   * @throws {ValidationError} If any required parameters are missing
   */
  protected validateRequired(params: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => 
      params[param] === undefined || params[param] === null || params[param] === ''
    );

    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Format file size in a human-readable format
   * 
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  protected formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Format duration in a human-readable format
   * 
   * @param seconds - Duration in seconds
   * @returns Formatted duration string (e.g., "3:45", "1:23:45")
   */
  protected formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Poll for a resource status until completion
   * 
   * @param getId - Function that returns the resource ID
   * @param getStatus - Function that checks the resource status
   * @param isComplete - Function that determines if the resource is complete
   * @param interval - Polling interval in milliseconds (default: 2000)
   * @param timeout - Maximum time to wait in milliseconds (default: 300000)
   * @returns Promise resolving when the resource is complete
   */
  protected async pollForCompletion<T>(
    getId: () => string,
    getStatus: (id: string) => Promise<T>,
    isComplete: (status: T) => boolean,
    interval: number = 2000,
    timeout: number = 300000
  ): Promise<T> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const status = await getStatus(getId());
      
      if (isComplete(status)) {
        return status;
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Polling timeout: Resource did not complete within the specified time');
  }
}

/**
 * Pagination information for paginated API responses
 */
export interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Standard list response with pagination
 */
export interface ListResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * Parameters for paginated requests
 */
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

/**
 * Parameters for filtered and sorted requests
 */
export interface QueryParams extends PaginationParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
  search?: string;
}