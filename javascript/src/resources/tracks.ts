import { BaseResource, ListResponse, QueryParams } from './base';
import {
  Track,
  TrackUploadOptions,
  TrackMetadata,
  UploadProgress,
} from '../types';

/**
 * Tracks Resource
 * 
 * Manages track upload, metadata, processing, and organization.
 * Supports various audio formats, batch operations, and provides
 * detailed tracking of upload and processing status.
 */
export class TracksResource extends BaseResource {
  constructor(httpClient: any) {
    super(httpClient, '/tracks');
  }

  /**
   * Upload a single track with metadata
   * 
   * @param file - Audio file to upload
   * @param metadata - Track metadata
   * @param options - Upload options
   * @returns Promise resolving to uploaded track information
   * 
   * @example
   * ```typescript
   * const track = await client.tracks.upload(audioFile, {
   *   title: 'My Song',
   *   artist: 'Artist Name',
   *   album: 'Album Name',
   *   genre: 'Electronic',
   *   releaseDate: '2025-09-01'
   * }, {
   *   onProgress: (progress) => {
   *     console.log(`Upload progress: ${progress.percentage}%`);
   *   }
   * });
   * 
   * console.log('Track uploaded:', track.data.id);
   * ```
   */
  async upload(
    file: File | Buffer,
    metadata: TrackMetadata,
    options: Partial<TrackUploadOptions> = {}
  ): Promise<Track> {
    this.validateRequired(metadata, ['title', 'artist']);

    // Validate file size (example: 500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    const fileSize = file instanceof Buffer ? file.length : file.size;
    
    if (fileSize > maxSize) {
      throw new Error(`File size (${this.formatFileSize(fileSize)}) exceeds maximum allowed size (${this.formatFileSize(maxSize)})`);
    }

    const uploadData = {
      ...metadata,
      chunkSize: options.chunkSize || 1024 * 1024, // 1MB chunks
    };

    // Handle artwork upload if provided
    if (options.artwork) {
      uploadData.hasArtwork = true;
    }

    let response;
    
    if (fileSize > 10 * 1024 * 1024) { // Files larger than 10MB use chunked upload
      response = await this.chunkedUpload(file, uploadData, options.onProgress);
    } else {
      response = await this.upload<Track>('/upload', file, uploadData);
    }

    // Upload artwork separately if provided
    if (options.artwork && response.success) {
      await this.uploadArtwork(this.extractData(response).id, options.artwork);
    }

    return this.extractData(response);
  }

  /**
   * Get list of tracks with filtering and pagination
   * 
   * @param params - Query parameters
   * @returns Promise resolving to paginated tracks list
   * 
   * @example
   * ```typescript
   * const tracks = await client.tracks.list({
   *   page: 1,
   *   perPage: 20,
   *   sortBy: 'uploadedAt',
   *   sortOrder: 'desc',
   *   filter: { 
   *     status: 'ready',
   *     genre: 'Electronic'
   *   }
   * });
   * 
   * console.log('Tracks:', tracks.data.items);
   * console.log('Total:', tracks.data.pagination.total);
   * ```
   */
  async list(params: QueryParams & {
    status?: Track['status'];
    genre?: string;
    artist?: string;
    album?: string;
    uploadedAfter?: string;
    uploadedBefore?: string;
    durationMin?: number;
    durationMax?: number;
  } = {}): Promise<ListResponse<Track>> {
    const response = await this.get<ListResponse<Track>>('', {
      page: params.page || 1,
      perPage: params.perPage || 20,
      sortBy: params.sortBy || 'uploadedAt',
      sortOrder: params.sortOrder || 'desc',
      status: params.status,
      genre: params.genre,
      artist: params.artist,
      album: params.album,
      uploadedAfter: params.uploadedAfter,
      uploadedBefore: params.uploadedBefore,
      durationMin: params.durationMin,
      durationMax: params.durationMax,
      search: params.search,
    });

    return this.extractData(response);
  }

  /**
   * Get a specific track by ID
   * 
   * @param id - Track ID
   * @returns Promise resolving to track details
   * 
   * @example
   * ```typescript
   * const track = await client.tracks.get('track_123');
   * console.log('Track details:', track.data);
   * console.log('Duration:', this.formatDuration(track.data.duration));
   * ```
   */
  async get(id: string): Promise<Track> {
    this.validateRequired({ id }, ['id']);

    const response = await this.get<Track>(`/${id}`);
    return this.extractData(response);
  }

