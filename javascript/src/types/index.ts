// Core SDK Types

export interface JewelMusicConfig {
  /** Your JewelMusic API key */
  apiKey: string;
  /** API environment */
  environment?: 'production' | 'sandbox';
  /** API version */
  apiVersion?: string;
  /** Base API URL (auto-determined from environment if not provided) */
  baseUrl?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial retry delay in milliseconds */
  retryDelay?: number;
  /** Custom HTTP agent */
  httpAgent?: any;
  /** Custom HTTPS agent */
  httpsAgent?: any;
  /** Proxy configuration */
  proxy?: ProxyConfig;
  /** Custom logger instance */
  logger?: Logger;
  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Custom user agent */
  userAgent?: string;
  /** Request/response hooks */
  hooks?: {
    onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
    onResponse?: (response: ApiResponse<any>) => ApiResponse<any> | Promise<ApiResponse<any>>;
    onError?: (error: JewelMusicError) => void | Promise<void>;
  };
}

export interface ProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
}

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
    rateLimit: {
      limit: number;
      remaining: number;
      reset: number;
    };
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    requestId: string;
  };
}

// Track and Media Types

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
  fileSize?: number;
  format?: string;
  sampleRate?: number;
  bitRate?: number;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  downloadUrl?: string;
  waveformUrl?: string;
  metadata?: TrackMetadata;
}

export interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  albumArtist?: string;
  genre?: string;
  year?: number;
  trackNumber?: number;
  totalTracks?: number;
  discNumber?: number;
  totalDiscs?: number;
  composer?: string;
  lyricist?: string;
  producer?: string;
  label?: string;
  copyright?: string;
  isrc?: string;
  releaseDate?: string;
  language?: string;
  explicit?: boolean;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface TrackUploadOptions {
  file: File | Buffer | ReadableStream;
  metadata: TrackMetadata;
  artwork?: File | Buffer;
  chunkSize?: number;
  onProgress?: (progress: UploadProgress) => void;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  phase: 'uploading' | 'processing' | 'complete';
}

// AI Copilot Types

export interface CopilotGenerationOptions {
  style?: string;
  genre?: string;
  mood?: string;
  tempo?: number;
  key?: string;
  timeSignature?: string;
  length?: number;
  instruments?: string[];
  referenceTrack?: string;
  creativity?: number; // 0-1
  seed?: number;
}

export interface MelodyGenerationResult {
  id: string;
  melody: MelodyData;
  midiUrl?: string;
  audioPreviewUrl?: string;
  confidence: number;
  alternatives?: MelodyData[];
}

export interface MelodyData {
  notes: Note[];
  key: string;
  timeSignature: string;
  tempo: number;
}

export interface Note {
  pitch: string;
  octave: number;
  start: number;
  duration: number;
  velocity: number;
}

export interface LyricsGenerationOptions {
  theme?: string;
  mood?: string;
  genre?: string;
  language?: string;
  rhymeScheme?: string;
  verseCount?: number;
  chorusCount?: number;
  bridgeCount?: number;
  wordsPerLine?: number;
  explicitContent?: boolean;
  keywords?: string[];
  referenceArtists?: string[];
}

export interface LyricsGenerationResult {
  id: string;
  lyrics: LyricsData;
  alternatives?: LyricsData[];
  confidence: number;
  structure: SongStructure;
}

export interface LyricsData {
  sections: LyricsSection[];
  language: string;
  rhymeScheme: string;
  theme: string;
  mood: string;
}

export interface LyricsSection {
  type: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro' | 'intro';
  number: number;
  lines: string[];
  timestamp?: number;
}

export interface SongStructure {
  sections: StructureSection[];
  totalDuration?: number;
}

