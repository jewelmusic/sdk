# Base API Client Architecture

This document defines the common architecture pattern that all JewelMusic SDKs should follow, ensuring consistency across programming languages while respecting language-specific conventions.

## Core Client Structure

### Main Client Class
```
JewelMusicClient/JewelMusic
├── Configuration
├── HTTP Client
├── Authentication Handler
├── Rate Limiter
├── Error Handler
├── Resource Managers
│   ├── Copilot
│   ├── Analysis
│   ├── Distribution
│   ├── Transcription
│   ├── Tracks
│   ├── Analytics
│   ├── User
│   └── Webhooks
└── Utilities
```

## Configuration Structure

### Required Configuration
```json
{
  "apiKey": "string (required)",
  "environment": "production | sandbox",
  "apiVersion": "v1",
  "baseUrl": "https://api.jewelmusic.art",
  "timeout": 30000,
  "maxRetries": 3,
  "retryDelay": 1000
}
```

### Optional Configuration
```json
{
  "httpAgent": "custom HTTP agent",
  "proxy": "proxy configuration",
  "logger": "custom logger instance",
  "logLevel": "debug | info | warn | error",
  "userAgent": "custom user agent",
  "hooks": {
    "onRequest": "function",
    "onResponse": "function", 
    "onError": "function"
  }
}
```

## Authentication Pattern

### API Key Format
- Production: `jml_live_*`
- Sandbox: `jml_test_*`
- Development: `jml_dev_*`

### Implementation
```
class AuthHandler:
  - validateApiKey(key)
  - attachAuthHeaders(request)
  - handleAuthErrors(response)
  - refreshToken() // if needed for future OAuth
```

## HTTP Client Pattern

### Request Structure
```
class HTTPClient:
  - baseUrl: string
  - defaultHeaders: object
  - timeout: number
  - retryConfig: object
  
  Methods:
  - get(path, options)
  - post(path, data, options)
  - put(path, data, options)
  - delete(path, options)
  - upload(path, file, metadata, options)
```

### Response Structure
```json
{
  "success": "boolean",
  "data": "any",
  "meta": {
    "timestamp": "ISO 8601",
    "requestId": "string",
    "rateLimit": {
      "limit": "number",
      "remaining": "number",
      "reset": "timestamp"
    }
  }
}
```

## Error Handling Pattern

### Error Hierarchy
```
JewelMusicError (Base)
├── AuthenticationError (401)
├── AuthorizationError (403)
├── NotFoundError (404)
├── ValidationError (400)
├── RateLimitError (429)
├── ServerError (5xx)
├── NetworkError (timeouts, connection)
└── UnknownError (unexpected)
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "requestId": "string"
  }
}
```

## Resource Manager Pattern

Each resource manager handles a specific domain of the API:

### Base Resource Manager
```
class BaseResource:
  - client: HTTPClient
  - basePath: string
  
  Methods:
  - buildUrl(path)
  - makeRequest(method, path, data, options)
  - handleResponse(response)
  - handleError(error)
```

### Copilot Resource
```
class CopilotResource extends BaseResource:
  Methods:
  - generateMelody(options)
  - generateHarmony(options)
  - generateLyrics(options)
  - suggestArrangement(options)
  - completeSong(options)
  - getTemplates()
  - styleTransfer(options)
  - chordProgression(options)
  - genreAnalysis(options)
  - moodMatching(options)
```

### Analysis Resource
```
class AnalysisResource extends BaseResource:
  Methods:
  - uploadTrack(file, options)
  - getAnalysis(id)
  - batchAnalysis(files, options)
  - downloadReport(id, format)
  - audioQualityCheck(file)
  - masteringSuggestions(file)
  - loudnessAnalysis(file)
  - spectrumAnalysis(file)
  - culturalCompliance(file, region)
  - detectStructure(file)
  - detectKey(file)
  - tempoAnalysis(file)
  - chordDetection(file)
```

### Distribution Resource
```
class DistributionResource extends BaseResource:
  Methods:
  - createRelease(releaseData)
  - getReleases(filters)
  - getRelease(id)
  - updateRelease(id, updates)
  - cancelRelease(id)
  - submitToPlatforms(releaseId, platforms)
  - getDistributionStatus(releaseId)
  - takedownFromPlatforms(releaseId, platforms)
  - getSupportedPlatforms()
  - validateRelease(releaseData)
  - scheduleRelease(releaseId, date)
  - generatePreview(releaseId)
```

### Transcription Resource
```
class TranscriptionResource extends BaseResource:
  Methods:
  - createTranscription(file, options)
  - getTranscriptionStatus(id)
  - downloadTranscription(id, format)
  - translateLyrics(id, targetLanguages)
  - syncLyrics(transcriptionId, audioFile)
  - enhanceLyrics(lyrics, options)
  - checkRhymeScheme(lyrics)
  - analyzeSentiment(lyrics)
  - checkLanguageQuality(lyrics, language)
```

