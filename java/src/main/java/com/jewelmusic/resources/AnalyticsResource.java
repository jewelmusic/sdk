package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import java.util.HashMap;
import java.util.Map;

/**
 * Analytics resource for music analytics and insights.
 * <p>
 * This resource provides comprehensive analytics capabilities for tracking
 * music performance, user engagement, streaming metrics, revenue analytics,
 * and detailed reporting across the JewelMusic platform.
 *
 * @since 1.0.0
 */
public class AnalyticsResource extends BaseResource {
    
    /**
     * Creates a new analytics resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public AnalyticsResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/analytics";
    }
    
    /**
     * Gets overall analytics summary for the authenticated user.
     *
     * @return Map containing analytics overview
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getOverview() {
        return getOverview(null);
    }
    
    /**
     * Gets analytics overview for a specific time period.
     *
     * @param timeframe Timeframe for analytics (day, week, month, year)
     * @return Map containing analytics overview
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getOverview(String timeframe) {
        Map<String, String> params = new HashMap<>();
        if (timeframe != null && !timeframe.isEmpty()) {
            params.put("timeframe", timeframe);
        }
        return httpClient.get(getBasePath() + "/overview", params);
    }
    
    /**
     * Gets streaming analytics for tracks.
     *
     * @return Map containing streaming metrics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getStreamingAnalytics() {
        return getStreamingAnalytics(null);
    }
    
    /**
     * Gets streaming analytics with specific filters.
     *
     * @param filters Analytics filters (date range, platforms, tracks)
     * @return Map containing filtered streaming metrics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getStreamingAnalytics(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/streaming", filters);
    }
    
    /**
     * Gets analytics for a specific track.
     *
     * @param trackId The ID of the track
     * @return Map containing track analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrackAnalytics(String trackId) {
        return getTrackAnalytics(trackId, null);
    }
    
    /**
     * Gets track analytics for a specific time period.
     *
     * @param trackId The ID of the track
     * @param timeframe Timeframe for analytics
     * @return Map containing track analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrackAnalytics(String trackId, String timeframe) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        if (timeframe != null && !timeframe.isEmpty()) {
            params.put("timeframe", timeframe);
        }
        return httpClient.get(getBasePath() + "/tracks", params);
    }
    
    /**
     * Gets audience demographics and insights.
     *
     * @return Map containing audience analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAudienceAnalytics() {
        return getAudienceAnalytics(null);
    }
    
    /**
     * Gets audience analytics with specific parameters.
     *
     * @param params Analytics parameters (demographics, regions, age groups)
     * @return Map containing audience analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAudienceAnalytics(Map<String, String> params) {
        return httpClient.get(getBasePath() + "/audience", params);
    }
    
    /**
     * Gets revenue and earnings analytics.
     *
     * @return Map containing revenue analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRevenueAnalytics() {
        return getRevenueAnalytics(null);
    }
    
    /**
     * Gets revenue analytics for a specific period or breakdown.
     *
     * @param params Revenue parameters (timeframe, platforms, breakdown type)
     * @return Map containing revenue analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRevenueAnalytics(Map<String, String> params) {
        return httpClient.get(getBasePath() + "/revenue", params);
    }
    
    /**
     * Gets geographic analytics showing where music is being played.
     *
     * @return Map containing geographic analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getGeographicAnalytics() {
        return getGeographicAnalytics(null);
    }
    
    /**
     * Gets geographic analytics with specific filters.
     *
     * @param filters Geographic filters (regions, countries, cities)
     * @return Map containing geographic analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getGeographicAnalytics(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/geographic", filters);
    }
    
    /**
     * Gets platform-specific analytics.
     *
     * @return Map containing platform analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPlatformAnalytics() {
        return getPlatformAnalytics(null);
    }
    
    /**
     * Gets analytics for specific platforms.
     *
     * @param platforms Platform filters or specific platform names
     * @return Map containing platform analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPlatformAnalytics(Map<String, String> platforms) {
        return httpClient.get(getBasePath() + "/platforms", platforms);
    }
    
    /**
     * Gets trend analytics showing performance over time.
     *
     * @return Map containing trend analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrendAnalytics() {
        return getTrendAnalytics(null);
    }
    
    /**
     * Gets trend analytics with specific metrics and timeframes.
     *
     * @param params Trend parameters (metrics, resolution, comparison periods)
     * @return Map containing trend analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrendAnalytics(Map<String, String> params) {
        return httpClient.get(getBasePath() + "/trends", params);
    }
    
    /**
     * Gets engagement analytics (likes, shares, saves, etc.).
     *
     * @return Map containing engagement analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getEngagementAnalytics() {
        return getEngagementAnalytics(null);
    }
    
    /**
     * Gets engagement analytics with specific filters.
     *
     * @param filters Engagement filters (interaction types, timeframe)
     * @return Map containing engagement analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getEngagementAnalytics(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/engagement", filters);
    }
    
    /**
     * Creates a custom analytics report.
     *
     * @param reportConfig Report configuration (metrics, dimensions, filters)
     * @return Map containing the custom report
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createCustomReport(Map<String, Object> reportConfig) {
        return httpClient.post(getBasePath() + "/reports", reportConfig);
    }
    
    /**
     * Gets a previously created custom report.
     *
     * @param reportId The ID of the report
     * @return Map containing the report data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getCustomReport(String reportId) {
        return httpClient.get(getBasePath() + "/reports/" + reportId);
    }
    
    /**
     * Lists all custom reports for the authenticated user.
     *
     * @return Map containing list of custom reports
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listCustomReports() {
        return listCustomReports(null);
    }
    
    /**
     * Lists custom reports with specific filters.
     *
     * @param filters Report filters (date range, type, status)
     * @return Map containing filtered list of reports
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listCustomReports(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/reports", filters);
    }
    
    /**
     * Exports analytics data in various formats.
     *
     * @param exportConfig Export configuration (format, data selection, date range)
     * @return Map containing export information or download URL
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> exportData(Map<String, Object> exportConfig) {
        return httpClient.post(getBasePath() + "/export", exportConfig);
    }
    
    /**
     * Gets real-time analytics data.
     *
     * @return Map containing real-time metrics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRealTimeAnalytics() {
        return getRealTimeAnalytics(null);
    }
    
    /**
     * Gets real-time analytics with specific metrics.
     *
     * @param metrics Specific metrics to include in real-time data
     * @return Map containing real-time metrics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRealTimeAnalytics(Map<String, String> metrics) {
        return httpClient.get(getBasePath() + "/realtime", metrics);
    }
    
    /**
     * Gets comparative analytics between different periods or entities.
     *
     * @param comparisonConfig Comparison configuration (periods, tracks, metrics)
     * @return Map containing comparative analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getComparativeAnalytics(Map<String, Object> comparisonConfig) {
        return httpClient.post(getBasePath() + "/compare", comparisonConfig);
    }
    
    /**
     * Gets predictive analytics and forecasting.
     *
     * @return Map containing predictive analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPredictiveAnalytics() {
        return getPredictiveAnalytics(null);
    }
    
    /**
     * Gets predictive analytics with specific parameters.
     *
     * @param params Prediction parameters (timeframe, confidence level, metrics)
     * @return Map containing predictive analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPredictiveAnalytics(Map<String, String> params) {
        return httpClient.get(getBasePath() + "/predictive", params);
    }
}