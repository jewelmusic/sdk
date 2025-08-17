# frozen_string_literal: true

module JewelMusic
  ##
  # Main client class for the JewelMusic SDK
  #
  # Provides access to all SDK resources and manages the HTTP client configuration.
  #
  class Client
    attr_reader :http_client, :copilot, :analysis, :distribution, :transcription,
                :tracks, :analytics, :user, :webhooks

    ##
    # Initialize a new JewelMusic client
    #
    # @param api_key [String] Your JewelMusic API key
    # @param options [Hash] Configuration options
    # @option options [String] :base_url ('https://api.jewelmusic.art') API base URL
    # @option options [Integer] :timeout (30) Request timeout in seconds
    # @option options [String] :user_agent Custom user agent string
    # @option options [Integer] :retries (3) Number of retry attempts
    # @option options [Float] :retry_delay (1.0) Delay between retries in seconds
    # @option options [Boolean] :rate_limit (true) Enable rate limiting
    # @option options [Hash] :headers Additional headers to include
    #
    def initialize(api_key, options = {})
      @http_client = Http::Client.new(api_key, options)
      
      # Initialize all resource managers
      @copilot = Resources::CopilotResource.new(@http_client)
      @analysis = Resources::AnalysisResource.new(@http_client)
      @distribution = Resources::DistributionResource.new(@http_client)
      @transcription = Resources::TranscriptionResource.new(@http_client)
      @tracks = Resources::TracksResource.new(@http_client)
      @analytics = Resources::AnalyticsResource.new(@http_client)
      @user = Resources::UserResource.new(@http_client)
      @webhooks = Resources::WebhooksResource.new(@http_client)
    end

    ##
    # Get API information
    #
    # @return [Hash] API information
    #
    def api_info
      @http_client.get('/info')
    end

    ##
    # Test API connection
    #
    # @return [Hash] Ping response
    #
    def ping
      @http_client.get('/ping')
    end

    ##
    # Get SDK version
    #
    # @return [String] SDK version
    #
    def version
      JewelMusic::VERSION
    end
  end
end