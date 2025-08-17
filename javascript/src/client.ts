import { JewelMusicConfig } from './types';
import { HttpClient } from './utils/http-client';
import { CopilotResource } from './resources/copilot';
import { AnalysisResource } from './resources/analysis';
import { DistributionResource } from './resources/distribution';
import { TranscriptionResource } from './resources/transcription';
import { TracksResource } from './resources/tracks';
import { AnalyticsResource } from './resources/analytics';
import { UserResource } from './resources/user';
import { WebhooksResource } from './resources/webhooks';

/**
 * JewelMusic SDK Client
 * 
 * The main client for interacting with the JewelMusic API.
 * Provides access to all JewelMusic services including AI copilot,
 * music analysis, distribution, transcription, and more.
 * 
 * @example
 * ```typescript
 * import { JewelMusic } from '@jewelmusic/sdk';
 * 
 * const client = new JewelMusic({
 *   apiKey: 'jml_live_your_api_key_here',
 *   environment: 'production'
 * });
 * 
 * // Upload a track
 * const track = await client.tracks.upload(audioFile, {
 *   title: 'My Song',
 *   artist: 'Artist Name'
 * });
 * 
 * // Get AI transcription
 * const transcription = await client.transcription.create(track.id, {
 *   languages: ['en', 'ka'],
 *   includeTimestamps: true
 * });
 * ```
 */
export class JewelMusic {
  private httpClient: HttpClient;

  /** AI-powered music copilot features */
  public readonly copilot: CopilotResource;
  
  /** Music analysis and quality checking */
  public readonly analysis: AnalysisResource;
  
  /** Music distribution to streaming platforms */
  public readonly distribution: DistributionResource;
  
  /** AI transcription and lyrics processing */
  public readonly transcription: TranscriptionResource;
  
  /** Track upload and management */
  public readonly tracks: TracksResource;
  
  /** Analytics and streaming data */
  public readonly analytics: AnalyticsResource;
  
  /** User profile and API key management */
  public readonly user: UserResource;
  
  /** Webhook configuration and management */
  public readonly webhooks: WebhooksResource;

  /**
   * Create a new JewelMusic client instance
   * 
   * @param config - Configuration options for the client
   */
  constructor(config: JewelMusicConfig) {
    this.httpClient = new HttpClient(config);

    // Initialize resource managers
    this.copilot = new CopilotResource(this.httpClient);
    this.analysis = new AnalysisResource(this.httpClient);
    this.distribution = new DistributionResource(this.httpClient);
    this.transcription = new TranscriptionResource(this.httpClient);
    this.tracks = new TracksResource(this.httpClient);
    this.analytics = new AnalyticsResource(this.httpClient);
    this.user = new UserResource(this.httpClient);
    this.webhooks = new WebhooksResource(this.httpClient);
  }

  /**
   * Test the API connection and authentication
   * 
   * @returns Promise that resolves if the connection is successful
   * @throws {AuthenticationError} If the API key is invalid
   * @throws {NetworkError} If there's a network connectivity issue
   */
  async ping(): Promise<{ success: boolean; timestamp: string; version: string }> {
    const response = await this.httpClient.get<{ timestamp: string; version: string }>('/ping');
    return {
      success: response.success,
      timestamp: response.data.timestamp,
      version: response.data.version,
    };
  }

  /**
   * Get the current user's profile and API usage information
   * 
   * @returns Promise resolving to user profile data
   */
  async getProfile() {
    return this.user.getProfile();
  }

  /**
   * Get API usage statistics for the current user
   * 
   * @returns Promise resolving to usage statistics
   */
  async getUsage() {
    return this.user.getUsageStats();
  }
}

// Export the main client as default
export default JewelMusic;

// Re-export types for convenience
export * from './types';
export * from './utils/http-client';

// Export individual resource classes for advanced usage
export {
  CopilotResource,
  AnalysisResource,
  DistributionResource,
  TranscriptionResource,
  TracksResource,
  AnalyticsResource,
  UserResource,
  WebhooksResource,
};

/**
 * Create a new JewelMusic client instance
 * 
 * This is a convenience function that creates a new client with the provided configuration.
 * 
 * @param config - Configuration options for the client
 * @returns A new JewelMusic client instance
 * 
 * @example
 * ```typescript
 * import { createClient } from '@jewelmusic/sdk';
 * 
 * const client = createClient({
 *   apiKey: process.env.JEWELMUSIC_API_KEY!,
 *   environment: 'production'
 * });
 * ```
 */
export function createClient(config: JewelMusicConfig): JewelMusic {
  return new JewelMusic(config);
}