no# JewelMusic API Specification v1.0

## Base URL
```
https://api.jewelmusic.com/v1
```

## Authentication
All requests require an API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

## Unified API Endpoints

### Copilot Resource - AI-Powered Music Generation

#### Generate Melody
```
POST /copilot/melody
```
Generate AI-powered melody suggestions.

**Request Body:**
```json
{
  "style": "pop",
  "genre": "electronic",
  "mood": "upbeat",
  "tempo": 120,
  "key": "C major",
  "mode": "major",
  "timeSignature": "4/4",
  "duration": 32,
  "instruments": ["piano", "synth"],
  "complexity": "medium",
  "energy": "high",
  "creativity": 0.7,
  "seed": "optional-seed"
}
```

#### Generate Harmony
```
POST /copilot/harmony
```
Generate harmony progressions for existing melodies.

**Request Body:**
```json
{
  "melodyId": "melody_123",
  "style": "jazz",
  "complexity": "complex",
  "voicing": "close",
  "instruments": ["piano", "guitar"],
  "creativity": 0.8
}
```

#### Generate Lyrics
```
POST /copilot/lyrics
```
Generate AI-powered lyrics.

**Request Body:**
```json
{
  "theme": "love and relationships",
  "genre": "pop",
  "language": "en",
  "mood": "romantic",
  "structure": "verse-chorus-verse-chorus-bridge-chorus",
  "rhymeScheme": "ABAB",
  "syllableCount": "8-6-8-6",
  "inspirationText": "optional inspiration",
  "verseCount": 2,
  "chorusCount": 1,
  "bridgeCount": 1,
  "wordsPerLine": 6,
  "explicitContent": false,
  "keywords": ["love", "heart"],
  "referenceArtists": ["artist1", "artist2"]
}
```

#### Complete Song
```
POST /copilot/complete-song
```
Generate a complete song with AI.

**Request Body:**
```json
{
  "prompt": "Create an upbeat summer song",
  "melodyId": "optional_melody_id",
  "harmonyId": "optional_harmony_id",
  "lyricsId": "optional_lyrics_id",
  "templateId": "optional_template_id",
  "style": "pop",
  "duration": 180,
  "includeVocals": true,
  "vocalStyle": "female-pop",
  "mixingStyle": "modern",
  "masteringPreset": "streaming",
  "completionType": "full",
  "addIntro": true,
  "addOutro": true,
  "addBridge": true
}
```

#### Style Transfer
```
POST /copilot/style-transfer
```
Apply style transfer to existing content.

**Request Body:**
```json
{
  "sourceId": "track_123",
  "targetStyle": "jazz",
  "intensity": 0.8,
  "preserveStructure": true,
  "preserveTiming": true
}
```

#### Chord Progression
```
POST /copilot/chord-progression
```
Generate chord progression suggestions.

**Request Body:**
```json
{
  "key": "C major",
  "style": "pop",
  "complexity": 0.5,
  "length": 8
}
```

#### Suggest Arrangement
```
POST /copilot/suggest-arrangement
```
Get arrangement suggestions for a track.

**Request Body:**
```json
{
  "trackId": "track_123",
  "targetStyle": "orchestral"
}
```

#### Genre Analysis
```
POST /copilot/genre-analysis
```
Analyze and suggest genre improvements.

**Request Body:**
```json
{
  "trackId": "track_123",
  "targetGenre": "electronic"
}
```

#### Mood Matching
```
POST /copilot/mood-matching
```
Match music to target mood/emotion.

**Request Body:**
```json
{
  "trackId": "track_123",
  "targetMood": "energetic",
  "adjustmentType": "all"
}
```

#### Generate Variations
```
POST /copilot/generate-variations
```
Generate variations of an existing composition.

**Request Body:**
```json
{
  "sourceId": "melody_123",
  "variationType": "melodic",
  "count": 3
}
```

#### Mastering Suggestions
```
POST /copilot/mastering-suggestions
```
Get AI-powered mastering suggestions.

**Request Body:**
```json
{
  "trackId": "track_123",
  "targetPlatform": "spotify"
}
```

