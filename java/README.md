# JewelMusic Java SDK

The official Java SDK for the JewelMusic API - an AI-powered music distribution and analytics platform.

## Features

- 🎵 **Music Analysis**: Advanced audio analysis and feature extraction
- 🤖 **AI Copilot**: Intelligent music recommendations and insights
- 📡 **Distribution**: Seamless music distribution to streaming platforms
- 📝 **Transcription**: AI-powered audio transcription and lyrics extraction
- 📊 **Analytics**: Comprehensive music performance analytics
- 👤 **User Management**: Complete user account and profile management
- 🔗 **Webhooks**: Real-time event notifications with signature verification
- 🎼 **Track Management**: Upload, organize, and manage your music library

## Installation

### Maven

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>com.jewelmusic</groupId>
    <artifactId>jewelmusic-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Gradle

Add the following to your `build.gradle`:

```gradle
implementation 'com.jewelmusic:jewelmusic-sdk:1.0.0'
```

## Quick Start

```java
import com.jewelmusic.JewelMusic;
import com.jewelmusic.JewelMusicClient;
import java.util.Map;

public class Example {
    public static void main(String[] args) {
        // Initialize the client
        JewelMusic client = new JewelMusicClient("your-api-key");
        
        // Get AI recommendations
        Map<String, Object> recommendations = client.copilot().getRecommendations();
        System.out.println("Recommendations: " + recommendations);
        
        // Analyze a track
        Map<String, Object> analysis = client.analysis().analyzeTrack("track-id");
        System.out.println("Analysis: " + analysis);
        
        // Get user profile
        Map<String, Object> profile = client.user().getProfile();
        System.out.println("Profile: " + profile);
    }
}
```

## Configuration

### Basic Configuration

```java
JewelMusic client = new JewelMusicClient("your-api-key");
```

### Advanced Configuration

```java
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

// Custom configuration
Map<String, String> headers = new HashMap<>();
headers.put("X-Custom-Header", "value");

JewelMusic client = new JewelMusicClient.Builder("your-api-key")
    .baseUrl("https://custom-api.jewelmusic.com")
    .timeout(Duration.ofSeconds(30))
    .maxRetries(5)
    .userAgent("MyApp/1.0")
    .additionalHeaders(headers)
    .build();
```

## Usage Examples

### Music Analysis

```java
import java.io.File;

// Analyze audio file
File audioFile = new File("path/to/music.mp3");
Map<String, Object> analysis = client.analysis().analyzeFile(audioFile, "music.mp3");

// Get audio features
Map<String, Object> features = client.analysis().getAudioFeatures("track-id");

// Detect tempo
Map<String, Object> tempo = client.analysis().detectTempo("track-id");

// Analyze key signature
Map<String, Object> key = client.analysis().analyzeKey("track-id");
```

### AI Copilot

```java
import java.util.HashMap;
import java.util.Map;

// Get personalized recommendations
Map<String, Object> recommendations = client.copilot().getRecommendations();

// Get recommendations with filters
Map<String, String> filters = new HashMap<>();
filters.put("genre", "electronic");
filters.put("mood", "energetic");
Map<String, Object> filteredRecs = client.copilot().getRecommendations(filters);

// Analyze track mood
Map<String, Object> mood = client.copilot().analyzeMood("track-id");

// Find similar tracks
Map<String, Object> similar = client.copilot().findSimilar("track-id");

// Generate AI tags
Map<String, Object> tags = client.copilot().generateTags("track-id");
```

### Music Distribution

```java
import java.util.HashMap;
import java.util.Map;

// Create a new release
Map<String, Object> releaseData = new HashMap<>();
releaseData.put("title", "My New Album");
releaseData.put("artist", "Artist Name");
releaseData.put("genre", "Electronic");
releaseData.put("release_date", "2024-12-01");

Map<String, Object> release = client.distribution().createRelease(releaseData);

// Distribute to platforms
Map<String, Object> platforms = new HashMap<>();
platforms.put("spotify", true);
platforms.put("apple_music", true);
platforms.put("youtube_music", true);

Map<String, Object> distribution = client.distribution()
    .distributeRelease((String) release.get("id"), platforms);

// Check distribution status
Map<String, Object> status = client.distribution()
    .getDistributionStatus((String) release.get("id"));
```

