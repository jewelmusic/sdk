# JewelMusic Go SDK

The official Go SDK for the JewelMusic AI-powered music distribution platform. This SDK provides comprehensive access to JewelMusic's API, including AI copilot features, music analysis, distribution management, transcription services, and analytics.

[![Go Reference](https://pkg.go.dev/badge/github.com/jewelmusic/sdk/go.svg)](https://pkg.go.dev/github.com/jewelmusic/sdk/go)
[![Go Report Card](https://goreportcard.com/badge/github.com/jewelmusic/sdk)](https://goreportcard.com/report/github.com/jewelmusic/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🤖 **AI Copilot**: Generate melodies, harmonies, lyrics, and complete songs
- 🎵 **Music Analysis**: Advanced audio quality checking, structure detection, and cultural compliance
- 📡 **Distribution**: Manage releases across 150+ streaming platforms
- 🎤 **Transcription**: AI transcription with 150+ language support and speaker diarization
- 📊 **Analytics**: Comprehensive streaming data, royalty tracking, and performance insights
- 👤 **User Management**: Profile, preferences, API keys, and account management
- 🔗 **Webhooks**: Real-time event notifications with signature verification
- ⚡ **Context Support**: Full context.Context support for cancellation and timeouts

## Requirements

- Go 1.19 or higher

## Installation

```bash
go get github.com/jewelmusic/sdk/go/jewelmusic
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"
    
    "github.com/jewelmusic/sdk/go/jewelmusic"
)

func main() {
    // Initialize the client
    client := jewelmusic.NewClient("jml_live_your_api_key_here")
    
    ctx := context.Background()
    
    // Test connection
    ping, err := client.Ping(ctx)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Connected to JewelMusic API v%s\n", ping.Version)
    
    // Upload and analyze a track
    file, err := os.Open("song.mp3")
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()
    
    track, err := client.Tracks.Upload(ctx, file, &jewelmusic.TrackMetadata{
        Title:  "My Song",
        Artist: "Artist Name",
        Album:  "Album Name",
        Genre:  "Electronic",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Get AI analysis
    analysis, err := client.Analysis.AnalyzeTrack(ctx, track.ID, &jewelmusic.AnalysisOptions{
        AnalysisTypes: []string{"tempo", "key", "structure", "quality"},
        DetailedReport: true,
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Track uploaded: %s\n", track.ID)
    fmt.Printf("Analysis completed: %s\n", analysis.Summary)
}
```

## Authentication

### API Key Setup

1. Sign up at [JewelMusic](https://jewelmusic.art)
2. Navigate to your dashboard and generate an API key
3. Use the appropriate key for your environment:
   - Production: `jml_live_*`
   - Sandbox: `jml_test_*`
   - Development: `jml_dev_*`

### Environment Configuration

```go
import (
    "os"
    "github.com/jewelmusic/sdk/go/jewelmusic"
)

// Production
client := jewelmusic.NewClient("jml_live_your_key_here")

// Sandbox (for testing)  
client := jewelmusic.NewClient("jml_test_your_key_here")

// From environment variable
client := jewelmusic.NewClient(os.Getenv("JEWELMUSIC_API_KEY"))
```

### Advanced Configuration

```go
import (
    "time"
    "github.com/jewelmusic/sdk/go/jewelmusic"
)

config := &jewelmusic.Config{
    APIKey:     "your_api_key",
    Environment: "production",
    APIVersion: "v1",
    BaseURL:    "https://api.jewelmusic.art",
    Timeout:    30 * time.Second,
    MaxRetries: 3,
    RetryDelay: 1 * time.Second,
    UserAgent:  "MyApp/1.0.0",
}

client := jewelmusic.NewClientWithConfig(config)
```

## Core Features

### AI Copilot

Generate music content with AI assistance:

```go
import (
    "context"
    "github.com/jewelmusic/sdk/go/jewelmusic"
)

func aiGenerationExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Generate a melody
    melody, err := client.Copilot.GenerateMelody(ctx, &jewelmusic.MelodyOptions{
        Style:       "electronic",
        Tempo:       128,
        Key:         "C",
        Duration:    30,
        Instruments: []string{"synthesizer", "bass"},
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Generate lyrics
    lyrics, err := client.Copilot.GenerateLyrics(ctx, &jewelmusic.LyricsOptions{
        Theme:     "love",
        Genre:     "pop",
        Language:  "en",
        Mood:      "uplifting",
        Structure: "verse-chorus-verse-chorus-bridge-chorus",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Complete song generation
    song, err := client.Copilot.CompleteSong(ctx, &jewelmusic.SongOptions{
        Prompt:        "An uplifting electronic song about overcoming challenges",
        Style:         "electronic",
        Duration:      180,
        IncludeVocals: true,
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Generated melody: %s\n", melody.ID)
    fmt.Printf("Generated lyrics: %s\n", lyrics.ID)
    fmt.Printf("Generated song: %s\n", song.ID)
}
```

### Music Analysis

Comprehensive audio analysis and quality checking:

```go
func analysisExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Upload and analyze audio
    file, err := os.Open("song.mp3")
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()
    
    analysis, err := client.Analysis.AnalyzeFile(ctx, file, &jewelmusic.AnalysisOptions{
        AnalysisTypes:    []string{"tempo", "key", "structure", "quality", "loudness"},
        DetailedReport:   true,
        CulturalContext:  "global",
        TargetPlatforms:  []string{"spotify", "apple-music"},
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Audio quality check
    quality, err := client.Analysis.AudioQualityCheck(ctx, file, &jewelmusic.QualityOptions{
        CheckClipping:      true,
        CheckPhaseIssues:   true,
        CheckDynamicRange:  true,
        TargetLoudness:     -14, // LUFS
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Tempo: %.1f BPM\n", analysis.Tempo.BPM)
    fmt.Printf("Key: %s %s\n", analysis.Key.Key, analysis.Key.Mode)
    fmt.Printf("Quality Score: %.2f\n", quality.OverallScore)
}
```

### Distribution Management

Manage releases across streaming platforms:

```go
func distributionExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Create a release
    release, err := client.Distribution.CreateRelease(ctx, &jewelmusic.Release{
        Type:        "single",
        Title:       "My Song",
        Artist:      "Artist Name",
        ReleaseDate: "2025-09-01",
        Tracks: []jewelmusic.ReleaseTrack{
            {
                TrackID:  "track_123",
                Title:    "My Song",
                Duration: 210,
                ISRC:     "US1234567890",
            },
        },
        Territories: []string{"worldwide"},
        Platforms:   []string{"spotify", "apple-music", "youtube-music"},
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Submit to platforms
    err = client.Distribution.SubmitToPlatforms(ctx, release.ID, &jewelmusic.SubmissionOptions{
        Platforms:     []string{"spotify", "apple-music"},
        ScheduledDate: "2025-09-01T00:00:00Z",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Release created: %s\n", release.ID)
}
```

### Transcription Services

AI-powered transcription with multi-language support:

```go
func transcriptionExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Create transcription from file
    file, err := os.Open("song.mp3")
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()
    
    transcription, err := client.Transcription.Create(ctx, &jewelmusic.TranscriptionRequest{
        File:                  file,
        Languages:             []string{"en", "es", "fr"},
        IncludeTimestamps:     true,
        WordLevelTimestamps:   true,
        SpeakerDiarization:    true,
        Model:                 "large",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Translate lyrics
    translation, err := client.Transcription.TranslateLyrics(ctx, transcription.ID, []string{"es", "fr", "de"})
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Original: %s\n", transcription.Text)
    fmt.Printf("Translations: %+v\n", translation)
}
```

### Analytics & Reporting

Comprehensive streaming analytics and royalty tracking:

```go
func analyticsExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Get streaming data
    streams, err := client.Analytics.GetStreams(ctx, &jewelmusic.StreamsQuery{
        StartDate: "2025-01-01",
        EndDate:   "2025-01-31",
        GroupBy:   "day",
        Platforms: []string{"spotify", "apple-music"},
        Metrics:   []string{"streams", "listeners", "revenue"},
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Royalty reports
    royalties, err := client.Analytics.GetRoyaltyReports(ctx, "2025-01-01", "2025-01-31", &jewelmusic.RoyaltyOptions{
        Currency:       "USD",
        IncludePending: true,
        GroupBy:        "platform",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Total streams: %d\n", streams.Summary.TotalStreams)
    fmt.Printf("Revenue: $%.2f\n", royalties.TotalRevenue)
}
```

### Track Management

Upload, organize, and manage your music library:

```go
func trackManagementExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Upload with progress tracking
    file, err := os.Open("song.mp3")
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()
    
    progressCallback := func(loaded, total int64) {
        percentage := float64(loaded) / float64(total) * 100
        fmt.Printf("Upload progress: %.1f%%\n", percentage)
    }
    
    track, err := client.Tracks.UploadWithProgress(ctx, file, &jewelmusic.TrackMetadata{
        Title:       "My Song",
        Artist:      "Artist Name",
        Album:       "My Album",
        Genre:       "Electronic",
        ReleaseDate: "2025-09-01",
    }, progressCallback)
    if err != nil {
        log.Fatal(err)
    }
    
    // Get track details
    trackDetails, err := client.Tracks.Get(ctx, track.ID)
    if err != nil {
        log.Fatal(err)
    }
    
    // Update metadata
    updated, err := client.Tracks.Update(ctx, track.ID, &jewelmusic.TrackUpdate{
        Title: "Updated Title",
        Genre: "Ambient",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Track uploaded: %s\n", track.ID)
    fmt.Printf("Updated track: %s\n", updated.Title)
}
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```go
import (
    "context"
    "errors"
    "github.com/jewelmusic/sdk/go/jewelmusic"
)

func errorHandlingExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    file, err := os.Open("song.mp3")
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()
    
    track, err := client.Tracks.Upload(ctx, file, &jewelmusic.TrackMetadata{
        Title:  "My Song",
        Artist: "Artist Name",
    })
    
    if err != nil {
        var authErr *jewelmusic.AuthenticationError
        var validationErr *jewelmusic.ValidationError
        var rateLimitErr *jewelmusic.RateLimitError
        var networkErr *jewelmusic.NetworkError
        
        switch {
        case errors.As(err, &authErr):
            fmt.Printf("Authentication failed: %s\n", authErr.Message)
        case errors.As(err, &validationErr):
            fmt.Printf("Validation failed: %s\n", validationErr.Message)
            for field, errs := range validationErr.ValidationErrors {
                fmt.Printf("  %s: %v\n", field, errs)
            }
        case errors.As(err, &rateLimitErr):
            fmt.Printf("Rate limit exceeded. Retry after: %d seconds\n", rateLimitErr.RetryAfter)
        case errors.As(err, &networkErr):
            fmt.Printf("Network error: %s\n", networkErr.Message)
        default:
            fmt.Printf("Unknown error: %s\n", err.Error())
        }
        return
    }
    
    fmt.Printf("Track uploaded successfully: %s\n", track.ID)
}
```

## Webhooks

Set up webhooks to receive real-time notifications:

```go
func webhookSetup() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Create webhook
    webhook, err := client.Webhooks.Create(ctx, &jewelmusic.Webhook{
        URL: "https://myapp.com/webhooks/jewelmusic",
        Events: []string{
            "track.uploaded",
            "track.processed",
            "analysis.completed",
            "distribution.released",
        },
        Secret: "my_webhook_secret_123",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Webhook created: %s\n", webhook.ID)
}

// Verify webhook signatures in your web server
func handleWebhook(payload []byte, signature, secret string) error {
    // Verify signature
    isValid := jewelmusic.VerifyWebhookSignature(payload, signature, secret)
    if !isValid {
        return errors.New("invalid webhook signature")
    }
    
    // Parse event
    event, err := jewelmusic.ParseWebhookEvent(payload)
    if err != nil {
        return err
    }
    
    // Handle different event types
    switch event.Type {
    case "track.uploaded":
        fmt.Printf("Track uploaded: %s\n", event.Data["track"].(map[string]interface{})["title"])
    case "analysis.completed":
        fmt.Printf("Analysis completed: %s\n", event.Data["analysis"].(map[string]interface{})["id"])
    }
    
    return nil
}
```

## Context and Cancellation

The SDK fully supports Go's context package for cancellation and timeouts:

```go
func contextExample() {
    client := jewelmusic.NewClient("your_api_key")
    
    // Context with timeout
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    
    // Context with cancellation
    ctx, cancel = context.WithCancel(context.Background())
    
    go func() {
        time.Sleep(5 * time.Second)
        cancel() // Cancel after 5 seconds
    }()
    
    // All SDK methods respect context cancellation
    _, err := client.Tracks.List(ctx, &jewelmusic.ListOptions{
        Page:    1,
        PerPage: 20,
    })
    
    if err != nil {
        if errors.Is(err, context.Canceled) {
            fmt.Println("Request was canceled")
        } else if errors.Is(err, context.DeadlineExceeded) {
            fmt.Println("Request timed out")
        } else {
            fmt.Printf("Request failed: %s\n", err)
        }
    }
}
```

## Pagination

Handle paginated responses efficiently:

```go
func paginationExample() {
    client := jewelmusic.NewClient("your_api_key")
    ctx := context.Background()
    
    // Method 1: Manual pagination
    page := 1
    var allTracks []jewelmusic.Track
    
    for {
        response, err := client.Tracks.List(ctx, &jewelmusic.ListOptions{
            Page:    page,
            PerPage: 20,
        })
        if err != nil {
            log.Fatal(err)
        }
        
        allTracks = append(allTracks, response.Items...)
        
        if page >= response.Pagination.TotalPages {
            break
        }
        page++
    }
    
    // Method 2: Iterator
    iter := client.Tracks.Iterate(ctx, &jewelmusic.ListOptions{
        PerPage: 50,
    })
    
    for iter.Next() {
        track := iter.Track()
        fmt.Printf("Track: %s\n", track.Title)
    }
    
    if err := iter.Err(); err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Total tracks: %d\n", len(allTracks))
}
```

## Type Safety

The SDK provides comprehensive type definitions for better development experience:

```go
// Track metadata with validation
metadata := &jewelmusic.TrackMetadata{
    Title:       "My Song",        // Required
    Artist:      "Artist Name",    // Required
    Album:       "Album Name",     // Optional
    Genre:       "Electronic",     // Optional
    ReleaseDate: "2025-09-01",     // Optional, ISO 8601 format
    Duration:    210,              // Optional, seconds
    BPM:         128,              // Optional
    Key:         "C major",        // Optional
}

// Analysis options with type safety
options := &jewelmusic.AnalysisOptions{
    AnalysisTypes:   []string{"tempo", "key", "structure"},
    DetailedReport:  true,
    CulturalContext: "global",
    TargetPlatforms: []string{"spotify", "apple-music"},
}

// Webhook event with strong typing
type WebhookEvent struct {
    Type      string                 `json:"type"`
    Data      map[string]interface{} `json:"data"`
    Timestamp time.Time             `json:"timestamp"`
    ID        string                 `json:"id"`
}
```

## Configuration

### Environment Variables

You can configure the SDK using environment variables:

```bash
export JEWELMUSIC_API_KEY=jml_live_your_key_here
export JEWELMUSIC_ENVIRONMENT=production
export JEWELMUSIC_API_VERSION=v1
```

```go
import (
    "os"
    "github.com/jewelmusic/sdk/go/jewelmusic"
)

// SDK will automatically use environment variables
client := jewelmusic.NewClient(os.Getenv("JEWELMUSIC_API_KEY"))
```

### Logging

Configure logging to debug SDK behavior:

```go
import (
    "log"
    "os"
    "github.com/jewelmusic/sdk/go/jewelmusic"
)

// Enable debug logging
config := &jewelmusic.Config{
    APIKey:     "your_api_key",
    LogLevel:   jewelmusic.LogLevelDebug,
    Logger:     log.New(os.Stdout, "jewelmusic: ", log.LstdFlags),
}

client := jewelmusic.NewClientWithConfig(config)
```

## Examples

See the [examples](examples/) directory for complete working examples:

- [basic_usage.go](examples/basic_usage.go) - Basic SDK usage patterns
- [ai_generation.go](examples/ai_generation.go) - AI music generation
- [webhook_server.go](examples/webhook_server.go) - Webhook handling server
- [batch_operations.go](examples/batch_operations.go) - Batch upload and processing
- [concurrent_uploads.go](examples/concurrent_uploads.go) - Concurrent operations

## API Reference

### Client Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `APIKey` | `string` | *required* | Your JewelMusic API key |
| `Environment` | `string` | `"production"` | API environment |
| `APIVersion` | `string` | `"v1"` | API version |
| `BaseURL` | `string` | `"https://api.jewelmusic.art"` | API base URL |
| `Timeout` | `time.Duration` | `30s` | Request timeout |
| `MaxRetries` | `int` | `3` | Maximum retry attempts |
| `RetryDelay` | `time.Duration` | `1s` | Initial retry delay |

### Resource Methods

#### Copilot
- `GenerateMelody(ctx, options)` - Generate AI melody
- `GenerateHarmony(ctx, options)` - Generate AI harmony
- `GenerateLyrics(ctx, options)` - Generate AI lyrics
- `CompleteSong(ctx, options)` - Generate complete song
- `GetTemplates(ctx)` - Get song templates

#### Analysis
- `AnalyzeFile(ctx, file, options)` - Upload and analyze audio
- `AnalyzeTrack(ctx, trackID, options)` - Analyze existing track
- `GetAnalysis(ctx, analysisID)` - Get analysis results
- `AudioQualityCheck(ctx, file, options)` - Check audio quality

#### Distribution
- `CreateRelease(ctx, release)` - Create new release
- `GetReleases(ctx, params)` - List releases
- `GetRelease(ctx, releaseID)` - Get release details
- `SubmitToPlatforms(ctx, releaseID, options)` - Submit to platforms

#### Transcription
- `Create(ctx, request)` - Create transcription
- `Get(ctx, transcriptionID)` - Get transcription
- `TranslateLyrics(ctx, transcriptionID, languages)` - Translate lyrics

#### Tracks
- `Upload(ctx, file, metadata)` - Upload track
- `UploadWithProgress(ctx, file, metadata, callback)` - Upload with progress
- `List(ctx, options)` - List tracks
- `Get(ctx, trackID)` - Get track details
- `Update(ctx, trackID, update)` - Update track
- `Delete(ctx, trackID)` - Delete track

#### Analytics
- `GetStreams(ctx, query)` - Get streaming data
- `GetRoyaltyReports(ctx, start, end, options)` - Get royalty reports
- `GetInsights(ctx, options)` - Get AI insights

#### User
- `GetProfile(ctx)` - Get user profile
- `UpdateProfile(ctx, updates)` - Update profile
- `GetAPIKeys(ctx)` - List API keys
- `CreateAPIKey(ctx, name, permissions)` - Create API key

#### Webhooks
- `List(ctx)` - List webhooks
- `Create(ctx, webhook)` - Create webhook
- `Get(ctx, webhookID)` - Get webhook details
- `Update(ctx, webhookID, updates)` - Update webhook
- `Delete(ctx, webhookID)` - Delete webhook
- `Test(ctx, webhookID)` - Test webhook

## Requirements

- Go 1.19+
- Context support for all operations
- Error handling with typed errors

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/jewelmusic/sdk.git
cd sdk/go

# Install dependencies
go mod download

# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run linting
golangci-lint run

# Format code
go fmt ./...
```

### Running Tests

```bash
# Run all tests
go test ./...

# Run specific package tests
go test ./jewelmusic

# Run with verbose output
go test -v ./...

# Run integration tests (requires API key)
JEWELMUSIC_API_KEY=your_test_key go test -tags=integration ./...
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [support@jewelmusic.art](mailto:support@jewelmusic.art)
- 💬 Discord: [JewelMusic Community](https://discord.gg/jewelmusic)
- 📖 Documentation: [docs.jewelmusic.art](https://docs.jewelmusic.art)
- 🐛 Issues: [GitHub Issues](https://github.com/jewelmusic/sdk/issues)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes in each version.

---

**JewelMusic Go SDK** - Empowering musicians with AI-powered tools for creation, analysis, and distribution.