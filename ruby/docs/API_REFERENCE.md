# JewelMusic Ruby SDK API Reference

This document provides detailed API reference for the JewelMusic Ruby SDK.

## Table of Contents

- [Client Initialization](#client-initialization)
- [Resources Overview](#resources-overview)
- [Error Handling](#error-handling)
- [Type Annotations](#type-annotations)

## Client Initialization

### JewelMusic::Client

```ruby
require 'jewelmusic'

# Basic initialization
client = JewelMusic::Client.new(api_key: 'your-api-key')

# With options
client = JewelMusic::Client.new(
  api_key: 'your-api-key',
  base_url: 'https://api.jewelmusic.art',
  timeout: 30,
  retries: 3,
  retry_delay: 1.0,
  user_agent: 'MyApp/1.0',
  headers: { 'Custom-Header' => 'value' },
  debug: false,
  rate_limit_retry: true
)

# Using environment variable
client = JewelMusic::Client.new(api_key: ENV['JEWELMUSIC_API_KEY'])
```

### Configuration Options

```ruby
# Available configuration options
options = {
  api_key: 'your-api-key',                    # Required
  base_url: 'https://api.jewelmusic.art',     # Optional
  timeout: 30,                               # Optional, in seconds
  retries: 3,                                # Optional
  retry_delay: 1.0,                          # Optional, in seconds
  user_agent: 'MyApp/1.0',                   # Optional
  headers: {},                               # Optional additional headers
  debug: false,                              # Optional debug logging
  rate_limit_retry: true,                    # Optional auto-retry on rate limits
  proxy: nil,                                # Optional proxy configuration
  ssl_verify_peer: true                      # Optional SSL verification
}
```

## Resources Overview

### Tracks Resource

```ruby
# Upload track
track = client.tracks.upload(
  '/path/to/audio.mp3',
  'audio.mp3',
  title: 'My Song',
  artist: 'My Artist',
  genre: 'Electronic'
)

# Upload with progress block
track = client.tracks.upload(file_path, filename, metadata) do |bytes_uploaded, total_bytes|
  percent = (bytes_uploaded.to_f / total_bytes * 100).round(1)
  puts "Upload progress: #{percent}%"
end

# Upload from File object
File.open('/path/to/audio.mp3', 'rb') do |file|
  track = client.tracks.upload(file, 'audio.mp3', metadata)
end

# Get track
track = client.tracks.get(track_id)

# List tracks
tracks = client.tracks.list(page: 1, per_page: 20)

# List with filters
tracks = client.tracks.list(
  page: 1,
  per_page: 20,
  filters: { genre: 'Electronic', artist: 'My Artist' }
)

# Update track
updated_track = client.tracks.update(track_id, title: 'Updated Title')

# Delete track
client.tracks.delete(track_id)

# Search tracks
results = client.tracks.search(
  'electronic music',
  limit: 10,
  filters: { genre: 'Electronic' }
)

# Upload artwork
artwork = client.tracks.upload_artwork(
  track_id,
  '/path/to/cover.jpg',
  'cover.jpg'
)
```

### Analysis Resource

```ruby
# Analyze track
analysis = client.analysis.analyze(track_id)

# Analyze with options
analysis = client.analysis.analyze_with_options(track_id,
  analysis_types: %w[tempo key mood],
  detailed_report: true,
  cultural_context: 'global',
  target_platforms: %w[spotify apple-music]
)

# Get analysis results
analysis = client.analysis.get(analysis_id)

# Get specific analysis components
tempo_analysis = client.analysis.get_tempo_analysis(analysis_id)
key_analysis = client.analysis.get_key_analysis(analysis_id)
mood_analysis = client.analysis.get_mood_analysis(analysis_id)

# Get analysis insights
insights = client.analysis.get_insights(analysis_id,
  focus: %w[production composition],
  include_actionables: true
)

# Get analysis status
status = client.analysis.get_status(analysis_id)
```

### Copilot Resource (AI Generation)

```ruby
# Generate melody
melody = client.copilot.generate_melody(
  style: 'electronic',
  genre: 'electronic',
  mood: 'upbeat',
  tempo: 128,
  key: 'C',
  mode: 'major',
  duration: 30,
  instruments: %w[synthesizer bass piano],
  complexity: 'medium',
  creativity: 0.7
)

# Generate lyrics
lyrics = client.copilot.generate_lyrics(
  theme: 'technology and human connection',
  genre: 'electronic',
  language: 'en',
  mood: 'optimistic',
  structure: 'verse-chorus-verse-chorus-bridge-chorus',
  keywords: %w[future connection digital]
)

# Generate harmony
harmony = client.copilot.generate_harmony(
  melody_id: melody_id,
  style: 'jazz',
  complexity: 'complex',
  voicing: 'close',
  instruments: %w[piano guitar]
)

# Generate chord progression
progression = client.copilot.generate_chord_progression(
  key: 'C major',
  style: 'pop',
  complexity: 0.5,
  length: 8
)

# Generate complete song
song = client.copilot.generate_complete_song(
  prompt: 'Create an uplifting electronic song',
  style: 'electronic',
  duration: 180,
  include_vocals: true,
  vocal_style: 'female-pop',
  mixing_style: 'modern'
)

# Apply style transfer
styled_track = client.copilot.apply_style_transfer(
  source_id: source_track_id,
  target_style: 'jazz',
  intensity: 0.8,
  preserve_structure: true
)

# Get templates
templates = client.copilot.get_templates(
  genre: 'electronic',
  mood: 'upbeat',
  style: 'modern'
)

# Suggest arrangement
arrangement = client.copilot.suggest_arrangement(
  track_id: track_id,
  genre: 'electronic',
  mood: 'upbeat'
)
```

### Distribution Resource

```ruby
# Create release
release = client.distribution.create_release(
  type: 'single',
  title: 'My Release',
  artist: 'My Artist',
  release_date: '2025-09-01',
  tracks: [{ track_id: track_id, title: 'Song Title' }],
  platforms: %w[spotify apple-music youtube-music]
)

# Submit to platforms
submission = client.distribution.submit_to_platforms(release_id,
  platforms: %w[spotify apple-music],
  scheduled_date: '2025-09-01T00:00:00Z',
  expedited: false
)

# Get distribution status
status = client.distribution.get_status(release_id)

# Validate release
validation = client.distribution.validate_release(release_id)

# Get available platforms
platforms = client.distribution.get_platforms

# Get earnings
earnings = client.distribution.get_earnings(release_id,
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  currency: 'USD'
)
```

### Transcription Resource

```ruby
# Create transcription
transcription = client.transcription.create_transcription(track_id,
  languages: %w[en auto-detect],
  include_timestamps: true,
  word_level_timestamps: true,
  speaker_diarization: true,
  model: 'large'
)

# Create from file
transcription = client.transcription.create_from_file(
  '/path/to/audio.mp3',
  'audio.mp3',
  options
)

# Get transcription
transcription = client.transcription.get(transcription_id)

# Enhance lyrics
enhanced = client.transcription.enhance_lyrics('Original lyrics text',
  improve_meter: true,
  enhance_rhyming: true,
  adjust_tone: 'professional',
  preserve_original_meaning: true
)

# Translate lyrics
translation = client.transcription.translate_lyrics(
  transcription_id,
  %w[es fr],
  preserve_rhyme: true
)

# Get transcription status
status = client.transcription.get_status(transcription_id)
```

### Analytics Resource

```ruby
# Get streaming analytics
streams = client.analytics.get_streams(
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  group_by: 'month',
  platforms: %w[spotify apple-music]
)

# Get listener demographics
listeners = client.analytics.get_listeners(
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  group_by: 'territory'
)

# Get track analytics
track_analytics = client.analytics.get_track_analytics(track_id,
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  metrics: %w[streams listeners completion_rate]
)

# Setup alert
alert = client.analytics.setup_alert(
  name: 'High Streaming Alert',
  release_id: release_id,
  conditions: [
    {
      metric: 'streams',
      operator: 'greater_than',
      threshold: 1000,
      period: 'day'
    }
  ],
  notifications: { email: true, webhook: true }
)

# Export data
export = client.analytics.export_data(
  { start_date: '2024-01-01', end_date: '2024-12-31' },
  { format: 'csv', include_charts: true }
)

# Get real-time analytics
realtime = client.analytics.get_realtime_analytics(
  period: '24h',
  update_interval: 300,
  metrics: %w[streams listeners]
)
```

### User Resource

```ruby
# Get profile
profile = client.user.get_profile

# Update profile
updated_profile = client.user.update_profile(
  name: 'New Name',
  bio: 'Updated bio',
  website: 'https://mywebsite.com'
)

# Get usage stats
usage = client.user.get_usage_stats(
  period: 'month',
  include_breakdown: true
)

# API key management
api_keys = client.user.get_api_keys

new_key = client.user.create_api_key('My App Key',
  scopes: %w[tracks:read analytics:read],
  rate_limit: 1000
)

client.user.revoke_api_key(key_id)

# Get subscription info
subscription = client.user.get_subscription

# Update subscription
client.user.update_subscription(plan_id)
```

### Webhooks Resource

```ruby
# Create webhook
webhook = client.webhooks.create(
  url: 'https://myapp.com/webhooks/jewelmusic',
  events: %w[track.processed analysis.completed],
  secret: 'my-webhook-secret',
  active: true
)

# List webhooks
webhooks = client.webhooks.list

# Get webhook
webhook = client.webhooks.get(webhook_id)

# Update webhook
updated_webhook = client.webhooks.update(webhook_id, active: false)

# Delete webhook
client.webhooks.delete(webhook_id)

# Test webhook
test_result = client.webhooks.test(webhook_id)

# Verify webhook signature (class method)
valid = JewelMusic::Resources::WebhooksResource.verify_signature(payload, signature, secret)

# Parse webhook event
event = JewelMusic::Resources::WebhooksResource.parse_event(payload)

# Create signature for testing
signature = JewelMusic::Resources::WebhooksResource.create_signature(payload, secret)
```

## Error Handling

### Exception Classes

```ruby
module JewelMusic
  module Exceptions
    # Base exception
    class ApiError < StandardError
      attr_reader :status_code, :details, :request_id
      
      def initialize(message, status_code: nil, details: nil, request_id: nil)
        @status_code = status_code
        @details = details
        @request_id = request_id
        super(message)
      end
    end
    
    # Specific exceptions
    class AuthenticationError < ApiError; end
    
    class ValidationError < ApiError
      attr_reader :field_errors
      
      def initialize(message, field_errors: {}, **kwargs)
        @field_errors = field_errors
        super(message, **kwargs)
      end
    end
    
    class NotFoundError < ApiError; end
    
    class RateLimitError < ApiError
      attr_reader :retry_after_seconds
      
      def initialize(message, retry_after_seconds: nil, **kwargs)
        @retry_after_seconds = retry_after_seconds
        super(message, **kwargs)
      end
    end
    
    class NetworkError < ApiError; end
  end
end
```

### Error Handling Example

```ruby
begin
  track = client.tracks.get('invalid-id')
rescue JewelMusic::Exceptions::AuthenticationError => e
  puts "Authentication failed: #{e.message}"
  puts "Request ID: #{e.request_id}"
rescue JewelMusic::Exceptions::ValidationError => e
  puts "Validation errors:"
  e.field_errors.each { |field, errors| puts "  #{field}: #{errors.join(', ')}" }
rescue JewelMusic::Exceptions::NotFoundError => e
  puts "Track not found: #{e.message}"
rescue JewelMusic::Exceptions::RateLimitError => e
  puts "Rate limited. Retry after #{e.retry_after_seconds} seconds"
  sleep(e.retry_after_seconds)
rescue JewelMusic::Exceptions::NetworkError => e
  puts "Network error: #{e.message}"
rescue JewelMusic::Exceptions::ApiError => e
  puts "API error: #{e.message} (Status: #{e.status_code})"
rescue StandardError => e
  puts "Unexpected error: #{e.message}"
end
```

### Retry Logic

```ruby
# Automatic retry with exponential backoff
def with_retry(max_attempts: 3, base_delay: 1.0)
  attempt = 0
  
  loop do
    attempt += 1
    
    begin
      return yield
    rescue JewelMusic::Exceptions::RateLimitError => e
      if attempt < max_attempts
        delay = base_delay * (2 ** (attempt - 1))
        sleep([delay, e.retry_after_seconds].max)
        next
      else
        raise
      end
    rescue JewelMusic::Exceptions::NetworkError => e
      if attempt < max_attempts
        delay = base_delay * (2 ** (attempt - 1))
        sleep(delay)
        next
      else
        raise
      end
    end
  end
end

# Usage
track = with_retry(max_attempts: 5) do
  client.tracks.get(track_id)
end
```

## Type Annotations

### Using RBS or Sorbet

```ruby
# RBS type definitions (in .rbs files)
class JewelMusic::Client
  def initialize: (api_key: String, ?base_url: String, ?timeout: Integer) -> void
  
  def tracks: () -> JewelMusic::Resources::TracksResource
  def analysis: () -> JewelMusic::Resources::AnalysisResource
  def copilot: () -> JewelMusic::Resources::CopilotResource
end

class JewelMusic::Resources::TracksResource
  def upload: (String | IO, String, ?Hash[Symbol, untyped], ?block) -> Hash[String, untyped]
  def get: (String) -> Hash[String, untyped]
  def list: (?page: Integer, ?per_page: Integer, ?filters: Hash[Symbol, untyped]) -> Hash[String, untyped]
end
```

### YARD Documentation

```ruby
# @!method upload
#   Upload a track file with metadata
#   @param file [String, IO] File path or IO object
#   @param filename [String] Original filename
#   @param metadata [Hash<Symbol, Object>] Track metadata
#   @param block [Proc] Optional progress callback
#   @return [Hash<String, Object>] Track data
#   @raise [JewelMusic::Exceptions::ApiError] If the upload fails

# @!method analyze_with_options
#   Analyze a track with specific options
#   @param track_id [String] Track identifier
#   @param options [Hash<Symbol, Object>] Analysis options
#   @option options [Array<String>] :analysis_types Types of analysis to perform
#   @option options [Boolean] :detailed_report Whether to include detailed report
#   @option options [String] :cultural_context Cultural context for analysis
#   @return [Hash<String, Object>] Analysis result
```

### Common Type Patterns

```ruby
# Type aliases using constants
module JewelMusic
  # @type TrackMetadata = Hash[Symbol, String | Integer | Boolean | Array<String>]
  # @type AnalysisOptions = Hash[Symbol, Array<String> | Boolean | String]
  # @type PaginatedResponse = Hash[String, Array<Hash> | Hash[String, Integer]]
  
  TrackMetadata = Hash
  AnalysisOptions = Hash
  PaginatedResponse = Hash
end

# Method signatures with type annotations
class TracksResource
  # @param file [String, IO]
  # @param filename [String]
  # @param metadata [TrackMetadata]
  # @return [Hash<String, Object>]
  def upload(file, filename, metadata = {})
    # Implementation
  end
  
  # @param track_id [String]
  # @param options [AnalysisOptions]
  # @return [Hash<String, Object>]
  def analyze_with_options(track_id, options = {})
    # Implementation
  end
end
```

### Configuration Hashes

```ruby
# Configuration type definitions
ClientConfig = Struct.new(
  :api_key,
  :base_url,
  :timeout,
  :retries,
  :retry_delay,
  :user_agent,
  :headers,
  :debug,
  :rate_limit_retry,
  keyword_init: true
) do
  def self.from_hash(hash)
    new(**hash.slice(*members))
  end
end

UploadOptions = Struct.new(
  :chunk_size,
  :timeout,
  :retries,
  keyword_init: true
)

# Usage
config = ClientConfig.from_hash(
  api_key: 'key',
  timeout: 30,
  debug: true
)

client = JewelMusic::Client.new(**config.to_h.compact)
```

### Response Wrapper Classes

```ruby
# Wrapper classes for better type safety
class ApiResponse
  attr_reader :data, :status_code, :headers, :request_id
  
  def initialize(data:, status_code:, headers: {}, request_id: nil)
    @data = data
    @status_code = status_code
    @headers = headers
    @request_id = request_id
  end
  
  def success?
    (200..299).include?(status_code)
  end
end

class PaginatedResponse < ApiResponse
  def items
    data['items'] || []
  end
  
  def pagination
    data['pagination'] || {}
  end
  
  def has_next?
    pagination['hasNext'] || false
  end
  
  def has_prev?
    pagination['hasPrev'] || false
  end
end
```

For complete documentation with type annotations, see the YARD documentation generated from the source code: `yard doc && yard server`