import { BaseResource, ListResponse, QueryParams } from './base';
import {
  Release,
  CreateReleaseOptions,
  UpdateReleaseOptions,
  DistributionStatus,
  ReleaseStatus,
} from '../types';

/**
 * Distribution Resource
 * 
 * Manages music distribution to streaming platforms, release scheduling,
 * and platform-specific optimizations. Handles the complete workflow
 * from release creation to live distribution across 150+ platforms.
 */
export class DistributionResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/distribution');
  }

  /**
   * Create a new release for distribution
   * 
   * @param options - Release configuration options
   * @returns Promise resolving to the created release
   * 
   * @example
   * ```typescript
   * const release = await client.distribution.createRelease({
   *   type: 'album',
   *   title: 'My Album',
   *   artist: 'Artist Name',
   *   tracks: ['track_1', 'track_2', 'track_3'],
   *   releaseDate: '2025-09-01',
   *   platforms: ['spotify', 'apple-music', 'youtube-music'],
   *   territories: ['worldwide']
   * });
   * 
   * console.log('Release created:', release.data.id);
   * ```
   */
  async createRelease(options: CreateReleaseOptions): Promise<Release> {
    this.validateRequired(options, ['type', 'title', 'artist', 'tracks', 'releaseDate']);

    if (options.tracks.length === 0) {
      throw new Error('At least one track is required for a release');
    }

    if (options.type === 'single' && options.tracks.length > 1) {
      throw new Error('Singles can only contain one track');
    }

    const response = await this.post<Release>('/releases', {
      type: options.type,
      title: options.title,
      artist: options.artist,
      tracks: options.tracks,
      releaseDate: options.releaseDate,
      territories: options.territories || ['worldwide'],
      platforms: options.platforms || [],
      label: options.label,
      copyright: options.copyright || {
        text: `© ${new Date().getFullYear()} ${options.artist}`,
        year: new Date().getFullYear(),
      },
      metadata: options.metadata,
      schedule: options.schedule || false,
    });

    return this.extractData(response);
  }

  /**
   * Get all releases with optional filtering
   * 
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated releases list
   * 
   * @example
   * ```typescript
   * const releases = await client.distribution.getReleases({
   *   page: 1,
   *   perPage: 20,
   *   sortBy: 'releaseDate',
   *   sortOrder: 'desc',
   *   filter: { status: 'live' }
   * });
   * 
   * console.log('Releases:', releases.data.items);
   * console.log('Total:', releases.data.pagination.total);
   * ```
   */
  async getReleases(params: QueryParams & {
    status?: ReleaseStatus;
    type?: Release['type'];
    artist?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<ListResponse<Release>> {
    const response = await this.get<ListResponse<Release>>('/releases', {
      page: params.page || 1,
      perPage: params.perPage || 20,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      status: params.status,
      type: params.type,
      artist: params.artist,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      search: params.search,
    });

    return this.extractData(response);
  }

  /**
   * Get a specific release by ID
   * 
   * @param id - Release ID
   * @returns Promise resolving to release details
   * 
   * @example
   * ```typescript
   * const release = await client.distribution.getRelease('release_123');
   * console.log('Release details:', release.data);
   * console.log('Distribution status:', release.data.distributionStatus);
   * ```
   */
  async getRelease(id: string): Promise<Release> {
    this.validateRequired({ id }, ['id']);

    const response = await this.get<Release>(`/releases/${id}`);
    return this.extractData(response);
  }

  /**
   * Update an existing release
   * 
   * @param id - Release ID
   * @param updates - Fields to update
   * @returns Promise resolving to updated release
   * 
   * @example
   * ```typescript
   * const updated = await client.distribution.updateRelease('release_123', {
   *   title: 'Updated Album Title',
   *   releaseDate: '2025-10-01',
   *   platforms: ['spotify', 'apple-music', 'tidal']
   * });
   * ```
   */
  async updateRelease(id: string, updates: UpdateReleaseOptions): Promise<Release> {
    this.validateRequired({ id }, ['id']);

    const response = await this.put<Release>(`/releases/${id}`, updates);
    return this.extractData(response);
  }

  /**
   * Cancel or delete a release
   * 
   * @param id - Release ID
   * @param reason - Reason for cancellation
   * @returns Promise resolving to cancellation confirmation
   * 
   * @example
   * ```typescript
   * await client.distribution.cancelRelease('release_123', 'Artist request');
   * console.log('Release cancelled');
   * ```
   */
  async cancelRelease(id: string, reason?: string) {
    this.validateRequired({ id }, ['id']);

    const response = await this.delete(`/releases/${id}`, {
      data: { reason },
    });

    return this.extractData(response);
  }

  /**
   * Submit release to specific streaming platforms
   * 
   * @param releaseId - Release ID
   * @param platforms - Array of platform names
   * @param options - Submission options
   * @returns Promise resolving to submission status
   * 
   * @example
   * ```typescript
   * const submission = await client.distribution.submitToPlatforms(
   *   'release_123',
   *   ['spotify', 'apple-music', 'youtube-music'],
   *   { priority: 'high', fastTrack: true }
   * );
   * ```
   */
  async submitToPlatforms(
    releaseId: string, 
    platforms: string[],
    options: {
      priority?: 'low' | 'normal' | 'high';
      fastTrack?: boolean;
      scheduledDate?: string;
      territories?: string[];
    } = {}
  ) {
    this.validateRequired({ releaseId, platforms }, ['releaseId', 'platforms']);

    if (platforms.length === 0) {
      throw new Error('At least one platform is required');
    }

    const response = await this.post('/platforms/submit', {
      releaseId,
      platforms,
      priority: options.priority || 'normal',
      fastTrack: options.fastTrack || false,
      scheduledDate: options.scheduledDate,
      territories: options.territories || ['worldwide'],
    });

    return this.extractData(response);
  }

  /**
   * Get distribution status for a release
   * 
   * @param releaseId - Release ID
   * @returns Promise resolving to distribution status across platforms
   * 
   * @example
   * ```typescript
   * const status = await client.distribution.getDistributionStatus('release_123');
   * 
   * status.data.forEach(platform => {
   *   console.log(`${platform.platform}: ${platform.status}`);
   *   if (platform.storeUrl) {
   *     console.log(`Store URL: ${platform.storeUrl}`);
   *   }
   * });
   * ```
   */
  async getDistributionStatus(releaseId: string): Promise<DistributionStatus[]> {
    this.validateRequired({ releaseId }, ['releaseId']);

    const response = await this.get<DistributionStatus[]>(`/platforms/status`, {
      releaseId,
    });

    return this.extractData(response);
  }

  /**
   * Remove release from specific platforms (takedown)
   * 
   * @param releaseId - Release ID
   * @param platforms - Platforms to remove from
   * @param reason - Reason for takedown
   * @returns Promise resolving to takedown confirmation
   * 
   * @example
   * ```typescript
   * await client.distribution.takedownFromPlatforms(
   *   'release_123',
   *   ['spotify', 'apple-music'],
   *   'Rights expiration'
   * );
   * ```
   */
  async takedownFromPlatforms(releaseId: string, platforms: string[], reason?: string) {
    this.validateRequired({ releaseId, platforms }, ['releaseId', 'platforms']);

    const response = await this.post('/platforms/takedown', {
      releaseId,
      platforms,
      reason,
    });

    return this.extractData(response);
  }

  /**
   * Get list of supported streaming platforms
   * 
   * @param territory - Filter by territory/region
   * @param tier - Filter by subscription tier
   * @returns Promise resolving to supported platforms list
   * 
   * @example
   * ```typescript
   * const platforms = await client.distribution.getSupportedPlatforms('US', 'professional');
   * console.log('Available platforms:', platforms.data.map(p => p.name));
   * ```
   */
  async getSupportedPlatforms(territory?: string, tier?: string) {
    const response = await this.get('/platforms/supported', {
      territory,
      tier,
    });

    return this.extractData(response);
  }

  /**
   * Validate release for distribution
   * 
   * @param releaseData - Release data to validate
   * @returns Promise resolving to validation results
   * 
   * @example
   * ```typescript
   * const validation = await client.distribution.validateRelease({
   *   type: 'album',
   *   title: 'My Album',
   *   artist: 'Artist Name',
   *   tracks: ['track_1', 'track_2'],
   *   releaseDate: '2025-09-01'
   * });
   * 
   * if (!validation.data.valid) {
   *   console.log('Validation errors:', validation.data.errors);
   * }
   * ```
   */
  async validateRelease(releaseData: Partial<CreateReleaseOptions>) {
    const response = await this.post('/validate', releaseData);
    return this.extractData(response);
  }

  /**
   * Schedule a release for future distribution
   * 
   * @param releaseId - Release ID
   * @param scheduledDate - Date to schedule for
   * @param options - Scheduling options
   * @returns Promise resolving to scheduling confirmation
   * 
   * @example
   * ```typescript
   * await client.distribution.scheduleRelease('release_123', '2025-09-01', {
   *   timezone: 'UTC',
   *   sendReminders: true
   * });
   * ```
   */
  async scheduleRelease(
    releaseId: string, 
    scheduledDate: string,
    options: {
      timezone?: string;
      sendReminders?: boolean;
      autoSubmit?: boolean;
    } = {}
  ) {
    this.validateRequired({ releaseId, scheduledDate }, ['releaseId', 'scheduledDate']);

    const response = await this.post('/schedule', {
      releaseId,
      scheduledDate,
      timezone: options.timezone || 'UTC',
      sendReminders: options.sendReminders !== false,
      autoSubmit: options.autoSubmit !== false,
    });

    return this.extractData(response);
  }

  /**
   * Generate distribution preview
   * 
   * @param releaseId - Release ID
   * @param format - Preview format
   * @returns Promise resolving to preview data or URL
   * 
   * @example
   * ```typescript
   * const preview = await client.distribution.generatePreview('release_123', 'html');
   * console.log('Preview URL:', preview.data.previewUrl);
   * ```
   */
  async generatePreview(releaseId: string, format: 'html' | 'pdf' | 'json' = 'html') {
    this.validateRequired({ releaseId }, ['releaseId']);

    const response = await this.post('/preview', {
      releaseId,
      format,
    });

    return this.extractData(response);
  }

  /**
   * Get platform-specific requirements
   * 
   * @param platform - Platform name
   * @param territory - Target territory
   * @returns Promise resolving to platform requirements
   * 
   * @example
   * ```typescript
   * const requirements = await client.distribution.getPlatformRequirements('spotify', 'US');
   * console.log('Audio requirements:', requirements.data.audio);
   * console.log('Metadata requirements:', requirements.data.metadata);
   * ```
   */
  async getPlatformRequirements(platform: string, territory?: string) {
    this.validateRequired({ platform }, ['platform']);

    const response = await this.get(`/platforms/${platform}/requirements`, {
      territory,
    });

    return this.extractData(response);
  }

  /**
   * Get distribution analytics
   * 
   * @param releaseId - Release ID
   * @param dateRange - Date range for analytics
   * @returns Promise resolving to distribution analytics
   * 
   * @example
   * ```typescript
   * const analytics = await client.distribution.getDistributionAnalytics(
   *   'release_123',
   *   { from: '2025-01-01', to: '2025-01-31' }
   * );
   * 
   * console.log('Platform performance:', analytics.data.platformMetrics);
   * ```
   */
  async getDistributionAnalytics(
    releaseId: string,
    dateRange: { from: string; to: string }
  ) {
    this.validateRequired({ releaseId, dateRange }, ['releaseId', 'dateRange']);

    const response = await this.get(`/releases/${releaseId}/analytics`, {
      from: dateRange.from,
      to: dateRange.to,
    });

    return this.extractData(response);
  }

  /**
   * Wait for release to go live
   * 
   * @param releaseId - Release ID
   * @param platforms - Platforms to wait for (optional, waits for all if not specified)
   * @param pollInterval - Polling interval in milliseconds
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise resolving when release is live
   * 
   * @example
   * ```typescript
   * const release = await client.distribution.createRelease(releaseOptions);
   * await client.distribution.submitToPlatforms(release.data.id, ['spotify', 'apple-music']);
   * 
   * const liveRelease = await client.distribution.waitForLive(
   *   release.data.id,
   *   ['spotify', 'apple-music']
   * );
   * 
   * console.log('Release is now live!');
   * ```
   */
  async waitForLive(
    releaseId: string,
    platforms?: string[],
    pollInterval: number = 30000,
    timeout: number = 7200000 // 2 hours
  ): Promise<Release> {
    return this.pollForCompletion(
      () => releaseId,
      async (id) => {
        const [release, distributionStatus] = await Promise.all([
          this.getRelease(id),
          this.getDistributionStatus(id),
        ]);

        const targetPlatforms = platforms || release.platforms;
        const relevantStatuses = distributionStatus.filter(status => 
          targetPlatforms.includes(status.platform)
        );

        const allLive = relevantStatuses.every(status => status.status === 'live');
        
        return {
          ...release,
          _isLive: allLive,
        } as any;
      },
      (result: any) => result._isLive === true,
      pollInterval,
      timeout
    );
  }

  /**
   * Get release earnings summary
   * 
   * @param releaseId - Release ID
   * @param period - Period for earnings ('last_30_days', 'last_90_days', 'all_time')
   * @returns Promise resolving to earnings summary
   * 
   * @example
   * ```typescript
   * const earnings = await client.distribution.getReleaseEarnings(
   *   'release_123',
   *   'last_30_days'
   * );
   * 
   * console.log('Total earnings:', earnings.data.totalEarnings);
   * console.log('Platform breakdown:', earnings.data.platformBreakdown);
   * ```
   */
  async getReleaseEarnings(
    releaseId: string,
    period: 'last_30_days' | 'last_90_days' | 'all_time' = 'last_30_days'
  ) {
    this.validateRequired({ releaseId }, ['releaseId']);

    const response = await this.get(`/releases/${releaseId}/earnings`, {
      period,
    });

    return this.extractData(response);
  }

  /**
   * Update release artwork
   * 
   * @param releaseId - Release ID
   * @param artworkFile - New artwork file
   * @returns Promise resolving to update confirmation
   * 
   * @example
   * ```typescript
   * await client.distribution.updateArtwork('release_123', newArtworkFile);
   * console.log('Artwork updated');
   * ```
   */
  async updateArtwork(releaseId: string, artworkFile: File | Buffer) {
    this.validateRequired({ releaseId }, ['releaseId']);

    const response = await this.upload(`/releases/${releaseId}/artwork`, artworkFile);
    return this.extractData(response);
  }
}