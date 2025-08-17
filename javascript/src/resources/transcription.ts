import { BaseResource } from './base';
import {
  TranscriptionOptions,
  Transcription,
  TranscriptionResult,
  DownloadUrls,
} from '../types';

/**
 * Transcription Resource
 * 
 * Provides AI-powered transcription and lyrics processing capabilities.
 * Supports 150+ languages with high accuracy, timestamps, speaker
 * diarization, and cultural context understanding.
 */
export class TranscriptionResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/transcription');
  }

  /**
   * Create a new transcription job
   * 
   * @param trackId - ID of the track to transcribe (optional if providing file)
   * @param file - Audio file to transcribe (optional if providing trackId)
   * @param options - Transcription configuration options
   * @returns Promise resolving to transcription job information
   * 
   * @example
   * ```typescript
   * // Transcribe an already uploaded track
   * const transcription = await client.transcription.create('track_123', null, {
   *   languages: ['en', 'ka', 'es'],
   *   includeTimestamps: true,
   *   speakerDiarization: true,
   *   model: 'cultural'
   * });
   * 
   * // Or transcribe a new file directly
   * const transcription = await client.transcription.create(null, audioFile, {
   *   languages: ['en'],
   *   wordLevelTimestamps: true
   * });
   * ```
   */
  async create(
    trackId?: string | null,
    file?: File | Buffer | null,
    options: TranscriptionOptions = {}
  ): Promise<Transcription> {
    if (!trackId && !file) {
      throw new Error('Either trackId or file must be provided');
    }

    if (trackId && file) {
      throw new Error('Provide either trackId or file, not both');
    }

    const requestData = {
      trackId,
      languages: options.languages || ['en'],
      includeTimestamps: options.includeTimestamps !== false,
      wordLevelTimestamps: options.wordLevelTimestamps || false,
      speakerDiarization: options.speakerDiarization || false,
      punctuation: options.punctuation !== false,
      profanityFilter: options.profanityFilter || false,
      customVocabulary: options.customVocabulary || [],
      boostPhrases: options.boostPhrases || [],
      model: options.model || 'standard',
    };

    let response;
    if (file) {
      response = await this.upload<Transcription>('/create', file, requestData);
    } else {
      response = await this.post<Transcription>('/create', requestData);
    }

    return this.extractData(response);
  }

  /**
   * Get transcription status and results
   * 
   * @param id - Transcription job ID
   * @returns Promise resolving to transcription details
   * 
   * @example
   * ```typescript
   * const transcription = await client.transcription.getStatus('transcription_123');
   * 
   * console.log('Status:', transcription.data.status);
   * if (transcription.data.status === 'completed') {
   *   console.log('Results:', transcription.data.results);
   * }
   * ```
   */
  async getStatus(id: string): Promise<Transcription> {
    this.validateRequired({ id }, ['id']);

    const response = await this.get<Transcription>(`/${id}`);
    return this.extractData(response);
  }

  /**
   * Download transcription in various formats
   * 
   * @param id - Transcription job ID
   * @param format - Output format ('json', 'srt', 'vtt', 'txt', 'ass')
   * @param language - Specific language to download (optional)
   * @returns Promise resolving to download URL or content
   * 
   * @example
   * ```typescript
   * // Download SRT subtitle file
   * const srtUrl = await client.transcription.download('transcription_123', 'srt', 'en');
   * console.log('Download SRT:', srtUrl.data.downloadUrl);
   * 
   * // Download JSON with all data
   * const jsonData = await client.transcription.download('transcription_123', 'json');
   * console.log('Transcription data:', jsonData.data);
   * ```
   */
  async download(
    id: string,
    format: 'json' | 'srt' | 'vtt' | 'txt' | 'ass' = 'json',
    language?: string
  ) {
    this.validateRequired({ id }, ['id']);

    const response = await this.get(`/${id}/download`, {
      format,
      language,
    });

    return this.extractData(response);
  }

  /**
   * Translate existing transcription to other languages
   * 
   * @param id - Transcription job ID
   * @param targetLanguages - Array of target language codes
   * @param preserveTimestamps - Whether to preserve original timestamps
   * @returns Promise resolving to translation job information
   * 
   * @example
   * ```typescript
   * const translation = await client.transcription.translate(
   *   'transcription_123',
   *   ['es', 'fr', 'de'],
   *   true
   * );
   * 
   * console.log('Translation job:', translation.data.translationId);
   * ```
   */
  async translate(
    id: string,
    targetLanguages: string[],
    preserveTimestamps: boolean = true
  ) {
    this.validateRequired({ id, targetLanguages }, ['id', 'targetLanguages']);

    if (targetLanguages.length === 0) {
      throw new Error('At least one target language is required');
    }

    const response = await this.post(`/${id}/translate`, {
      targetLanguages,
      preserveTimestamps,
    });

    return this.extractData(response);
  }

  /**
   * Sync lyrics with audio timing
   * 
   * @param transcriptionId - Transcription job ID
   * @param audioFile - Audio file for timing synchronization
   * @param options - Synchronization options
   * @returns Promise resolving to synchronized transcription
   * 
   * @example
   * ```typescript
   * const synced = await client.transcription.syncLyrics(
   *   'transcription_123',
   *   audioFile,
   *   { 
   *     adjustmentThreshold: 0.1,
   *     manualAdjustments: [
   *       { wordIndex: 10, newTimestamp: 15.5 }
   *     ]
   *   }
   * );
   * ```
   */
  async syncLyrics(
    transcriptionId: string,
    audioFile: File | Buffer,
    options: {
      adjustmentThreshold?: number;
      manualAdjustments?: Array<{ wordIndex: number; newTimestamp: number }>;
      forceRealign?: boolean;
    } = {}
  ) {
    this.validateRequired({ transcriptionId }, ['transcriptionId']);

    const response = await this.upload(`/${transcriptionId}/sync`, audioFile, {
      adjustmentThreshold: options.adjustmentThreshold || 0.1,
      manualAdjustments: options.manualAdjustments || [],
      forceRealign: options.forceRealign || false,
    });

    return this.extractData(response);
  }

  /**
   * Enhance existing lyrics with AI improvements
   * 
   * @param lyrics - Original lyrics text or transcription ID
   * @param options - Enhancement options
   * @returns Promise resolving to enhanced lyrics
   * 
   * @example
   * ```typescript
   * const enhanced = await client.transcription.enhanceLyrics(
   *   'Original lyrics text here...',
   *   {
   *     improveGrammar: true,
   *     enhanceRhyming: true,
   *     maintainMeaning: true,
   *     style: 'contemporary'
   *   }
   * );
   * 
   * console.log('Enhanced lyrics:', enhanced.data.enhancedLyrics);
   * ```
   */
  async enhanceLyrics(
    lyrics: string,
    options: {
      improveGrammar?: boolean;
      enhanceRhyming?: boolean;
      maintainMeaning?: boolean;
      style?: string;
      targetLanguage?: string;
      preserveStructure?: boolean;
    } = {}
  ) {
    this.validateRequired({ lyrics }, ['lyrics']);

    const response = await this.post('/enhance-lyrics', {
      lyrics,
      improveGrammar: options.improveGrammar !== false,
      enhanceRhyming: options.enhanceRhyming || false,
      maintainMeaning: options.maintainMeaning !== false,
      style: options.style,
      targetLanguage: options.targetLanguage,
      preserveStructure: options.preserveStructure !== false,
    });

    return this.extractData(response);
  }

  /**
   * Analyze rhyme scheme in lyrics
   * 
   * @param lyrics - Lyrics text to analyze
   * @param language - Language of the lyrics
   * @returns Promise resolving to rhyme scheme analysis
   * 
   * @example
   * ```typescript
   * const rhymeAnalysis = await client.transcription.checkRhymeScheme(
   *   `Verse 1:
   *    Line that ends with word A
   *    Line that ends with word B
   *    Line that ends with word A
   *    Line that ends with word B`,
   *   'en'
   * );
   * 
   * console.log('Rhyme scheme:', rhymeAnalysis.data.scheme); // 'ABAB'
   * console.log('Rhyme quality:', rhymeAnalysis.data.quality);
   * ```
   */
  async checkRhymeScheme(lyrics: string, language: string = 'en') {
    this.validateRequired({ lyrics }, ['lyrics']);

    const response = await this.post('/rhyme-check', {
      lyrics,
      language,
    });

    return this.extractData(response);
  }

  /**
   * Analyze sentiment and mood of lyrics
   * 
   * @param lyrics - Lyrics text to analyze
   * @param language - Language of the lyrics
   * @param includeEmotions - Whether to include detailed emotion analysis
   * @returns Promise resolving to sentiment analysis
   * 
   * @example
   * ```typescript
   * const sentiment = await client.transcription.analyzeSentiment(
   *   'Lyrics about love and happiness...',
   *   'en',
   *   true
   * );
   * 
   * console.log('Overall sentiment:', sentiment.data.overall);
   * console.log('Emotions detected:', sentiment.data.emotions);
   * console.log('Mood:', sentiment.data.mood);
   * ```
   */
  async analyzeSentiment(
    lyrics: string,
    language: string = 'en',
    includeEmotions: boolean = false
  ) {
    this.validateRequired({ lyrics }, ['lyrics']);

    const response = await this.post('/sentiment', {
      lyrics,
      language,
      includeEmotions,
    });

    return this.extractData(response);
  }

  /**
   * Check language quality and grammar
   * 
   * @param lyrics - Lyrics text to check
   * @param language - Expected language of the lyrics
   * @param strictMode - Whether to use strict grammar checking
   * @returns Promise resolving to language quality assessment
   * 
   * @example
   * ```typescript
   * const quality = await client.transcription.checkLanguageQuality(
   *   'Lyrics with potential grammar issues...',
   *   'en',
   *   true
   * );
   * 
   * console.log('Grammar score:', quality.data.grammarScore);
   * console.log('Issues found:', quality.data.issues);
   * console.log('Suggestions:', quality.data.suggestions);
   * ```
   */
  async checkLanguageQuality(
    lyrics: string,
    language: string,
    strictMode: boolean = false
  ) {
    this.validateRequired({ lyrics, language }, ['lyrics', 'language']);

    const response = await this.post('/language-check', {
      lyrics,
      language,
      strictMode,
    });

    return this.extractData(response);
  }

  /**
   * Wait for transcription completion
   * 
   * @param transcriptionId - Transcription job ID
   * @param pollInterval - Polling interval in milliseconds
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise resolving when transcription is complete
   * 
   * @example
   * ```typescript
   * const transcription = await client.transcription.create('track_123');
   * const completed = await client.transcription.waitForCompletion(
   *   transcription.data.id
   * );
   * 
   * console.log('Transcription completed:', completed.data.results);
   * ```
   */
  async waitForCompletion(
    transcriptionId: string,
    pollInterval: number = 5000,
    timeout: number = 600000
  ): Promise<Transcription> {
    return this.pollForCompletion(
      () => transcriptionId,
      (id) => this.getStatus(id),
      (transcription) => transcription.status === 'completed' || transcription.status === 'failed',
      pollInterval,
      timeout
    );
  }

  /**
   * Get transcription accuracy metrics
   * 
   * @param id - Transcription job ID
   * @param referenceText - Reference text for accuracy comparison (optional)
   * @returns Promise resolving to accuracy metrics
   * 
   * @example
   * ```typescript
   * const accuracy = await client.transcription.getAccuracyMetrics(
   *   'transcription_123',
   *   'Known correct transcription text...'
   * );
   * 
   * console.log('Word accuracy:', accuracy.data.wordAccuracy);
   * console.log('Character accuracy:', accuracy.data.characterAccuracy);
   * ```
   */
  async getAccuracyMetrics(id: string, referenceText?: string) {
    this.validateRequired({ id }, ['id']);

    const response = await this.post(`/${id}/accuracy`, {
      referenceText,
    });

    return this.extractData(response);
  }

  /**
   * Export transcription to external formats
   * 
   * @param id - Transcription job ID
   * @param exportFormat - Export format and destination
   * @returns Promise resolving to export information
   * 
   * @example
   * ```typescript
   * const exported = await client.transcription.exportTo('transcription_123', {
   *   format: 'youtube',
   *   includeTranslations: true,
   *   videoId: 'youtube_video_id'
   * });
   * ```
   */
  async exportTo(
    id: string,
    exportFormat: {
      format: 'youtube' | 'vimeo' | 'spotify' | 'genius' | 'musicbrainz';
      includeTranslations?: boolean;
      videoId?: string;
      credentials?: Record<string, string>;
    }
  ) {
    this.validateRequired({ id, exportFormat }, ['id', 'exportFormat']);

    const response = await this.post(`/${id}/export`, exportFormat);
    return this.extractData(response);
  }

  /**
   * Get supported languages for transcription
   * 
   * @param model - Transcription model to check ('standard', 'premium', 'cultural')
   * @returns Promise resolving to supported languages list
   * 
   * @example
   * ```typescript
   * const languages = await client.transcription.getSupportedLanguages('cultural');
   * console.log('Supported languages:', languages.data.languages);
   * console.log('Cultural variants:', languages.data.culturalVariants);
   * ```
   */
  async getSupportedLanguages(model: 'standard' | 'premium' | 'cultural' = 'standard') {
    const response = await this.get('/supported-languages', { model });
    return this.extractData(response);
  }

  /**
   * Cancel a running transcription job
   * 
   * @param id - Transcription job ID
   * @returns Promise resolving to cancellation confirmation
   * 
   * @example
   * ```typescript
   * await client.transcription.cancel('transcription_123');
   * console.log('Transcription cancelled');
   * ```
   */
  async cancel(id: string) {
    this.validateRequired({ id }, ['id']);

    const response = await this.delete(`/${id}`);
    return this.extractData(response);
  }
}