<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * Tracks resource for track upload, metadata management, and organization
 */
class TracksResource extends BaseResource
{
    /**
     * Upload a track with metadata
     *
     * @param string|resource $file Audio file to upload
     * @param string $filename Original filename
     * @param array $metadata Track metadata
     *                       - title: Track title (required)
     *                       - artist: Artist name (required)
     *                       - album: Album name
     *                       - genre: Music genre
     *                       - releaseDate: Release date
     *                       - duration: Track duration
     *                       - explicit: Explicit content flag
     *                       - isrc: ISRC code
     * @param array $options Upload options
     *                      - chunkSize: Size for chunked upload
     *                      - quality: Audio quality preference
     * @return array Uploaded track data
     */
    public function upload($file, string $filename, array $metadata, array $options = []): array
    {
        $this->validateRequired($metadata, ['title', 'artist']);
        
        $uploadMetadata = [];
        foreach ($metadata as $key => $value) {
            if (is_bool($value)) {
                $uploadMetadata[$key] = $value ? 'true' : 'false';
            } else {
                $uploadMetadata[$key] = (string)$value;
            }
        }
        
        // Add upload options to metadata
        foreach ($options as $key => $value) {
            if ($value !== null && $value !== '') {
                $uploadMetadata[$key] = (string)$value;
            }
        }
        
        $response = $this->httpClient->uploadFile('/tracks/upload', $file, $filename, $uploadMetadata);
        return $this->extractData($response);
    }

    /**
     * Upload track with chunked upload for large files
     *
     * @param string|resource $file Audio file to upload
     * @param string $filename Original filename
     * @param array $metadata Track metadata
     * @param int $chunkSize Chunk size in bytes (default: 8MB)
     * @return array Uploaded track data
     */
    public function uploadChunked($file, string $filename, array $metadata, int $chunkSize = 8388608): array
    {
        $this->validateRequired($metadata, ['title', 'artist']);
        
        $uploadMetadata = [];
        foreach ($metadata as $key => $value) {
            if (is_bool($value)) {
                $uploadMetadata[$key] = $value ? 'true' : 'false';
            } else {
                $uploadMetadata[$key] = (string)$value;
            }
        }
        
        $response = $this->httpClient->uploadFileChunked('/tracks/upload', $file, $filename, $uploadMetadata, $chunkSize);
        return $this->extractData($response);
    }

    /**
     * Get track by ID
     *
     * @param string $trackId Track ID
     * @return array Track data
     */
    public function get(string $trackId): array
    {
        $response = $this->httpClient->get("/tracks/{$trackId}");
        return $this->extractData($response);
    }

    /**
     * Update track metadata
     *
     * @param string $trackId Track ID
     * @param array $metadata Updated metadata
     * @return array Updated track data
     */
    public function update(string $trackId, array $metadata): array
    {
        $this->validateRequired(['trackId' => $trackId], ['trackId']);
        
        $response = $this->httpClient->put("/tracks/{$trackId}", $metadata);
        return $this->extractData($response);
    }

    /**
     * Delete a track
     *
     * @param string $trackId Track ID
     * @return array Deletion confirmation
     */
    public function delete(string $trackId): array
    {
        $this->validateRequired(['trackId' => $trackId], ['trackId']);
        
        $response = $this->httpClient->delete("/tracks/{$trackId}");
        return $this->extractData($response);
    }

    /**
     * Upload artwork for a track
     *
     * @param string $trackId Track ID
     * @param string|resource $artworkFile Artwork image file
     * @param string $filename Artwork filename
     * @return array Artwork upload result
     */
    public function uploadArtwork(string $trackId, $artworkFile, string $filename): array
    {
        $this->validateRequired([
            'trackId' => $trackId,
            'artworkFile' => $artworkFile,
            'filename' => $filename
        ], ['trackId', 'artworkFile', 'filename']);
        
        $response = $this->httpClient->uploadFile("/tracks/{$trackId}/artwork", $artworkFile, $filename);
        return $this->extractData($response);
    }

    /**
     * Batch update metadata for multiple tracks
     *
     * @param array $updates Array of track updates
     *                      Each item should contain 'id' and 'metadata' keys
     * @return array Batch update results
     */
    public function batchUpdateMetadata(array $updates): array
    {
        foreach ($updates as $update) {
            $this->validateRequired($update, ['id', 'metadata']);
        }
        
        $data = ['updates' => $updates];
        $response = $this->httpClient->post('/tracks/batch/metadata', $data);
        return $this->extractData($response);
    }

    /**
     * Queue tracks for batch processing
     *
     * @param array $trackIds Array of track IDs
     * @param array $operations Processing operations to perform
     * @param array $options Batch processing options
     *                      - priority: Processing priority
     *                      - notify: Send notification when complete
     * @return array Batch processing job data
     */
    public function batchProcess(array $trackIds, array $operations, array $options = []): array
    {
        $this->validateRequired(['trackIds' => $trackIds, 'operations' => $operations], ['trackIds', 'operations']);
        
        $data = array_merge([
            'trackIds' => $trackIds,
            'operations' => $operations
        ], $this->filterNullValues($options));
        
        $response = $this->httpClient->post('/tracks/batch/process', $data);
        return $this->extractData($response);
    }

