/**
 * JewelMusic SDK for JavaScript/TypeScript
 * 
 * Official SDK for the JewelMusic AI-powered music distribution platform.
 * 
 * @packageDocumentation
 */

// Main client export
export { JewelMusic, default, createClient } from './client';

// Type exports
export * from './types';

// Resource exports
export {
  CopilotResource,
  AnalysisResource,
  DistributionResource,
  TranscriptionResource,
  TracksResource,
  AnalyticsResource,
  UserResource,
  WebhooksResource,
} from './client';

// Utility exports
export { HttpClient } from './utils/http-client';
export { BaseResource } from './resources/base';

// Version
export const VERSION = '2.5.0';

/**
 * Quick start example:
 * 
 * ```typescript
 * import { JewelMusic } from '@jewelmusic/sdk';
 * 
 * const client = new JewelMusic({
 *   apiKey: 'jml_live_your_api_key_here',
 *   environment: 'production'
 * });
 * 
 * // Upload a track
 * const track = await client.tracks.upload(audioFile, {
 *   title: 'My Song',
 *   artist: 'Artist Name'
 * });
 * 
 * // Get AI transcription  
 * const transcription = await client.transcription.create(track.id, {
 *   languages: ['en', 'ka'],
 *   includeTimestamps: true
 * });
 * 
 * // Distribute to platforms
 * const release = await client.distribution.createRelease({
 *   type: 'single',
 *   title: 'My Song',
 *   artist: 'Artist Name',
 *   tracks: [track.id],
 *   releaseDate: '2025-09-01',
 *   platforms: ['spotify', 'apple-music']
 * });
 * ```
 */