#### Get Templates
```
GET /copilot/templates
```
Retrieve available song templates.

**Query Parameters:**
- `genre` - Filter by genre
- `mood` - Filter by mood
- `duration` - Filter by duration
- `style` - Filter by style

#### Get Generation
```
GET /copilot/generations/{generationId}
```
Retrieve a specific generation by ID.

#### List Generations
```
GET /copilot/generations
```
List user's generations with pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `perPage` - Items per page (default: 20)
- `type` - Filter by generation type

### Analysis Resource - Music Analysis

#### Analyze File
```
POST /analysis/file
```
Analyze uploaded audio file.

**Form Data:**
- `file` - Audio file
- `format` - Output format
- `quality` - Analysis quality
- `features` - Features to extract

#### Analyze Track
```
GET /analysis/track
```
Analyze existing track by ID.

**Query Parameters:**
- `track_id` - Track ID to analyze

#### Get Audio Features
```
GET /analysis/features
```
Get detailed audio features for a track.

**Query Parameters:**
- `track_id` - Track ID

#### Detect Tempo
```
GET /analysis/tempo
```
Detect the tempo (BPM) of a track.

**Query Parameters:**
- `track_id` - Track ID

#### Analyze Key
```
GET /analysis/key
```
Analyze the key signature and tonality.

**Query Parameters:**
- `track_id` - Track ID

#### Spectral Analysis
```
GET /analysis/spectral
```
Perform spectral analysis on a track.

**Query Parameters:**
- `track_id` - Track ID

#### Harmonic Analysis
```
GET /analysis/harmonic
```
Analyze harmonic content of a track.

**Query Parameters:**
- `track_id` - Track ID

#### Beat Detection
```
GET /analysis/beats
```
Detect beat and rhythm patterns.

**Query Parameters:**
- `track_id` - Track ID

#### Structure Analysis
```
GET /analysis/structure
```
Analyze track structure and segments.

**Query Parameters:**
- `track_id` - Track ID

#### Full Analysis
```
GET /analysis/full
```
Get comprehensive analysis results.

**Query Parameters:**
- `track_id` - Track ID

#### Compare Tracks
```
POST /analysis/compare
```
Compare two tracks for similarity.

**Request Body:**
```json
{
  "track_id_1": "track_123",
  "track_id_2": "track_456"
}
```

#### Analysis History
```
GET /analysis/history
```
Get analysis history.

**Query Parameters:**
- `start_date` - Start date filter
- `end_date` - End date filter
- `track_type` - Track type filter

### Distribution Resource

#### Create Release
```
POST /distribution/releases
```
Create a new music release.

#### Get Release
```
GET /distribution/releases/{releaseId}
```
Get specific release details.

#### Update Release
```
PUT /distribution/releases/{releaseId}
```
Update existing release.

#### Delete Release
```
DELETE /distribution/releases/{releaseId}
```
Delete a release.

#### List Releases
```
GET /distribution/releases
```
List all releases.

#### Distribute Release
```
POST /distribution/releases/{releaseId}/distribute
```
Submit release for distribution.

#### Distribution Status
```
GET /distribution/releases/{releaseId}/status
```
Get distribution status.

#### Get Platforms
```
GET /distribution/platforms
```
Get available distribution platforms.

#### Platform Requirements
```
GET /distribution/platforms/{platformId}/requirements
```
Get platform-specific requirements.

#### Get Pricing
```
GET /distribution/pricing
```
Get pricing information.

#### Release Analytics
```
GET /distribution/releases/{releaseId}/analytics
```
Get distribution analytics.

#### Get Revenue
```
GET /distribution/releases/{releaseId}/revenue
```
Get revenue and royalty information.

#### Withdraw Release
```
POST /distribution/releases/{releaseId}/withdraw
```
Withdraw release from platforms.

#### Distribution History
```
GET /distribution/history
```
Get distribution history.

### Transcription Resource

#### Transcribe File
```
POST /transcription/file
```
Transcribe uploaded audio file.

