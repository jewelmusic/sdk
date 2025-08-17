# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # Analytics resource for comprehensive music analytics and reporting
    #
    class AnalyticsResource < BaseResource
      ##
      # Get streaming analytics data
      #
      # @param query [Hash] Analytics query parameters
      # @option query [String] :start_date Start date for analytics period (required)
      # @option query [String] :end_date End date for analytics period (required)
      # @option query [String] :group_by Data grouping (day, week, month, platform, territory)
      # @option query [Array<String>] :platforms Specific platforms to include
      # @option query [Array<String>] :territories Geographic territories
      # @option query [Array<String>] :tracks Specific track IDs
      # @option query [Array<String>] :metrics Specific metrics to retrieve
      # @return [Hash] Streaming analytics data
      #
      def get_streams(query)
        validate_required(query, [:start_date, :end_date])
        
        params = build_params({}, query)
        response = http_client.get('/analytics/streams', params)
        extract_data(response)
      end

      ##
      # Get listener demographics and behavior data
      #
      # @param query [Hash] Analytics query parameters
      # @return [Hash] Listener analytics data
      #
      def get_listeners(query)
        validate_required(query, [:start_date, :end_date])
        
        params = build_params({}, query)
        response = http_client.get('/analytics/listeners', params)
        extract_data(response)
      end

      ##
      # Get platform-specific performance metrics
      #
      # @param query [Hash] Analytics query parameters
      # @return [Hash] Platform metrics data
      #
      def get_platform_metrics(query)
        validate_required(query, [:start_date, :end_date])
        
        params = build_params({}, query)
        response = http_client.get('/analytics/platform-metrics', params)
        extract_data(response)
      end

      ##
      # Get geographical streaming data
      #
      # @param query [Hash] Analytics query parameters
      # @return [Hash] Geographical analytics data
      #
      def get_geographical_data(query)
        validate_required(query, [:start_date, :end_date])
        
        params = build_params({}, query)
        response = http_client.get('/analytics/geographical', params)
        extract_data(response)
      end

      ##
      # Get trending analysis and insights
      #
      # @param query [Hash] Analytics query parameters
      # @return [Hash] Trends analysis data
      #
      def get_trends(query)
        validate_required(query, [:start_date, :end_date])
        
        params = build_params({}, query)
        response = http_client.get('/analytics/trends', params)
        extract_data(response)
      end

      ##
      # Get royalty reports for a specific period
      #
      # @param start_date [String] Start date for royalty period
      # @param end_date [String] End date for royalty period
      # @param options [Hash] Royalty report options
      # @option options [String] :currency Currency for earnings
      # @option options [Boolean] :include_pending Include pending payments
      # @option options [String] :group_by Data grouping method
      # @option options [Array<String>] :platforms Specific platforms
      # @return [Hash] Royalty reports data
      #
      def get_royalty_reports(start_date, end_date, options = {})
        validate_required({ start_date: start_date, end_date: end_date }, [:start_date, :end_date])
        
        params = build_params({
          start_date: start_date,
          end_date: end_date
        }, options)
        
        response = http_client.get('/analytics/royalties/reports', params)
        extract_data(response)
      end

      ##
      # Download royalty statements
      #
      # @param report_id [String] Royalty report ID
      # @param format [String] Download format (pdf, csv, json)
      # @return [Hash] Download URL or data
      #
      def download_royalty_statement(report_id, format = 'pdf')
        validate_required({ report_id: report_id }, [:report_id])
        params = { format: format }
        response = http_client.get("/analytics/royalties/statements/#{report_id}", params)
        extract_data(response)
      end

      ##
      # Get revenue projections based on current trends
      #
      # @param options [Hash] Projection options
      # @option options [String] :period Projection period (month, quarter, year)
      # @option options [Array<String>] :tracks Specific tracks to project
      # @option options [Array<String>] :platforms Target platforms
      # @option options [Boolean] :include_confidence_interval Include confidence intervals
      # @return [Hash] Revenue projections
      #
      def get_revenue_projections(options = {})
        params = build_params({}, options)
        response = http_client.get('/analytics/royalties/projections', params)
        extract_data(response)
      end

      ##
      # Get track performance analytics
      #
      # @param track_id [String] Track ID
      # @param query [Hash] Analytics query parameters
      # @return [Hash] Track analytics data
      #
      def get_track_analytics(track_id, query)
        validate_required({ track_id: track_id }, [:track_id])
        validate_required(query, [:start_date, :end_date])
        
        params = build_params({}, query)
        response = http_client.get("/analytics/tracks/#{track_id}", params)
        extract_data(response)
      end

      ##
      # Get real-time analytics dashboard data
      #
      # @param options [Hash] Real-time options
      # @option options [String] :period Time period for real-time data
      # @option options [Integer] :update_interval Update frequency in seconds
      # @option options [Array<String>] :metrics Specific metrics to track
      # @return [Hash] Real-time analytics data
      #
      def get_realtime_analytics(options = {})
        params = build_params({}, options)
        response = http_client.get('/analytics/realtime', params)
        extract_data(response)
      end

      ##
      # Get analytics insights and recommendations
      #
      # @param options [Hash] Insights options
      # @option options [String] :period Analysis period
      # @option options [Boolean] :include_recommendations Include actionable recommendations
      # @option options [Array<String>] :focus Focus areas (performance, growth, monetization)
      # @option options [Array<String>] :tracks Specific tracks to analyze
      # @return [Hash] Analytics insights
      #
      def get_insights(options = {})
        params = build_params({}, options)
        response = http_client.get('/analytics/insights', params)
        extract_data(response)
      end

      ##
      # Export analytics data to external formats
      #
      # @param query [Hash] Analytics query for export
      # @param options [Hash] Export options
      # @option options [String] :format Export format (csv, json, xlsx, pdf)
      # @option options [Boolean] :include_charts Include visualization charts
      # @option options [String] :email Email address for delivery
      # @option options [String] :custom_template Custom report template
      # @return [Hash] Export job data or download URL
      #
      def export_data(query, options = {})
        validate_required(query, [:start_date, :end_date])
        
        data = { query: query }.merge(filter_nil_values(options))
        response = http_client.post('/analytics/export', data)
        extract_data(response)
      end

      ##
      # Set up analytics alerts for specific conditions
      #
      # @param alert_config [Hash] Alert configuration
      # @option alert_config [String] :name Alert name (required)
      # @option alert_config [Hash] :condition Alert trigger condition (required)
      # @option alert_config [Array<String>] :notifications Notification methods (required)
      # @option alert_config [String] :email Email for notifications
      # @option alert_config [String] :webhook_url Webhook URL for notifications
      # @option alert_config [String] :phone Phone number for SMS alerts
      # @return [Hash] Created alert configuration
      #
      def setup_alert(alert_config)
        validate_required(alert_config, [:name, :condition, :notifications])
        
        response = http_client.post('/analytics/alerts', alert_config)
        extract_data(response)
      end

      ##
      # Get list of configured analytics alerts
      #
      # @param filters [Hash] Alert filters
      # @option filters [Boolean] :active Filter by active status
      # @option filters [String] :type Alert type filter
      # @return [Hash] List of alerts
      #
      def get_alerts(filters = {})
        params = build_params({}, filters)
        response = http_client.get('/analytics/alerts', params)
        extract_data(response)
      end

      ##
      # Update existing analytics alert
      #
      # @param alert_id [String] Alert ID
      # @param updates [Hash] Alert updates
      # @return [Hash] Updated alert configuration
      #
      def update_alert(alert_id, updates)
        validate_required({ alert_id: alert_id }, [:alert_id])
        response = http_client.put("/analytics/alerts/#{alert_id}", updates)
        extract_data(response)
      end

      ##
      # Delete analytics alert
      #
      # @param alert_id [String] Alert ID
      # @return [Hash] Deletion confirmation
      #
      def delete_alert(alert_id)
        validate_required({ alert_id: alert_id }, [:alert_id])
        response = http_client.delete("/analytics/alerts/#{alert_id}")
        extract_data(response)
      end

      ##
      # Get comparative analytics between multiple tracks or periods
      #
      # @param comparison [Hash] Comparison parameters
      # @option comparison [String] :type Comparison type (tracks, periods, artists) (required)
      # @option comparison [Array] :items Items to compare (required)
      # @option comparison [Array<String>] :metrics Metrics for comparison
      # @option comparison [Array<Hash>] :timeframes Time periods for comparison
      # @return [Hash] Comparative analytics data
      #
      def get_comparative_analytics(comparison)
        validate_required(comparison, [:type, :items])
        
        response = http_client.post('/analytics/compare', comparison)
        extract_data(response)
      end

      ##
      # Get performance benchmarks against industry standards
      #
      # @param options [Hash] Benchmark options
      # @option options [Array<String>] :tracks Specific tracks to benchmark
      # @option options [String] :genre Genre for comparison
      # @option options [String] :region Geographic region
      # @option options [String] :timeframe Analysis timeframe
      # @return [Hash] Benchmark data
      #
      def get_benchmarks(options = {})
        params = build_params({}, options)
        response = http_client.get('/analytics/benchmarks', params)
        extract_data(response)
      end

      ##
      # Generate custom analytics report
      #
      # @param report_config [Hash] Report configuration
      # @option report_config [String] :name Report name (required)
      # @option report_config [Array<String>] :metrics Metrics to include (required)
      # @option report_config [Array<String>] :dimensions Data dimensions
      # @option report_config [Hash] :filters Data filters
      # @option report_config [Array<String>] :visualization Chart types
      # @option report_config [Hash] :schedule Report schedule (optional)
      # @return [Hash] Generated report data
      #
      def generate_custom_report(report_config)
        validate_required(report_config, [:name, :metrics])
        
        response = http_client.post('/analytics/reports/custom', report_config)
        extract_data(response)
      end

      ##
      # Get analytics summary dashboard
      #
      # @param options [Hash] Dashboard options
      # @option options [String] :period Summary period
      # @option options [Array<String>] :widgets Specific dashboard widgets
      # @option options [Array<String>] :tracks Track filter for summary
      # @return [Hash] Dashboard summary data
      #
      def get_dashboard(options = {})
        params = build_params({}, options)
        response = http_client.get('/analytics/dashboard', params)
        extract_data(response)
      end
    end
  end
end