    /**
     * Get track processing status
     *
     * @param string $trackId Track ID
     * @return array Processing status information
     */
    public function getProcessingStatus(string $trackId): array
    {
        $response = $this->httpClient->get("/tracks/{$trackId}/processing-status");
        return $this->extractData($response);
    }

    /**
     * Generate waveform visualization for a track
     *
     * @param string $trackId Track ID
     * @param array $options Waveform generation options
     *                      - width: Image width in pixels
     *                      - height: Image height in pixels
     *                      - colors: Color scheme for waveform
     *                      - format: Output format (png, svg, json)
     *                      - samples: Number of sample points
     * @return array Waveform data or image URL
     */
    public function generateWaveform(string $trackId, array $options = []): array
    {
        $response = $this->httpClient->post("/tracks/{$trackId}/waveform", $this->filterNullValues($options));
        return $this->extractData($response);
    }

    /**
     * Get download URL for a track
     *
     * @param string $trackId Track ID
     * @param string $format Audio format (mp3, wav, flac, etc.)
     * @param string $quality Audio quality (high, medium, low)
     * @return array Download URL and metadata
     */
    public function getDownloadUrl(string $trackId, string $format = 'mp3', string $quality = 'high'): array
    {
        $params = [
            'format' => $format,
            'quality' => $quality
        ];
        
        $response = $this->httpClient->get("/tracks/{$trackId}/download", $params);
        return $this->extractData($response);
    }

    /**
     * Find similar tracks based on content analysis
     *
     * @param string $referenceTrackId Reference track ID
     * @param array $options Similarity search options
     *                      - limit: Maximum number of results
     *                      - minSimilarity: Minimum similarity threshold
     *                      - sameArtist: Include tracks from same artist
     *                      - sameGenre: Include tracks from same genre
     *                      - features: Specific features to compare
     * @return array Similar tracks
     */
    public function findSimilar(string $referenceTrackId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/tracks/{$referenceTrackId}/similar", $params);
        return $this->extractData($response);
    }

    /**
     * Get track audio features and characteristics
     *
     * @param string $trackId Track ID
     * @param array $features Specific features to retrieve
     *                       - tempo: BPM and rhythmic features
     *                       - key: Musical key and scale
     *                       - energy: Energy and intensity levels
     *                       - mood: Emotional characteristics
     * @return array Audio features
     */
    public function getAudioFeatures(string $trackId, array $features = []): array
    {
        $params = $this->buildParams([], ['features' => $features]);
        $response = $this->httpClient->get("/tracks/{$trackId}/features", $params);
        return $this->extractData($response);
    }

    /**
     * Create playlist from tracks
     *
     * @param array $trackIds Array of track IDs
     * @param array $playlistData Playlist metadata
     *                           - name: Playlist name
     *                           - description: Playlist description
     *                           - public: Public visibility
     * @return array Created playlist data
     */
    public function createPlaylist(array $trackIds, array $playlistData): array
    {
        $this->validateRequired($playlistData, ['name']);
        
        $data = array_merge(['trackIds' => $trackIds], $playlistData);
        $response = $this->httpClient->post('/tracks/playlists', $data);
        return $this->extractData($response);
    }

    /**
     * Tag tracks with custom labels
     *
     * @param string $trackId Track ID
     * @param array $tags Array of tags to add
     * @return array Updated track with tags
     */
    public function addTags(string $trackId, array $tags): array
    {
        $data = ['tags' => $tags];
        $response = $this->httpClient->post("/tracks/{$trackId}/tags", $data);
        return $this->extractData($response);
    }

    /**
     * Remove tags from track
     *
     * @param string $trackId Track ID
     * @param array $tags Array of tags to remove
     * @return array Updated track
     */
    public function removeTags(string $trackId, array $tags): array
    {
        $data = ['tags' => $tags];
        $response = $this->httpClient->delete("/tracks/{$trackId}/tags", $data);
        return $this->extractData($response);
    }

    /**
     * List tracks with filtering and pagination
     *
     * @param int $page Page number
     * @param int $perPage Items per page
     * @param array $filters Track filters
     *                      - status: Processing status
     *                      - genre: Genre filter
     *                      - artist: Artist name filter
     *                      - album: Album filter
     *                      - uploadedAfter: Date filter
     *                      - uploadedBefore: Date filter
     *                      - durationMin: Minimum duration
     *                      - durationMax: Maximum duration
     *                      - search: Text search in metadata
     * @return array Tracks list
     */
    public function list(int $page = 1, int $perPage = 20, array $filters = []): array
    {
        $params = $this->buildParams([
            'page' => (string)$page,
            'perPage' => (string)$perPage
        ], $filters);
        
        $response = $this->httpClient->get('/tracks', $params);
        return $this->extractData($response);
    }
}