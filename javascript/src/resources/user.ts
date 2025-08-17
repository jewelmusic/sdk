import { BaseResource } from './base';
import {
  UserProfile,
  UserPreferences,
  ApiKey,
  UsageStats,
} from '../types';

/**
 * User Resource
 * 
 * Manages user profile, preferences, API keys, and account settings.
 * Provides access to personal information, usage statistics, and
 * account management functionality.
 */
export class UserResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/user');
  }

  /**
   * Get user profile information
   * 
   * @returns Promise resolving to user profile data
   * 
   * @example
   * ```typescript
   * const profile = await client.user.getProfile();
   * console.log('User:', profile.data.name);
   * console.log('Email:', profile.data.email);
   * console.log('Plan:', profile.data.subscription.plan);
   * ```
   */
  async getProfile(): Promise<UserProfile> {
    const response = await this.get<UserProfile>('/profile');
    return this.extractData(response);
  }

  /**
   * Update user profile information
   * 
   * @param updates - Profile updates to apply
   * @returns Promise resolving to updated profile
   * 
   * @example
   * ```typescript
   * const updated = await client.user.updateProfile({
   *   name: 'New Name',
   *   bio: 'Updated bio',
   *   website: 'https://example.com',
   *   socialLinks: {
   *     twitter: '@username',
   *     instagram: '@username'
   *   }
   * });
   * ```
   */
  async updateProfile(updates: Partial<{
    name: string;
    bio: string;
    website: string;
    location: string;
    socialLinks: {
      twitter?: string;
      instagram?: string;
      youtube?: string;
      spotify?: string;
      soundcloud?: string;
    };
    artistInfo: {
      genre: string[];
      influences: string[];
      yearsActive: number;
      recordLabel?: string;
    };
  }>): Promise<UserProfile> {
    const response = await this.put<UserProfile>('/profile', updates);
    return this.extractData(response);
  }

  /**
   * Upload user avatar image
   * 
   * @param avatarFile - Image file for avatar
   * @returns Promise resolving to upload confirmation
   * 
   * @example
   * ```typescript
   * await client.user.uploadAvatar(avatarFile);
   * console.log('Avatar uploaded successfully');
   * ```
   */
  async uploadAvatar(avatarFile: File | Buffer) {
    // Validate avatar file
    const fileSize = avatarFile instanceof Buffer ? avatarFile.length : avatarFile.size;
    const maxAvatarSize = 5 * 1024 * 1024; // 5MB

    if (fileSize > maxAvatarSize) {
      throw new Error(`Avatar file size (${this.formatFileSize(fileSize)}) exceeds maximum allowed size (${this.formatFileSize(maxAvatarSize)})`);
    }

    const response = await this.upload('/avatar', avatarFile);
    return this.extractData(response);
  }

  /**
   * Get user preferences and settings
   * 
   * @returns Promise resolving to user preferences
   * 
   * @example
   * ```typescript
   * const preferences = await client.user.getPreferences();
   * console.log('Email notifications:', preferences.data.notifications.email);
   * console.log('Theme:', preferences.data.ui.theme);
   * ```
   */
  async getPreferences(): Promise<UserPreferences> {
    const response = await this.get<UserPreferences>('/preferences');
    return this.extractData(response);
  }

  /**
   * Update user preferences and settings
   * 
   * @param preferences - Preference updates to apply
   * @returns Promise resolving to updated preferences
   * 
   * @example
   * ```typescript
   * await client.user.updatePreferences({
   *   notifications: {
   *     email: true,
   *     push: false,
   *     marketing: false
   *   },
   *   ui: {
   *     theme: 'dark',
   *     language: 'en'
   *   },
   *   privacy: {
   *     profilePublic: true,
   *     showRealName: false
   *   }
   * });
   * ```
   */
  async updatePreferences(preferences: Partial<{
    notifications: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      marketing?: boolean;
      releases?: boolean;
      analytics?: boolean;
    };
    ui: {
      theme?: 'light' | 'dark' | 'auto';
      language?: string;
      timezone?: string;
      dateFormat?: string;
    };
    privacy: {
      profilePublic?: boolean;
      showRealName?: boolean;
      showLocation?: boolean;
      allowMessageFrom?: 'everyone' | 'followers' | 'none';
    };
    api: {
      defaultRateLimit?: number;
      webhookRetries?: number;
      logRetention?: number;
    };
  }>): Promise<UserPreferences> {
    const response = await this.put<UserPreferences>('/preferences', preferences);
    return this.extractData(response);
  }

  /**
   * Get list of user's API keys
   * 
   * @returns Promise resolving to API keys list
   * 
   * @example
   * ```typescript
   * const apiKeys = await client.user.getApiKeys();
   * apiKeys.data.forEach(key => {
   *   console.log(`${key.name}: ${key.lastUsed ? 'Active' : 'Unused'}`);
   * });
   * ```
   */
  async getApiKeys() {
    const response = await this.get('/api-keys');
    return this.extractData(response);
  }

  /**
   * Create a new API key
   * 
   * @param name - Name for the API key
   * @param permissions - Permissions to grant to the key
   * @returns Promise resolving to created API key information
   * 
   * @example
   * ```typescript
   * const apiKey = await client.user.createApiKey('My App Key', {
   *   scopes: ['tracks:read', 'tracks:write', 'analytics:read'],
   *   rateLimit: 1000,
   *   ipRestrictions: ['192.168.1.0/24'],
   *   expiresAt: '2025-12-31T23:59:59Z'
   * });
   * 
   * console.log('New API key:', apiKey.data.key);
   * console.log('Key ID:', apiKey.data.id);
   * ```
   */
  async createApiKey(
    name: string,
    permissions: {
      scopes: string[];
      rateLimit?: number;
      ipRestrictions?: string[];
      expiresAt?: string;
      description?: string;
    }
  ): Promise<ApiKey> {
    this.validateRequired({ name }, ['name']);
    this.validateRequired(permissions, ['scopes']);

    if (permissions.scopes.length === 0) {
      throw new Error('At least one scope is required for API key');
    }

    const response = await this.post<ApiKey>('/api-keys', {
      name,
      ...permissions,
    });

    return this.extractData(response);
  }

  /**
   * Update an existing API key
   * 
   * @param keyId - API key ID
   * @param updates - Updates to apply
   * @returns Promise resolving to updated API key information
   * 
   * @example
   * ```typescript
   * await client.user.updateApiKey('key_123', {
   *   name: 'Updated Key Name',
   *   scopes: ['tracks:read', 'analytics:read'],
   *   rateLimit: 500
   * });
   * ```
   */
  async updateApiKey(
    keyId: string,
    updates: Partial<{
      name: string;
      scopes: string[];
      rateLimit: number;
      ipRestrictions: string[];
      expiresAt: string;
      description: string;
      active: boolean;
    }>
  ): Promise<ApiKey> {
    this.validateRequired({ keyId }, ['keyId']);

    const response = await this.put<ApiKey>(`/api-keys/${keyId}`, updates);
    return this.extractData(response);
  }

  /**
   * Revoke (delete) an API key
   * 
   * @param keyId - API key ID to revoke
   * @returns Promise resolving to revocation confirmation
   * 
   * @example
   * ```typescript
   * await client.user.revokeApiKey('key_123');
   * console.log('API key revoked');
   * ```
   */
  async revokeApiKey(keyId: string) {
    this.validateRequired({ keyId }, ['keyId']);

    const response = await this.delete(`/api-keys/${keyId}`);
    return this.extractData(response);
  }

  /**
   * Get detailed API usage statistics
   * 
   * @param options - Usage query options
   * @returns Promise resolving to usage statistics
   * 
   * @example
   * ```typescript
   * const usage = await client.user.getUsageStats({
   *   period: 'last_30_days',
   *   groupBy: 'day',
   *   includeBreakdown: true
   * });
   * 
   * console.log('Total requests:', usage.data.summary.totalRequests);
   * console.log('Data transferred:', usage.data.summary.dataTransferred);
   * console.log('Cost estimate:', usage.data.summary.estimatedCost);
   * ```
   */
  async getUsageStats(options: {
    period?: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'current_month' | 'custom';
    startDate?: string;
    endDate?: string;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
    includeBreakdown?: boolean;
    apiKeyId?: string;
  } = {}): Promise<UsageStats> {
    const response = await this.get<UsageStats>('/usage', {
      period: options.period || 'last_30_days',
      startDate: options.startDate,
      endDate: options.endDate,
      groupBy: options.groupBy || 'day',
      includeBreakdown: options.includeBreakdown !== false,
      apiKeyId: options.apiKeyId,
    });

    return this.extractData(response);
  }

  /**
   * Get billing information and invoices
   * 
   * @param options - Billing query options
   * @returns Promise resolving to billing information
   * 
   * @example
   * ```typescript
   * const billing = await client.user.getBilling({
   *   includeInvoices: true,
   *   invoiceLimit: 10
   * });
   * 
   * console.log('Current plan:', billing.data.subscription.plan);
   * console.log('Next billing date:', billing.data.subscription.nextBillingDate);
   * console.log('Recent invoices:', billing.data.invoices);
   * ```
   */
  async getBilling(options: {
    includeInvoices?: boolean;
    invoiceLimit?: number;
    invoiceStatus?: 'paid' | 'pending' | 'failed';
  } = {}) {
    const response = await this.get('/billing', {
      includeInvoices: options.includeInvoices !== false,
      invoiceLimit: options.invoiceLimit || 10,
      invoiceStatus: options.invoiceStatus,
    });

    return this.extractData(response);
  }

  /**
   * Update billing information
   * 
   * @param billingData - Billing information to update
   * @returns Promise resolving to updated billing information
   * 
   * @example
   * ```typescript
   * await client.user.updateBilling({
   *   paymentMethod: {
   *     type: 'card',
   *     token: 'pm_1234567890'
   *   },
   *   billingAddress: {
   *     country: 'US',
   *     state: 'CA',
   *     city: 'San Francisco',
   *     postalCode: '94105',
   *     line1: '123 Main St'
   *   }
   * });
   * ```
   */
  async updateBilling(billingData: {
    paymentMethod?: {
      type: 'card' | 'bank_account';
      token: string;
    };
    billingAddress?: {
      country: string;
      state?: string;
      city: string;
      postalCode: string;
      line1: string;
      line2?: string;
    };
    taxId?: string;
    company?: string;
  }) {
    const response = await this.put('/billing', billingData);
    return this.extractData(response);
  }

  /**
   * Download invoice by ID
   * 
   * @param invoiceId - Invoice ID
   * @param format - Download format
   * @returns Promise resolving to download information
   * 
   * @example
   * ```typescript
   * const download = await client.user.downloadInvoice('inv_123', 'pdf');
   * console.log('Download URL:', download.data.downloadUrl);
   * ```
   */
  async downloadInvoice(
    invoiceId: string,
    format: 'pdf' | 'csv' = 'pdf'
  ) {
    this.validateRequired({ invoiceId }, ['invoiceId']);

    const response = await this.get(`/billing/invoices/${invoiceId}`, {
      format,
    });

    return this.extractData(response);
  }

  /**
   * Get account limits and quotas
   * 
   * @returns Promise resolving to account limits
   * 
   * @example
   * ```typescript
   * const limits = await client.user.getLimits();
   * console.log('Monthly upload limit:', limits.data.uploads.monthly);
   * console.log('API rate limit:', limits.data.api.requestsPerMinute);
   * console.log('Storage used:', limits.data.storage.used);
   * ```
   */
  async getLimits() {
    const response = await this.get('/limits');
    return this.extractData(response);
  }

  /**
   * Delete user account
   * 
   * @param confirmation - Confirmation object
   * @returns Promise resolving to deletion confirmation
   * 
   * @example
   * ```typescript
   * await client.user.deleteAccount({
   *   confirmEmail: 'user@example.com',
   *   reason: 'No longer needed',
   *   deleteData: true
   * });
   * ```
   */
  async deleteAccount(confirmation: {
    confirmEmail: string;
    reason?: string;
    deleteData?: boolean;
  }) {
    this.validateRequired(confirmation, ['confirmEmail']);

    const response = await this.delete('/account', confirmation);
    return this.extractData(response);
  }

  /**
   * Export user data
   * 
   * @param options - Export options
   * @returns Promise resolving to export job information
   * 
   * @example
   * ```typescript
   * const exportJob = await client.user.exportData({
   *   format: 'json',
   *   includeMetadata: true,
   *   email: 'user@example.com'
   * });
   * 
   * console.log('Export job ID:', exportJob.data.jobId);
   * ```
   */
  async exportData(options: {
    format?: 'json' | 'csv' | 'xml';
    includeMetadata?: boolean;
    includeTracks?: boolean;
    includeAnalytics?: boolean;
    email?: string;
  } = {}) {
    const response = await this.post('/export', {
      format: options.format || 'json',
      includeMetadata: options.includeMetadata !== false,
      includeTracks: options.includeTracks !== false,
      includeAnalytics: options.includeAnalytics !== false,
      email: options.email,
    });

    return this.extractData(response);
  }
}