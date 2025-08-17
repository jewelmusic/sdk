package jewelmusic

import (
	"context"
	"strconv"
	"strings"
)

// AnalyticsResource provides comprehensive analytics and reporting
type AnalyticsResource struct {
	client *Client
}

// AnalyticsQuery represents analytics query parameters
type AnalyticsQuery struct {
	StartDate   string   `json:"startDate"`
	EndDate     string   `json:"endDate"`
	GroupBy     string   `json:"groupBy,omitempty"`
	Platforms   []string `json:"platforms,omitempty"`
	Territories []string `json:"territories,omitempty"`
	Tracks      []string `json:"tracks,omitempty"`
	Metrics     []string `json:"metrics,omitempty"`
}

// RoyaltyReportOptions represents options for royalty reports
type RoyaltyReportOptions struct {
	Currency        string   `json:"currency,omitempty"`
	IncludePending  bool     `json:"includePending,omitempty"`
	GroupBy         string   `json:"groupBy,omitempty"`
	Platforms       []string `json:"platforms,omitempty"`
}

// RevenueProjectionOptions represents options for revenue projections
type RevenueProjectionOptions struct {
	Period                     string   `json:"period,omitempty"`
	Tracks                     []string `json:"tracks,omitempty"`
	Platforms                  []string `json:"platforms,omitempty"`
	IncludeConfidenceInterval bool     `json:"includeConfidenceInterval,omitempty"`
}

// InsightsOptions represents options for analytics insights
type InsightsOptions struct {
	Period                 string   `json:"period,omitempty"`
	IncludeRecommendations bool     `json:"includeRecommendations,omitempty"`
	Focus                  string   `json:"focus,omitempty"`
	Tracks                 []string `json:"tracks,omitempty"`
}

// ExportOptions represents options for data export
type ExportOptions struct {
	Query          AnalyticsQuery `json:"query"`
	Format         string         `json:"format"`
	IncludeCharts  bool           `json:"includeCharts,omitempty"`
	Email          string         `json:"email,omitempty"`
	CustomTemplate string         `json:"customTemplate,omitempty"`
}

// AlertConfig represents configuration for analytics alerts
type AlertConfig struct {
	Name         string      `json:"name"`
	Condition    AlertCondition `json:"condition"`
	Notifications []string   `json:"notifications"`
	Email        string      `json:"email,omitempty"`
	WebhookURL   string      `json:"webhookUrl,omitempty"`
	Phone        string      `json:"phone,omitempty"`
}

// AlertCondition represents an alert condition
type AlertCondition struct {
	Metric    string  `json:"metric"`
	Operator  string  `json:"operator"`
	Threshold float64 `json:"threshold"`
	Period    string  `json:"period"`
}

// GetStreams gets streaming analytics data
func (a *AnalyticsResource) GetStreams(ctx context.Context, query AnalyticsQuery) (*AnalyticsData, error) {
	params := map[string]string{
		"startDate": query.StartDate,
		"endDate":   query.EndDate,
	}
	
	if query.GroupBy != "" {
		params["groupBy"] = query.GroupBy
	}
	if len(query.Platforms) > 0 {
		params["platforms"] = strings.Join(query.Platforms, ",")
	}
	if len(query.Territories) > 0 {
		params["territories"] = strings.Join(query.Territories, ",")
	}
	if len(query.Tracks) > 0 {
		params["tracks"] = strings.Join(query.Tracks, ",")
	}
	if len(query.Metrics) > 0 {
		params["metrics"] = strings.Join(query.Metrics, ",")
	}

	var result AnalyticsData
	err := a.client.Get(ctx, "/analytics/streams", params, &result)
	return &result, err
}