  /**
   * Update track metadata
   * 
   * @param id - Track ID
   * @param metadata - Updated metadata
   * @returns Promise resolving to updated track
   * 
   * @example
   * ```typescript
   * const updated = await client.tracks.update('track_123', {
   *   title: 'Updated Title',
   *   genre: 'Ambient',
   *   tags: ['chill', 'instrumental']
   * });
   * ```
   */
  async update(id: string, metadata: Partial<TrackMetadata>): Promise<Track> {
    this.validateRequired({ id }, ['id']);

    const response = await this.put<Track>(`/${id}`, metadata);
    return this.extractData(response);
  }

  /**
   * Delete a track
   * 
   * @param id - Track ID
   * @returns Promise resolving to deletion confirmation
   * 
   * @example
   * ```typescript
   * await client.tracks.delete('track_123');
   * console.log('Track deleted');
   * ```
   */
  async delete(id: string) {
    this.validateRequired({ id }, ['id']);

    const response = await this.delete(`/${id}`);
    return this.extractData(response);
  }

  /**
   * Upload artwork for a track
   * 
   * @param trackId - Track ID
   * @param artworkFile - Artwork image file
   * @returns Promise resolving to upload confirmation
   * 
   * @example
   * ```typescript
   * await client.tracks.uploadArtwork('track_123', artworkFile);
   * console.log('Artwork uploaded');
   * ```
   */
  async uploadArtwork(trackId: string, artworkFile: File | Buffer) {
    this.validateRequired({ trackId }, ['trackId']);

    // Validate artwork file
    const fileSize = artworkFile instanceof Buffer ? artworkFile.length : artworkFile.size;
    const maxArtworkSize = 10 * 1024 * 1024; // 10MB

    if (fileSize > maxArtworkSize) {
      throw new Error(`Artwork file size (${this.formatFileSize(fileSize)}) exceeds maximum allowed size (${this.formatFileSize(maxArtworkSize)})`);
    }

    const response = await this.upload(`/${trackId}/artwork`, artworkFile);
    return this.extractData(response);
  }