export interface StructureSection {
  type: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

// Analysis Types

export interface AnalysisOptions {
  analysisTypes?: AnalysisType[];
  detailedReport?: boolean;
  culturalContext?: string;
  targetPlatforms?: string[];
}

export type AnalysisType = 
  | 'tempo'
  | 'key'
  | 'structure'
  | 'mood'
  | 'genre'
  | 'cultural'
  | 'quality'
  | 'loudness'
  | 'spectrum'
  | 'chords';

export interface AnalysisResult {
  id: string;
  trackId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: {
    tempo?: TempoAnalysis;
    key?: KeyAnalysis;
    structure?: StructureAnalysis;
    mood?: MoodAnalysis;
    genre?: GenreAnalysis;
    cultural?: CulturalAnalysis;
    quality?: QualityAnalysis;
    loudness?: LoudnessAnalysis;
    spectrum?: SpectrumAnalysis;
    chords?: ChordAnalysis;
  };
  confidence: number;
  processingTime?: number;
  reportUrl?: string;
}

export interface TempoAnalysis {
  bpm: number;
  confidence: number;
  variations: TempoVariation[];
  stability: number;
}

export interface TempoVariation {
  start: number;
  end: number;
  bpm: number;
}

export interface KeyAnalysis {
  key: string;
  mode: 'major' | 'minor';
  confidence: number;
  alternativeKeys?: { key: string; confidence: number }[];
}

export interface StructureAnalysis {
  sections: StructureSection[];
  form: string;
  confidence: number;
}

export interface MoodAnalysis {
  primary: string;
  secondary?: string;
  valence: number; // -1 to 1
  arousal: number; // 0 to 1
  dominance: number; // 0 to 1
  confidence: number;
}

export interface GenreAnalysis {
  primary: string;
  secondary?: string;
  confidence: number;
  subgenres?: string[];
  crossoverPotential?: { genre: string; probability: number }[];
}

export interface CulturalAnalysis {
  primary: string;
  confidence: number;
  characteristics: string[];
  traditionalElements?: string[];
  modernInfluences?: string[];
}

export interface QualityAnalysis {
  overall: number; // 0-10
  audioQuality: number;
  mixQuality: number;
  masteringQuality: number;
  issues?: QualityIssue[];
  recommendations?: string[];
}

export interface QualityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp?: number;
}

export interface LoudnessAnalysis {
  integratedLoudness: number; // LUFS
  truePeak: number; // dBTP
  loudnessRange: number; // LU
  momentaryLoudness: number[];
  shortTermLoudness: number[];
  compliance: PlatformCompliance[];
}

export interface PlatformCompliance {
  platform: string;
  compliant: boolean;
  targetLoudness: number;
  currentLoudness: number;
  adjustment?: number;
}

export interface SpectrumAnalysis {
  frequencyBands: FrequencyBand[];
  spectralCentroid: number;
  spectralRolloff: number;
  spectralFlux: number;
  mfcc: number[];
}

export interface FrequencyBand {
  frequency: number;
  magnitude: number;
  phase: number;
}

export interface ChordAnalysis {
  progressions: ChordProgression[];
  key: string;
  complexity: number;
  commonProgressions?: string[];
}

export interface ChordProgression {
  chords: Chord[];
  start: number;
  end: number;
  confidence: number;
}

export interface Chord {
  root: string;
  quality: string;
  extensions?: string[];
  bass?: string;
  start: number;
  duration: number;
  confidence: number;
}

// Distribution Types

export interface Release {
  id: string;
  type: 'single' | 'ep' | 'album' | 'compilation';
  title: string;
  artist: string;
  tracks: string[];
  artwork?: string;
  releaseDate: string;
  label?: string;
  copyright: Copyright;
  territories: string[];
  platforms: string[];
  status: ReleaseStatus;
  distributionStatus?: DistributionStatus[];
  metadata?: ReleaseMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Copyright {
  text: string;
  year: number;
  owner?: string;
}

export type ReleaseStatus = 
  | 'draft'
  | 'scheduled'
  | 'submitted'
  | 'processing'
  | 'live'
  | 'failed'
  | 'cancelled';

export interface DistributionStatus {
  platform: string;
  status: 'pending' | 'processing' | 'live' | 'failed' | 'rejected';
  liveDate?: string;
  storeUrl?: string;
  error?: string;
}

export interface ReleaseMetadata {
  genre: string;
  subgenre?: string;
  mood?: string;
  language: string;
  explicit: boolean;
  previewStart?: number;
  previewDuration?: number;
  tags?: string[];
  description?: string;
}

export interface CreateReleaseOptions {
  type: Release['type'];
  title: string;
  artist: string;
  tracks: string[];
  releaseDate: string;
  territories?: string[];
  platforms?: string[];
  artwork?: File | Buffer | string;
  label?: string;
  copyright?: Copyright;
  metadata?: ReleaseMetadata;
  schedule?: boolean;
}

export interface UpdateReleaseOptions {
  title?: string;
  artist?: string;
  releaseDate?: string;
  territories?: string[];
  platforms?: string[];
  metadata?: Partial<ReleaseMetadata>;
}

// Transcription Types

export interface TranscriptionOptions {
  languages?: string[];
  includeTimestamps?: boolean;
  wordLevelTimestamps?: boolean;
  speakerDiarization?: boolean;
  punctuation?: boolean;
  profanityFilter?: boolean;
  customVocabulary?: string[];
  boostPhrases?: string[];
  model?: 'standard' | 'premium' | 'cultural';
}

export interface Transcription {
  id: string;
  trackId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  languages: string[];
  options: TranscriptionOptions;
  results?: TranscriptionResult[];
  confidence: number;
  processingTime?: number;
  downloadUrls?: DownloadUrls;
  createdAt: string;
  completedAt?: string;
}

export interface TranscriptionResult {
  language: string;
  text: string;
  confidence: number;
  segments?: TranscriptionSegment[];
  words?: TranscriptionWord[];
  speakers?: Speaker[];
}

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  confidence: number;
  speaker?: string;
}