#### Transcribe Track
```
GET /transcription/track
```
Transcribe existing track.

#### Extract Lyrics
```
GET /transcription/lyrics
```
Extract lyrics from track.

#### Isolate Vocals
```
GET /transcription/vocals
```
Isolate vocal tracks.

#### Supported Languages
```
GET /transcription/languages
```
Get supported languages.

#### Job Status
```
GET /transcription/jobs/{jobId}
```
Get transcription job status.

#### Job Results
```
GET /transcription/jobs/{jobId}/results
```
Get transcription results.

#### Cancel Job
```
DELETE /transcription/jobs/{jobId}
```
Cancel transcription job.

#### List Jobs
```
GET /transcription/jobs
```
List transcription jobs.

#### Create Batch Job
```
POST /transcription/batch
```
Create batch transcription job.

#### Quality Metrics
```
GET /transcription/jobs/{jobId}/quality
```
Get quality metrics.

#### Export Transcription
```
GET /transcription/jobs/{jobId}/export
```
Export transcription in various formats.

#### Correct Transcription
```
PUT /transcription/jobs/{jobId}/correct
```
Correct transcription results.

#### Transcription History
```
GET /transcription/history
```
Get transcription history.

### Tracks Resource

#### Upload Track
```
POST /tracks/upload
```
Upload new track.

#### Get Track
```
GET /tracks/{trackId}
```
Get track details.

#### Update Track
```
PUT /tracks/{trackId}
```
Update track metadata.

#### Delete Track
```
DELETE /tracks/{trackId}
```
Delete a track.

#### List Tracks
```
GET /tracks
```
List all tracks.

#### Search Tracks
```
GET /tracks/search
```
Search for tracks.

#### Get Metadata
```
GET /tracks/{trackId}/metadata
```
Get track metadata.

#### Update Metadata
```
PUT /tracks/{trackId}/metadata
```
Update track metadata.

#### Get Audio Info
```
GET /tracks/{trackId}/audio
```
Get audio information.

#### Get Download URL
```
GET /tracks/{trackId}/download
```
Get download URL.

#### Get Streaming URL
```
GET /tracks/{trackId}/stream
```
Get streaming URL.

#### Create Collection
```
POST /tracks/collections
```
Create track collection.

#### Add to Collection
```
POST /tracks/collections/{collectionId}/tracks
```
Add track to collection.

#### Remove from Collection
```
DELETE /tracks/collections/{collectionId}/tracks/{trackId}
```
Remove track from collection.

#### Track Statistics
```
GET /tracks/{trackId}/stats
```
Get track statistics.

#### Track Activity
```
GET /tracks/{trackId}/activity
```
Get track activity.

### Analytics Resource

#### Get Overview
```
GET /analytics/overview
```
Get analytics overview.

#### Streaming Analytics
```
GET /analytics/streaming
```
Get streaming analytics.

#### Track Analytics
```
GET /analytics/tracks
```
Get track-specific analytics.

#### Audience Analytics
```
GET /analytics/audience
```
Get audience demographics.

#### Revenue Analytics
```
GET /analytics/revenue
```
Get revenue analytics.

#### Geographic Analytics
```
GET /analytics/geographic
```
Get geographic analytics.

#### Platform Analytics
```
GET /analytics/platforms
```
Get platform-specific analytics.

#### Trend Analytics
```
GET /analytics/trends
```
Get trend analytics.

#### Engagement Analytics
```
GET /analytics/engagement
```
Get engagement metrics.

#### Create Custom Report
```
POST /analytics/reports
```
Create custom analytics report.

#### Get Custom Report
```
GET /analytics/reports/{reportId}
```
Get custom report.

#### List Custom Reports
```
GET /analytics/reports
```
List custom reports.

#### Export Data
```
POST /analytics/export
```
Export analytics data.

#### Real-Time Analytics
```
GET /analytics/realtime
```
Get real-time analytics.

#### Comparative Analytics
```
POST /analytics/compare
```
Get comparative analytics.

#### Predictive Analytics
```
GET /analytics/predictive
```
Get predictive analytics.

