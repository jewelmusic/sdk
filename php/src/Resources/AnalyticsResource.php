<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * Analytics resource for comprehensive music analytics and reporting
 */
class AnalyticsResource extends BaseResource
{
    /**
     * Get streaming analytics data
     *
     * @param array $query Analytics query parameters
     *                    - startDate: Start date for analytics period (required)
     *                    - endDate: End date for analytics period (required)
     *                    - groupBy: Data grouping (day, week, month, platform, territory)
     *                    - platforms: Specific platforms to include
     *                    - territories: Geographic territories
     *                    - tracks: Specific track IDs
     *                    - metrics: Specific metrics to retrieve
     * @return array Streaming analytics data
     */
    public function getStreams(array $query): array
    {
        $this->validateRequired($query, ['startDate', 'endDate']);
        
        $params = $this->buildParams([], $query);
        $response = $this->httpClient->get('/analytics/streams', $params);
        return $this->extractData($response);
    }

    /**
     * Get listener demographics and behavior data
     *
     * @param array $query Analytics query parameters
     * @return array Listener analytics data
     */
    public function getListeners(array $query): array
    {
        $this->validateRequired($query, ['startDate', 'endDate']);
        
        $params = $this->buildParams([], $query);
        $response = $this->httpClient->get('/analytics/listeners', $params);
        return $this->extractData($response);
    }

    /**
     * Get platform-specific performance metrics
     *
     * @param array $query Analytics query parameters
     * @return array Platform metrics data
     */
    public function getPlatformMetrics(array $query): array
    {
        $this->validateRequired($query, ['startDate', 'endDate']);
        
        $params = $this->buildParams([], $query);
        $response = $this->httpClient->get('/analytics/platform-metrics', $params);
        return $this->extractData($response);
    }

    /**
     * Get geographical streaming data
     *
     * @param array $query Analytics query parameters
     * @return array Geographical analytics data
     */
    public function getGeographicalData(array $query): array
    {
        $this->validateRequired($query, ['startDate', 'endDate']);
        
        $params = $this->buildParams([], $query);
        $response = $this->httpClient->get('/analytics/geographical', $params);
        return $this->extractData($response);
    }

    /**
     * Get trending analysis and insights
     *
     * @param array $query Analytics query parameters
     * @return array Trends analysis data
     */
    public function getTrends(array $query): array
    {
        $this->validateRequired($query, ['startDate', 'endDate']);
        
        $params = $this->buildParams([], $query);
        $response = $this->httpClient->get('/analytics/trends', $params);
        return $this->extractData($response);
    }

    /**
     * Get royalty reports for a specific period
     *
     * @param string $startDate Start date for royalty period
     * @param string $endDate End date for royalty period
     * @param array $options Royalty report options
     *                      - currency: Currency for earnings
     *                      - includePending: Include pending payments
     *                      - groupBy: Data grouping method
     *                      - platforms: Specific platforms
     * @return array Royalty reports data
     */
    public function getRoyaltyReports(string $startDate, string $endDate, array $options = []): array
    {
        $params = $this->buildParams([
            'startDate' => $startDate,
            'endDate' => $endDate
        ], $options);
        
        $response = $this->httpClient->get('/analytics/royalties/reports', $params);
        return $this->extractData($response);
    }

    /**
     * Download royalty statements
     *
     * @param string $reportId Royalty report ID
     * @param string $format Download format (pdf, csv, json)
     * @return array Download URL or data
     */
    public function downloadRoyaltyStatement(string $reportId, string $format = 'pdf'): array
    {
        $params = ['format' => $format];
        $response = $this->httpClient->get("/analytics/royalties/statements/{$reportId}", $params);
        return $this->extractData($response);
    }

    /**
     * Get revenue projections based on current trends
     *
     * @param array $options Projection options
     *                      - period: Projection period (month, quarter, year)
     *                      - tracks: Specific tracks to project
     *                      - platforms: Target platforms
     *                      - includeConfidenceInterval: Include confidence intervals
     * @return array Revenue projections
     */
    public function getRevenueProjections(array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get('/analytics/royalties/projections', $params);
        return $this->extractData($response);
    }

    /**
     * Get track performance analytics
     *
     * @param string $trackId Track ID
     * @param array $query Analytics query parameters
     * @return array Track analytics data
     */
    public function getTrackAnalytics(string $trackId, array $query): array
    {
        $this->validateRequired($query, ['startDate', 'endDate']);
        
        $params = $this->buildParams([], $query);
        $response = $this->httpClient->get("/analytics/tracks/{$trackId}", $params);
        return $this->extractData($response);
    }

    /**
     * Get real-time analytics dashboard data
     *
     * @param array $options Real-time options
     *                      - period: Time period for real-time data
     *                      - updateInterval: Update frequency in seconds
     *                      - metrics: Specific metrics to track
     * @return array Real-time analytics data
     */
    public function getRealtimeAnalytics(array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get('/analytics/realtime', $params);
        return $this->extractData($response);
    }

