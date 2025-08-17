# JewelMusic Java SDK API Reference

This document provides detailed API reference for the JewelMusic Java SDK.

## Table of Contents

- [Client Initialization](#client-initialization)
- [Resources Overview](#resources-overview)
- [Error Handling](#error-handling)
- [Model Classes](#model-classes)

## Client Initialization

### JewelMusicClient

```java
import com.jewelmusic.JewelMusic;
import com.jewelmusic.JewelMusicClient;

// Basic initialization
JewelMusic client = new JewelMusicClient("your-api-key");

// With builder pattern
JewelMusic client = new JewelMusicClient.Builder("your-api-key")
    .baseUrl("https://api.jewelmusic.art")
    .timeout(Duration.ofSeconds(30))
    .maxRetries(3)
    .userAgent("MyApp/1.0")
    .additionalHeaders(Map.of("Custom-Header", "value"))
    .build();
```

### Configuration Options

```java
// Builder options
public class Builder {
    public Builder baseUrl(String baseUrl)
    public Builder timeout(Duration timeout)
    public Builder maxRetries(int maxRetries)
    public Builder userAgent(String userAgent)
    public Builder additionalHeaders(Map<String, String> headers)
    public Builder debug(boolean debug)
    public JewelMusicClient build()
}
```

## Resources Overview

### Tracks Resource

```java
// Upload track
Map<String, Object> track = client.tracks().uploadTrack(
    new File("/path/to/audio.mp3"),
    "audio.mp3",
    Map.of(
        "title", "My Song",
        "artist", "My Artist",
        "genre", "Electronic"
    )
);

// Upload with progress callback
Map<String, Object> track = client.tracks().uploadTrack(
    file,
    filename,
    metadata,
    (bytesUploaded, totalBytes) -> {
        double progress = (double) bytesUploaded / totalBytes * 100;
        System.out.printf("Upload progress: %.1f%%\r", progress);
    }
);

// Get track
Map<String, Object> track = client.tracks().getTrack(trackId);

// List tracks
Map<String, Object> tracks = client.tracks().listTracks(page, perPage);

// List with filters
Map<String, Object> tracks = client.tracks().listTracks(
    page, 
    perPage, 
    Map.of("genre", "Electronic", "artist", "My Artist")
);

// Update track
Map<String, Object> updatedTrack = client.tracks().updateTrack(
    trackId,
    Map.of("title", "Updated Title")
);

// Delete track
client.tracks().deleteTrack(trackId);

// Search tracks
Map<String, Object> results = client.tracks().searchTracks(
    "electronic music",
    Map.of("limit", 10, "filters", Map.of("genre", "Electronic"))
);
```

### Analysis Resource

```java
// Analyze track
Map<String, Object> analysis = client.analysis().analyzeTrack(trackId);

// Analyze with options
Map<String, Object> analysis = client.analysis().analyzeTrackWithOptions(
    trackId,
    Map.of(
        "analysisTypes", List.of("tempo", "key", "mood"),
        "detailedReport", true,
        "culturalContext", "global",
        "targetPlatforms", List.of("spotify", "apple-music")
    )
);

// Get analysis results
Map<String, Object> analysis = client.analysis().getAnalysis(analysisId);

// Get specific analysis components
Map<String, Object> tempoAnalysis = client.analysis().getTempoAnalysis(analysisId);
Map<String, Object> keyAnalysis = client.analysis().getKeyAnalysis(analysisId);
Map<String, Object> moodAnalysis = client.analysis().getMoodAnalysis(analysisId);

// Get analysis insights
Map<String, Object> insights = client.analysis().getInsights(
    analysisId,
    Map.of("focus", List.of("production", "composition"))
);
```

### Copilot Resource (AI Generation)

```java
// Generate melody
Map<String, Object> melody = client.copilot().generateMelody(Map.of(
    "style", "electronic",
    "genre", "electronic",
    "mood", "upbeat",
    "tempo", 128,
    "key", "C",
    "mode", "major",
    "duration", 30,
    "instruments", List.of("synthesizer", "bass", "piano"),
    "complexity", "medium",
    "creativity", 0.7
));

// Generate lyrics
Map<String, Object> lyrics = client.copilot().generateLyrics(Map.of(
    "theme", "technology and human connection",
    "genre", "electronic",
    "language", "en",
    "mood", "optimistic",
    "structure", "verse-chorus-verse-chorus-bridge-chorus",
    "keywords", List.of("future", "connection", "digital")
));

// Generate harmony
Map<String, Object> harmony = client.copilot().generateHarmony(Map.of(
    "melodyId", melodyId,
    "style", "jazz",
    "complexity", "complex",
    "voicing", "close",
    "instruments", List.of("piano", "guitar")
));

// Generate complete song
Map<String, Object> song = client.copilot().generateCompleteSong(Map.of(
    "prompt", "Create an uplifting electronic song",
    "style", "electronic",
    "duration", 180,
    "includeVocals", true,
    "vocalStyle", "female-pop",
    "mixingStyle", "modern"
));

// Apply style transfer
Map<String, Object> styledTrack = client.copilot().applyStyleTransfer(Map.of(
    "sourceId", sourceTrackId,
    "targetStyle", "jazz",
    "intensity", 0.8,
    "preserveStructure", true
));

// Get templates
Map<String, Object> templates = client.copilot().getTemplates(Map.of(
    "genre", "electronic",
    "mood", "upbeat",
    "style", "modern"
));
```

### Distribution Resource

```java
// Create release
Map<String, Object> release = client.distribution().createRelease(Map.of(
    "type", "single",
    "title", "My Release",
    "artist", "My Artist",
    "releaseDate", "2025-09-01",
    "tracks", List.of(Map.of("trackId", trackId, "title", "Song Title")),
    "platforms", List.of("spotify", "apple-music", "youtube-music")
));

// Submit to platforms
Map<String, Object> submission = client.distribution().submitToPlatforms(
    releaseId,
    Map.of(
        "platforms", List.of("spotify", "apple-music"),
        "scheduledDate", "2025-09-01T00:00:00Z",
        "expedited", false
    )
);

// Get distribution status
Map<String, Object> status = client.distribution().getDistributionStatus(releaseId);

// Validate release
Map<String, Object> validation = client.distribution().validateRelease(releaseId);

// Get available platforms
List<Map<String, Object>> platforms = client.distribution().getPlatforms();
```

### Transcription Resource

```java
// Create transcription
Map<String, Object> transcription = client.transcription().createTranscription(
    trackId,
    Map.of(
        "languages", List.of("en", "auto-detect"),
        "includeTimestamps", true,
        "wordLevelTimestamps", true,
        "speakerDiarization", true,
        "model", "large"
    )
);

// Create from file
Map<String, Object> transcription = client.transcription().createTranscriptionFromFile(
    new File("/path/to/audio.mp3"),
    "audio.mp3",
    options
);

// Get transcription
Map<String, Object> transcription = client.transcription().getTranscription(transcriptionId);

// Enhance lyrics
Map<String, Object> enhanced = client.transcription().enhanceLyrics(
    "Original lyrics text",
    Map.of(
        "improveMeter", true,
        "enhanceRhyming", true,
        "adjustTone", "professional"
    )
);

// Translate lyrics
Map<String, Object> translation = client.transcription().translateLyrics(
    transcriptionId,
    List.of("es", "fr"),
    Map.of("preserveRhyme", true)
);
```

### Analytics Resource

```java
// Get streaming analytics
Map<String, Object> streams = client.analytics().getStreams(Map.of(
    "startDate", "2024-01-01",
    "endDate", "2024-12-31",
    "groupBy", "month",
    "platforms", List.of("spotify", "apple-music")
));

// Get listener demographics
Map<String, Object> listeners = client.analytics().getListeners(Map.of(
    "startDate", "2024-01-01",
    "endDate", "2024-12-31",
    "groupBy", "territory"
));

// Get track analytics
Map<String, Object> trackAnalytics = client.analytics().getTrackAnalytics(
    trackId,
    Map.of(
        "startDate", "2024-01-01",
        "endDate", "2024-12-31",
        "metrics", List.of("streams", "listeners", "completion_rate")
    )
);

// Setup alert
Map<String, Object> alert = client.analytics().setupAlert(Map.of(
    "name", "High Streaming Alert",
    "releaseId", releaseId,
    "conditions", List.of(Map.of(
        "metric", "streams",
        "operator", "greater_than",
        "threshold", 1000,
        "period", "day"
    )),
    "notifications", Map.of("email", true, "webhook", true)
));

// Export data
Map<String, Object> export = client.analytics().exportData(
    Map.of("startDate", "2024-01-01", "endDate", "2024-12-31"),
    Map.of("format", "csv", "includeCharts", true)
);
```

### User Resource

```java
// Get profile
Map<String, Object> profile = client.user().getProfile();

// Update profile
Map<String, Object> updatedProfile = client.user().updateProfile(Map.of(
    "name", "New Name",
    "bio", "Updated bio",
    "website", "https://mywebsite.com"
));

// Get usage stats
Map<String, Object> usage = client.user().getUsageStats(Map.of(
    "period", "month",
    "includeBreakdown", true
));

// API key management
List<Map<String, Object>> apiKeys = client.user().getApiKeys();

Map<String, Object> newKey = client.user().createApiKey(
    "My App Key",
    Map.of(
        "scopes", List.of("tracks:read", "analytics:read"),
        "rateLimit", 1000
    )
);

client.user().revokeApiKey(keyId);
```

### Webhooks Resource

```java
// Create webhook
Map<String, Object> webhook = client.webhooks().create(Map.of(
    "url", "https://myapp.com/webhooks/jewelmusic",
    "events", List.of("track.processed", "analysis.completed"),
    "secret", "my-webhook-secret",
    "active", true
));

// List webhooks
List<Map<String, Object>> webhooks = client.webhooks().list();

// Get webhook
Map<String, Object> webhook = client.webhooks().get(webhookId);

// Update webhook
Map<String, Object> updatedWebhook = client.webhooks().update(
    webhookId,
    Map.of("active", false)
);

// Delete webhook
client.webhooks().delete(webhookId);

// Test webhook
Map<String, Object> testResult = client.webhooks().test(webhookId);

// Verify webhook signature (static method)
boolean isValid = JewelMusicClient.verifyWebhookSignature(payload, signature, secret);
```

## Error Handling

### Exception Hierarchy

```java
// Base exception
public class JewelMusicException extends Exception {
    private final int statusCode;
    private final Map<String, Object> details;
    private final String requestId;
    
    public int getStatusCode() { return statusCode; }
    public Map<String, Object> getDetails() { return details; }
    public String getRequestId() { return requestId; }
}

// Specific exceptions
public class AuthenticationException extends JewelMusicException {}

public class ValidationException extends JewelMusicException {
    private final Map<String, List<String>> fieldErrors;
    public Map<String, List<String>> getFieldErrors() { return fieldErrors; }
}

public class NotFoundException extends JewelMusicException {}

public class RateLimitException extends JewelMusicException {
    private final int retryAfterSeconds;
    public int getRetryAfterSeconds() { return retryAfterSeconds; }
}

public class NetworkException extends JewelMusicException {}
```

### Error Handling Example

```java
try {
    Map<String, Object> track = client.tracks().getTrack("invalid-id");
} catch (AuthenticationException e) {
    System.err.println("Authentication failed: " + e.getMessage());
    System.err.println("Request ID: " + e.getRequestId());
} catch (ValidationException e) {
    System.err.println("Validation errors: " + e.getFieldErrors());
} catch (NotFoundException e) {
    System.err.println("Track not found: " + e.getMessage());
} catch (RateLimitException e) {
    System.err.println("Rate limited. Retry after " + e.getRetryAfterSeconds() + " seconds");
    Thread.sleep(e.getRetryAfterSeconds() * 1000);
} catch (NetworkException e) {
    System.err.println("Network error: " + e.getMessage());
} catch (JewelMusicException e) {
    System.err.println("API error: " + e.getMessage() + " (Status: " + e.getStatusCode() + ")");
}
```

## Model Classes

### Core Data Models

```java
// These are conceptual representations. 
// The actual SDK uses Map<String, Object> for flexibility.

public class Track {
    private String id;
    private String title;
    private String artist;
    private String album;
    private String genre;
    private int duration;
    private long fileSize;
    private String format;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private TrackMetadata metadata;
    
    // Getters and setters...
}

public class TrackMetadata {
    private String title;
    private String artist;
    private String album;
    private String genre;
    private String releaseDate;
    private boolean explicit;
    private List<String> tags;
    
    // Getters and setters...
}

public class Analysis {
    private String id;
    private String trackId;
    private String status;
    private AnalysisResults results;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    // Getters and setters...
}

public class AnalysisResults {
    private TempoAnalysis tempo;
    private KeyAnalysis key;
    private MoodAnalysis mood;
    private QualityAnalysis quality;
    private StructureAnalysis structure;
    private LoudnessAnalysis loudness;
    
    // Getters and setters...
}
```

### Utility Classes

```java
// Progress callback interface
@FunctionalInterface
public interface ProgressCallback {
    void onProgress(long bytesUploaded, long totalBytes);
}

// Request builders
public class AnalysisRequestBuilder {
    public AnalysisRequestBuilder analysisTypes(List<String> types);
    public AnalysisRequestBuilder detailedReport(boolean detailed);
    public AnalysisRequestBuilder culturalContext(String context);
    public Map<String, Object> build();
}

// Response wrapper
public class ApiResponse<T> {
    private final T data;
    private final String requestId;
    private final int statusCode;
    
    public T getData() { return data; }
    public String getRequestId() { return requestId; }
    public int getStatusCode() { return statusCode; }
}
```

### Concurrent Processing

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// Example of concurrent operations
ExecutorService executor = Executors.newFixedThreadPool(3);

CompletableFuture<Map<String, Object>> melodyFuture = CompletableFuture.supplyAsync(() -> {
    try {
        return client.copilot().generateMelody(melodyOptions);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}, executor);

CompletableFuture<Map<String, Object>> lyricsFuture = CompletableFuture.supplyAsync(() -> {
    try {
        return client.copilot().generateLyrics(lyricsOptions);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}, executor);

// Wait for all to complete
CompletableFuture<Void> allOf = CompletableFuture.allOf(melodyFuture, lyricsFuture);
allOf.join();

Map<String, Object> melody = melodyFuture.get();
Map<String, Object> lyrics = lyricsFuture.get();

executor.shutdown();
```

For complete documentation and examples, see the JavaDoc included with the SDK.