### Audio Transcription

```java
import java.io.File;

// Transcribe audio file
File audioFile = new File("path/to/audio.wav");
Map<String, Object> transcription = client.transcription()
    .transcribeFile(audioFile, "audio.wav");

// Transcribe with options
Map<String, String> options = new HashMap<>();
options.put("language", "en-US");
options.put("timestamps", "true");

Map<String, Object> detailedTranscription = client.transcription()
    .transcribeFile(audioFile, "audio.wav", options);

// Extract lyrics from track
Map<String, Object> lyrics = client.transcription().extractLyrics("track-id");

// Get transcription job status
Map<String, Object> jobStatus = client.transcription().getJobStatus("job-id");
```

### Track Management

```java
import java.io.File;
import java.util.HashMap;
import java.util.Map;

// Upload a track
File trackFile = new File("path/to/track.mp3");
Map<String, Object> uploadedTrack = client.tracks().uploadTrack(trackFile, "track.mp3");

// Upload with metadata
Map<String, String> metadata = new HashMap<>();
metadata.put("title", "Song Title");
metadata.put("artist", "Artist Name");
metadata.put("album", "Album Name");

Map<String, Object> trackWithMeta = client.tracks()
    .uploadTrack(trackFile, "track.mp3", metadata);

// Search tracks
Map<String, Object> searchResults = client.tracks().searchTracks("electronic music");

// Get track details
Map<String, Object> track = client.tracks().getTrack("track-id");

// Update track metadata
Map<String, Object> updates = new HashMap<>();
updates.put("genre", "Ambient");
Map<String, Object> updatedTrack = client.tracks().updateTrack("track-id", updates);
```

### Analytics

```java
import java.util.HashMap;
import java.util.Map;

// Get analytics overview
Map<String, Object> overview = client.analytics().getOverview("month");

// Get streaming analytics
Map<String, Object> streaming = client.analytics().getStreamingAnalytics();

// Get track-specific analytics
Map<String, Object> trackAnalytics = client.analytics()
    .getTrackAnalytics("track-id", "week");

// Get audience demographics
Map<String, Object> audience = client.analytics().getAudienceAnalytics();

// Get revenue analytics
Map<String, Object> revenue = client.analytics().getRevenueAnalytics();

// Create custom report
Map<String, Object> reportConfig = new HashMap<>();
reportConfig.put("metrics", new String[]{"plays", "downloads", "revenue"});
reportConfig.put("dimensions", new String[]{"country", "platform"});
reportConfig.put("start_date", "2024-01-01");
reportConfig.put("end_date", "2024-12-31");

Map<String, Object> customReport = client.analytics().createCustomReport(reportConfig);
```

### User Management

```java
import java.util.HashMap;
import java.util.Map;

// Get user profile
Map<String, Object> profile = client.user().getProfile();

// Update profile
Map<String, Object> updates = new HashMap<>();
updates.put("display_name", "New Name");
updates.put("bio", "Updated bio");
Map<String, Object> updatedProfile = client.user().updateProfile(updates);

// Get API usage
Map<String, Object> usage = client.user().getUsage("month");

// Create API key
Map<String, Object> keyData = new HashMap<>();
keyData.put("name", "My API Key");
keyData.put("permissions", new String[]{"read", "write"});
Map<String, Object> apiKey = client.user().createApiKey(keyData);

// Get user settings
Map<String, Object> settings = client.user().getSettings();
```

### Webhooks

```java
import java.util.HashMap;
import java.util.Map;

// Create webhook
Map<String, Object> webhookData = new HashMap<>();
webhookData.put("url", "https://myapp.com/webhooks");
webhookData.put("events", new String[]{"track.uploaded", "analysis.completed"});
webhookData.put("secret", "webhook-secret");

Map<String, Object> webhook = client.webhooks().createWebhook(webhookData);

// List webhooks
Map<String, Object> webhooks = client.webhooks().listWebhooks();

// Test webhook
Map<String, Object> testResult = client.webhooks()
    .testWebhook((String) webhook.get("id"));

// Get webhook deliveries
Map<String, Object> deliveries = client.webhooks()
    .getDeliveries((String) webhook.get("id"));
```