    /**
     * Get analytics insights and recommendations
     *
     * @param array $options Insights options
     *                      - period: Analysis period
     *                      - includeRecommendations: Include actionable recommendations
     *                      - focus: Focus areas (performance, growth, monetization)
     *                      - tracks: Specific tracks to analyze
     * @return array Analytics insights
     */
    public function getInsights(array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get('/analytics/insights', $params);
        return $this->extractData($response);
    }

    /**
     * Export analytics data to external formats
     *
     * @param array $query Analytics query for export
     * @param array $options Export options
     *                      - format: Export format (csv, json, xlsx, pdf)
     *                      - includeCharts: Include visualization charts
     *                      - email: Email address for delivery
     *                      - customTemplate: Custom report template
     * @return array Export job data or download URL
     */
    public function exportData(array $query, array $options = []): array
    {
        $this->validateRequired($query, ['startDate', 'endDate']);
        
        $data = array_merge(['query' => $query], $this->filterNullValues($options));
        $response = $this->httpClient->post('/analytics/export', $data);
        return $this->extractData($response);
    }

    /**
     * Set up analytics alerts for specific conditions
     *
     * @param array $alertConfig Alert configuration
     *                          - name: Alert name
     *                          - condition: Alert trigger condition
     *                          - notifications: Notification methods
     *                          - email: Email for notifications
     *                          - webhookUrl: Webhook URL for notifications
     *                          - phone: Phone number for SMS alerts
     * @return array Created alert configuration
     */
    public function setupAlert(array $alertConfig): array
    {
        $this->validateRequired($alertConfig, ['name', 'condition', 'notifications']);
        
        $response = $this->httpClient->post('/analytics/alerts', $alertConfig);
        return $this->extractData($response);
    }

    /**
     * Get list of configured analytics alerts
     *
     * @param array $filters Alert filters
     *                      - active: Filter by active status
     *                      - type: Alert type filter
     * @return array List of alerts
     */
    public function getAlerts(array $filters = []): array
    {
        $params = $this->buildParams([], $filters);
        $response = $this->httpClient->get('/analytics/alerts', $params);
        return $this->extractData($response);
    }

    /**
     * Update existing analytics alert
     *
     * @param string $alertId Alert ID
     * @param array $updates Alert updates
     * @return array Updated alert configuration
     */
    public function updateAlert(string $alertId, array $updates): array
    {
        $response = $this->httpClient->put("/analytics/alerts/{$alertId}", $updates);
        return $this->extractData($response);
    }

    /**
     * Delete analytics alert
     *
     * @param string $alertId Alert ID
     * @return array Deletion confirmation
     */
    public function deleteAlert(string $alertId): array
    {
        $response = $this->httpClient->delete("/analytics/alerts/{$alertId}");
        return $this->extractData($response);
    }

    /**
     * Get comparative analytics between multiple tracks or periods
     *
     * @param array $comparison Comparison parameters
     *                         - type: Comparison type (tracks, periods, artists)
     *                         - items: Items to compare
     *                         - metrics: Metrics for comparison
     *                         - timeframes: Time periods for comparison
     * @return array Comparative analytics data
     */
    public function getComparativeAnalytics(array $comparison): array
    {
        $this->validateRequired($comparison, ['type', 'items']);
        
        $response = $this->httpClient->post('/analytics/compare', $comparison);
        return $this->extractData($response);
    }

    /**
     * Get performance benchmarks against industry standards
     *
     * @param array $options Benchmark options
     *                      - tracks: Specific tracks to benchmark
     *                      - genre: Genre for comparison
     *                      - region: Geographic region
     *                      - timeframe: Analysis timeframe
     * @return array Benchmark data
     */
    public function getBenchmarks(array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get('/analytics/benchmarks', $params);
        return $this->extractData($response);
    }

    /**
     * Generate custom analytics report
     *
     * @param array $reportConfig Report configuration
     *                           - name: Report name
     *                           - metrics: Metrics to include
     *                           - dimensions: Data dimensions
     *                           - filters: Data filters
     *                           - visualization: Chart types
     *                           - schedule: Report schedule (optional)
     * @return array Generated report data
     */
    public function generateCustomReport(array $reportConfig): array
    {
        $this->validateRequired($reportConfig, ['name', 'metrics']);
        
        $response = $this->httpClient->post('/analytics/reports/custom', $reportConfig);
        return $this->extractData($response);
    }

    /**
     * Get analytics summary dashboard
     *
     * @param array $options Dashboard options
     *                      - period: Summary period
     *                      - widgets: Specific dashboard widgets
     *                      - tracks: Track filter for summary
     * @return array Dashboard summary data
     */
    public function getDashboard(array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get('/analytics/dashboard', $params);
        return $this->extractData($response);
    }
}