### Tracks Resource
```
class TracksResource extends BaseResource:
  Methods:
  - upload(file, metadata, options)
  - list(filters, pagination)
  - get(id)
  - update(id, metadata)
  - delete(id)
  - uploadArtwork(trackId, artworkFile)
  - batchUpload(files, options)
  - batchUpdateMetadata(updates)
  - batchProcess(trackIds, options)
```

### Analytics Resource
```
class AnalyticsResource extends BaseResource:
  Methods:
  - getStreams(filters)
  - getListeners(filters)
  - getPlatformMetrics(filters)
  - getGeographicalData(filters)
  - getTrends(filters)
```

### User Resource
```
class UserResource extends BaseResource:
  Methods:
  - getProfile()
  - updateProfile(data)
  - uploadAvatar(file)
  - getPreferences()
  - updatePreferences(preferences)
  - getApiKeys()
  - createApiKey(name, permissions)
  - updateApiKey(id, updates)
  - revokeApiKey(id)
  - getUsageStats()
```

### Webhooks Resource
```
class WebhooksResource extends BaseResource:
  Methods:
  - list()
  - create(webhookData)
  - update(id, updates)
  - delete(id)
  - test(id)
  
  Static Methods:
  - verifySignature(payload, signature, secret)
  - parseEvent(payload)
```

## Rate Limiting Pattern

### Implementation
```
class RateLimiter:
  - limits: object // per endpoint limits
  - windows: object // time windows
  - current: object // current usage
  
  Methods:
  - checkLimit(endpoint)
  - updateUsage(endpoint, response)
  - waitIfNeeded(endpoint)
  - getRemainingRequests(endpoint)
```

## File Upload Pattern

### Multipart Upload Support
```
class FileUploader:
  - chunkSize: number
  - maxFileSize: number
  - supportedFormats: array
  
  Methods:
  - validateFile(file)
  - uploadChunk(chunk, metadata)
  - uploadFile(file, metadata, progressCallback)
  - resumeUpload(uploadId)
```

## Webhook Verification Pattern

### Signature Verification
```
class WebhookVerifier:
  Methods:
  - verifySignature(payload, signature, secret)
  - parseWebhookEvent(payload)
  - validateEventType(eventType)
```

## Language-Specific Adaptations

### JavaScript/TypeScript
- Use async/await for all async operations
- Export both ESM and CommonJS formats
- Include TypeScript definitions
- Use FormData for file uploads
- Support both Node.js and browser environments

### Python
- Use async/await with aiohttp for async client
- Support both sync and async APIs
- Use type hints throughout
- Support file-like objects for uploads
- Follow PEP 8 naming conventions

### Go
- Use context.Context for all operations
- Implement interfaces for testability
- Support io.Reader for file uploads
- Use proper error wrapping
- Follow Go naming conventions

### Ruby
- Use ActiveRecord-like syntax where appropriate
- Support both sync and async operations
- Use symbols for options
- Support File objects for uploads
- Follow Ruby naming conventions

### PHP
- Support PSR-4 autoloading
- Use type declarations where possible
- Support resource handles for uploads
- Implement PSR-3 logging interface
- Follow PSR-12 coding standards

### Java
- Use builder pattern for configuration
- Support both sync and async (CompletableFuture)
- Use InputStream for file uploads
- Implement proper exception hierarchy
- Use annotations for configuration

## Testing Strategy

### Unit Tests
- Mock HTTP responses
- Test error handling
- Validate request formatting
- Test authentication flow

### Integration Tests
- Test against sandbox API
- Validate webhook signature verification
- Test file upload functionality
- Test rate limiting behavior

### Example Test Structure
```
tests/
├── unit/
│   ├── client_test.*
│   ├── auth_test.*
│   ├── copilot_test.*
│   ├── analysis_test.*
│   └── distribution_test.*
├── integration/
│   ├── api_integration_test.*
│   └── webhook_test.*
└── fixtures/
    ├── responses/
    └── test_files/
```

## Documentation Requirements

### README Structure
1. Installation instructions
2. Quick start example
3. Authentication setup
4. Core features overview
5. Complete API reference
6. Error handling guide
7. Contributing guidelines

### Code Examples
- Basic client initialization
- Track upload with metadata
- AI transcription request
- Distribution workflow
- Webhook handling
- Error handling patterns

### API Documentation
- All methods documented with parameters
- Response format specifications
- Error code explanations
- Rate limiting information
- Authentication requirements

This architecture ensures consistency across all SDKs while allowing for language-specific optimizations and conventions.