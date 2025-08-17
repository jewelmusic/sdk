# JewelMusic JavaScript/TypeScript SDK

The official JavaScript/TypeScript SDK for the JewelMusic AI-powered music distribution platform. This SDK provides comprehensive access to JewelMusic's API, including AI copilot features, music analysis, distribution management, transcription services, and analytics.

[![npm version](https://badge.fury.io/js/@jewelmusic%2Fsdk.svg)](https://badge.fury.io/js/@jewelmusic%2Fsdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🤖 **AI Copilot**: Generate melodies, harmonies, lyrics, and complete songs
- 🎵 **Music Analysis**: Advanced audio quality checking, structure detection, and cultural compliance
- 📡 **Distribution**: Manage releases across 150+ streaming platforms
- 🎤 **Transcription**: AI transcription with 150+ language support and speaker diarization
- 📊 **Analytics**: Comprehensive streaming data, royalty tracking, and performance insights
- 👤 **User Management**: Profile, preferences, API keys, and account management
- 🔗 **Webhooks**: Real-time event notifications with signature verification

## Installation

### npm
```bash
npm install @jewelmusic/sdk
```

### yarn
```bash
yarn add @jewelmusic/sdk
```

### pnpm
```bash
pnpm add @jewelmusic/sdk
```

### bun
```bash
bun add @jewelmusic/sdk
```

## Quick Start

```typescript
import { JewelMusic } from '@jewelmusic/sdk';

// Initialize the client
const client = new JewelMusic({
  apiKey: 'jml_live_your_api_key_here',
  environment: 'production'
});

// Upload and analyze a track
async function uploadTrack() {
  // Upload track
  const track = await client.tracks.upload(audioFile, {
    title: 'My Song',
    artist: 'Artist Name',
    album: 'Album Name',
    genre: 'Electronic'
  });

  // Get AI analysis
  const analysis = await client.analysis.uploadTrack(audioFile, {
    analysisTypes: ['tempo', 'key', 'structure', 'quality'],
    detailedReport: true
  });

  // Generate transcription
  const transcription = await client.transcription.create(track.id, {
    languages: ['en'],
    includeTimestamps: true,
    speakerDiarization: true
  });

  console.log('Track uploaded:', track.id);
  console.log('Analysis completed:', analysis.summary);
  console.log('Transcription ready:', transcription.text);
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

```typescript
// Production
const client = new JewelMusic({
  apiKey: 'jml_live_your_key_here',
  environment: 'production'
});

// Sandbox (for testing)
const client = new JewelMusic({
  apiKey: 'jml_test_your_key_here',
  environment: 'sandbox'
});
```

### Advanced Configuration

```typescript
const client = new JewelMusic({
  apiKey: 'your_api_key',
  environment: 'production',
  apiVersion: 'v1',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  userAgent: 'MyApp/1.0.0',
  hooks: {
    onRequest: (config) => {
      console.log('Making request:', config.url);
    },
    onResponse: (response) => {
      console.log('Response received:', response.status);
    },
    onError: (error) => {
      console.error('Request failed:', error.message);
    }
  }
});
```

## Core Features

### AI Copilot

Generate music content with AI assistance:

```typescript
// Generate a melody
const melody = await client.copilot.generateMelody({
  style: 'electronic',
  tempo: 128,
  key: 'C',
  duration: 30,
  instruments: ['synthesizer', 'bass']
});

// Generate lyrics
const lyrics = await client.copilot.generateLyrics({
  theme: 'love',
  genre: 'pop',
  language: 'en',
  mood: 'uplifting',
  structure: 'verse-chorus-verse-chorus-bridge-chorus'
});

// Complete song generation
const song = await client.copilot.completeSong({
  prompt: 'An uplifting electronic song about overcoming challenges',
  style: 'electronic',
  duration: 180,
  includeVocals: true
});
```

### Music Analysis

Comprehensive audio analysis and quality checking:

```typescript
// Upload and analyze audio
const analysis = await client.analysis.uploadTrack(audioFile, {
  analysisTypes: ['tempo', 'key', 'structure', 'quality', 'loudness'],
  detailedReport: true,
  culturalContext: 'global',
  targetPlatforms: ['spotify', 'apple-music']
});

// Audio quality check
const quality = await client.analysis.audioQualityCheck(audioFile, {
  checkClipping: true,
  checkPhaseIssues: true,
  checkDynamicRange: true,
  targetLoudness: -14 // LUFS
});

// Get mastering suggestions
const suggestions = await client.analysis.masteringSuggestions(audioFile, {
  targetPlatform: 'streaming',
  genre: 'electronic',
  includePresets: true
});
```

### Distribution Management

Manage releases across streaming platforms:

```typescript
// Create a release
const release = await client.distribution.createRelease({
  type: 'single',
  title: 'My Song',
  artist: 'Artist Name',
  releaseDate: '2025-09-01',
  tracks: [
    {
      trackId: 'track_123',
      title: 'My Song',
      duration: 210,
      isrc: 'US1234567890'
    }
  ],
  territories: ['worldwide'],
  platforms: ['spotify', 'apple-music', 'youtube-music']
});

// Submit to platforms
await client.distribution.submitToPlatforms(release.id, {
  platforms: ['spotify', 'apple-music'],
  scheduledDate: '2025-09-01T00:00:00Z'
});

// Track distribution status
const status = await client.distribution.getDistributionStatus(release.id);
console.log('Distribution status:', status.platforms);
```

### Transcription Services

AI-powered transcription with multi-language support:

```typescript
// Create transcription
const transcription = await client.transcription.create(audioFile, {
  languages: ['en', 'es', 'fr'],
  includeTimestamps: true,
  wordLevelTimestamps: true,
  speakerDiarization: true,
  model: 'large'
});

// Translate lyrics
const translation = await client.transcription.translateLyrics(
  transcription.id,
  ['es', 'fr', 'de']
);

// Enhance lyrics with AI
const enhanced = await client.transcription.enhanceLyrics(
  transcription.text,
  {
    improveMeter: true,
    enhanceRhyming: true,
    adjustTone: 'professional'
  }
);
```

### Analytics & Reporting

Comprehensive streaming analytics and royalty tracking:

```typescript
// Get streaming data
const streams = await client.analytics.getStreams({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  groupBy: 'day',
  platforms: ['spotify', 'apple-music'],
  metrics: ['streams', 'listeners', 'revenue']
});

// Royalty reports
const royalties = await client.analytics.getRoyaltyReports(
  '2025-01-01',
  '2025-01-31',
  {
    currency: 'USD',
    includePending: true,
    groupBy: 'platform'
  }
);

// Real-time analytics
const realtime = await client.analytics.getRealtimeAnalytics({
  period: 'last_24_hours',
  updateInterval: 300000 // 5 minutes
});
```

### Track Management

Upload, organize, and manage your music library:

```typescript
// Upload with progress tracking
const track = await client.tracks.upload(audioFile, {
  title: 'My Song',
  artist: 'Artist Name',
  album: 'My Album',
  genre: 'Electronic',
  releaseDate: '2025-09-01'
}, {
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress.percentage}%`);
  }
});

// Batch upload
const results = await client.tracks.batchUpload([
  { file: file1, metadata: { title: 'Song 1', artist: 'Artist' } },
  { file: file2, metadata: { title: 'Song 2', artist: 'Artist' } },
  { file: file3, metadata: { title: 'Song 3', artist: 'Artist' } }
], {
  onProgress: (progress) => {
    console.log(`Batch progress: ${progress.completed}/${progress.total}`);
  }
});

// Generate waveform
const waveform = await client.tracks.generateWaveform(track.id, {
  width: 800,
  height: 200,
  colors: ['#3b82f6', '#8b5cf6']
});
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```typescript
import { 
  JewelMusic, 
  AuthenticationError, 
  ValidationError, 
  RateLimitError, 
  NetworkError 
} from '@jewelmusic/sdk';

try {
  const track = await client.tracks.upload(audioFile, metadata);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation failed:', error.details);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Try again in:', error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Webhooks

Set up webhooks to receive real-time notifications:

```typescript
// Create webhook
const webhook = await client.webhooks.create({
  url: 'https://myapp.com/webhooks/jewelmusic',
  events: [
    'track.uploaded',
    'track.processed',
    'analysis.completed',
    'distribution.released'
  ],
  secret: 'my_webhook_secret_123'
});

// Verify webhook signatures (in your webhook handler)
import { WebhooksResource } from '@jewelmusic/sdk';

app.post('/webhooks/jewelmusic', (req, res) => {
  const signature = req.headers['x-jewelmusic-signature'];
  const isValid = WebhooksResource.verifySignature(
    req.body,
    signature,
    'my_webhook_secret_123'
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = WebhooksResource.parseEvent(req.body);
  
  switch (event.type) {
    case 'track.uploaded':
      console.log('Track uploaded:', event.data.track.id);
      break;
    case 'analysis.completed':
      console.log('Analysis completed:', event.data.analysis.id);
      break;
  }

  res.status(200).send('OK');
});
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import { 
  JewelMusic, 
  Track, 
  AnalysisResult, 
  Transcription,
  Release,
  UserProfile 
} from '@jewelmusic/sdk';

const client = new JewelMusic({ apiKey: 'your_key' });

// All methods are fully typed
const track: Track = await client.tracks.get('track_123');
const analysis: AnalysisResult = await client.analysis.getAnalysis('analysis_456');
const profile: UserProfile = await client.user.getProfile();
```

## Rate Limiting

The SDK automatically handles rate limiting and retries:

```typescript
const client = new JewelMusic({
  apiKey: 'your_key',
  maxRetries: 5,
  retryDelay: 1000, // Start with 1 second
  // Automatic exponential backoff is applied
});

// The client will automatically retry failed requests
// and respect rate limit headers from the API
```

## Environments

### Node.js

Works in Node.js 16+ with full feature support:

```typescript
import { JewelMusic } from '@jewelmusic/sdk';
import fs from 'fs';

const client = new JewelMusic({ apiKey: 'your_key' });
const audioFile = fs.readFileSync('path/to/audio.mp3');
const track = await client.tracks.upload(audioFile, metadata);
```

### Browser

Browser support with file upload capabilities:

```typescript
import { JewelMusic } from '@jewelmusic/sdk';

const client = new JewelMusic({ 
  apiKey: 'your_key',
  environment: 'production'
});

// Handle file input
const fileInput = document.getElementById('audio-file') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const track = await client.tracks.upload(file, {
    title: 'Browser Upload',
    artist: 'Web User'
  });
}
```

## Examples

### Complete Upload Workflow

```typescript
async function completeWorkflow() {
  const client = new JewelMusic({ apiKey: 'your_key' });

  try {
    // 1. Upload track
    console.log('Uploading track...');
    const track = await client.tracks.upload(audioFile, {
      title: 'My Song',
      artist: 'Artist Name',
      genre: 'Electronic'
    });

    // 2. Wait for processing
    console.log('Waiting for processing...');
    await client.tracks.waitForProcessing(track.id);

    // 3. Get AI analysis
    console.log('Analyzing track...');
    const analysis = await client.analysis.uploadTrack(audioFile, {
      analysisTypes: ['all'],
      detailedReport: true
    });

    // 4. Generate transcription
    console.log('Creating transcription...');
    const transcription = await client.transcription.create(track.id, {
      languages: ['en'],
      includeTimestamps: true
    });

    // 5. Create release
    console.log('Creating release...');
    const release = await client.distribution.createRelease({
      type: 'single',
      title: track.title,
      artist: track.artist,
      releaseDate: '2025-09-01',
      tracks: [{ trackId: track.id }]
    });

    // 6. Submit to platforms
    console.log('Submitting to platforms...');
    await client.distribution.submitToPlatforms(release.id, {
      platforms: ['spotify', 'apple-music']
    });

    console.log('Workflow completed successfully!');
    
    return {
      track,
      analysis,
      transcription,
      release
    };
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
}
```

### AI Music Generation

```typescript
async function generateMusic() {
  const client = new JewelMusic({ apiKey: 'your_key' });

  // Generate song structure
  const structure = await client.copilot.suggestArrangement({
    genre: 'electronic',
    duration: 180,
    energy: 'high'
  });

  // Generate melody
  const melody = await client.copilot.generateMelody({
    style: 'electronic',
    tempo: 128,
    key: 'C',
    duration: 30
  });

  // Generate harmony
  const harmony = await client.copilot.generateHarmony({
    melodyId: melody.id,
    style: 'modern',
    complexity: 'medium'
  });

  // Generate lyrics
  const lyrics = await client.copilot.generateLyrics({
    theme: 'technology',
    mood: 'optimistic',
    structure: structure.suggestion
  });

  // Combine into complete song
  const song = await client.copilot.completeSong({
    melodyId: melody.id,
    harmonyId: harmony.id,
    lyricsId: lyrics.id,
    style: 'electronic',
    includeVocals: true
  });

  return song;
}
```

## API Reference

### Client Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | *required* | Your JewelMusic API key |
| `environment` | `'production' \| 'sandbox'` | `'production'` | API environment |
| `apiVersion` | `string` | `'v1'` | API version |
| `baseUrl` | `string` | `'https://api.jewelmusic.art'` | API base URL |
| `timeout` | `number` | `30000` | Request timeout in ms |
| `maxRetries` | `number` | `3` | Maximum retry attempts |
| `retryDelay` | `number` | `1000` | Initial retry delay in ms |

### Resource Methods

#### Copilot
- `generateMelody(options)` - Generate AI melody
- `generateHarmony(options)` - Generate AI harmony
- `generateLyrics(options)` - Generate AI lyrics
- `completeSong(options)` - Generate complete song
- `styleTransfer(options)` - Apply style transfer
- `getTemplates()` - Get song templates

#### Analysis
- `uploadTrack(file, options)` - Upload and analyze audio
- `getAnalysis(id)` - Get analysis results
- `audioQualityCheck(file)` - Check audio quality
- `masteringSuggestions(file)` - Get mastering suggestions
- `detectStructure(file)` - Detect song structure

#### Distribution
- `createRelease(data)` - Create new release
- `submitToPlatforms(id, options)` - Submit to platforms
- `getDistributionStatus(id)` - Get distribution status
- `takedownFromPlatforms(id, platforms)` - Remove from platforms

#### Transcription
- `create(file, options)` - Create transcription
- `translateLyrics(id, languages)` - Translate lyrics
- `enhanceLyrics(text, options)` - Enhance lyrics with AI

#### Tracks
- `upload(file, metadata, options)` - Upload track
- `list(params)` - List tracks
- `get(id)` - Get track details
- `update(id, metadata)` - Update track
- `delete(id)` - Delete track

#### Analytics
- `getStreams(query)` - Get streaming data
- `getRoyaltyReports(start, end, options)` - Get royalty reports
- `getInsights(options)` - Get AI insights

#### User
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update profile
- `getApiKeys()` - List API keys
- `createApiKey(name, permissions)` - Create API key

#### Webhooks
- `list()` - List webhooks
- `create(data)` - Create webhook
- `test(id)` - Test webhook
- `verifySignature(payload, signature, secret)` - Verify signature

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/jewelmusic/sdk-javascript.git
cd sdk-javascript

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run type checking
npm run type-check
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [support@jewelmusic.art](mailto:support@jewelmusic.art)
- 💬 Discord: [JewelMusic Community](https://discord.gg/jewelmusic)
- 📖 Documentation: [docs.jewelmusic.art](https://docs.jewelmusic.art)
- 🐛 Issues: [GitHub Issues](https://github.com/jewelmusic/sdk-javascript/issues)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes in each version.

---

**JewelMusic SDK** - Empowering musicians with AI-powered tools for creation, analysis, and distribution.