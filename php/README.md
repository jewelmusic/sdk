# JewelMusic PHP SDK

The official PHP SDK for JewelMusic's AI-powered music distribution platform. This SDK provides comprehensive access to music analysis, distribution, transcription, analytics, and user management features.

## Features

- 🎵 **AI Music Analysis** - Advanced audio analysis and insights
- 🚀 **Music Distribution** - Multi-platform release management
- 📝 **Transcription Services** - AI-powered lyrics transcription and enhancement
- 📊 **Analytics & Reporting** - Comprehensive streaming analytics
- 👤 **User Management** - Profile, preferences, and account management
- 🔗 **Webhooks** - Real-time event notifications
- 🤖 **AI Copilot** - Music creation and production assistance

## Requirements

- PHP 8.1 or higher
- cURL extension
- JSON extension
- Composer for dependency management

## Installation

Install the SDK using Composer:

```bash
composer require jewelmusic/sdk
```

## Quick Start

```php
<?php

require_once 'vendor/autoload.php';

use JewelMusic\JewelMusic;

// Initialize the SDK
$jewelMusic = new JewelMusic('your-api-key-here');

// Get user profile
$profile = $jewelMusic->user->getProfile();
echo "Welcome, " . $profile['name'] . "!\n";

// Upload and analyze a track
$track = $jewelMusic->tracks->upload(
    '/path/to/audio.mp3',
    'audio.mp3',
    [
        'title' => 'My Song',
        'artist' => 'My Artist',
        'genre' => 'Electronic'
    ]
);

// Start AI analysis
$analysis = $jewelMusic->analysis->analyze($track['id']);
echo "Analysis started: " . $analysis['id'] . "\n";

// Get analysis results when complete
$results = $jewelMusic->analysis->get($analysis['id']);
print_r($results);
```

## Configuration

### Basic Configuration

```php
use JewelMusic\JewelMusic;

$jewelMusic = new JewelMusic('your-api-key', [
    'baseUrl' => 'https://api.jewelmusic.art', // Default
    'timeout' => 30,                           // Request timeout in seconds
    'retries' => 3,                            // Number of retry attempts
    'retryDelay' => 1,                         // Delay between retries
    'userAgent' => 'MyApp/1.0'                 // Custom user agent
]);
```

### Environment Variables

You can also configure the SDK using environment variables:

```bash
JEWELMUSIC_API_KEY=your-api-key-here
JEWELMUSIC_BASE_URL=https://api.jewelmusic.art
```

## Core Concepts

### Error Handling

The SDK uses typed exceptions for different error scenarios:

```php
use JewelMusic\Exceptions\AuthenticationException;
use JewelMusic\Exceptions\ValidationException;
use JewelMusic\Exceptions\RateLimitException;
use JewelMusic\Exceptions\NotFoundException;

try {
    $result = $jewelMusic->tracks->get('invalid-id');
} catch (AuthenticationException $e) {
    echo "Authentication failed: " . $e->getMessage();
} catch (ValidationException $e) {
    echo "Validation errors: ";
    print_r($e->getValidationErrors());
} catch (RateLimitException $e) {
    echo "Rate limit exceeded. Retry after: " . $e->getRetryAfter() . " seconds";
} catch (NotFoundException $e) {
    echo "Resource not found: " . $e->getMessage();
}
```

### File Uploads

The SDK supports both regular and chunked file uploads:

```php
// Regular upload
$track = $jewelMusic->tracks->upload(
    '/path/to/file.mp3',
    'song.mp3',
    ['title' => 'My Song', 'artist' => 'Artist']
);

// Chunked upload for large files
$track = $jewelMusic->tracks->uploadChunked(
    '/path/to/large-file.wav',
    'large-song.wav',
    ['title' => 'Epic Song', 'artist' => 'Artist'],
    8388608 // 8MB chunks
);

// Upload from file handle
$fileHandle = fopen('/path/to/file.mp3', 'rb');
$track = $jewelMusic->tracks->upload(
    $fileHandle,
    'song.mp3',
    ['title' => 'My Song', 'artist' => 'Artist']
);
fclose($fileHandle);
```

## SDK Resources

### Tracks Management

```php
// Upload a track
$track = $jewelMusic->tracks->upload(
    '/path/to/audio.mp3',
    'song.mp3',
    [
        'title' => 'Amazing Song',
        'artist' => 'Great Artist',
        'album' => 'Best Album',
        'genre' => 'Pop',
        'releaseDate' => '2024-01-01'
    ]
);

// Get track details
$trackDetails = $jewelMusic->tracks->get($track['id']);

// Update track metadata
$updated = $jewelMusic->tracks->update($track['id'], [
    'title' => 'Updated Title'
]);

// Upload artwork
$artwork = $jewelMusic->tracks->uploadArtwork(
    $track['id'],
    '/path/to/cover.jpg',
    'cover.jpg'
);

// List tracks with filters
$tracks = $jewelMusic->tracks->list(1, 20, [
    'genre' => 'Pop',
    'artist' => 'Great Artist'
]);
```

### AI Music Analysis

```php
// Analyze existing track
$analysis = $jewelMusic->analysis->analyze($trackId);

// Analyze uploaded file directly
$analysis = $jewelMusic->analysis->analyze(
    null,
    '/path/to/audio.mp3',
    'audio.mp3',
    [
        'analysisTypes' => ['harmony', 'rhythm', 'mood'],
        'includeVisualization' => true
    ]
);

// Get specific analysis results
$keyAnalysis = $jewelMusic->analysis->getKeyAnalysis($analysis['id']);
$tempoAnalysis = $jewelMusic->analysis->getTempoAnalysis($analysis['id']);
$moodAnalysis = $jewelMusic->analysis->getMoodAnalysis($analysis['id']);

// Get insights and recommendations
$insights = $jewelMusic->analysis->getInsights($analysis['id'], [
    'focus' => ['production', 'composition'],
    'includeActionables' => true
]);
```

### Distribution Management

```php
// Create a release
$release = $jewelMusic->distribution->createRelease([
    'title' => 'My Album',
    'artist' => 'My Artist',
    'releaseDate' => '2024-06-01',
    'tracks' => [$track1Id, $track2Id],
    'platforms' => ['spotify', 'apple-music', 'youtube-music']
]);

// Submit for distribution
$submission = $jewelMusic->distribution->submitForDistribution(
    $release['id'],
    ['spotify', 'apple-music'],
    [
        'releaseDate' => '2024-06-01',
        'territories' => ['US', 'CA', 'GB']
    ]
);

// Get distribution status
$status = $jewelMusic->distribution->getDistributionStatus($release['id']);

// Get earnings data
$earnings = $jewelMusic->distribution->getEarnings($release['id'], [
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31',
    'currency' => 'USD'
]);
```

### Transcription Services

```php
// Create transcription from track
$transcription = $jewelMusic->transcription->create(
    $trackId,
    null,
    null,
    [
        'languages' => ['en', 'es'],
        'includeTimestamps' => true,
        'speakerDiarization' => true
    ]
);

// Create transcription from file
$transcription = $jewelMusic->transcription->create(
    null,
    '/path/to/audio.mp3',
    'audio.mp3',
    ['languages' => ['en']]
);

// Translate lyrics
$translation = $jewelMusic->transcription->translateLyrics(
    $transcription['id'],
    ['es', 'fr'],
    [
        'preserveRhyme' => true,
        'preserveMeter' => true
    ]
);

// Enhance lyrics with AI
$enhanced = $jewelMusic->transcription->enhanceLyrics(
    "Original lyrics text here",
    [
        'improveMeter' => true,
        'enhanceRhyming' => true,
        'adjustTone' => 'uplifting'
    ]
);
```

### Analytics & Reporting

```php
// Get streaming analytics
$streams = $jewelMusic->analytics->getStreams([
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31',
    'groupBy' => 'month',
    'platforms' => ['spotify', 'apple-music']
]);

// Get listener demographics
$listeners = $jewelMusic->analytics->getListeners([
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31',
    'groupBy' => 'territory'
]);

// Get track-specific analytics
$trackAnalytics = $jewelMusic->analytics->getTrackAnalytics($trackId, [
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31'
]);

// Export analytics data
$export = $jewelMusic->analytics->exportData([
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31'
], [
    'format' => 'csv',
    'includeCharts' => true,
    'email' => 'user@example.com'
]);
```

### User Management

```php
// Get user profile
$profile = $jewelMusic->user->getProfile();

// Update profile
$updatedProfile = $jewelMusic->user->updateProfile([
    'name' => 'New Name',
    'bio' => 'Updated bio',
    'website' => 'https://mywebsite.com'
]);

// Manage API keys
$apiKeys = $jewelMusic->user->getApiKeys();
$newKey = $jewelMusic->user->createApiKey('My App Key', [
    'scopes' => ['tracks:read', 'analytics:read'],
    'rateLimit' => 1000
]);

// Get usage statistics
$usage = $jewelMusic->user->getUsageStats([
    'period' => 'month',
    'includeBreakdown' => true
]);
```

### Webhooks

```php
// Create webhook
$webhook = $jewelMusic->webhooks->create([
    'url' => 'https://myapp.com/webhooks/jewelmusic',
    'events' => ['track.processed', 'analysis.completed'],
    'secret' => 'my-webhook-secret'
]);

// List webhooks
$webhooks = $jewelMusic->webhooks->list();

// Test webhook
$testResult = $jewelMusic->webhooks->test($webhook['id']);

// Verify webhook signature (in your webhook handler)
$isValid = JewelMusic\Resources\WebhooksResource::verifySignature(
    $payload,
    $_SERVER['HTTP_JEWELMUSIC_SIGNATURE'],
    'your-webhook-secret'
);

if ($isValid) {
    $event = JewelMusic\Resources\WebhooksResource::parseEvent($payload);
    // Process webhook event
}
```

### AI Copilot

```php
// Create copilot session
$session = $jewelMusic->copilot->createSession([
    'type' => 'composition',
    'context' => 'Electronic music production'
]);

// Send message to copilot
$response = $jewelMusic->copilot->sendMessage(
    $session['id'],
    "Help me create a chord progression for an uplifting electronic track"
);

// Get composition suggestions
$suggestions = $jewelMusic->copilot->getCompositionSuggestions([
    'type' => 'chord_progression',
    'key' => 'C major',
    'style' => 'electronic'
], [
    'mood' => 'uplifting',
    'tempo' => 128
]);

// Get production advice
$advice = $jewelMusic->copilot->getProductionAdvice($trackId, [
    'mixing', 'mastering'
], [
    'targetPlatforms' => ['spotify'],
    'skillLevel' => 'intermediate'
]);
```

## Advanced Features

### Batch Processing

```php
// Batch update track metadata
$batchUpdate = $jewelMusic->tracks->batchUpdateMetadata([
    ['id' => $track1Id, 'metadata' => ['genre' => 'Electronic']],
    ['id' => $track2Id, 'metadata' => ['genre' => 'House']]
]);

// Batch process tracks
$batchJob = $jewelMusic->tracks->batchProcess(
    [$track1Id, $track2Id],
    ['analyze', 'generate_waveform'],
    ['priority' => 'high', 'notify' => true]
);
```

### Real-time Analytics

```php
// Get real-time streaming data
$realtime = $jewelMusic->analytics->getRealtimeAnalytics([
    'period' => '24h',
    'updateInterval' => 300, // 5 minutes
    'metrics' => ['streams', 'listeners']
]);

// Set up analytics alerts
$alert = $jewelMusic->analytics->setupAlert([
    'name' => 'High Streaming Alert',
    'condition' => [
        'metric' => 'streams',
        'operator' => 'greater_than',
        'threshold' => 1000,
        'period' => 'hour'
    ],
    'notifications' => ['email', 'webhook'],
    'email' => 'alerts@myapp.com'
]);
```

## Testing

Run the test suite:

```bash
composer test
```

Run static analysis:

```bash
composer analyze
```

Format code:

```bash
composer cs-fix
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Examples

The `examples/` directory contains comprehensive examples demonstrating SDK usage:

- [`basic_usage.php`](examples/basic_usage.php) - Basic SDK operations and error handling
- [`ai_generation.php`](examples/ai_generation.php) - AI-powered music generation examples
- [`complete_workflow.php`](examples/complete_workflow.php) - End-to-end music production workflow
- [`webhook_server.php`](examples/webhook_server.php) - Production-ready webhook server implementation
- [`track_analysis.php`](examples/track_analysis.php) - Advanced track analysis features

Run examples:

```bash
# Set your API key
export JEWELMUSIC_API_KEY=your_key_here

# Run basic usage example
php examples/basic_usage.php

# Run AI generation examples
php examples/ai_generation.php

# Run complete workflow
php examples/complete_workflow.php

# Set up webhooks
php examples/webhook_server.php setup https://your-domain.com/webhook your-secret
```

## Documentation

- [API Documentation](https://docs.jewelmusic.art/api)
- [SDK Reference](https://docs.jewelmusic.art/sdk/php)
- [Examples](https://github.com/jewelmusic/sdk/tree/main/php/examples)

## Support

- Email: [support@jewelmusic.art](mailto:support@jewelmusic.art)
- Documentation: [docs.jewelmusic.art](https://docs.jewelmusic.art)
- Issues: [GitHub Issues](https://github.com/jewelmusic/sdk/issues)

## License

This SDK is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and updates.