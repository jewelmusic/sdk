import { BaseResource } from './base';
import {
  CopilotGenerationOptions,
  MelodyGenerationResult,
  LyricsGenerationOptions,
  LyricsGenerationResult,
  ChordProgression,
} from '../types';

/**
 * AI Copilot Resource
 * 
 * Provides access to JewelMusic's AI-powered music creation and assistance features.
 * The copilot can help with melody generation, lyrics creation, chord progressions,
 * arrangement suggestions, and more.
 */
export class CopilotResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/copilot');
  }

  /**
   * Generate AI-powered melody suggestions
   * 
   * @param options - Configuration for melody generation
   * @returns Promise resolving to melody generation results
   * 
   * @example
   * ```typescript
   * const melody = await client.copilot.generateMelody({
   *   style: 'pop',
   *   genre: 'electronic',
   *   mood: 'upbeat',
   *   tempo: 120,
   *   key: 'C major',
   *   length: 32 // bars
   * });
   * 
   * console.log('Generated melody:', melody.data.melody);
   * console.log('MIDI download:', melody.data.midiUrl);
   * ```
   */
  async generateMelody(options: CopilotGenerationOptions = {}): Promise<MelodyGenerationResult> {
    const response = await this.post<MelodyGenerationResult>('/generate-melody', {
      style: options.style,
      genre: options.genre,
      mood: options.mood,
      tempo: options.tempo || 120,
      key: options.key || 'C major',
      timeSignature: options.timeSignature || '4/4',
      length: options.length || 16,
      instruments: options.instruments || ['piano'],
      referenceTrack: options.referenceTrack,
      creativity: options.creativity || 0.7,
      seed: options.seed,
    });

    return this.extractData(response);
  }

  /**
   * Generate harmony progressions for existing melodies
   * 
   * @param melodyId - ID of the melody to harmonize
   * @param options - Configuration for harmony generation
   * @returns Promise resolving to harmony generation results
   * 
   * @example
   * ```typescript
   * const harmony = await client.copilot.generateHarmony('melody_123', {
   *   style: 'jazz',
   *   complexity: 0.8,
   *   instruments: ['piano', 'guitar']
   * });
   * ```
   */
  async generateHarmony(melodyId: string, options: CopilotGenerationOptions = {}) {
    this.validateRequired({ melodyId }, ['melodyId']);

    const response = await this.post('/generate-harmony', {
      melodyId,
      style: options.style,
      genre: options.genre,
      mood: options.mood,
      instruments: options.instruments || ['piano'],
      creativity: options.creativity || 0.7,
    });

    return this.extractData(response);
  }

  /**
   * Generate AI-powered lyrics
   * 
   * @param options - Configuration for lyrics generation
   * @returns Promise resolving to lyrics generation results
   * 
   * @example
   * ```typescript
   * const lyrics = await client.copilot.generateLyrics({
   *   theme: 'love and relationships',
   *   mood: 'romantic',
   *   genre: 'pop',
   *   language: 'en',
   *   rhymeScheme: 'ABAB',
   *   verseCount: 2,
   *   chorusCount: 1
   * });
   * 
   * console.log('Generated lyrics:', lyrics.data.lyrics.sections);
   * ```
   */
  async generateLyrics(options: LyricsGenerationOptions = {}): Promise<LyricsGenerationResult> {
    const response = await this.post<LyricsGenerationResult>('/generate-lyrics', {
      theme: options.theme,
      mood: options.mood,
      genre: options.genre,
      language: options.language || 'en',
      rhymeScheme: options.rhymeScheme,
      verseCount: options.verseCount || 2,
      chorusCount: options.chorusCount || 1,
      bridgeCount: options.bridgeCount || 0,
      wordsPerLine: options.wordsPerLine,
      explicitContent: options.explicitContent || false,
      keywords: options.keywords || [],
      referenceArtists: options.referenceArtists || [],
    });

    return this.extractData(response);
  }

  /**
   * Get arrangement suggestions for a track
   * 
   * @param trackId - ID of the track to analyze
   * @param targetStyle - Target musical style for arrangements
   * @returns Promise resolving to arrangement suggestions
   * 
   * @example
   * ```typescript
   * const suggestions = await client.copilot.suggestArrangement('track_123', 'orchestral');
   * console.log('Arrangement suggestions:', suggestions.data.suggestions);
   * ```
   */
  async suggestArrangement(trackId: string, targetStyle?: string) {
    this.validateRequired({ trackId }, ['trackId']);

    const response = await this.post('/suggest-arrangement', {
      trackId,
      targetStyle,
    });

    return this.extractData(response);
  }

  /**
   * Auto-complete a partial song composition
   * 
   * @param partialTrackId - ID of the partial track/composition
   * @param completionType - Type of completion needed
   * @param options - Additional options for completion
   * @returns Promise resolving to completed composition
   * 
   * @example
   * ```typescript
   * const completed = await client.copilot.completeSong('partial_123', 'full', {
   *   targetLength: 180, // seconds
   *   addIntro: true,
   *   addOutro: true
   * });
   * ```
   */
  async completeSong(
    partialTrackId: string, 
    completionType: 'intro' | 'outro' | 'bridge' | 'full' = 'full',
    options: {
      targetLength?: number;
      addIntro?: boolean;
      addOutro?: boolean;
      addBridge?: boolean;
      style?: string;
    } = {}
  ) {
    this.validateRequired({ partialTrackId }, ['partialTrackId']);

    const response = await this.post('/complete-song', {
      partialTrackId,
      completionType,
      targetLength: options.targetLength,
      addIntro: options.addIntro,
      addOutro: options.addOutro,
      addBridge: options.addBridge,
      style: options.style,
    });

    return this.extractData(response);
  }

  /**
   * Get available composition templates
   * 
   * @param genre - Filter templates by genre
   * @param mood - Filter templates by mood
   * @returns Promise resolving to available templates
   * 
   * @example
   * ```typescript
   * const templates = await client.copilot.getTemplates('pop', 'upbeat');
   * console.log('Available templates:', templates.data.templates);
   * ```
   */
  async getTemplates(genre?: string, mood?: string) {
    const response = await this.get('/templates', {
      genre,
      mood,
    });

    return this.extractData(response);
  }

  /**
   * Apply style transfer to existing music
   * 
   * @param sourceTrackId - ID of the source track
   * @param targetStyle - Target style to apply
   * @param intensity - Intensity of style transfer (0-1)
   * @returns Promise resolving to style-transferred result
   * 
   * @example
   * ```typescript
   * const transferred = await client.copilot.styleTransfer(
   *   'track_123', 
   *   'jazz', 
   *   0.8
   * );
   * ```
   */
  async styleTransfer(sourceTrackId: string, targetStyle: string, intensity: number = 0.7) {
    this.validateRequired({ sourceTrackId, targetStyle }, ['sourceTrackId', 'targetStyle']);

    if (intensity < 0 || intensity > 1) {
      throw new Error('Intensity must be between 0 and 1');
    }

    const response = await this.post('/style-transfer', {
      sourceTrackId,
      targetStyle,
      intensity,
    });

    return this.extractData(response);
  }

  /**
   * Generate chord progression suggestions
   * 
   * @param key - Musical key for the progression
   * @param style - Musical style/genre
   * @param complexity - Complexity level (0-1)
   * @param length - Number of chords in the progression
   * @returns Promise resolving to chord progression suggestions
   * 
   * @example
   * ```typescript
   * const progression = await client.copilot.chordProgression('C major', 'pop', 0.5, 8);
   * console.log('Chord progression:', progression.data.chords);
   * ```
   */
  async chordProgression(
    key: string = 'C major',
    style: string = 'pop',
    complexity: number = 0.5,
    length: number = 4
  ): Promise<ChordProgression> {
    if (complexity < 0 || complexity > 1) {
      throw new Error('Complexity must be between 0 and 1');
    }

    const response = await this.post<ChordProgression>('/chord-progression', {
      key,
      style,
      complexity,
      length,
    });

    return this.extractData(response);
  }

  /**
   * Analyze and suggest genre improvements
   * 
   * @param trackId - ID of the track to analyze
   * @param targetGenre - Target genre for optimization
   * @returns Promise resolving to genre analysis and suggestions
   * 
   * @example
   * ```typescript
   * const analysis = await client.copilot.genreAnalysis('track_123', 'electronic');
   * console.log('Genre suggestions:', analysis.data.suggestions);
   * ```
   */
  async genreAnalysis(trackId: string, targetGenre?: string) {
    this.validateRequired({ trackId }, ['trackId']);

    const response = await this.post('/genre-analysis', {
      trackId,
      targetGenre,
    });

    return this.extractData(response);
  }

  /**
   * Match music to target mood/emotion
   * 
   * @param trackId - ID of the track to analyze
   * @param targetMood - Target mood to match
   * @param adjustmentType - Type of adjustment to suggest
   * @returns Promise resolving to mood matching suggestions
   * 
   * @example
   * ```typescript
   * const moodMatch = await client.copilot.moodMatching(
   *   'track_123', 
   *   'energetic', 
   *   'arrangement'
   * );
   * ```
   */
  async moodMatching(
    trackId: string, 
    targetMood: string,
    adjustmentType: 'tempo' | 'key' | 'arrangement' | 'all' = 'all'
  ) {
    this.validateRequired({ trackId, targetMood }, ['trackId', 'targetMood']);

    const response = await this.post('/mood-matching', {
      trackId,
      targetMood,
      adjustmentType,
    });

    return this.extractData(response);
  }

  /**
   * Get collaboration suggestions for multi-artist projects
   * 
   * @param projectId - ID of the collaborative project
   * @param artistStyles - Array of artist styles to blend
   * @returns Promise resolving to collaboration suggestions
   * 
   * @example
   * ```typescript
   * const collaboration = await client.copilot.collaboration('project_123', [
   *   'hip-hop', 'electronic', 'jazz'
   * ]);
   * ```
   */
  async collaboration(projectId: string, artistStyles: string[]) {
    this.validateRequired({ projectId }, ['projectId']);

    const response = await this.post('/collaboration', {
      projectId,
      artistStyles,
    });

    return this.extractData(response);
  }

  /**
   * Generate variations of an existing composition
   * 
   * @param sourceId - ID of the source composition
   * @param variationType - Type of variation to generate
   * @param count - Number of variations to generate
   * @returns Promise resolving to generated variations
   * 
   * @example
   * ```typescript
   * const variations = await client.copilot.generateVariations(
   *   'melody_123', 
   *   'rhythmic', 
   *   3
   * );
   * ```
   */
  async generateVariations(
    sourceId: string,
    variationType: 'melodic' | 'rhythmic' | 'harmonic' | 'structural' = 'melodic',
    count: number = 3
  ) {
    this.validateRequired({ sourceId }, ['sourceId']);

    if (count < 1 || count > 10) {
      throw new Error('Count must be between 1 and 10');
    }

    const response = await this.post('/generate-variations', {
      sourceId,
      variationType,
      count,
    });

    return this.extractData(response);
  }

  /**
   * Get AI-powered mastering suggestions
   * 
   * @param trackId - ID of the track to analyze for mastering
   * @param targetPlatform - Target platform for optimization
   * @returns Promise resolving to mastering suggestions
   * 
   * @example
   * ```typescript
   * const mastering = await client.copilot.masteringSuggestions(
   *   'track_123', 
   *   'spotify'
   * );
   * ```
   */
  async masteringSuggestions(trackId: string, targetPlatform?: string) {
    this.validateRequired({ trackId }, ['trackId']);

    const response = await this.post('/mastering-suggestions', {
      trackId,
      targetPlatform,
    });

    return this.extractData(response);
  }
}