// GetListeners gets listener demographics and behavior data
func (a *AnalyticsResource) GetListeners(ctx context.Context, query AnalyticsQuery) (map[string]interface{}, error) {
	params := map[string]string{
		"startDate": query.StartDate,
		"endDate":   query.EndDate,
	}
	
	if query.GroupBy != "" {
		params["groupBy"] = query.GroupBy
	}
	if len(query.Platforms) > 0 {
		params["platforms"] = strings.Join(query.Platforms, ",")
	}
	if len(query.Territories) > 0 {
		params["territories"] = strings.Join(query.Territories, ",")
	}
	if len(query.Tracks) > 0 {
		params["tracks"] = strings.Join(query.Tracks, ",")
	}
	if len(query.Metrics) > 0 {
		params["metrics"] = strings.Join(query.Metrics, ",")
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/listeners", params, &result)
	return result, err
}

// GetPlatformMetrics gets platform-specific performance metrics
func (a *AnalyticsResource) GetPlatformMetrics(ctx context.Context, query AnalyticsQuery) (map[string]interface{}, error) {
	params := map[string]string{
		"startDate": query.StartDate,
		"endDate":   query.EndDate,
	}
	
	if query.GroupBy != "" {
		params["groupBy"] = query.GroupBy
	}
	if len(query.Platforms) > 0 {
		params["platforms"] = strings.Join(query.Platforms, ",")
	}
	if len(query.Territories) > 0 {
		params["territories"] = strings.Join(query.Territories, ",")
	}
	if len(query.Tracks) > 0 {
		params["tracks"] = strings.Join(query.Tracks, ",")
	}
	if len(query.Metrics) > 0 {
		params["metrics"] = strings.Join(query.Metrics, ",")
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/platform-metrics", params, &result)
	return result, err
}

// GetGeographicalData gets geographical streaming data
func (a *AnalyticsResource) GetGeographicalData(ctx context.Context, query AnalyticsQuery) (map[string]interface{}, error) {
	params := map[string]string{
		"startDate": query.StartDate,
		"endDate":   query.EndDate,
	}
	
	if query.GroupBy != "" {
		params["groupBy"] = query.GroupBy
	}
	if len(query.Platforms) > 0 {
		params["platforms"] = strings.Join(query.Platforms, ",")
	}
	if len(query.Territories) > 0 {
		params["territories"] = strings.Join(query.Territories, ",")
	}
	if len(query.Tracks) > 0 {
		params["tracks"] = strings.Join(query.Tracks, ",")
	}
	if len(query.Metrics) > 0 {
		params["metrics"] = strings.Join(query.Metrics, ",")
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/geographical", params, &result)
	return result, err
}

// GetTrends gets trending analysis and insights
func (a *AnalyticsResource) GetTrends(ctx context.Context, query AnalyticsQuery) (map[string]interface{}, error) {
	params := map[string]string{
		"startDate": query.StartDate,
		"endDate":   query.EndDate,
	}
	
	if query.GroupBy != "" {
		params["groupBy"] = query.GroupBy
	}
	if len(query.Platforms) > 0 {
		params["platforms"] = strings.Join(query.Platforms, ",")
	}
	if len(query.Territories) > 0 {
		params["territories"] = strings.Join(query.Territories, ",")
	}
	if len(query.Tracks) > 0 {
		params["tracks"] = strings.Join(query.Tracks, ",")
	}
	if len(query.Metrics) > 0 {
		params["metrics"] = strings.Join(query.Metrics, ",")
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/trends", params, &result)
	return result, err
}

// GetRoyaltyReports gets royalty reports for a specific period
func (a *AnalyticsResource) GetRoyaltyReports(ctx context.Context, startDate, endDate string, options *RoyaltyReportOptions) (map[string]interface{}, error) {
	params := map[string]string{
		"startDate": startDate,
		"endDate":   endDate,
	}
	
	if options != nil {
		if options.Currency != "" {
			params["currency"] = options.Currency
		}
		if options.IncludePending {
			params["includePending"] = "true"
		}
		if options.GroupBy != "" {
			params["groupBy"] = options.GroupBy
		}
		if len(options.Platforms) > 0 {
			params["platforms"] = strings.Join(options.Platforms, ",")
		}
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/royalties/reports", params, &result)
	return result, err
}

// DownloadRoyaltyStatement downloads royalty statements
func (a *AnalyticsResource) DownloadRoyaltyStatement(ctx context.Context, reportID string, format string) (map[string]interface{}, error) {
	params := map[string]string{
		"format": format,
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/royalties/statements/"+reportID, params, &result)
	return result, err
}

// GetRevenueProjections gets revenue projections based on current trends
func (a *AnalyticsResource) GetRevenueProjections(ctx context.Context, options *RevenueProjectionOptions) (map[string]interface{}, error) {
	params := make(map[string]string)
	
	if options != nil {
		if options.Period != "" {
			params["period"] = options.Period
		}
		if len(options.Tracks) > 0 {
			params["tracks"] = strings.Join(options.Tracks, ",")
		}
		if len(options.Platforms) > 0 {
			params["platforms"] = strings.Join(options.Platforms, ",")
		}
		if options.IncludeConfidenceInterval {
			params["includeConfidenceInterval"] = "true"
		}
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/royalties/projections", params, &result)
	return result, err
}

// GetTrackAnalytics gets track performance analytics
func (a *AnalyticsResource) GetTrackAnalytics(ctx context.Context, trackID string, query AnalyticsQuery) (map[string]interface{}, error) {
	params := map[string]string{
		"startDate": query.StartDate,
		"endDate":   query.EndDate,
	}
	
	if query.GroupBy != "" {
		params["groupBy"] = query.GroupBy
	}
	if len(query.Metrics) > 0 {
		params["metrics"] = strings.Join(query.Metrics, ",")
	}
	if len(query.Platforms) > 0 {
		params["platforms"] = strings.Join(query.Platforms, ",")
	}
	if len(query.Territories) > 0 {
		params["territories"] = strings.Join(query.Territories, ",")
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/tracks/"+trackID, params, &result)
	return result, err
}

// GetRealtimeAnalytics gets real-time analytics dashboard data
func (a *AnalyticsResource) GetRealtimeAnalytics(ctx context.Context, period string, updateInterval int, metrics []string) (map[string]interface{}, error) {
	params := make(map[string]string)
	
	if period != "" {
		params["period"] = period
	}
	if updateInterval > 0 {
		params["updateInterval"] = strconv.Itoa(updateInterval)
	}
	if len(metrics) > 0 {
		params["metrics"] = strings.Join(metrics, ",")
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/realtime", params, &result)
	return result, err
}

// GetInsights gets analytics insights and recommendations
func (a *AnalyticsResource) GetInsights(ctx context.Context, options *InsightsOptions) (map[string]interface{}, error) {
	params := make(map[string]string)
	
	if options != nil {
		if options.Period != "" {
			params["period"] = options.Period
		}
		if options.IncludeRecommendations {
			params["includeRecommendations"] = "true"
		}
		if options.Focus != "" {
			params["focus"] = options.Focus
		}
		if len(options.Tracks) > 0 {
			params["tracks"] = strings.Join(options.Tracks, ",")
		}
	}

	var result map[string]interface{}
	err := a.client.Get(ctx, "/analytics/insights", params, &result)
	return result, err
}

// ExportData exports analytics data to external formats
func (a *AnalyticsResource) ExportData(ctx context.Context, options ExportOptions) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := a.client.Post(ctx, "/analytics/export", options, &result)
	return result, err
}

// SetupAlert sets up analytics alerts for specific conditions
func (a *AnalyticsResource) SetupAlert(ctx context.Context, alertConfig AlertConfig) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := a.client.Post(ctx, "/analytics/alerts", alertConfig, &result)
	return result, err
}