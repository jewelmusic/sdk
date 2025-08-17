import FormData from 'form-data';
import { BaseResource } from './base';
import {
  AnalysisOptions,
  AnalysisResult,
  QualityAnalysis,
  LoudnessAnalysis,
  SpectrumAnalysis,
  ChordAnalysis,
  StructureAnalysis,
  TempoAnalysis,
  KeyAnalysis,
  MoodAnalysis,
  GenreAnalysis,
  CulturalAnalysis,
} from '../types';

/**
 * Music Analysis Resource
 * 
 * Provides comprehensive music analysis and quality checking capabilities.
 * Includes audio quality assessment, musical structure analysis, cultural
 * compliance checking, and more.
 */
export class AnalysisResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/analysis');
  }

  /**
   * Upload a track for comprehensive analysis
   * 
   * @param file - Audio file to analyze
   * @param options - Analysis configuration options
   * @returns Promise resolving to analysis job information
   * 
   * @example
   * ```typescript
   * const analysis = await client.analysis.uploadTrack(audioFile, {
   *   analysisTypes: ['tempo', 'key', 'structure', 'quality'],
   *   detailedReport: true,
   *   culturalContext: 'georgian'
   * });
   * 
   * console.log('Analysis ID:', analysis.data.id);
   * ```
   */
  async uploadTrack(file: File | Buffer, options: AnalysisOptions = {}): Promise<AnalysisResult> {
    const response = await this.upload<AnalysisResult>('/upload', file, {
      analysisTypes: options.analysisTypes || ['tempo', 'key', 'structure', 'quality'],
      detailedReport: options.detailedReport || false,
      culturalContext: options.culturalContext,
      targetPlatforms: options.targetPlatforms || [],
    });

    return this.extractData(response);
  }

  /**
   * Get analysis results by ID
   * 
   * @param id - Analysis job ID
   * @returns Promise resolving to analysis results
   * 
   * @example
   * ```typescript
   * const results = await client.analysis.getAnalysis('analysis_123');
   * console.log('Analysis status:', results.data.status);
   * console.log('Results:', results.data.results);
   * ```
   */
  async getAnalysis(id: string): Promise<AnalysisResult> {
    this.validateRequired({ id }, ['id']);

    const response = await this.get<AnalysisResult>(`/${id}`);
    return this.extractData(response);
  }

  /**
   * Perform batch analysis of multiple tracks
   * 
   * @param files - Array of audio files to analyze
   * @param options - Analysis configuration options
   * @returns Promise resolving to batch analysis job information
   * 
   * @example
   * ```typescript
   * const batchAnalysis = await client.analysis.batchAnalysis([file1, file2, file3], {
   *   analysisTypes: ['quality', 'loudness'],
   *   culturalContext: 'western'
   * });
   * ```
   */
  async batchAnalysis(files: (File | Buffer)[], options: AnalysisOptions = {}) {
    if (!files || files.length === 0) {
      throw new Error('At least one file is required for batch analysis');
    }

    if (files.length > 50) {
      throw new Error('Batch analysis is limited to 50 files maximum');
    }

    // Create FormData for multiple files
    const formData = new FormData();
    
    files.forEach((file, index) => {
      if (file instanceof Buffer) {
        formData.append(`files`, file, { filename: `track_${index}.mp3` });
      } else {
        formData.append(`files`, file);
      }
    });

    // Add options
    formData.append('analysisTypes', JSON.stringify(options.analysisTypes || ['quality']));
    formData.append('detailedReport', String(options.detailedReport || false));
    if (options.culturalContext) {
      formData.append('culturalContext', options.culturalContext);
    }
    if (options.targetPlatforms) {
      formData.append('targetPlatforms', JSON.stringify(options.targetPlatforms));
    }

    const response = await this.post('/batch', formData);
    return this.extractData(response);
  }

  /**
   * Download detailed analysis report
   * 
   * @param id - Analysis job ID
   * @param format - Report format ('pdf', 'json', 'csv')
   * @returns Promise resolving to download URL or report data
   * 
   * @example
   * ```typescript
   * const reportUrl = await client.analysis.downloadReport('analysis_123', 'pdf');
   * console.log('Download report:', reportUrl.data.downloadUrl);
   * ```
   */
  async downloadReport(id: string, format: 'pdf' | 'json' | 'csv' = 'pdf') {
    this.validateRequired({ id }, ['id']);

    const response = await this.get(`/${id}/report`, { format });
    return this.extractData(response);
  }

  /**
   * Perform audio quality assessment
   * 
   * @param file - Audio file to assess
   * @param targetPlatforms - Target streaming platforms for optimization
   * @returns Promise resolving to quality analysis results
   * 
   * @example
   * ```typescript
   * const quality = await client.analysis.audioQualityCheck(audioFile, [
   *   'spotify', 'apple-music', 'youtube-music'
   * ]);
   * 
   * console.log('Overall quality score:', quality.data.overall);
   * console.log('Issues found:', quality.data.issues);
   * ```
   */
  async audioQualityCheck(file: File | Buffer, targetPlatforms: string[] = []): Promise<QualityAnalysis> {
    const response = await this.upload<QualityAnalysis>('/quality/audio-check', file, {
      targetPlatforms,
    });

    return this.extractData(response);
  }

  /**
   * Get mastering recommendations
   * 
   * @param file - Audio file to analyze for mastering
   * @param targetLoudness - Target loudness in LUFS
   * @param targetPlatform - Primary target platform
   * @returns Promise resolving to mastering suggestions
   * 
   * @example
   * ```typescript
   * const mastering = await client.analysis.masteringSuggestions(audioFile, -14, 'spotify');
   * console.log('Mastering recommendations:', mastering.data.recommendations);
   * ```
   */
  async masteringSuggestions(file: File | Buffer, targetLoudness?: number, targetPlatform?: string) {
    const response = await this.upload('/quality/mastering-suggestions', file, {
      targetLoudness,
      targetPlatform,
    });

    return this.extractData(response);
  }

  /**
   * Perform LUFS loudness analysis
   * 
   * @param file - Audio file to analyze
   * @param standards - Loudness standards to check against
   * @returns Promise resolving to loudness analysis results
   * 
   * @example
   * ```typescript
   * const loudness = await client.analysis.loudnessAnalysis(audioFile, [
   *   'spotify', 'apple-music', 'youtube', 'broadcast'
   * ]);
   * 
   * console.log('Integrated loudness:', loudness.data.integratedLoudness);
   * console.log('Platform compliance:', loudness.data.compliance);
   * ```
   */
  async loudnessAnalysis(file: File | Buffer, standards: string[] = []): Promise<LoudnessAnalysis> {
    const response = await this.upload<LoudnessAnalysis>('/quality/loudness-analysis', file, {
      standards,
    });

    return this.extractData(response);
  }

  /**
   * Perform frequency spectrum analysis
   * 
   * @param file - Audio file to analyze
   * @param resolution - Frequency resolution ('low', 'medium', 'high')
   * @returns Promise resolving to spectrum analysis results
   * 
   * @example
   * ```typescript
   * const spectrum = await client.analysis.spectrumAnalysis(audioFile, 'high');
   * console.log('Frequency bands:', spectrum.data.frequencyBands);
   * console.log('Spectral centroid:', spectrum.data.spectralCentroid);
   * ```
   */
  async spectrumAnalysis(file: File | Buffer, resolution: 'low' | 'medium' | 'high' = 'medium'): Promise<SpectrumAnalysis> {
    const response = await this.upload<SpectrumAnalysis>('/quality/spectrum-analysis', file, {
      resolution,
    });

    return this.extractData(response);
  }

  /**
   * Check cultural and regional compliance
   * 
   * @param file - Audio file to check
   * @param region - Target region for compliance checking
   * @param culturalContext - Specific cultural context
   * @returns Promise resolving to cultural compliance results
   * 
   * @example
   * ```typescript
   * const compliance = await client.analysis.culturalCompliance(
   *   audioFile, 
   *   'georgia', 
   *   'traditional-polyphonic'
   * );
   * 
   * console.log('Cultural classification:', compliance.data.primary);
   * console.log('Traditional elements:', compliance.data.traditionalElements);
   * ```
   */
  async culturalCompliance(file: File | Buffer, region: string, culturalContext?: string): Promise<CulturalAnalysis> {
    this.validateRequired({ region }, ['region']);

    const response = await this.upload<CulturalAnalysis>('/quality/cultural-compliance', file, {
      region,
      culturalContext,
    });

    return this.extractData(response);
  }

  /**
   * Detect song structure (verse, chorus, bridge, etc.)
   * 
   * @param file - Audio file to analyze
   * @param confidence - Minimum confidence threshold (0-1)
   * @returns Promise resolving to structure analysis results
   * 
   * @example
   * ```typescript
   * const structure = await client.analysis.detectStructure(audioFile, 0.8);
   * console.log('Song sections:', structure.data.sections);
   * console.log('Song form:', structure.data.form);
   * ```
   */
  async detectStructure(file: File | Buffer, confidence: number = 0.7): Promise<StructureAnalysis> {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }

    const response = await this.upload<StructureAnalysis>('/structure/detect', file, {
      confidence,
    });

    return this.extractData(response);
  }

  /**
   * Detect musical key
   * 
   * @param file - Audio file to analyze
   * @param algorithm - Key detection algorithm ('krumhansl', 'temperley', 'edma')
   * @returns Promise resolving to key analysis results
   * 
   * @example
   * ```typescript
   * const key = await client.analysis.detectKey(audioFile, 'krumhansl');
   * console.log('Detected key:', key.data.key);
   * console.log('Mode:', key.data.mode);
   * console.log('Confidence:', key.data.confidence);
   * ```
   */
  async detectKey(file: File | Buffer, algorithm: 'krumhansl' | 'temperley' | 'edma' = 'krumhansl'): Promise<KeyAnalysis> {
    const response = await this.upload<KeyAnalysis>('/structure/key-detection', file, {
      algorithm,
    });

    return this.extractData(response);
  }

  /**
   * Analyze tempo and BPM
   * 
   * @param file - Audio file to analyze
   * @param detectVariations - Whether to detect tempo variations
   * @returns Promise resolving to tempo analysis results
   * 
   * @example
   * ```typescript
   * const tempo = await client.analysis.tempoAnalysis(audioFile, true);
   * console.log('BPM:', tempo.data.bpm);
   * console.log('Tempo variations:', tempo.data.variations);
   * console.log('Stability:', tempo.data.stability);
   * ```
   */
  async tempoAnalysis(file: File | Buffer, detectVariations: boolean = true): Promise<TempoAnalysis> {
    const response = await this.upload<TempoAnalysis>('/structure/tempo-analysis', file, {
      detectVariations,
    });

    return this.extractData(response);
  }

  /**
   * Detect chord progressions
   * 
   * @param file - Audio file to analyze
   * @param includeInversions - Whether to include chord inversions
   * @param complexityLevel - Analysis complexity ('basic', 'intermediate', 'advanced')
   * @returns Promise resolving to chord analysis results
   * 
   * @example
   * ```typescript
   * const chords = await client.analysis.chordDetection(audioFile, true, 'advanced');
   * console.log('Chord progressions:', chords.data.progressions);
   * console.log('Key context:', chords.data.key);
   * ```
   */
  async chordDetection(
    file: File | Buffer, 
    includeInversions: boolean = false,
    complexityLevel: 'basic' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<ChordAnalysis> {
    const response = await this.upload<ChordAnalysis>('/structure/chord-detection', file, {
      includeInversions,
      complexityLevel,
    });

    return this.extractData(response);
  }

  /**
   * Analyze mood and emotional content
   * 
   * @param file - Audio file to analyze
   * @param includeValenceArousal - Whether to include valence-arousal analysis
   * @returns Promise resolving to mood analysis results
   * 
   * @example
   * ```typescript
   * const mood = await client.analysis.moodAnalysis(audioFile, true);
   * console.log('Primary mood:', mood.data.primary);
   * console.log('Valence:', mood.data.valence);
   * console.log('Arousal:', mood.data.arousal);
   * ```
   */
  async moodAnalysis(file: File | Buffer, includeValenceArousal: boolean = true): Promise<MoodAnalysis> {
    const response = await this.upload<MoodAnalysis>('/mood-analysis', file, {
      includeValenceArousal,
    });

    return this.extractData(response);
  }

  /**
   * Analyze and classify genre
   * 
   * @param file - Audio file to analyze
   * @param includeCrossover - Whether to analyze crossover potential
   * @param culturalContext - Cultural context for genre classification
   * @returns Promise resolving to genre analysis results
   * 
   * @example
   * ```typescript
   * const genre = await client.analysis.genreAnalysis(audioFile, true, 'western');
   * console.log('Primary genre:', genre.data.primary);
   * console.log('Subgenres:', genre.data.subgenres);
   * console.log('Crossover potential:', genre.data.crossoverPotential);
   * ```
   */
  async genreAnalysis(
    file: File | Buffer, 
    includeCrossover: boolean = false,
    culturalContext?: string
  ): Promise<GenreAnalysis> {
    const response = await this.upload<GenreAnalysis>('/genre-analysis', file, {
      includeCrossover,
      culturalContext,
    });

    return this.extractData(response);
  }

  /**
   * Wait for analysis completion
   * 
   * @param analysisId - Analysis job ID
   * @param pollInterval - Polling interval in milliseconds
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise resolving when analysis is complete
   * 
   * @example
   * ```typescript
   * const analysis = await client.analysis.uploadTrack(audioFile);
   * const completed = await client.analysis.waitForCompletion(analysis.data.id);
   * console.log('Analysis completed:', completed.data.results);
   * ```
   */
  async waitForCompletion(
    analysisId: string,
    pollInterval: number = 5000,
    timeout: number = 600000
  ): Promise<AnalysisResult> {
    return this.pollForCompletion(
      () => analysisId,
      (id) => this.getAnalysis(id),
      (result) => result.status === 'completed' || result.status === 'failed',
      pollInterval,
      timeout
    );
  }

  /**
   * Get analysis status for multiple jobs
   * 
   * @param analysisIds - Array of analysis job IDs
   * @returns Promise resolving to status information for all jobs
   * 
   * @example
   * ```typescript
   * const statuses = await client.analysis.getBatchStatus([
   *   'analysis_1', 'analysis_2', 'analysis_3'
   * ]);
   * ```
   */
  async getBatchStatus(analysisIds: string[]) {
    this.validateRequired({ analysisIds }, ['analysisIds']);

    if (analysisIds.length === 0) {
      throw new Error('At least one analysis ID is required');
    }

    const response = await this.post('/batch/status', {
      analysisIds,
    });

    return this.extractData(response);
  }

  /**
   * Cancel a running analysis job
   * 
   * @param analysisId - Analysis job ID to cancel
   * @returns Promise resolving to cancellation confirmation
   * 
   * @example
   * ```typescript
   * await client.analysis.cancelAnalysis('analysis_123');
   * console.log('Analysis cancelled');
   * ```
   */
  async cancelAnalysis(analysisId: string) {
    this.validateRequired({ analysisId }, ['analysisId']);

    const response = await this.delete(`/${analysisId}`);
    return this.extractData(response);
  }
}