# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # Distribution resource for music platform distribution and release management
    #
    class DistributionResource < BaseResource
      ##
      # Create a new release for distribution
      #
      # @param release_data [Hash] Release information
      # @option release_data [String] :title Release title (required)
      # @option release_data [String] :artist Artist name (required)
      # @option release_data [String] :release_date Release date (required)
      # @option release_data [Array<String>] :tracks Array of track IDs (required)
      # @option release_data [Array<String>] :platforms Target platforms
      # @option release_data [Hash] :metadata Additional metadata
      # @return [Hash] Created release data
      #
      def create_release(release_data)
        validate_required(release_data, [:title, :artist, :release_date, :tracks])
        
        response = http_client.post('/distribution/releases', release_data)
        extract_data(response)
      end

      ##
      # Get release by ID
      #
      # @param release_id [String] Release ID
      # @return [Hash] Release data
      #
      def get_release(release_id)
        validate_required({ release_id: release_id }, [:release_id])
        response = http_client.get("/distribution/releases/#{release_id}")
        extract_data(response)
      end

      ##
      # Update release information
      #
      # @param release_id [String] Release ID
      # @param updates [Hash] Release updates
      # @return [Hash] Updated release data
      #
      def update_release(release_id, updates)
        validate_required({ release_id: release_id }, [:release_id])
        
        response = http_client.put("/distribution/releases/#{release_id}", updates)
        extract_data(response)
      end

      ##
      # Submit release for platform distribution
      #
      # @param release_id [String] Release ID
      # @param platforms [Array<String>] Target platforms
      # @param options [Hash] Distribution options
      # @option options [String] :release_date Specific release date
      # @option options [Array<String>] :territories Geographic territories
      # @option options [Hash] :pricing Pricing information
      # @return [Hash] Submission result
      #
      def submit_for_distribution(release_id, platforms, options = {})
        validate_required({ release_id: release_id, platforms: platforms }, [:release_id, :platforms])
        
        data = {
          platforms: platforms
        }.merge(filter_nil_values(options))
        
        response = http_client.post("/distribution/releases/#{release_id}/submit", data)
        extract_data(response)
      end

      ##
      # Get distribution status for a release
      #
      # @param release_id [String] Release ID
      # @return [Hash] Distribution status
      #
      def get_distribution_status(release_id)
        validate_required({ release_id: release_id }, [:release_id])
        response = http_client.get("/distribution/releases/#{release_id}/status")
        extract_data(response)
      end

      ##
      # Get available platforms for distribution
      #
      # @param filters [Hash] Platform filters
      # @option filters [String] :type Platform type (streaming, download, social)
      # @option filters [Array<String>] :regions Supported regions
      # @option filters [Array<String>] :features Required features
      # @return [Hash] Available platforms
      #
      def get_platforms(filters = {})
        params = build_params({}, filters)
        response = http_client.get('/distribution/platforms', params)
        extract_data(response)
      end

      ##
      # Get platform-specific requirements
      #
      # @param platform [String] Platform identifier
      # @return [Hash] Platform requirements
      #
      def get_platform_requirements(platform)
        validate_required({ platform: platform }, [:platform])
        response = http_client.get("/distribution/platforms/#{platform}/requirements")
        extract_data(response)
      end

      ##
      # Validate release for platform compliance
      #
      # @param release_id [String] Release ID
      # @param platforms [Array<String>] Platforms to validate against
      # @return [Hash] Validation results
      #
      def validate_release(release_id, platforms = [])
        validate_required({ release_id: release_id }, [:release_id])
        data = { platforms: platforms }
        response = http_client.post("/distribution/releases/#{release_id}/validate", data)
        extract_data(response)
      end

      ##
      # Schedule release for future distribution
      #
      # @param release_id [String] Release ID
      # @param release_date [String] Scheduled release date
      # @param platforms [Array<String>] Target platforms
      # @param options [Hash] Scheduling options
      # @option options [String] :timezone Release timezone
      # @option options [Array<String>] :territories Geographic territories
      # @option options [Boolean] :pre_order Enable pre-order
      # @return [Hash] Scheduling result
      #
      def schedule_release(release_id, release_date, platforms, options = {})
        validate_required({
          release_id: release_id,
          release_date: release_date,
          platforms: platforms
        }, [:release_id, :release_date, :platforms])
        
        data = {
          release_date: release_date,
          platforms: platforms
        }.merge(filter_nil_values(options))
        
        response = http_client.post("/distribution/releases/#{release_id}/schedule", data)
        extract_data(response)
      end

      ##
      # Get earnings and royalty information
      #
      # @param release_id [String, nil] Release ID (optional, for specific release)
      # @param filters [Hash] Earnings filters
      # @option filters [String] :start_date Start date for earnings period
      # @option filters [String] :end_date End date for earnings period
      # @option filters [Array<String>] :platforms Specific platforms
      # @option filters [String] :currency Currency for earnings
      # @return [Hash] Earnings data
      #
      def get_earnings(release_id = nil, filters = {})
        endpoint = release_id ? "/distribution/releases/#{release_id}/earnings" : '/distribution/earnings'
        params = build_params({}, filters)
        
        response = http_client.get(endpoint, params)
        extract_data(response)
      end

      ##
      # Get streaming statistics
      #
      # @param release_id [String] Release ID
      # @param filters [Hash] Statistics filters
      # @option filters [String] :start_date Start date for statistics
      # @option filters [String] :end_date End date for statistics
      # @option filters [Array<String>] :platforms Specific platforms
      # @option filters [Array<String>] :metrics Specific metrics to retrieve
      # @return [Hash] Streaming statistics
      #
      def get_streaming_stats(release_id, filters = {})
        validate_required({ release_id: release_id }, [:release_id])
        params = build_params({}, filters)
        response = http_client.get("/distribution/releases/#{release_id}/stats", params)
        extract_data(response)
      end

      ##
      # Update release on specific platforms
      #
      # @param release_id [String] Release ID
      # @param platform_updates [Hash] Platform-specific updates
      # @return [Hash] Update results
      #
      def update_on_platforms(release_id, platform_updates)
        validate_required({ release_id: release_id, platform_updates: platform_updates }, [:release_id, :platform_updates])
        data = { platform_updates: platform_updates }
        response = http_client.post("/distribution/releases/#{release_id}/platform-updates", data)
        extract_data(response)
      end

      ##
      # Takedown release from platforms
      #
      # @param release_id [String] Release ID
      # @param platforms [Array<String>] Platforms to takedown from
      # @param options [Hash] Takedown options
      # @option options [String] :reason Takedown reason
      # @option options [String] :effective Effective date
      # @return [Hash] Takedown result
      #
      def takedown_release(release_id, platforms, options = {})
        validate_required({ release_id: release_id, platforms: platforms }, [:release_id, :platforms])
        
        data = {
          platforms: platforms
        }.merge(filter_nil_values(options))
        
        response = http_client.post("/distribution/releases/#{release_id}/takedown", data)
        extract_data(response)
      end

      ##
      # Get detailed distribution analytics
      #
      # @param release_id [String] Release ID
      # @param options [Hash] Analytics options
      # @option options [String] :period Analysis period
      # @option options [String] :breakdown Data breakdown (platform, territory, time)
      # @option options [Array<String>] :metrics Specific metrics to include
      # @return [Hash] Distribution analytics
      #
      def get_analytics(release_id, options = {})
        validate_required({ release_id: release_id }, [:release_id])
        params = build_params({}, options)
        response = http_client.get("/distribution/releases/#{release_id}/analytics", params)
        extract_data(response)
      end

      ##
      # Generate distribution report
      #
      # @param options [Hash] Report options
      # @option options [Array<String>] :release_ids Specific releases to include
      # @option options [String] :period Report period
      # @option options [String] :format Report format (pdf, csv, json)
      # @option options [Boolean] :include_earnings Include earnings data
      # @return [Hash] Report data or download link
      #
      def generate_report(options = {})
        response = http_client.post('/distribution/reports', filter_nil_values(options))
        extract_data(response)
      end

      ##
      # List releases with filtering and pagination
      #
      # @param page [Integer] Page number
      # @param per_page [Integer] Items per page
      # @param filters [Hash] Release filters
      # @option filters [String] :status Release status
      # @option filters [String] :artist Artist name filter
      # @option filters [String] :date_range Release date range
      # @option filters [Array<String>] :platforms Platform filter
      # @return [Hash] Releases list
      #
      def list_releases(page = 1, per_page = 20, filters = {})
        params = build_params({
          page: page.to_s,
          per_page: per_page.to_s
        }, filters)
        
        response = http_client.get('/distribution/releases', params)
        extract_data(response)
      end
    end
  end
end