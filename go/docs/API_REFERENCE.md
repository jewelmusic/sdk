# JewelMusic Go SDK API Reference

This document provides detailed API reference for the JewelMusic Go SDK.

## Table of Contents

- [Client Initialization](#client-initialization)
- [Resources Overview](#resources-overview)
- [Error Handling](#error-handling)
- [Type Definitions](#type-definitions)

## Client Initialization

### Creating a Client

```go
import "github.com/jewelmusic/sdk/go/jewelmusic"

// Basic initialization
client := jewelmusic.NewClient("your-api-key")

// With options
client := jewelmusic.NewClientWithOptions("your-api-key", &jewelmusic.ClientOptions{
    BaseURL:     "https://api.jewelmusic.art",
    Timeout:     30 * time.Second,
    MaxRetries:  3,
    RetryDelay:  time.Second,
    UserAgent:   "MyApp/1.0",
    Debug:       false,
    HTTPClient:  &http.Client{}, // Custom HTTP client
})

// With context
ctx := context.Background()
client := jewelmusic.NewClientWithContext(ctx, "your-api-key", options)
```

### ClientOptions

```go
type ClientOptions struct {
    BaseURL     string
    Timeout     time.Duration
    MaxRetries  int
    RetryDelay  time.Duration
    UserAgent   string
    Debug       bool
    HTTPClient  *http.Client
    Headers     map[string]string
}
```

## Resources Overview

### Tracks Resource

```go
// Upload track
track, err := client.Tracks.Upload(ctx, &jewelmusic.UploadRequest{
    FilePath: "/path/to/audio.mp3",
    Filename: "audio.mp3",
    Metadata: &jewelmusic.TrackMetadata{
        Title:  "My Song",
        Artist: "My Artist",
        Genre:  "Electronic",
    },
})

// Upload with io.Reader
file, err := os.Open("/path/to/audio.mp3")
if err != nil {
    return err
}
defer file.Close()

track, err := client.Tracks.UploadReader(ctx, file, "audio.mp3", metadata)

// Get track
track, err := client.Tracks.Get(ctx, trackID)

// List tracks
tracks, err := client.Tracks.List(ctx, &jewelmusic.ListTracksRequest{
    Page:    1,
    PerPage: 20,
    Filters: &jewelmusic.TrackFilters{
        Genre:  "Electronic",
        Artist: "My Artist",
    },
})

// Update track
updatedTrack, err := client.Tracks.Update(ctx, trackID, &jewelmusic.TrackUpdate{
    Title: "Updated Title",
})

// Delete track
err := client.Tracks.Delete(ctx, trackID)

// Search tracks
results, err := client.Tracks.Search(ctx, &jewelmusic.SearchRequest{
    Query: "electronic music",
    Options: &jewelmusic.SearchOptions{
        Limit: 10,
        Filters: map[string]interface{}{
            "genre": "Electronic",
        },
    },
})
```

### Analysis Resource

```go
// Analyze track
analysis, err := client.Analysis.Analyze(ctx, &jewelmusic.AnalysisRequest{
    TrackID: trackID,
    Options: &jewelmusic.AnalysisOptions{
        AnalysisTypes: []string{"tempo", "key", "mood"},
        DetailedReport: true,
    },
})

// Analyze with specific options
analysis, err := client.Analysis.AnalyzeWithOptions(ctx, trackID, &jewelmusic.AnalysisOptions{
    AnalysisTypes:     []string{"tempo", "key", "structure", "quality"},
    DetailedReport:    true,
    CulturalContext:   "global",
    TargetPlatforms:   []string{"spotify", "apple-music"},
})

// Get analysis results
analysis, err := client.Analysis.Get(ctx, analysisID)

// Get specific analysis components
tempoAnalysis, err := client.Analysis.GetTempo(ctx, analysisID)
keyAnalysis, err := client.Analysis.GetKey(ctx, analysisID)
moodAnalysis, err := client.Analysis.GetMood(ctx, analysisID)

// Get analysis status
status, err := client.Analysis.GetStatus(ctx, analysisID)
```

### Copilot Resource (AI Generation)

```go
// Generate melody
melody, err := client.Copilot.GenerateMelody(ctx, &jewelmusic.MelodyRequest{
    Style:       "electronic",
    Genre:       "electronic",
    Mood:        "upbeat",
    Tempo:       128,
    Key:         "C",
    Mode:        "major",
    Duration:    30,
    Instruments: []string{"synthesizer", "bass", "piano"},
    Complexity:  "medium",
    Energy:      "high",
    Creativity:  0.7,
})

// Generate lyrics
lyrics, err := client.Copilot.GenerateLyrics(ctx, &jewelmusic.LyricsRequest{
    Theme:         "technology and human connection",
    Genre:         "electronic",
    Language:      "en",
    Mood:          "optimistic",
    Structure:     "verse-chorus-verse-chorus-bridge-chorus",
    RhymeScheme:   "ABAB",
    Keywords:      []string{"future", "connection", "digital"},
})

// Generate harmony
harmony, err := client.Copilot.GenerateHarmony(ctx, &jewelmusic.HarmonyRequest{
    MelodyID:    melodyID,
    Style:       "jazz",
    Complexity:  "complex",
    Voicing:     "close",
    Instruments: []string{"piano", "guitar"},
    Creativity:  0.8,
})

// Generate complete song
song, err := client.Copilot.GenerateCompleteSong(ctx, &jewelmusic.SongRequest{
    Prompt:          "Create an uplifting electronic song",
    Style:           "electronic",
    Duration:        180,
    IncludeVocals:   true,
    VocalStyle:      "female-pop",
    MixingStyle:     "modern",
    MasteringPreset: "streaming",
})

// Apply style transfer
styledTrack, err := client.Copilot.ApplyStyleTransfer(ctx, &jewelmusic.StyleTransferRequest{
    SourceID:          sourceTrackID,
    TargetStyle:       "jazz",
    Intensity:         0.8,
    PreserveStructure: true,
    PreserveTiming:    true,
})

// Get templates
templates, err := client.Copilot.GetTemplates(ctx, &jewelmusic.TemplateQuery{
    Genre:    "electronic",
    Mood:     "upbeat",
    Duration: 180,
    Style:    "modern",
})
```

### Distribution Resource

```go
// Create release
release, err := client.Distribution.CreateRelease(ctx, &jewelmusic.ReleaseRequest{
    Type:        "single",
    Title:       "My Release",
    Artist:      "My Artist",
    ReleaseDate: "2025-09-01",
    Tracks:      []jewelmusic.TrackData{{TrackID: trackID, Title: "Song Title"}},
    Platforms:   []string{"spotify", "apple-music", "youtube-music"},
})

// Submit to platforms
submission, err := client.Distribution.SubmitToPlatforms(ctx, releaseID, &jewelmusic.SubmissionRequest{
    Platforms:     []string{"spotify", "apple-music"},
    ScheduledDate: "2025-09-01T00:00:00Z",
    Expedited:     false,
})

// Get distribution status
status, err := client.Distribution.GetStatus(ctx, releaseID)

// Validate release
validation, err := client.Distribution.ValidateRelease(ctx, releaseID)

// Get available platforms
platforms, err := client.Distribution.GetPlatforms(ctx)
```

### Transcription Resource

```go
// Create transcription
transcription, err := client.Transcription.Create(ctx, &jewelmusic.TranscriptionRequest{
    TrackID: trackID,
    Options: &jewelmusic.TranscriptionOptions{
        Languages:            []string{"en", "auto-detect"},
        IncludeTimestamps:    true,
        WordLevelTimestamps:  true,
        SpeakerDiarization:   true,
        Model:                "large",
    },
})

// Create from file
transcription, err := client.Transcription.CreateFromFile(ctx, &jewelmusic.FileTranscriptionRequest{
    FilePath: "/path/to/audio.mp3",
    Filename: "audio.mp3",
    Options:  options,
})

// Get transcription
transcription, err := client.Transcription.Get(ctx, transcriptionID)

// Enhance lyrics
enhanced, err := client.Transcription.EnhanceLyrics(ctx, &jewelmusic.LyricsEnhancementRequest{
    Text: "Original lyrics text",
    Options: &jewelmusic.EnhancementOptions{
        ImproveMeter:            true,
        EnhanceRhyming:         true,
        AdjustTone:             "professional",
        PreserveOriginalMeaning: true,
    },
})

// Translate lyrics
translation, err := client.Transcription.TranslateLyrics(ctx, transcriptionID, &jewelmusic.TranslationRequest{
    TargetLanguages: []string{"es", "fr"},
    Options: &jewelmusic.TranslationOptions{
        PreserveRhyme: true,
        PreserveMeter: true,
    },
})
```

### Analytics Resource

```go
// Get streaming analytics
streams, err := client.Analytics.GetStreams(ctx, &jewelmusic.AnalyticsQuery{
    StartDate: "2024-01-01",
    EndDate:   "2024-12-31",
    GroupBy:   "month",
    Platforms: []string{"spotify", "apple-music"},
})

// Get listener demographics
listeners, err := client.Analytics.GetListeners(ctx, &jewelmusic.AnalyticsQuery{
    StartDate: "2024-01-01",
    EndDate:   "2024-12-31",
    GroupBy:   "territory",
})

// Get track analytics
trackAnalytics, err := client.Analytics.GetTrackAnalytics(ctx, trackID, &jewelmusic.AnalyticsQuery{
    StartDate: "2024-01-01",
    EndDate:   "2024-12-31",
    Metrics:   []string{"streams", "listeners", "completion_rate"},
})

// Setup alert
alert, err := client.Analytics.SetupAlert(ctx, &jewelmusic.AlertRequest{
    Name:      "High Streaming Alert",
    ReleaseID: releaseID,
    Conditions: []jewelmusic.AlertCondition{
        {
            Metric:    "streams",
            Operator:  "greater_than",
            Threshold: 1000,
            Period:    "day",
        },
    },
    Notifications: &jewelmusic.NotificationSettings{
        Email:   true,
        Webhook: true,
    },
})

// Export data
export, err := client.Analytics.ExportData(ctx, &jewelmusic.ExportRequest{
    Query: &jewelmusic.AnalyticsQuery{
        StartDate: "2024-01-01",
        EndDate:   "2024-12-31",
    },
    Options: &jewelmusic.ExportOptions{
        Format:        "csv",
        IncludeCharts: true,
        Email:         "user@example.com",
    },
})
```

### User Resource

```go
// Get profile
profile, err := client.User.GetProfile(ctx)

// Update profile
updatedProfile, err := client.User.UpdateProfile(ctx, &jewelmusic.ProfileUpdate{
    Name:    "New Name",
    Bio:     "Updated bio",
    Website: "https://mywebsite.com",
})

// Get usage stats
usage, err := client.User.GetUsageStats(ctx, &jewelmusic.UsageStatsOptions{
    Period:           "month",
    IncludeBreakdown: true,
})

// API key management
apiKeys, err := client.User.GetAPIKeys(ctx)

newKey, err := client.User.CreateAPIKey(ctx, &jewelmusic.APIKeyRequest{
    Name: "My App Key",
    Options: &jewelmusic.APIKeyOptions{
        Scopes:    []string{"tracks:read", "analytics:read"},
        RateLimit: 1000,
    },
})

err = client.User.RevokeAPIKey(ctx, keyID)
```

### Webhooks Resource

```go
// Create webhook
webhook, err := client.Webhooks.Create(ctx, &jewelmusic.WebhookRequest{
    URL:    "https://myapp.com/webhooks/jewelmusic",
    Events: []string{"track.processed", "analysis.completed"},
    Secret: "my-webhook-secret",
    Active: true,
})

// List webhooks
webhooks, err := client.Webhooks.List(ctx)

// Get webhook
webhook, err := client.Webhooks.Get(ctx, webhookID)

// Update webhook
updatedWebhook, err := client.Webhooks.Update(ctx, webhookID, &jewelmusic.WebhookUpdate{
    Active: false,
})

// Delete webhook
err = client.Webhooks.Delete(ctx, webhookID)

// Test webhook
testResult, err := client.Webhooks.Test(ctx, webhookID)

// Verify webhook signature
isValid := jewelmusic.VerifyWebhookSignature(payload, signature, secret)
```

## Error Handling

### Error Types

```go
// Custom error types
type Error struct {
    Message    string
    StatusCode int
    Details    map[string]interface{}
    RequestID  string
}

func (e *Error) Error() string {
    return e.Message
}

// Specific error types
type AuthenticationError struct {
    *Error
}

type ValidationError struct {
    *Error
    FieldErrors map[string][]string
}

type NotFoundError struct {
    *Error
}

type RateLimitError struct {
    *Error
    RetryAfterSeconds int
}

type NetworkError struct {
    *Error
}
```

### Error Handling Example

```go
track, err := client.Tracks.Get(ctx, "invalid-id")
if err != nil {
    switch e := err.(type) {
    case *jewelmusic.AuthenticationError:
        log.Printf("Authentication failed: %s", e.Message)
        log.Printf("Request ID: %s", e.RequestID)
    case *jewelmusic.ValidationError:
        log.Printf("Validation errors: %+v", e.FieldErrors)
    case *jewelmusic.NotFoundError:
        log.Printf("Track not found: %s", e.Message)
    case *jewelmusic.RateLimitError:
        log.Printf("Rate limited. Retry after %d seconds", e.RetryAfterSeconds)
        time.Sleep(time.Duration(e.RetryAfterSeconds) * time.Second)
    case *jewelmusic.NetworkError:
        log.Printf("Network error: %s", e.Message)
    case *jewelmusic.Error:
        log.Printf("API error: %s (Status: %d)", e.Message, e.StatusCode)
    default:
        log.Printf("Unexpected error: %s", err)
    }
    return err
}
```

## Type Definitions

### Core Types

```go
// Track represents a music track
type Track struct {
    ID        string            `json:"id"`
    Title     string            `json:"title"`
    Artist    string            `json:"artist"`
    Album     string            `json:"album,omitempty"`
    Genre     string            `json:"genre,omitempty"`
    Duration  int               `json:"duration"`
    FileSize  int64             `json:"fileSize"`
    Format    string            `json:"format"`
    Status    string            `json:"status"`
    CreatedAt time.Time         `json:"createdAt"`
    UpdatedAt time.Time         `json:"updatedAt"`
    Metadata  *TrackMetadata    `json:"metadata"`
}

// TrackMetadata contains track metadata
type TrackMetadata struct {
    Title       string    `json:"title"`
    Artist      string    `json:"artist"`
    Album       string    `json:"album,omitempty"`
    Genre       string    `json:"genre,omitempty"`
    ReleaseDate string    `json:"releaseDate,omitempty"`
    Explicit    bool      `json:"explicit,omitempty"`
    Tags        []string  `json:"tags,omitempty"`
}

// Analysis represents an analysis result
type Analysis struct {
    ID          string            `json:"id"`
    TrackID     string            `json:"trackId"`
    Status      string            `json:"status"`
    Results     *AnalysisResults  `json:"results,omitempty"`
    CreatedAt   time.Time         `json:"createdAt"`
    CompletedAt *time.Time        `json:"completedAt,omitempty"`
}

// AnalysisResults contains detailed analysis data
type AnalysisResults struct {
    Tempo     *TempoAnalysis     `json:"tempo,omitempty"`
    Key       *KeyAnalysis       `json:"key,omitempty"`
    Mood      *MoodAnalysis      `json:"mood,omitempty"`
    Quality   *QualityAnalysis   `json:"quality,omitempty"`
    Structure *StructureAnalysis `json:"structure,omitempty"`
    Loudness  *LoudnessAnalysis  `json:"loudness,omitempty"`
}
```

### Request Types

```go
// UploadRequest for track uploads
type UploadRequest struct {
    FilePath string         `json:"-"`
    Filename string         `json:"filename"`
    Metadata *TrackMetadata `json:"metadata,omitempty"`
}

// AnalysisRequest for requesting analysis
type AnalysisRequest struct {
    TrackID string           `json:"trackId"`
    Options *AnalysisOptions `json:"options,omitempty"`
}

type AnalysisOptions struct {
    AnalysisTypes     []string `json:"analysisTypes,omitempty"`
    DetailedReport    bool     `json:"detailedReport,omitempty"`
    CulturalContext   string   `json:"culturalContext,omitempty"`
    TargetPlatforms   []string `json:"targetPlatforms,omitempty"`
}

// MelodyRequest for AI melody generation
type MelodyRequest struct {
    Style       string   `json:"style"`
    Genre       string   `json:"genre"`
    Mood        string   `json:"mood"`
    Tempo       int      `json:"tempo"`
    Key         string   `json:"key"`
    Mode        string   `json:"mode"`
    Duration    int      `json:"duration"`
    Instruments []string `json:"instruments"`
    Complexity  string   `json:"complexity"`
    Energy      string   `json:"energy"`
    Creativity  float64  `json:"creativity"`
}
```

### Response Types

```go
// PaginatedResponse for paginated results
type PaginatedResponse struct {
    Items      interface{}        `json:"items"`
    Pagination *PaginationInfo    `json:"pagination"`
}

type PaginationInfo struct {
    Page       int  `json:"page"`
    PerPage    int  `json:"perPage"`
    Total      int  `json:"total"`
    TotalPages int  `json:"totalPages"`
    HasNext    bool `json:"hasNext"`
    HasPrev    bool `json:"hasPrev"`
}

// StreamsData for analytics
type StreamsData struct {
    TotalStreams      int64              `json:"totalStreams"`
    UniqueListeners   int64              `json:"uniqueListeners"`
    AverageListenTime float64            `json:"averageListenTime"`
    CompletionRate    float64            `json:"completionRate"`
    SkipRate          float64            `json:"skipRate"`
    Timeline          []TimelinePoint    `json:"timeline"`
}

type TimelinePoint struct {
    Date    string `json:"date"`
    Streams int64  `json:"streams"`
}
```

For complete type definitions and additional examples, see the package documentation: `go doc github.com/jewelmusic/sdk/go/jewelmusic`