### User Resource

#### Get Profile
```
GET /user/profile
```
Get user profile.

#### Update Profile
```
PUT /user/profile
```
Update user profile.

#### Get Settings
```
GET /user/settings
```
Get account settings.

#### Update Settings
```
PUT /user/settings
```
Update account settings.

#### Get Preferences
```
GET /user/preferences
```
Get user preferences.

#### Update Preferences
```
PUT /user/preferences
```
Update user preferences.

#### Get Subscription
```
GET /user/subscription
```
Get subscription information.

#### Update Subscription
```
PUT /user/subscription
```
Update subscription.

#### Get Billing
```
GET /user/billing
```
Get billing information.

#### Update Billing
```
PUT /user/billing
```
Update billing information.

#### Get Usage
```
GET /user/usage
```
Get API usage statistics.

#### List API Keys
```
GET /user/api-keys
```
List API keys.

#### Create API Key
```
POST /user/api-keys
```
Create new API key.

#### Get API Key
```
GET /user/api-keys/{keyId}
```
Get API key details.

#### Update API Key
```
PUT /user/api-keys/{keyId}
```
Update API key.

#### Delete API Key
```
DELETE /user/api-keys/{keyId}
```
Delete API key.

#### Regenerate API Key
```
POST /user/api-keys/{keyId}/regenerate
```
Regenerate API key.

#### Notification Settings
```
GET /user/notifications
```
Get notification settings.

#### Update Notifications
```
PUT /user/notifications
```
Update notification settings.

#### Security Settings
```
GET /user/security
```
Get security settings.

#### Update Security
```
PUT /user/security
```
Update security settings.

#### Change Password
```
PUT /user/password
```
Change password.

#### Get Activity
```
GET /user/activity
```
Get account activity.

#### Export Options
```
GET /user/export
```
Get export options.

#### Request Data Export
```
POST /user/export
```
Request data export.

#### Export Status
```
GET /user/export/{exportId}
```
Get export status.

#### Delete Account
```
DELETE /user/account
```
Delete user account.

### Webhooks Resource

#### List Webhooks
```
GET /webhooks
```
List all webhooks.

#### Create Webhook
```
POST /webhooks
```
Create new webhook.

#### Get Webhook
```
GET /webhooks/{webhookId}
```
Get webhook details.

#### Update Webhook
```
PUT /webhooks/{webhookId}
```
Update webhook.

#### Delete Webhook
```
DELETE /webhooks/{webhookId}
```
Delete webhook.

#### Test Webhook
```
POST /webhooks/{webhookId}/test
```
Test webhook.

#### Get Deliveries
```
GET /webhooks/{webhookId}/deliveries
```
Get webhook deliveries.

#### Get Delivery
```
GET /webhooks/{webhookId}/deliveries/{deliveryId}
```
Get delivery details.

#### Redeliver Event
```
POST /webhooks/{webhookId}/deliveries/{deliveryId}/redeliver
```
Redeliver webhook event.

#### Event Types
```
GET /webhooks/events
```
Get available event types.

#### Webhook Templates
```
GET /webhooks/templates
```
Get webhook templates.

#### Update Status
```
PUT /webhooks/{webhookId}/status
```
Enable/disable webhook.

#### Update Secret
```
PUT /webhooks/{webhookId}/secret
```
Update webhook secret.

#### Webhook Statistics
```
GET /webhooks/{webhookId}/stats
```
Get webhook statistics.

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-20T12:00:00Z",
    "request_id": "req_123456"
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      // Error details
    }
  },
  "meta": {
    "timestamp": "2024-01-20T12:00:00Z",
    "request_id": "req_123456"
  }
}
```

## Rate Limiting

- Default: 100 requests per minute
- Pro: 500 requests per minute
- Enterprise: Custom limits

Rate limit headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Webhook Signature Verification

Webhook payloads are signed using HMAC-SHA256. The signature is included in the `X-JewelMusic-Signature` header in the format:
```
t=1234567890,v1=signature_hash
```

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Invalid API key
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable