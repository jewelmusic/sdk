# frozen_string_literal: true

require_relative 'jewelmusic/version'
require_relative 'jewelmusic/client'
require_relative 'jewelmusic/exceptions'
require_relative 'jewelmusic/http/client'
require_relative 'jewelmusic/resources/base_resource'
require_relative 'jewelmusic/resources/copilot_resource'
require_relative 'jewelmusic/resources/analysis_resource'
require_relative 'jewelmusic/resources/distribution_resource'
require_relative 'jewelmusic/resources/transcription_resource'
require_relative 'jewelmusic/resources/tracks_resource'
require_relative 'jewelmusic/resources/analytics_resource'
require_relative 'jewelmusic/resources/user_resource'
require_relative 'jewelmusic/resources/webhooks_resource'

##
# JewelMusic Ruby SDK
#
# The official Ruby SDK for the JewelMusic AI-powered music distribution platform.
# Provides comprehensive access to music analysis, distribution, transcription,
# analytics, and user management features.
#
# @example Basic usage
#   client = JewelMusic::Client.new('your-api-key')
#   profile = client.user.get_profile
#   puts "Welcome, #{profile['name']}!"
#
# @example Track upload and analysis
#   track = client.tracks.upload('/path/to/audio.mp3', {
#     title: 'My Song',
#     artist: 'Artist Name'
#   })
#   analysis = client.analysis.analyze(track['id'])
#
module JewelMusic
  class Error < StandardError; end

  ##
  # Creates a new JewelMusic client instance
  #
  # @param api_key [String] Your JewelMusic API key
  # @param options [Hash] Configuration options
  # @option options [String] :base_url API base URL
  # @option options [Integer] :timeout Request timeout in seconds
  # @option options [String] :user_agent Custom user agent
  # @option options [Integer] :retries Number of retry attempts
  # @option options [Float] :retry_delay Delay between retries
  # @return [JewelMusic::Client] Configured client instance
  #
  def self.new(api_key, options = {})
    Client.new(api_key, options)
  end

  ##
  # Get SDK version
  #
  # @return [String] SDK version
  #
  def self.version
    VERSION
  end
end