### Webhook Signature Verification

```java
import com.jewelmusic.resources.WebhooksResource;

// Verify webhook signature
String payload = "..."; // Raw webhook payload
String signature = "..."; // X-JewelMusic-Signature header
String secret = "your-webhook-secret";

boolean isValid = WebhooksResource.verifySignature(payload, signature, secret);

if (isValid) {
    // Process webhook payload
    System.out.println("Webhook signature is valid");
} else {
    // Invalid signature
    System.out.println("Invalid webhook signature");
}
```

## Error Handling

```java
import com.jewelmusic.exceptions.*;

try {
    Map<String, Object> result = client.analysis().analyzeTrack("track-id");
} catch (AuthenticationException e) {
    System.err.println("Authentication failed: " + e.getMessage());
} catch (NotFoundException e) {
    System.err.println("Track not found: " + e.getMessage());
} catch (ValidationException e) {
    System.err.println("Validation error: " + e.getMessage());
    if (e.hasFieldError("track_id")) {
        System.err.println("Track ID error: " + e.getFirstFieldError("track_id"));
    }
} catch (RateLimitException e) {
    System.err.println("Rate limit exceeded. Retry after: " + e.getRetryAfterSeconds() + " seconds");
} catch (NetworkException e) {
    System.err.println("Network error: " + e.getMessage());
} catch (JewelMusicException e) {
    System.err.println("API error: " + e.getMessage());
    System.err.println("Status code: " + e.getStatusCode());
}
```

## File Upload Examples

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

// Upload from file
File file = new File("path/to/audio.mp3");
Map<String, Object> result = client.tracks().uploadTrack(file, "audio.mp3");

// Upload from InputStream
try (InputStream inputStream = new FileInputStream("path/to/audio.mp3")) {
    Map<String, Object> result = client.analysis()
        .analyzeFile(inputStream, "audio.mp3");
}

// Upload with metadata
Map<String, String> metadata = new HashMap<>();
metadata.put("title", "My Song");
metadata.put("artist", "Artist Name");

Map<String, Object> result = client.tracks()
    .uploadTrack(file, "audio.mp3", metadata);
```

## Threading and Concurrency

The JewelMusic Java SDK is thread-safe and can be used safely from multiple threads:

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// Single client instance can be shared across threads
JewelMusic client = new JewelMusicClient("your-api-key");

// Async example
ExecutorService executor = Executors.newFixedThreadPool(10);

CompletableFuture<Map<String, Object>> future = CompletableFuture.supplyAsync(() -> {
    return client.copilot().getRecommendations();
}, executor);

future.thenAccept(recommendations -> {
    System.out.println("Recommendations: " + recommendations);
});
```

## Requirements

- Java 11 or higher
- Maven 3.6+ or Gradle 6.0+

## Dependencies

- [OkHttp](https://square.github.io/okhttp/) - HTTP client
- [Jackson](https://github.com/FasterXML/jackson) - JSON processing
- [SLF4J](http://www.slf4j.org/) - Logging facade

## Rate Limiting

The SDK automatically handles rate limiting with exponential backoff. When rate limits are exceeded, the SDK will:

1. Automatically retry requests with exponential backoff
2. Respect the `Retry-After` header from the API
3. Throw a `RateLimitException` if all retries are exhausted

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [https://docs.jewelmusic.com](https://docs.jewelmusic.com)
- **API Reference**: [https://api.jewelmusic.com/docs](https://api.jewelmusic.com/docs)
- **Support**: [support@jewelmusic.com](mailto:support@jewelmusic.com)
- **Issues**: [GitHub Issues](https://github.com/jewelmusic/java-sdk/issues)

## Changelog

### Version 1.0.0
- Initial release
- Complete API coverage for all JewelMusic endpoints
- Comprehensive error handling and retry logic
- Thread-safe client implementation
- File upload support with progress tracking
- Webhook signature verification utilities
- Full documentation and examples