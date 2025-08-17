# JewelMusic PHP SDK API Reference

This document provides detailed API reference for the JewelMusic PHP SDK.

## Table of Contents

- [Client Initialization](#client-initialization)
- [Resources Overview](#resources-overview)
- [Error Handling](#error-handling)
- [Type Annotations](#type-annotations)

## Client Initialization

### JewelMusic Client

```php
use JewelMusic\JewelMusic;

// Basic initialization
$client = new JewelMusic('your-api-key');

// With options
$client = new JewelMusic('your-api-key', [
    'baseUrl' => 'https://api.jewelmusic.art',
    'timeout' => 30,
    'retries' => 3,
    'userAgent' => 'MyApp/1.0',
    'headers' => ['Custom-Header' => 'value'],
    'debug' => false,
    'rateLimitRetry' => true
]);
```

### Configuration Options

```php
$options = [
    'baseUrl' => 'https://api.jewelmusic.art',  // API base URL
    'timeout' => 30,                           // Request timeout in seconds
    'retries' => 3,                            // Number of retry attempts
    'retryDelay' => 1,                         // Delay between retries
    'userAgent' => 'MyApp/1.0',                // Custom user agent
    'headers' => [],                           // Additional headers
    'debug' => false,                          // Enable debug logging
    'rateLimitRetry' => true,                  // Auto-retry on rate limits
    'proxy' => null,                           // Proxy configuration
    'sslVerifyPeer' => true,                   // SSL verification
];
```

## Resources Overview

### Tracks Resource

```php
// Upload track
$track = $client->tracks->upload(
    '/path/to/audio.mp3',
    'audio.mp3',
    [
        'title' => 'My Song',
        'artist' => 'My Artist',
        'genre' => 'Electronic'
    ]
);

// Upload with progress callback
$track = $client->tracks->upload(
    $filePath,
    $filename,
    $metadata,
    function($bytesUploaded, $totalBytes) {
        $percent = ($bytesUploaded / $totalBytes) * 100;
        echo "Upload progress: " . round($percent, 1) . "%\r";
    }
);

// Get track
$track = $client->tracks->get($trackId);

// List tracks
$tracks = $client->tracks->list($page = 1, $perPage = 20);

// List with filters
$tracks = $client->tracks->list(1, 20, [
    'genre' => 'Electronic',
    'artist' => 'My Artist'
]);

// Update track
$updatedTrack = $client->tracks->update($trackId, [
    'title' => 'Updated Title'
]);

// Delete track
$client->tracks->delete($trackId);

// Search tracks
$results = $client->tracks->search('electronic music', [
    'limit' => 10,
    'filters' => ['genre' => 'Electronic']
]);

// Upload artwork
$artwork = $client->tracks->uploadArtwork(
    $trackId,
    '/path/to/cover.jpg',
    'cover.jpg'
);
```

### Analysis Resource

```php
// Analyze track
$analysis = $client->analysis->analyze($trackId);

// Analyze with options
$analysis = $client->analysis->analyzeWithOptions($trackId, [
    'analysisTypes' => ['tempo', 'key', 'mood'],
    'detailedReport' => true,
    'culturalContext' => 'global',
    'targetPlatforms' => ['spotify', 'apple-music']
]);

// Get analysis results
$analysis = $client->analysis->get($analysisId);

// Get specific analysis components
$tempoAnalysis = $client->analysis->getTempoAnalysis($analysisId);
$keyAnalysis = $client->analysis->getKeyAnalysis($analysisId);
$moodAnalysis = $client->analysis->getMoodAnalysis($analysisId);

// Get analysis insights
$insights = $client->analysis->getInsights($analysisId, [
    'focus' => ['production', 'composition'],
    'includeActionables' => true
]);

// Get analysis status
$status = $client->analysis->getStatus($analysisId);
```

### Copilot Resource (AI Generation)

```php
// Generate melody
$melody = $client->copilot->generateMelody([
    'style' => 'electronic',
    'genre' => 'electronic',
    'mood' => 'upbeat',
    'tempo' => 128,
    'key' => 'C',
    'mode' => 'major',
    'duration' => 30,
    'instruments' => ['synthesizer', 'bass', 'piano'],
    'complexity' => 'medium',
    'creativity' => 0.7
]);

// Generate lyrics
$lyrics = $client->copilot->generateLyrics([
    'theme' => 'technology and human connection',
    'genre' => 'electronic',
    'language' => 'en',
    'mood' => 'optimistic',
    'structure' => 'verse-chorus-verse-chorus-bridge-chorus',
    'keywords' => ['future', 'connection', 'digital']
]);

// Generate harmony
$harmony = $client->copilot->generateHarmony([
    'melodyId' => $melodyId,
    'style' => 'jazz',
    'complexity' => 'complex',
    'voicing' => 'close',
    'instruments' => ['piano', 'guitar']
]);

// Generate chord progression
$progression = $client->copilot->generateChordProgression([
    'key' => 'C major',
    'style' => 'pop',
    'complexity' => 0.5,
    'length' => 8
]);

// Generate complete song
$song = $client->copilot->generateCompleteSong([
    'prompt' => 'Create an uplifting electronic song',
    'style' => 'electronic',
    'duration' => 180,
    'includeVocals' => true,
    'vocalStyle' => 'female-pop',
    'mixingStyle' => 'modern'
]);

// Apply style transfer
$styledTrack = $client->copilot->applyStyleTransfer([
    'sourceId' => $sourceTrackId,
    'targetStyle' => 'jazz',
    'intensity' => 0.8,
    'preserveStructure' => true
]);

// Get templates
$templates = $client->copilot->getTemplates([
    'genre' => 'electronic',
    'mood' => 'upbeat',
    'style' => 'modern'
]);

// Suggest arrangement
$arrangement = $client->copilot->suggestArrangement([
    'trackId' => $trackId,
    'genre' => 'electronic',
    'mood' => 'upbeat'
]);
```

### Distribution Resource

```php
// Create release
$release = $client->distribution->createRelease([
    'type' => 'single',
    'title' => 'My Release',
    'artist' => 'My Artist',
    'releaseDate' => '2025-09-01',
    'tracks' => [
        ['trackId' => $trackId, 'title' => 'Song Title']
    ],
    'platforms' => ['spotify', 'apple-music', 'youtube-music']
]);

// Submit to platforms
$submission = $client->distribution->submitToPlatforms($releaseId, [
    'platforms' => ['spotify', 'apple-music'],
    'scheduledDate' => '2025-09-01T00:00:00Z',
    'expedited' => false
]);

// Get distribution status
$status = $client->distribution->getDistributionStatus($releaseId);

// Validate release
$validation = $client->distribution->validateRelease($releaseId);

// Get available platforms
$platforms = $client->distribution->getPlatforms();

// Get earnings
$earnings = $client->distribution->getEarnings($releaseId, [
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31',
    'currency' => 'USD'
]);
```

### Transcription Resource

```php
// Create transcription
$transcription = $client->transcription->createTranscription($trackId, [
    'languages' => ['en', 'auto-detect'],
    'includeTimestamps' => true,
    'wordLevelTimestamps' => true,
    'speakerDiarization' => true,
    'model' => 'large'
]);

// Create from file
$transcription = $client->transcription->createTranscriptionFromFile(
    '/path/to/audio.mp3',
    'audio.mp3',
    $options
);

// Get transcription
$transcription = $client->transcription->get($transcriptionId);

// Enhance lyrics
$enhanced = $client->transcription->enhanceLyrics('Original lyrics text', [
    'improveMeter' => true,
    'enhanceRhyming' => true,
    'adjustTone' => 'professional',
    'preserveOriginalMeaning' => true
]);

// Translate lyrics
$translation = $client->transcription->translateLyrics(
    $transcriptionId,
    ['es', 'fr'],
    ['preserveRhyme' => true]
);

// Get transcription status
$status = $client->transcription->getStatus($transcriptionId);
```

### Analytics Resource

```php
// Get streaming analytics
$streams = $client->analytics->getStreams([
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31',
    'groupBy' => 'month',
    'platforms' => ['spotify', 'apple-music']
]);

// Get listener demographics
$listeners = $client->analytics->getListeners([
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31',
    'groupBy' => 'territory'
]);

// Get track analytics
$trackAnalytics = $client->analytics->getTrackAnalytics($trackId, [
    'startDate' => '2024-01-01',
    'endDate' => '2024-12-31',
    'metrics' => ['streams', 'listeners', 'completion_rate']
]);

// Setup alert
$alert = $client->analytics->setupAlert([
    'name' => 'High Streaming Alert',
    'releaseId' => $releaseId,
    'conditions' => [
        [
            'metric' => 'streams',
            'operator' => 'greater_than',
            'threshold' => 1000,
            'period' => 'day'
        ]
    ],
    'notifications' => ['email' => true, 'webhook' => true]
]);

// Export data
$export = $client->analytics->exportData(
    ['startDate' => '2024-01-01', 'endDate' => '2024-12-31'],
    ['format' => 'csv', 'includeCharts' => true]
);

// Get real-time analytics
$realtime = $client->analytics->getRealtimeAnalytics([
    'period' => '24h',
    'updateInterval' => 300,
    'metrics' => ['streams', 'listeners']
]);
```

### User Resource

```php
// Get profile
$profile = $client->user->getProfile();

// Update profile
$updatedProfile = $client->user->updateProfile([
    'name' => 'New Name',
    'bio' => 'Updated bio',
    'website' => 'https://mywebsite.com'
]);

// Get usage stats
$usage = $client->user->getUsageStats([
    'period' => 'month',
    'includeBreakdown' => true
]);

// API key management
$apiKeys = $client->user->getApiKeys();

$newKey = $client->user->createApiKey('My App Key', [
    'scopes' => ['tracks:read', 'analytics:read'],
    'rateLimit' => 1000
]);

$client->user->revokeApiKey($keyId);

// Get subscription info
$subscription = $client->user->getSubscription();

// Update subscription
$client->user->updateSubscription($planId);
```

### Webhooks Resource

```php
use JewelMusic\Resources\WebhooksResource;

// Create webhook
$webhook = $client->webhooks->create([
    'url' => 'https://myapp.com/webhooks/jewelmusic',
    'events' => ['track.processed', 'analysis.completed'],
    'secret' => 'my-webhook-secret',
    'active' => true
]);

// List webhooks
$webhooks = $client->webhooks->list();

// Get webhook
$webhook = $client->webhooks->get($webhookId);

// Update webhook
$updatedWebhook = $client->webhooks->update($webhookId, [
    'active' => false
]);

// Delete webhook
$client->webhooks->delete($webhookId);

// Test webhook
$testResult = $client->webhooks->test($webhookId);

// Verify webhook signature (static method)
$isValid = WebhooksResource::verifySignature($payload, $signature, $secret);

// Parse webhook event
$event = WebhooksResource::parseEvent($payload);

// Create signature for testing
$signature = WebhooksResource::createSignature($payload, $secret);
```

## Error Handling

### Exception Classes

```php
use JewelMusic\Exceptions\{
    ApiException,
    AuthenticationException,
    ValidationException,
    NotFoundException,
    RateLimitException,
    NetworkException
};

// Base exception
class ApiException extends Exception
{
    protected $statusCode;
    protected $details;
    protected $requestId;
    
    public function getHttpStatusCode(): ?int
    public function getDetails(): ?array
    public function getRequestId(): ?string
}

// Specific exceptions
class AuthenticationException extends ApiException {}

class ValidationException extends ApiException
{
    protected $fieldErrors = [];
    
    public function getFieldErrors(): array
}

class RateLimitException extends ApiException
{
    protected $retryAfterSeconds;
    
    public function getRetryAfterSeconds(): int
}
```

### Error Handling Example

```php
try {
    $track = $client->tracks->get('invalid-id');
} catch (AuthenticationException $e) {
    echo "Authentication failed: " . $e->getMessage() . "\n";
    echo "Request ID: " . $e->getRequestId() . "\n";
} catch (ValidationException $e) {
    echo "Validation errors:\n";
    foreach ($e->getFieldErrors() as $field => $errors) {
        echo "  $field: " . implode(', ', $errors) . "\n";
    }
} catch (NotFoundException $e) {
    echo "Track not found: " . $e->getMessage() . "\n";
} catch (RateLimitException $e) {
    echo "Rate limited. Retry after " . $e->getRetryAfterSeconds() . " seconds\n";
    sleep($e->getRetryAfterSeconds());
} catch (NetworkException $e) {
    echo "Network error: " . $e->getMessage() . "\n";
} catch (ApiException $e) {
    echo "API error: " . $e->getMessage() . " (Status: " . $e->getHttpStatusCode() . ")\n";
}
```

## Type Annotations

### Using PHPDoc for Type Hints

```php
/**
 * Upload a track with metadata
 *
 * @param string|resource $file File path or file resource
 * @param string $filename Original filename
 * @param array<string, mixed> $metadata Track metadata
 * @param callable|null $progressCallback Progress callback function
 * @param array<string, mixed> $options Upload options
 * @return array<string, mixed> Track data
 * @throws ApiException
 */
public function upload(
    $file,
    string $filename,
    array $metadata = [],
    ?callable $progressCallback = null,
    array $options = []
): array;

/**
 * Analyze a track with specific options
 *
 * @param string $trackId Track identifier
 * @param array{
 *   analysisTypes?: string[],
 *   detailedReport?: bool,
 *   culturalContext?: string,
 *   targetPlatforms?: string[]
 * } $options Analysis options
 * @return array<string, mixed> Analysis result
 */
public function analyzeWithOptions(string $trackId, array $options = []): array;
```

### Common Type Definitions

```php
// Type aliases using PHPDoc
/**
 * @phpstan-type TrackMetadata array{
 *   title: string,
 *   artist: string,
 *   album?: string,
 *   genre?: string,
 *   releaseDate?: string,
 *   explicit?: bool,
 *   tags?: string[]
 * }
 *
 * @phpstan-type AnalysisOptions array{
 *   analysisTypes?: string[],
 *   detailedReport?: bool,
 *   culturalContext?: string,
 *   targetPlatforms?: string[]
 * }
 *
 * @phpstan-type PaginatedResponse array{
 *   items: array<mixed>,
 *   pagination: array{
 *     page: int,
 *     perPage: int,
 *     total: int,
 *     totalPages: int,
 *     hasNext: bool,
 *     hasPrev: bool
 *   }
 * }
 */
```

### Configuration Arrays

```php
/**
 * Client configuration options
 *
 * @phpstan-type ClientConfig array{
 *   baseUrl?: string,
 *   timeout?: int,
 *   retries?: int,
 *   retryDelay?: int,
 *   userAgent?: string,
 *   headers?: array<string, string>,
 *   debug?: bool,
 *   rateLimitRetry?: bool,
 *   proxy?: string|null,
 *   sslVerifyPeer?: bool
 * }
 */

/**
 * Upload options
 *
 * @phpstan-type UploadOptions array{
 *   chunkSize?: int,
 *   timeout?: int,
 *   retries?: int
 * }
 */
```

### Response Structures

```php
/**
 * Standard API response structures
 *
 * @phpstan-type Track array{
 *   id: string,
 *   title: string,
 *   artist: string,
 *   album?: string,
 *   genre?: string,
 *   duration: int,
 *   fileSize: int,
 *   format: string,
 *   status: string,
 *   createdAt: string,
 *   updatedAt: string,
 *   metadata: TrackMetadata
 * }
 *
 * @phpstan-type Analysis array{
 *   id: string,
 *   trackId: string,
 *   status: string,
 *   results?: array<string, mixed>,
 *   createdAt: string,
 *   completedAt?: string
 * }
 */
```

For complete API documentation with type annotations, see the PHPDoc comments in the source code.