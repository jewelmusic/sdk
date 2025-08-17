import { BaseResource } from './base';
import {
  AnalyticsQuery,
  AnalyticsData,
  RoyaltyReport,
  AnalyticsMetric,
} from '../types';

/**
 * Analytics Resource
 * 
 * Provides comprehensive analytics and royalty tracking capabilities.
 * Access streaming data, revenue information, geographic insights,
 * and performance metrics across all platforms.
 */
export class AnalyticsResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/analytics');
  }

  /**
   * Get streaming analytics data
   * 
   * @param query - Analytics query parameters
   * @returns Promise resolving to streaming analytics
   * 
   * @example
   * ```typescript
   * const analytics = await client.analytics.getStreams({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   groupBy: 'day',
   *   platforms: ['spotify', 'apple-music'],
   *   metrics: ['streams', 'listeners', 'revenue']
   * });
   * 
   * console.log('Total streams:', analytics.data.summary.totalStreams);
   * console.log('Daily breakdown:', analytics.data.data);
   * ```
   */
  async getStreams(query: AnalyticsQuery): Promise<AnalyticsData> {
    this.validateRequired(query, ['startDate', 'endDate']);

    const response = await this.get<AnalyticsData>('/streams', {
      startDate: query.startDate,
      endDate: query.endDate,
      groupBy: query.groupBy || 'day',
      platforms: query.platforms,
      territories: query.territories,
      tracks: query.tracks,
      metrics: query.metrics || ['streams'],
    });

    return this.extractData(response);
  }

  /**
   * Get listener demographics and behavior data
   * 
   * @param query - Analytics query parameters
   * @returns Promise resolving to listener analytics
   * 
   * @example
   * ```typescript
   * const listeners = await client.analytics.getListeners({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   groupBy: 'territory',
   *   metrics: ['listeners', 'newListeners', 'returningListeners']
   * });
   * 
   * console.log('Listener demographics:', listeners.data.demographics);
   * console.log('Geographic breakdown:', listeners.data.geographic);
   * ```
   */
  async getListeners(query: AnalyticsQuery) {
    this.validateRequired(query, ['startDate', 'endDate']);

    const response = await this.get('/listeners', {
      startDate: query.startDate,
      endDate: query.endDate,
      groupBy: query.groupBy || 'territory',
      platforms: query.platforms,
      territories: query.territories,
      tracks: query.tracks,
      metrics: query.metrics || ['listeners'],
    });

    return this.extractData(response);
  }

  /**
   * Get platform-specific performance metrics
   * 
   * @param query - Analytics query parameters
   * @returns Promise resolving to platform analytics
   * 
   * @example
   * ```typescript
   * const platforms = await client.analytics.getPlatformMetrics({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   groupBy: 'platform',
   *   metrics: ['streams', 'revenue', 'plays', 'skips']
   * });
   * 
   * platforms.data.data.forEach(platform => {
   *   console.log(`${platform.platform}: ${platform.metrics.streams} streams`);
   * });
   * ```
   */
  async getPlatformMetrics(query: AnalyticsQuery) {
    this.validateRequired(query, ['startDate', 'endDate']);

    const response = await this.get('/platform-metrics', {
      startDate: query.startDate,
      endDate: query.endDate,
      groupBy: query.groupBy || 'platform',
      platforms: query.platforms,
      territories: query.territories,
      tracks: query.tracks,
      metrics: query.metrics || ['streams', 'revenue'],
    });

    return this.extractData(response);
  }

  /**
   * Get geographical streaming data
   * 
   * @param query - Analytics query parameters
   * @returns Promise resolving to geographical analytics
   * 
   * @example
   * ```typescript
   * const geographic = await client.analytics.getGeographicalData({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   groupBy: 'territory',
   *   metrics: ['streams', 'listeners']
   * });
   * 
   * console.log('Top territories:', geographic.data.topTerritories);
   * console.log('Geographic distribution:', geographic.data.distribution);
   * ```
   */
  async getGeographicalData(query: AnalyticsQuery) {
    this.validateRequired(query, ['startDate', 'endDate']);

    const response = await this.get('/geographical', {
      startDate: query.startDate,
      endDate: query.endDate,
      groupBy: query.groupBy || 'territory',
      platforms: query.platforms,
      territories: query.territories,
      tracks: query.tracks,
      metrics: query.metrics || ['streams', 'listeners'],
    });

    return this.extractData(response);
  }

  /**
   * Get trending analysis and insights
   * 
   * @param query - Analytics query parameters
   * @returns Promise resolving to trending analytics
   * 
   * @example
   * ```typescript
   * const trends = await client.analytics.getTrends({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   groupBy: 'week',
   *   metrics: ['streams', 'velocity', 'growth']
   * });
   * 
   * console.log('Trending tracks:', trends.data.trendingTracks);
   * console.log('Growth rate:', trends.data.growthRate);
   * ```
   */
  async getTrends(query: AnalyticsQuery) {
    this.validateRequired(query, ['startDate', 'endDate']);

    const response = await this.get('/trends', {
      startDate: query.startDate,
      endDate: query.endDate,
      groupBy: query.groupBy || 'week',
      platforms: query.platforms,
      territories: query.territories,
      tracks: query.tracks,
      metrics: query.metrics || ['streams', 'velocity'],
    });

    return this.extractData(response);
  }

  /**
   * Get royalty reports for a specific period
   * 
   * @param startDate - Start date for the report
   * @param endDate - End date for the report
   * @param options - Report options
   * @returns Promise resolving to royalty report
   * 
   * @example
   * ```typescript
   * const royalties = await client.analytics.getRoyaltyReports(
   *   '2025-01-01',
   *   '2025-01-31',
   *   { 
   *     currency: 'USD',
   *     includePending: true,
   *     groupBy: 'platform'
   *   }
   * );
   * 
   * console.log('Total revenue:', royalties.data.totalRevenue);
   * console.log('Platform breakdown:', royalties.data.breakdown);
   * ```
   */
  async getRoyaltyReports(
    startDate: string,
    endDate: string,
    options: {
      currency?: string;
      includePending?: boolean;
      groupBy?: 'platform' | 'track' | 'territory' | 'day';
      platforms?: string[];
    } = {}
  ): Promise<RoyaltyReport> {
    this.validateRequired({ startDate, endDate }, ['startDate', 'endDate']);

    const response = await this.get<RoyaltyReport>('/royalties/reports', {
      startDate,
      endDate,
      currency: options.currency || 'USD',
      includePending: options.includePending !== false,
      groupBy: options.groupBy || 'platform',
      platforms: options.platforms,
    });

    return this.extractData(response);
  }

  /**
   * Download royalty statements
   * 
   * @param reportId - Royalty report ID
   * @param format - Download format
   * @returns Promise resolving to download information
   * 
   * @example
   * ```typescript
   * const statement = await client.analytics.downloadRoyaltyStatement(
   *   'report_123',
   *   'pdf'
   * );
   * 
   * console.log('Download URL:', statement.data.downloadUrl);
   * ```
   */
  async downloadRoyaltyStatement(
    reportId: string,
    format: 'pdf' | 'csv' | 'xlsx' = 'pdf'
  ) {
    this.validateRequired({ reportId }, ['reportId']);

    const response = await this.get(`/royalties/statements/${reportId}`, {
      format,
    });

    return this.extractData(response);
  }

  /**
   * Get revenue projections based on current trends
   * 
   * @param options - Projection options
   * @returns Promise resolving to revenue projections
   * 
   * @example
   * ```typescript
   * const projections = await client.analytics.getRevenueProjections({
   *   period: 'next_30_days',
   *   tracks: ['track_1', 'track_2'],
   *   includeConfidenceInterval: true
   * });
   * 
   * console.log('Projected revenue:', projections.data.projected);
   * console.log('Confidence:', projections.data.confidence);
   * ```
   */
  async getRevenueProjections(options: {
    period?: 'next_7_days' | 'next_30_days' | 'next_90_days';
    tracks?: string[];
    platforms?: string[];
    includeConfidenceInterval?: boolean;
  } = {}) {
    const response = await this.get('/royalties/projections', {
      period: options.period || 'next_30_days',
      tracks: options.tracks,
      platforms: options.platforms,
      includeConfidenceInterval: options.includeConfidenceInterval !== false,
    });

    return this.extractData(response);
  }

  /**
   * Get track performance analytics
   * 
   * @param trackId - Track ID
   * @param query - Analytics query parameters
   * @returns Promise resolving to track analytics
   * 
   * @example
   * ```typescript
   * const trackAnalytics = await client.analytics.getTrackAnalytics('track_123', {
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   metrics: ['streams', 'listeners', 'revenue', 'saves'],
   *   groupBy: 'day'
   * });
   * 
   * console.log('Track performance:', trackAnalytics.data.performance);
   * console.log('Comparison to average:', trackAnalytics.data.comparison);
   * ```
   */
  async getTrackAnalytics(trackId: string, query: AnalyticsQuery) {
    this.validateRequired({ trackId }, ['trackId']);
    this.validateRequired(query, ['startDate', 'endDate']);

    const response = await this.get(`/tracks/${trackId}`, {
      startDate: query.startDate,
      endDate: query.endDate,
      groupBy: query.groupBy || 'day',
      metrics: query.metrics || ['streams', 'listeners'],
      platforms: query.platforms,
      territories: query.territories,
    });

    return this.extractData(response);
  }

  /**
   * Get real-time analytics dashboard data
   * 
   * @param options - Dashboard options
   * @returns Promise resolving to real-time analytics
   * 
   * @example
   * ```typescript
   * const realtime = await client.analytics.getRealtimeAnalytics({
   *   period: 'last_24_hours',
   *   updateInterval: 300000 // 5 minutes
   * });
   * 
   * console.log('Current streams:', realtime.data.currentStreams);
   * console.log('Active listeners:', realtime.data.activeListeners);
   * ```
   */
  async getRealtimeAnalytics(options: {
    period?: 'last_hour' | 'last_24_hours' | 'last_7_days';
    updateInterval?: number;
    metrics?: AnalyticsMetric[];
  } = {}) {
    const response = await this.get('/realtime', {
      period: options.period || 'last_24_hours',
      updateInterval: options.updateInterval || 300000,
      metrics: options.metrics || ['streams', 'listeners'],
    });

    return this.extractData(response);
  }

  /**
   * Get comparative analytics against industry benchmarks
   * 
   * @param query - Analytics query parameters
   * @param benchmarkType - Type of benchmark comparison
   * @returns Promise resolving to comparative analytics
   * 
   * @example
   * ```typescript
   * const comparison = await client.analytics.getComparativeAnalytics({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   metrics: ['streams', 'engagement']
   * }, 'genre');
   * 
   * console.log('vs Genre average:', comparison.data.genreComparison);
   * console.log('Percentile ranking:', comparison.data.percentile);
   * ```
   */
  async getComparativeAnalytics(
    query: AnalyticsQuery,
    benchmarkType: 'genre' | 'similar_artists' | 'platform_average' | 'industry' = 'genre'
  ) {
    this.validateRequired(query, ['startDate', 'endDate']);

    const response = await this.get('/comparative', {
      startDate: query.startDate,
      endDate: query.endDate,
      benchmarkType,
      groupBy: query.groupBy || 'week',
      metrics: query.metrics || ['streams', 'listeners'],
      platforms: query.platforms,
      territories: query.territories,
      tracks: query.tracks,
    });

    return this.extractData(response);
  }

  /**
   * Export analytics data to external formats
   * 
   * @param query - Analytics query parameters
   * @param exportOptions - Export configuration
   * @returns Promise resolving to export information
   * 
   * @example
   * ```typescript
   * const exported = await client.analytics.exportData({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   metrics: ['streams', 'revenue']
   * }, {
   *   format: 'csv',
   *   includeCharts: true,
   *   email: 'analytics@example.com'
   * });
   * 
   * console.log('Export URL:', exported.data.downloadUrl);
   * ```
   */
  async exportData(
    query: AnalyticsQuery,
    exportOptions: {
      format: 'csv' | 'xlsx' | 'json' | 'pdf';
      includeCharts?: boolean;
      email?: string;
      customTemplate?: string;
    }
  ) {
    this.validateRequired(query, ['startDate', 'endDate']);
    this.validateRequired(exportOptions, ['format']);

    const response = await this.post('/export', {
      query,
      format: exportOptions.format,
      includeCharts: exportOptions.includeCharts || false,
      email: exportOptions.email,
      customTemplate: exportOptions.customTemplate,
    });

    return this.extractData(response);
  }

  /**
   * Set up analytics alerts for specific conditions
   * 
   * @param alertConfig - Alert configuration
   * @returns Promise resolving to alert setup confirmation
   * 
   * @example
   * ```typescript
   * const alert = await client.analytics.setupAlert({
   *   name: 'High Stream Alert',
   *   condition: {
   *     metric: 'streams',
   *     operator: 'greater_than',
   *     threshold: 10000,
   *     period: 'daily'
   *   },
   *   notifications: ['email', 'webhook'],
   *   email: 'alerts@example.com'
   * });
   * ```
   */
  async setupAlert(alertConfig: {
    name: string;
    condition: {
      metric: AnalyticsMetric;
      operator: 'greater_than' | 'less_than' | 'equals' | 'percentage_change';
      threshold: number;
      period: 'hourly' | 'daily' | 'weekly';
    };
    notifications: Array<'email' | 'webhook' | 'sms'>;
    email?: string;
    webhookUrl?: string;
    phone?: string;
  }) {
    this.validateRequired(alertConfig, ['name', 'condition', 'notifications']);

    const response = await this.post('/alerts', alertConfig);
    return this.extractData(response);
  }

  /**
   * Get analytics insights and recommendations
   * 
   * @param options - Insight options
   * @returns Promise resolving to AI-generated insights
   * 
   * @example
   * ```typescript
   * const insights = await client.analytics.getInsights({
   *   period: 'last_30_days',
   *   includeRecommendations: true,
   *   focus: 'growth'
   * });
   * 
   * console.log('Key insights:', insights.data.insights);
   * console.log('Recommendations:', insights.data.recommendations);
   * ```
   */
  async getInsights(options: {
    period?: 'last_7_days' | 'last_30_days' | 'last_90_days';
    includeRecommendations?: boolean;
    focus?: 'growth' | 'revenue' | 'engagement' | 'reach';
    tracks?: string[];
  } = {}) {
    const response = await this.get('/insights', {
      period: options.period || 'last_30_days',
      includeRecommendations: options.includeRecommendations !== false,
      focus: options.focus || 'growth',
      tracks: options.tracks,
    });

    return this.extractData(response);
  }

  /**
   * Get custom analytics dashboard configuration
   * 
   * @param dashboardId - Dashboard ID (optional for default)
   * @returns Promise resolving to dashboard configuration
   * 
   * @example
   * ```typescript
   * const dashboard = await client.analytics.getDashboard('custom_dashboard_1');
   * console.log('Widgets:', dashboard.data.widgets);
   * console.log('Filters:', dashboard.data.filters);
   * ```
   */
  async getDashboard(dashboardId?: string) {
    const path = dashboardId ? `/dashboards/${dashboardId}` : '/dashboards/default';
    const response = await this.get(path);
    return this.extractData(response);
  }

  /**
   * Create or update custom analytics dashboard
   * 
   * @param dashboardConfig - Dashboard configuration
   * @returns Promise resolving to dashboard save confirmation
   * 
   * @example
   * ```typescript
   * const dashboard = await client.analytics.saveDashboard({
   *   name: 'My Custom Dashboard',
   *   widgets: [
   *     { type: 'streams_chart', timeframe: '30d' },
   *     { type: 'revenue_summary', currency: 'USD' },
   *     { type: 'top_tracks', limit: 10 }
   *   ],
   *   filters: { platforms: ['spotify', 'apple-music'] }
   * });
   * ```
   */
  async saveDashboard(dashboardConfig: {
    name: string;
    widgets: Array<{
      type: string;
      position?: { x: number; y: number; width: number; height: number };
      config?: Record<string, any>;
    }>;
    filters?: Record<string, any>;
    isDefault?: boolean;
  }) {
    this.validateRequired(dashboardConfig, ['name', 'widgets']);

    const response = await this.post('/dashboards', dashboardConfig);
    return this.extractData(response);
  }
}