  /**
   * Batch upload multiple tracks
   * 
   * @param tracks - Array of track upload configurations
   * @param options - Batch upload options
   * @returns Promise resolving to batch upload results
   * 
   * @example
   * ```typescript
   * const results = await client.tracks.batchUpload([
   *   { file: file1, metadata: { title: 'Song 1', artist: 'Artist' } },
   *   { file: file2, metadata: { title: 'Song 2', artist: 'Artist' } },
   *   { file: file3, metadata: { title: 'Song 3', artist: 'Artist' } }
   * ], {
   *   onProgress: (progress) => {
   *     console.log(`Batch progress: ${progress.completed}/${progress.total}`);
   *   }
   * });
   * ```
   */
  async batchUpload(
    tracks: Array<{
      file: File | Buffer;
      metadata: TrackMetadata;
      artwork?: File | Buffer;
    }>,
    options: {
      onProgress?: (progress: { completed: number; total: number; percentage: number }) => void;
      maxConcurrent?: number;
    } = {}
  ) {
    if (tracks.length === 0) {
      throw new Error('At least one track is required for batch upload');
    }

    if (tracks.length > 100) {
      throw new Error('Batch upload is limited to 100 tracks maximum');
    }

    const maxConcurrent = options.maxConcurrent || 3;
    const results: Array<{ success: boolean; track?: Track; error?: string }> = [];
    let completed = 0;

    const uploadTrack = async (trackData: typeof tracks[0]) => {
      try {
        const track = await this.upload(trackData.file, trackData.metadata, {
          artwork: trackData.artwork,
        });
        completed++;
        
        if (options.onProgress) {
          options.onProgress({
            completed,
            total: tracks.length,
            percentage: Math.round((completed / tracks.length) * 100),
          });
        }

        return { success: true, track };
      } catch (error) {
        completed++;
        
        if (options.onProgress) {
          options.onProgress({
            completed,
            total: tracks.length,
            percentage: Math.round((completed / tracks.length) * 100),
          });
        }

        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    };

    // Process uploads in batches
    for (let i = 0; i < tracks.length; i += maxConcurrent) {
      const batch = tracks.slice(i, i + maxConcurrent);
      const batchResults = await Promise.all(batch.map(uploadTrack));
      results.push(...batchResults);
    }

    return {
      results,
      summary: {
        total: tracks.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      },
    };
  }

  /**
   * Batch update metadata for multiple tracks
   * 
   * @param updates - Array of track updates
   * @returns Promise resolving to batch update results
   * 
   * @example
   * ```typescript
   * const results = await client.tracks.batchUpdateMetadata([
   *   { id: 'track_1', metadata: { album: 'New Album' } },
   *   { id: 'track_2', metadata: { album: 'New Album' } },
   *   { id: 'track_3', metadata: { album: 'New Album' } }
   * ]);
   * ```
   */
  async batchUpdateMetadata(
    updates: Array<{
      id: string;
      metadata: Partial<TrackMetadata>;
    }>
  ) {
    if (updates.length === 0) {
      throw new Error('At least one update is required');
    }

    if (updates.length > 500) {
      throw new Error('Batch update is limited to 500 tracks maximum');
    }

    const response = await this.post('/batch/metadata', { updates });
    return this.extractData(response);
  }

  /**
   * Queue tracks for batch processing
   * 
   * @param trackIds - Array of track IDs to process
   * @param options - Processing options
   * @returns Promise resolving to processing job information
   * 
   * @example
   * ```typescript
   * const job = await client.tracks.batchProcess(['track_1', 'track_2', 'track_3'], {
   *   operations: ['analysis', 'transcription'],
   *   priority: 'high'
   * });
   * 
   * console.log('Batch processing job:', job.data.jobId);
   * ```
   */
  async batchProcess(
    trackIds: string[],
    options: {
      operations?: Array<'analysis' | 'transcription' | 'mastering' | 'genre-detection'>;
      priority?: 'low' | 'normal' | 'high';
      notify?: boolean;
    } = {}
  ) {
    this.validateRequired({ trackIds }, ['trackIds']);

    if (trackIds.length === 0) {
      throw new Error('At least one track ID is required');
    }

    if (trackIds.length > 1000) {
      throw new Error('Batch processing is limited to 1000 tracks maximum');
    }

    const response = await this.post('/batch/process', {
      trackIds,
      operations: options.operations || ['analysis'],
      priority: options.priority || 'normal',
      notify: options.notify !== false,
    });

    return this.extractData(response);
  }

  /**
   * Get track processing status
   * 
   * @param id - Track ID
   * @returns Promise resolving to processing status
   * 
   * @example
   * ```typescript
   * const status = await client.tracks.getProcessingStatus('track_123');
   * console.log('Processing status:', status.data.status);
   * console.log('Progress:', status.data.progress);
   * ```
   */
  async getProcessingStatus(id: string) {
    this.validateRequired({ id }, ['id']);

    const response = await this.get(`/${id}/processing-status`);
    return this.extractData(response);
  }

  /**
   * Generate waveform visualization for a track
   * 
   * @param id - Track ID
   * @param options - Waveform generation options
   * @returns Promise resolving to waveform data
   * 
   * @example
   * ```typescript
   * const waveform = await client.tracks.generateWaveform('track_123', {
   *   width: 800,
   *   height: 200,
   *   colors: ['#3b82f6', '#8b5cf6']
   * });
   * 
   * console.log('Waveform URL:', waveform.data.imageUrl);
   * console.log('Waveform data:', waveform.data.peaks);
   * ```
   */
  async generateWaveform(
    id: string,
    options: {
      width?: number;
      height?: number;
      colors?: string[];
      format?: 'png' | 'svg' | 'json';
      samples?: number;
    } = {}
  ) {
    this.validateRequired({ id }, ['id']);

    const response = await this.post(`/${id}/waveform`, {
      width: options.width || 800,
      height: options.height || 200,
      colors: options.colors || ['#3b82f6'],
      format: options.format || 'png',
      samples: options.samples || 1000,
    });

    return this.extractData(response);
  }

  /**
   * Get track download URL
   * 
   * @param id - Track ID
   * @param format - Download format
   * @param quality - Audio quality
   * @returns Promise resolving to download information
   * 
   * @example
   * ```typescript
   * const download = await client.tracks.getDownloadUrl('track_123', 'mp3', 'high');
   * console.log('Download URL:', download.data.downloadUrl);
   * console.log('Expires at:', download.data.expiresAt);
   * ```
   */
  async getDownloadUrl(
    id: string,
    format: 'mp3' | 'wav' | 'flac' | 'aac' = 'mp3',
    quality: 'low' | 'medium' | 'high' | 'lossless' = 'high'
  ) {
    this.validateRequired({ id }, ['id']);

    const response = await this.get(`/${id}/download`, {
      format,
      quality,
    });

    return this.extractData(response);
  }

  /**
   * Search tracks by content similarity
   * 
   * @param referenceTrackId - Reference track ID for similarity search
   * @param options - Search options
   * @returns Promise resolving to similar tracks
   * 
   * @example
   * ```typescript
   * const similar = await client.tracks.findSimilar('track_123', {
   *   limit: 10,
   *   minSimilarity: 0.7,
   *   sameArtist: false
   * });
   * 
   * console.log('Similar tracks:', similar.data.tracks);
   * ```
   */
  async findSimilar(
    referenceTrackId: string,
    options: {
      limit?: number;
      minSimilarity?: number;
      sameArtist?: boolean;
      sameGenre?: boolean;
    } = {}
  ) {
    this.validateRequired({ referenceTrackId }, ['referenceTrackId']);

    const response = await this.get(`/${referenceTrackId}/similar`, {
      limit: options.limit || 10,
      minSimilarity: options.minSimilarity || 0.5,
      sameArtist: options.sameArtist || false,
      sameGenre: options.sameGenre || false,
    });

    return this.extractData(response);
  }

  /**
   * Private method for chunked upload of large files
   */
  private async chunkedUpload(
    file: File | Buffer,
    metadata: any,
    onProgress?: (progress: UploadProgress) => void
  ) {
    const chunkSize = metadata.chunkSize || 1024 * 1024; // 1MB
    const fileSize = file instanceof Buffer ? file.length : file.size;
    const totalChunks = Math.ceil(fileSize / chunkSize);

    // Initialize upload session
    const session = await this.post('/upload/init', {
      fileName: file instanceof Buffer ? 'audio.mp3' : (file as File).name,
      fileSize,
      chunkSize,
      metadata,
    });

    const uploadId = this.extractData(session).uploadId;
    let uploadedBytes = 0;

    try {
      // Upload chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        
        let chunk: Buffer;
        if (file instanceof Buffer) {
          chunk = file.slice(start, end);
        } else {
          chunk = Buffer.from(await (file as File).slice(start, end).arrayBuffer());
        }

        await this.upload(`/upload/chunk/${uploadId}`, chunk, {
          chunkIndex,
          totalChunks,
        });

        uploadedBytes += chunk.length;

        if (onProgress) {
          onProgress({
            loaded: uploadedBytes,
            total: fileSize,
            percentage: Math.round((uploadedBytes / fileSize) * 100),
            phase: 'uploading',
          });
        }
      }

      // Complete upload
      const completed = await this.post(`/upload/complete/${uploadId}`);

      if (onProgress) {
        onProgress({
          loaded: fileSize,
          total: fileSize,
          percentage: 100,
          phase: 'complete',
        });
      }

      return completed;
    } catch (error) {
      // Abort upload on error
      await this.delete(`/upload/abort/${uploadId}`).catch(() => {
        // Ignore abort errors
      });
      throw error;
    }
  }

  /**
   * Wait for track processing completion
   * 
   * @param trackId - Track ID
   * @param pollInterval - Polling interval in milliseconds
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise resolving when processing is complete
   * 
   * @example
   * ```typescript
   * const uploaded = await client.tracks.upload(audioFile, metadata);
   * const processed = await client.tracks.waitForProcessing(uploaded.data.id);
   * console.log('Track processed:', processed.data.status);
   * ```
   */
  async waitForProcessing(
    trackId: string,
    pollInterval: number = 5000,
    timeout: number = 600000
  ): Promise<Track> {
    return this.pollForCompletion(
      () => trackId,
      (id) => this.get(id),
      (track) => track.status === 'ready' || track.status === 'error',
      pollInterval,
      timeout
    );
  }
}