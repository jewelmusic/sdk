# JewelMusic Ruby SDK

The official Ruby SDK for JewelMusic's AI-powered music distribution platform. This SDK provides comprehensive access to music analysis, distribution, transcription, analytics, and user management features.

[![Gem Version](https://badge.fury.io/rb/jewelmusic.svg)](https://badge.fury.io/rb/jewelmusic)
[![Ruby](https://github.com/jewelmusic/sdk/actions/workflows/ruby.yml/badge.svg)](https://github.com/jewelmusic/sdk/actions/workflows/ruby.yml)

## Features

- 🎵 **AI Music Analysis** - Advanced audio analysis and insights
- 🚀 **Music Distribution** - Multi-platform release management  
- 📝 **Transcription Services** - AI-powered lyrics transcription and enhancement
- 📊 **Analytics & Reporting** - Comprehensive streaming analytics
- 👤 **User Management** - Profile, preferences, and account management
- 🔗 **Webhooks** - Real-time event notifications
- 🤖 **AI Copilot** - Music creation and production assistance

## Requirements

- Ruby 3.0 or higher
- Bundler 2.0 or higher

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'jewelmusic'
```

And then execute:

```bash
bundle install
```

Or install it yourself as:

```bash
gem install jewelmusic
```

## Quick Start

```ruby
require 'jewelmusic'

# Initialize the SDK
client = JewelMusic.new('your-api-key-here')

# Get user profile
profile = client.user.get_profile
puts "Welcome, #{profile['name']}!"

# Upload and analyze a track
track = client.tracks.upload(
  '/path/to/audio.mp3',
  'audio.mp3',
  {
    title: 'My Song',
    artist: 'My Artist',
    genre: 'Electronic'
  }
)

# Start AI analysis
analysis = client.analysis.analyze(track_id: track['id'])
puts "Analysis started: #{analysis['id']}"

# Get analysis results when complete
results = client.analysis.get(analysis['id'])
puts results
```

## Configuration

### Basic Configuration

```ruby
# Using options hash
client = JewelMusic.new('your-api-key', {
  base_url: 'https://api.jewelmusic.art', # Default
  timeout: 30,                            # Request timeout in seconds
  retries: 3,                             # Number of retry attempts
  retry_delay: 1.0,                       # Delay between retries
  user_agent: 'MyApp/1.0'                 # Custom user agent
})

# Or using the Client class directly
client = JewelMusic::Client.new('your-api-key', options)
```

### Environment Variables

You can also configure the SDK using environment variables:

```bash
export JEWELMUSIC_API_KEY=your-api-key-here
export JEWELMUSIC_BASE_URL=https://api.jewelmusic.art
```

## Core Concepts

### Error Handling

The SDK uses typed exceptions for different error scenarios:

```ruby
begin
  result = client.tracks.get('invalid-id')
rescue JewelMusic::AuthenticationError => e
  puts "Authentication failed: #{e.message}"
rescue JewelMusic::ValidationError => e
  puts "Validation errors:"
  e.validation_errors.each { |field, errors| puts "#{field}: #{errors.join(', ')}" }
rescue JewelMusic::RateLimitError => e
  puts "Rate limit exceeded. Retry after: #{e.retry_after} seconds"
rescue JewelMusic::NotFoundError => e
  puts "Resource not found: #{e.message}"
rescue JewelMusic::ApiError => e
  puts "API error: #{e.message} (Status: #{e.status_code})"
end
```

### File Uploads

The SDK supports both regular and chunked file uploads:

```ruby
# Regular upload
track = client.tracks.upload(
  '/path/to/file.mp3',
  'song.mp3',
  { title: 'My Song', artist: 'Artist' }
)

# Chunked upload for large files
track = client.tracks.upload_chunked(
  '/path/to/large-file.wav',
  'large-song.wav',
  { title: 'Epic Song', artist: 'Artist' },
  8_388_608 # 8MB chunks
)

# Upload from File object
File.open('/path/to/file.mp3', 'rb') do |file|
  track = client.tracks.upload(
    file,
    'song.mp3',
    { title: 'My Song', artist: 'Artist' }
  )
end
```

## SDK Resources

### Tracks Management

```ruby
# Upload a track
track = client.tracks.upload(
  '/path/to/audio.mp3',
  'song.mp3',
  {
    title: 'Amazing Song',
    artist: 'Great Artist',
    album: 'Best Album',
    genre: 'Pop',
    release_date: '2024-01-01'
  }
)

# Get track details
track_details = client.tracks.get(track['id'])

# Update track metadata
updated = client.tracks.update(track['id'], {
  title: 'Updated Title'
})

# Upload artwork
artwork = client.tracks.upload_artwork(
  track['id'],
  '/path/to/cover.jpg',
  'cover.jpg'
)

# List tracks with filters
tracks = client.tracks.list(1, 20, {
  genre: 'Pop',
  artist: 'Great Artist'
})
```

### AI Music Analysis

```ruby
# Analyze existing track
analysis = client.analysis.analyze(track_id: track_id)

# Analyze uploaded file directly
analysis = client.analysis.analyze(
  file: '/path/to/audio.mp3',
  filename: 'audio.mp3',
  analysis_types: ['harmony', 'rhythm', 'mood'],
  include_visualization: true
)

# Get specific analysis results
key_analysis = client.analysis.get_key_analysis(analysis['id'])
tempo_analysis = client.analysis.get_tempo_analysis(analysis['id'])
mood_analysis = client.analysis.get_mood_analysis(analysis['id'])

# Get insights and recommendations
insights = client.analysis.get_insights(analysis['id'], {
  focus: ['production', 'composition'],
  include_actionables: true
})
```

### Distribution Management

```ruby
# Create a release
release = client.distribution.create_release({
  title: 'My Album',
  artist: 'My Artist',
  release_date: '2024-06-01',
  tracks: [track1_id, track2_id],
  platforms: ['spotify', 'apple-music', 'youtube-music']
})

# Submit for distribution
submission = client.distribution.submit_for_distribution(
  release['id'],
  ['spotify', 'apple-music'],
  {
    release_date: '2024-06-01',
    territories: ['US', 'CA', 'GB']
  }
)

# Get distribution status
status = client.distribution.get_distribution_status(release['id'])

# Get earnings data
earnings = client.distribution.get_earnings(release['id'], {
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  currency: 'USD'
})
```

### Transcription Services

```ruby
# Create transcription from track
transcription = client.transcription.create(
  track_id: track_id,
  languages: ['en', 'es'],
  include_timestamps: true,
  speaker_diarization: true
)

# Create transcription from file
transcription = client.transcription.create(
  file: '/path/to/audio.mp3',
  filename: 'audio.mp3',
  languages: ['en']
)

# Translate lyrics
translation = client.transcription.translate_lyrics(
  transcription['id'],
  ['es', 'fr'],
  {
    preserve_rhyme: true,
    preserve_meter: true
  }
)

# Enhance lyrics with AI
enhanced = client.transcription.enhance_lyrics(
  "Original lyrics text here",
  {
    improve_meter: true,
    enhance_rhyming: true,
    adjust_tone: 'uplifting'
  }
)
```

### Analytics & Reporting

```ruby
# Get streaming analytics
streams = client.analytics.get_streams({
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  group_by: 'month',
  platforms: ['spotify', 'apple-music']
})

# Get listener demographics
listeners = client.analytics.get_listeners({
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  group_by: 'territory'
})

# Get track-specific analytics
track_analytics = client.analytics.get_track_analytics(track_id, {
  start_date: '2024-01-01',
  end_date: '2024-12-31'
})

# Export analytics data
export = client.analytics.export_data({
  start_date: '2024-01-01',
  end_date: '2024-12-31'
}, {
  format: 'csv',
  include_charts: true,
  email: 'user@example.com'
})
```

### User Management

```ruby
# Get user profile
profile = client.user.get_profile

# Update profile
updated_profile = client.user.update_profile({
  name: 'New Name',
  bio: 'Updated bio',
  website: 'https://mywebsite.com'
})

# Manage API keys
api_keys = client.user.get_api_keys
new_key = client.user.create_api_key('My App Key', {
  scopes: ['tracks:read', 'analytics:read'],
  rate_limit: 1000
})

# Get usage statistics
usage = client.user.get_usage_stats({
  period: 'month',
  include_breakdown: true
})
```

### Webhooks

```ruby
# Create webhook
webhook = client.webhooks.create({
  url: 'https://myapp.com/webhooks/jewelmusic',
  events: ['track.processed', 'analysis.completed'],
  secret: 'my-webhook-secret'
})

# List webhooks
webhooks = client.webhooks.list

# Test webhook
test_result = client.webhooks.test(webhook['id'])

# Verify webhook signature (in your webhook handler)
valid = JewelMusic::Resources::WebhooksResource.verify_signature(
  payload,
  request.headers['JewelMusic-Signature'],
  'your-webhook-secret'
)

if valid
  event = JewelMusic::Resources::WebhooksResource.parse_event(payload)
  # Process webhook event
end
```

### AI Copilot

```ruby
# Create copilot session
session = client.copilot.create_session({
  type: 'composition',
  context: 'Electronic music production'
})

# Send message to copilot
response = client.copilot.send_message(
  session['id'],
  "Help me create a chord progression for an uplifting electronic track"
)

# Get composition suggestions
suggestions = client.copilot.get_composition_suggestions({
  type: 'chord_progression',
  key: 'C major',
  style: 'electronic'
}, {
  mood: 'uplifting',
  tempo: 128
})

# Get production advice
advice = client.copilot.get_production_advice(track_id, [
  'mixing', 'mastering'
], {
  target_platforms: ['spotify'],
  skill_level: 'intermediate'
})
```

## Advanced Features

### Batch Processing

```ruby
# Batch update track metadata
batch_update = client.tracks.batch_update_metadata([
  { id: track1_id, metadata: { genre: 'Electronic' } },
  { id: track2_id, metadata: { genre: 'House' } }
])

# Batch process tracks
batch_job = client.tracks.batch_process(
  [track1_id, track2_id],
  ['analyze', 'generate_waveform'],
  { priority: 'high', notify: true }
)
```

### Real-time Analytics

```ruby
# Get real-time streaming data
realtime = client.analytics.get_realtime_analytics({
  period: '24h',
  update_interval: 300, # 5 minutes
  metrics: ['streams', 'listeners']
})

# Set up analytics alerts
alert = client.analytics.setup_alert({
  name: 'High Streaming Alert',
  condition: {
    metric: 'streams',
    operator: 'greater_than',
    threshold: 1000,
    period: 'hour'
  },
  notifications: ['email', 'webhook'],
  email: 'alerts@myapp.com'
})
```

## Testing

Run the test suite:

```bash
bundle exec rspec
```

Run with coverage:

```bash
bundle exec rspec --require spec_helper
```

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Examples

The `examples/` directory contains comprehensive examples demonstrating SDK usage:

- [`basic_usage.rb`](examples/basic_usage.rb) - Basic SDK operations and error handling
- [`ai_generation.rb`](examples/ai_generation.rb) - AI-powered music generation examples
- [`complete_workflow.rb`](examples/complete_workflow.rb) - End-to-end music production workflow
- [`webhook_server.rb`](examples/webhook_server.rb) - Production-ready webhook server with Sinatra

Run examples:

```bash
# Set your API key
export JEWELMUSIC_API_KEY=your_key_here

# Run basic usage example
ruby examples/basic_usage.rb

# Run AI generation examples
ruby examples/ai_generation.rb

# Run complete workflow
ruby examples/complete_workflow.rb

# Start webhook server
ruby examples/webhook_server.rb server

# Set up webhooks
ruby examples/webhook_server.rb setup https://your-domain.com/webhook your-secret
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jewelmusic/sdk.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

- [API Documentation](https://docs.jewelmusic.art/api)
- [SDK Reference](https://docs.jewelmusic.art/sdk/ruby)
- [Examples](https://github.com/jewelmusic/sdk/tree/main/ruby/examples)

## Support

- Email: [support@jewelmusic.art](mailto:support@jewelmusic.art)
- Documentation: [docs.jewelmusic.art](https://docs.jewelmusic.art)
- Issues: [GitHub Issues](https://github.com/jewelmusic/sdk/issues)

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the JewelMusic project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/jewelmusic/sdk-ruby/blob/main/CODE_OF_CONDUCT.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and updates.