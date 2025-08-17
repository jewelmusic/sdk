# JewelMusic JavaScript/TypeScript SDK API Reference

This document provides detailed API reference for the JewelMusic JavaScript/TypeScript SDK.

## Table of Contents

- [Client Initialization](#client-initialization)
- [Resources Overview](#resources-overview)
- [Error Handling](#error-handling)
- [Type Definitions](#type-definitions)

## Client Initialization

### JewelMusicClient

```typescript
import { JewelMusicClient } from 'jewelmusic-sdk';

const client = new JewelMusicClient(apiKey: string, options?: ClientOptions);
```

#### ClientOptions

```typescript
interface ClientOptions {
  baseUrl?: string;          // Default: 'https://api.jewelmusic.art'
  timeout?: number;          // Default: 30000 (30 seconds)
  retries?: number;          // Default: 3
  retryDelay?: number;       // Default: 1000 (1 second)
  userAgent?: string;        // Custom user agent
  debug?: boolean;           // Enable debug logging
  headers?: Record<string, string>; // Additional headers
}
```

## Resources Overview

### Tracks Resource

```typescript
// Upload track
client.tracks.upload(file: File | Buffer, filename: string, metadata?: TrackMetadata): Promise<Track>

// Get track
client.tracks.get(trackId: string): Promise<Track>

// List tracks
client.tracks.list(page?: number, perPage?: number, filters?: TrackFilters): Promise<TracksList>

// Update track
client.tracks.update(trackId: string, updates: Partial<TrackMetadata>): Promise<Track>

// Delete track
client.tracks.delete(trackId: string): Promise<void>

// Search tracks
client.tracks.search(query: string, options?: SearchOptions): Promise<TracksList>
```

### Analysis Resource

```typescript
// Analyze track
client.analysis.analyze(trackId: string, options?: AnalysisOptions): Promise<Analysis>

// Get analysis results
client.analysis.get(analysisId: string): Promise<Analysis>

// Get specific analysis types
client.analysis.getTempo(analysisId: string): Promise<TempoAnalysis>
client.analysis.getKey(analysisId: string): Promise<KeyAnalysis>
client.analysis.getMood(analysisId: string): Promise<MoodAnalysis>
```

### Copilot Resource (AI Generation)

```typescript
// Generate melody
client.copilot.generateMelody(options: MelodyOptions): Promise<GeneratedMelody>

// Generate lyrics
client.copilot.generateLyrics(options: LyricsOptions): Promise<GeneratedLyrics>

// Generate harmony
client.copilot.generateHarmony(options: HarmonyOptions): Promise<GeneratedHarmony>

// Generate complete song
client.copilot.generateCompleteSong(options: SongOptions): Promise<GeneratedSong>

// Apply style transfer
client.copilot.applyStyleTransfer(options: StyleTransferOptions): Promise<StyledTrack>
```

### Distribution Resource

```typescript
// Create release
client.distribution.createRelease(releaseData: ReleaseData): Promise<Release>

// Submit to platforms
client.distribution.submitToPlatforms(releaseId: string, platforms: string[], options?: SubmissionOptions): Promise<Submission>

// Get distribution status
client.distribution.getStatus(releaseId: string): Promise<DistributionStatus>

// Validate release
client.distribution.validateRelease(releaseId: string): Promise<ValidationResult>
```

### Transcription Resource

```typescript
// Create transcription
client.transcription.create(trackId: string, options?: TranscriptionOptions): Promise<Transcription>

// Get transcription
client.transcription.get(transcriptionId: string): Promise<Transcription>

// Enhance lyrics
client.transcription.enhanceLyrics(text: string, options?: EnhancementOptions): Promise<EnhancedLyrics>

// Translate lyrics
client.transcription.translateLyrics(transcriptionId: string, targetLanguages: string[], options?: TranslationOptions): Promise<Translation>
```

### Analytics Resource

```typescript
// Get streaming analytics
client.analytics.getStreams(query: AnalyticsQuery): Promise<StreamsData>

// Get listener demographics
client.analytics.getListeners(query: AnalyticsQuery): Promise<ListenersData>

// Get track analytics
client.analytics.getTrackAnalytics(trackId: string, query: AnalyticsQuery): Promise<TrackAnalytics>

// Setup alert
client.analytics.setupAlert(alertData: AlertData): Promise<Alert>

// Export data
client.analytics.exportData(query: AnalyticsQuery, options: ExportOptions): Promise<Export>
```

### User Resource

```typescript
// Get profile
client.user.getProfile(): Promise<UserProfile>

// Update profile
client.user.updateProfile(updates: Partial<UserProfile>): Promise<UserProfile>

// Get usage stats
client.user.getUsageStats(options?: UsageStatsOptions): Promise<UsageStats>

// Manage API keys
client.user.getApiKeys(): Promise<ApiKey[]>
client.user.createApiKey(name: string, options?: ApiKeyOptions): Promise<ApiKey>
client.user.revokeApiKey(keyId: string): Promise<void>
```

### Webhooks Resource

```typescript
// Create webhook
client.webhooks.create(webhookData: WebhookData): Promise<Webhook>

// List webhooks
client.webhooks.list(): Promise<Webhook[]>

// Get webhook
client.webhooks.get(webhookId: string): Promise<Webhook>

// Update webhook
client.webhooks.update(webhookId: string, updates: Partial<WebhookData>): Promise<Webhook>

// Delete webhook
client.webhooks.delete(webhookId: string): Promise<void>

// Test webhook
client.webhooks.test(webhookId: string): Promise<TestResult>

// Verify signature (static method)
JewelMusicClient.webhooks.verifySignature(payload: string, signature: string, secret: string): boolean
```

## Error Handling

### Exception Types

```typescript
// Base exception
class JewelMusicError extends Error {
  statusCode?: number;
  details?: any;
  requestId?: string;
}

// Specific exceptions
class AuthenticationError extends JewelMusicError {}
class ValidationError extends JewelMusicError {
  fieldErrors: Record<string, string[]>;
}
class NotFoundError extends JewelMusicError {}
class RateLimitError extends JewelMusicError {
  retryAfterSeconds: number;
}
class NetworkError extends JewelMusicError {}
```

### Error Handling Example

```typescript
try {
  const track = await client.tracks.get('invalid-id');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Authentication failed:', error.message);
  } else if (error instanceof ValidationError) {
    console.log('Validation errors:', error.fieldErrors);
  } else if (error instanceof NotFoundError) {
    console.log('Track not found');
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfterSeconds} seconds`);
  }
}
```

## Type Definitions

### Core Types

```typescript
interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number;
  fileSize: number;
  format: string;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
  createdAt: string;
  updatedAt: string;
  metadata: TrackMetadata;
}

interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  releaseDate?: string;
  explicit?: boolean;
  tags?: string[];
}

interface Analysis {
  id: string;
  trackId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: AnalysisResults;
  createdAt: string;
  completedAt?: string;
}

interface AnalysisResults {
  tempo?: TempoAnalysis;
  key?: KeyAnalysis;
  mood?: MoodAnalysis;
  quality?: QualityAnalysis;
  structure?: StructureAnalysis;
  loudness?: LoudnessAnalysis;
}
```

### Generation Types

```typescript
interface MelodyOptions {
  style: string;
  genre: string;
  mood: string;
  tempo: number;
  key: string;
  mode: 'major' | 'minor';
  duration: number;
  instruments: string[];
  complexity: 'simple' | 'medium' | 'complex';
  creativity: number; // 0-1
}

interface LyricsOptions {
  theme: string;
  genre: string;
  language: string;
  mood: string;
  structure: string;
  rhymeScheme?: string;
  syllableCount?: string;
  verseCount?: number;
  chorusCount?: number;
  explicitContent?: boolean;
  keywords?: string[];
}
```

### Analytics Types

```typescript
interface AnalyticsQuery {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
  platforms?: string[];
  territories?: string[];
  metrics?: string[];
}

interface StreamsData {
  totalStreams: number;
  uniqueListeners: number;
  averageListenTime: number;
  completionRate: number;
  skipRate: number;
  timeline: TimelinePoint[];
}
```

For complete type definitions, see the TypeScript declaration files included with the SDK.