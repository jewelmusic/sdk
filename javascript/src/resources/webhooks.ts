import { BaseResource, ListResponse, QueryParams } from './base';
import {
  Webhook,
  WebhookEvent,
  WebhookDelivery,
} from '../types';
import * as crypto from 'crypto';

/**
 * Webhooks Resource
 * 
 * Manages webhook endpoints and delivery configurations.
 * Provides methods for creating, updating, testing webhooks,
 * and utilities for verifying webhook signatures.
 */
export class WebhooksResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/webhooks');
  }

  /**
   * Get list of webhooks with filtering and pagination
   * 
   * @param params - Query parameters
   * @returns Promise resolving to paginated webhooks list
   * 
   * @example
   * ```typescript
   * const webhooks = await client.webhooks.list({
   *   page: 1,
   *   perPage: 10,
   *   active: true,
   *   events: ['track.uploaded', 'analysis.completed']
   * });
   * 
   * console.log('Active webhooks:', webhooks.data.items);
   * ```
   */
  async list(params: QueryParams & {
    active?: boolean;
    events?: string[];
    url?: string;
  } = {}): Promise<ListResponse<Webhook>> {
    const response = await this.get<ListResponse<Webhook>>('', {
      page: params.page || 1,
      perPage: params.perPage || 20,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      active: params.active,
      events: params.events,
      url: params.url,
      search: params.search,
    });

    return this.extractData(response);
  }

  /**
   * Get a specific webhook by ID
   * 
   * @param id - Webhook ID
   * @returns Promise resolving to webhook details
   * 
   * @example
   * ```typescript
   * const webhook = await client.webhooks.get('webhook_123');
   * console.log('Webhook URL:', webhook.data.url);
   * console.log('Events:', webhook.data.events);
   * ```
   */
  async get(id: string): Promise<Webhook> {
    this.validateRequired({ id }, ['id']);

    const response = await this.get<Webhook>(`/${id}`);
    return this.extractData(response);
  }

  /**
   * Create a new webhook endpoint
   * 
   * @param webhookData - Webhook configuration
   * @returns Promise resolving to created webhook
   * 
   * @example
   * ```typescript
   * const webhook = await client.webhooks.create({
   *   url: 'https://myapp.com/webhooks/jewelmusic',
   *   events: [
   *     'track.uploaded',
   *     'track.processed',
   *     'analysis.completed',
   *     'distribution.released'
   *   ],
   *   secret: 'my_webhook_secret_123',
   *   active: true,
   *   description: 'Main app webhook endpoint'
   * });
   * 
   * console.log('Webhook created:', webhook.data.id);
   * ```
   */
  async create(webhookData: {
    url: string;
    events: string[];
    secret?: string;
    active?: boolean;
    description?: string;
    headers?: Record<string, string>;
    timeout?: number;
    retryPolicy?: {
      maxRetries: number;
      backoffMultiplier: number;
      maxBackoffDelay: number;
    };
  }): Promise<Webhook> {
    this.validateRequired(webhookData, ['url', 'events']);

    if (webhookData.events.length === 0) {
      throw new Error('At least one event type is required for webhook');
    }

    // Validate URL format
    try {
      new URL(webhookData.url);
    } catch (error) {
      throw new Error('Invalid webhook URL format');
    }

    const response = await this.post<Webhook>('', {
      url: webhookData.url,
      events: webhookData.events,
      secret: webhookData.secret,
      active: webhookData.active !== false,
      description: webhookData.description,
      headers: webhookData.headers,
      timeout: webhookData.timeout || 30000,
      retryPolicy: webhookData.retryPolicy || {
        maxRetries: 3,
        backoffMultiplier: 2,
        maxBackoffDelay: 60000,
      },
    });

    return this.extractData(response);
  }

  /**
   * Update an existing webhook
   * 
   * @param id - Webhook ID
   * @param updates - Updates to apply
   * @returns Promise resolving to updated webhook
   * 
   * @example
   * ```typescript
   * const updated = await client.webhooks.update('webhook_123', {
   *   events: ['track.uploaded', 'track.processed'],
   *   active: false,
   *   description: 'Updated webhook description'
   * });
   * ```
   */
  async update(
    id: string,
    updates: Partial<{
      url: string;
      events: string[];
      secret: string;
      active: boolean;
      description: string;
      headers: Record<string, string>;
      timeout: number;
      retryPolicy: {
        maxRetries: number;
        backoffMultiplier: number;
        maxBackoffDelay: number;
      };
    }>
  ): Promise<Webhook> {
    this.validateRequired({ id }, ['id']);

    // Validate URL if provided
    if (updates.url) {
      try {
        new URL(updates.url);
      } catch (error) {
        throw new Error('Invalid webhook URL format');
      }
    }

    const response = await this.put<Webhook>(`/${id}`, updates);
    return this.extractData(response);
  }

  /**
   * Delete a webhook
   * 
   * @param id - Webhook ID
   * @returns Promise resolving to deletion confirmation
   * 
   * @example
   * ```typescript
   * await client.webhooks.delete('webhook_123');
   * console.log('Webhook deleted');
   * ```
   */
  async delete(id: string) {
    this.validateRequired({ id }, ['id']);

    const response = await this.delete(`/${id}`);
    return this.extractData(response);
  }

  /**
   * Test a webhook by sending a test event
   * 
   * @param id - Webhook ID
   * @param eventType - Event type to test with
   * @returns Promise resolving to test delivery information
   * 
   * @example
   * ```typescript
   * const testResult = await client.webhooks.test('webhook_123', 'track.uploaded');
   * console.log('Test successful:', testResult.data.success);
   * console.log('Response status:', testResult.data.responseStatus);
   * console.log('Response time:', testResult.data.responseTime);
   * ```
   */
  async test(id: string, eventType?: string) {
    this.validateRequired({ id }, ['id']);

    const response = await this.post(`/${id}/test`, {
      eventType: eventType || 'webhook.test',
    });

    return this.extractData(response);
  }

  /**
   * Get webhook delivery history
   * 
   * @param id - Webhook ID
   * @param params - Query parameters
   * @returns Promise resolving to delivery history
   * 
   * @example
   * ```typescript
   * const deliveries = await client.webhooks.getDeliveries('webhook_123', {
   *   page: 1,
   *   perPage: 20,
   *   status: 'failed',
   *   eventType: 'track.uploaded'
   * });
   * 
   * console.log('Failed deliveries:', deliveries.data.items);
   * ```
   */
  async getDeliveries(
    id: string,
    params: QueryParams & {
      status?: 'pending' | 'success' | 'failed' | 'retrying';
      eventType?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<ListResponse<WebhookDelivery>> {
    this.validateRequired({ id }, ['id']);

    const response = await this.get<ListResponse<WebhookDelivery>>(`/${id}/deliveries`, {
      page: params.page || 1,
      perPage: params.perPage || 20,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      status: params.status,
      eventType: params.eventType,
      startDate: params.startDate,
      endDate: params.endDate,
    });

    return this.extractData(response);
  }

  /**
   * Get specific webhook delivery details
   * 
   * @param webhookId - Webhook ID
   * @param deliveryId - Delivery ID
   * @returns Promise resolving to delivery details
   * 
   * @example
   * ```typescript
   * const delivery = await client.webhooks.getDelivery('webhook_123', 'delivery_456');
   * console.log('Delivery status:', delivery.data.status);
   * console.log('Response body:', delivery.data.response.body);
   * ```
   */
  async getDelivery(webhookId: string, deliveryId: string): Promise<WebhookDelivery> {
    this.validateRequired({ webhookId, deliveryId }, ['webhookId', 'deliveryId']);

    const response = await this.get<WebhookDelivery>(`/${webhookId}/deliveries/${deliveryId}`);
    return this.extractData(response);
  }

  /**
   * Retry a failed webhook delivery
   * 
   * @param webhookId - Webhook ID
   * @param deliveryId - Delivery ID
   * @returns Promise resolving to retry result
   * 
   * @example
   * ```typescript
   * const retryResult = await client.webhooks.retryDelivery('webhook_123', 'delivery_456');
   * console.log('Retry initiated:', retryResult.data.success);
   * ```
   */
  async retryDelivery(webhookId: string, deliveryId: string) {
    this.validateRequired({ webhookId, deliveryId }, ['webhookId', 'deliveryId']);

    const response = await this.post(`/${webhookId}/deliveries/${deliveryId}/retry`);
    return this.extractData(response);
  }

  /**
   * Get available webhook event types
   * 
   * @returns Promise resolving to available event types
   * 
   * @example
   * ```typescript
   * const eventTypes = await client.webhooks.getEventTypes();
   * console.log('Available events:', eventTypes.data);
   * ```
   */
  async getEventTypes() {
    const response = await this.get('/events/types');
    return this.extractData(response);
  }

  /**
   * Verify webhook signature
   * 
   * This is a static method that can be used to verify webhook signatures
   * without making an API call.
   * 
   * @param payload - Raw request body
   * @param signature - Webhook signature header
   * @param secret - Webhook secret
   * @param tolerance - Time tolerance in seconds (default: 300)
   * @returns Boolean indicating if signature is valid
   * 
   * @example
   * ```typescript
   * // In your webhook handler
   * const isValid = WebhooksResource.verifySignature(
   *   req.body,
   *   req.headers['x-jewelmusic-signature'],
   *   'your_webhook_secret',
   *   300 // 5 minutes tolerance
   * );
   * 
   * if (!isValid) {
   *   return res.status(401).send('Invalid signature');
   * }
   * ```
   */
  static verifySignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
    tolerance: number = 300
  ): boolean {
    try {
      // Parse signature header (format: "t=timestamp,v1=hash")
      const elements = signature.split(',');
      const timestampElement = elements.find(el => el.startsWith('t='));
      const hashElement = elements.find(el => el.startsWith('v1='));

      if (!timestampElement || !hashElement) {
        return false;
      }

      const timestamp = parseInt(timestampElement.split('=')[1]);
      const hash = hashElement.split('=')[1];

      // Check timestamp tolerance
      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - timestamp) > tolerance) {
        return false;
      }

      // Verify signature
      const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
      const signedPayload = `${timestamp}.${payloadString}`;
      const expectedHash = crypto
        .createHmac('sha256', secret)
        .update(signedPayload, 'utf8')
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(hash, 'hex'),
        Buffer.from(expectedHash, 'hex')
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Parse webhook event payload
   * 
   * This is a static method to safely parse webhook event data.
   * 
   * @param payload - Raw request body
   * @returns Parsed webhook event
   * 
   * @example
   * ```typescript
   * // In your webhook handler
   * const event = WebhooksResource.parseEvent(req.body);
   * 
   * switch (event.type) {
   *   case 'track.uploaded':
   *     console.log('Track uploaded:', event.data.track.id);
   *     break;
   *   case 'analysis.completed':
   *     console.log('Analysis completed for track:', event.data.track.id);
   *     break;
   * }
   * ```
   */
  static parseEvent(payload: string | Buffer): WebhookEvent {
    try {
      const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
      return JSON.parse(payloadString) as WebhookEvent;
    } catch (error) {
      throw new Error('Invalid webhook payload format');
    }
  }

  /**
   * Create webhook signature for testing
   * 
   * This utility method can be used for testing webhook signature verification.
   * 
   * @param payload - Payload to sign
   * @param secret - Webhook secret
   * @param timestamp - Optional timestamp (defaults to current time)
   * @returns Signature string
   * 
   * @example
   * ```typescript
   * // For testing purposes
   * const signature = WebhooksResource.createSignature(
   *   JSON.stringify(eventData),
   *   'test_secret'
   * );
   * ```
   */
  static createSignature(
    payload: string | Buffer,
    secret: string,
    timestamp?: number
  ): string {
    const ts = timestamp || Math.floor(Date.now() / 1000);
    const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
    const signedPayload = `${ts}.${payloadString}`;
    
    const hash = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    return `t=${ts},v1=${hash}`;
  }

  /**
   * Get webhook statistics and metrics
   * 
   * @param id - Webhook ID
   * @param options - Statistics options
   * @returns Promise resolving to webhook statistics
   * 
   * @example
   * ```typescript
   * const stats = await client.webhooks.getStatistics('webhook_123', {
   *   period: 'last_30_days',
   *   groupBy: 'day'
   * });
   * 
   * console.log('Success rate:', stats.data.successRate);
   * console.log('Average response time:', stats.data.averageResponseTime);
   * ```
   */
  async getStatistics(
    id: string,
    options: {
      period?: 'last_24_hours' | 'last_7_days' | 'last_30_days' | 'custom';
      startDate?: string;
      endDate?: string;
      groupBy?: 'hour' | 'day' | 'week';
    } = {}
  ) {
    this.validateRequired({ id }, ['id']);

    const response = await this.get(`/${id}/statistics`, {
      period: options.period || 'last_7_days',
      startDate: options.startDate,
      endDate: options.endDate,
      groupBy: options.groupBy || 'day',
    });

    return this.extractData(response);
  }
}