export interface TranscriptionWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: string;
}

export interface Speaker {
  id: string;
  name?: string;
  confidence: number;
  segments: number[];
}

export interface DownloadUrls {
  json?: string;
  srt?: string;
  vtt?: string;
  txt?: string;
  ass?: string;
}

// Analytics and Royalties Types

export interface AnalyticsQuery {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month' | 'platform' | 'territory' | 'track';
  platforms?: string[];
  territories?: string[];
  tracks?: string[];
  metrics?: AnalyticsMetric[];
}

export type AnalyticsMetric = 
  | 'streams'
  | 'listeners'
  | 'revenue'
  | 'plays'
  | 'skips'
  | 'saves'
  | 'shares';

export interface AnalyticsData {
  query: AnalyticsQuery;
  data: AnalyticsDataPoint[];
  summary: AnalyticsSummary;
  generated: string;
}

export interface AnalyticsDataPoint {
  date?: string;
  platform?: string;
  territory?: string;
  track?: string;
  metrics: Record<AnalyticsMetric, number>;
}

export interface AnalyticsSummary {
  totalStreams: number;
  totalListeners: number;
  totalRevenue: number;
  topPlatform: string;
  topTerritory: string;
  topTrack: string;
}

export interface RoyaltyReport {
  id: string;
  period: {
    start: string;
    end: string;
  };
  totalRevenue: number;
  currency: string;
  breakdown: RoyaltyBreakdown[];
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  paymentDate?: string;
  downloadUrl?: string;
  generatedAt: string;
}

export interface RoyaltyBreakdown {
  platform: string;
  streams: number;
  revenue: number;
  rate: number;
  territory?: string;
  trackBreakdown?: TrackRoyalty[];
}

export interface TrackRoyalty {
  trackId: string;
  title: string;
  artist: string;
  streams: number;
  revenue: number;
}

// Webhook Types

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  createdAt: string;
  lastTriggered?: string;
  deliveryAttempts?: number;
  successfulDeliveries?: number;
}

export type WebhookEvent = 
  | 'track.uploaded'
  | 'track.processed'
  | 'track.failed'
  | 'release.created'
  | 'release.live'
  | 'release.failed'
  | 'transcription.completed'
  | 'analysis.completed'
  | 'royalty.reported'
  | 'payment.processed';

export interface WebhookPayload {
  id: string;
  event: WebhookEvent;
  created: string;
  data: any;
  livemode: boolean;
}

export interface CreateWebhookOptions {
  url: string;
  events: WebhookEvent[];
  secret?: string;
}

// Error Types

export abstract class JewelMusicError extends Error {
  abstract readonly code: string;
  readonly requestId?: string;

  constructor(message: string, requestId?: string) {
    super(message);
    this.name = this.constructor.name;
    this.requestId = requestId;
  }
}

export class AuthenticationError extends JewelMusicError {
  readonly code = 'AUTHENTICATION_ERROR';
}

export class AuthorizationError extends JewelMusicError {
  readonly code = 'AUTHORIZATION_ERROR';
}

export class ValidationError extends JewelMusicError {
  readonly code = 'VALIDATION_ERROR';
  readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>, requestId?: string) {
    super(message, requestId);
    this.errors = errors;
  }
}

export class NotFoundError extends JewelMusicError {
  readonly code = 'NOT_FOUND_ERROR';
}

export class RateLimitError extends JewelMusicError {
  readonly code = 'RATE_LIMIT_ERROR';
  readonly retryAfter: number;

  constructor(message: string, retryAfter: number, requestId?: string) {
    super(message, requestId);
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends JewelMusicError {
  readonly code = 'SERVER_ERROR';
}

export class NetworkError extends JewelMusicError {
  readonly code = 'NETWORK_ERROR';
}

export class UnknownError extends JewelMusicError {
  readonly code = 'UNKNOWN_ERROR';
}