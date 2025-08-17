package jewelmusic

import (
	"context"
	"io"
	"strconv"
)

// TracksResource manages track upload, metadata, and organization
type TracksResource struct {
	client *Client
}

// TrackFilter represents filters for listing tracks
type TrackFilter struct {
	Status            string `json:"status,omitempty"`
	Genre             string `json:"genre,omitempty"`
	Artist            string `json:"artist,omitempty"`
	Album             string `json:"album,omitempty"`
	UploadedAfter     string `json:"uploadedAfter,omitempty"`
	UploadedBefore    string `json:"uploadedBefore,omitempty"`
	DurationMin       int    `json:"durationMin,omitempty"`
	DurationMax       int    `json:"durationMax,omitempty"`
	Search            string `json:"search,omitempty"`
}

// UploadOptions represents options for track upload
type UploadOptions struct {
	ChunkSize int `json:"chunkSize,omitempty"`
}

// BatchUpdateItem represents an item in batch metadata update
type BatchUpdateItem struct {
	ID       string        `json:"id"`
	Metadata TrackMetadata `json:"metadata"`
}

// BatchProcessOptions represents options for batch processing
type BatchProcessOptions struct {
	Operations []string `json:"operations,omitempty"`
	Priority   string   `json:"priority,omitempty"`
	Notify     bool     `json:"notify,omitempty"`
}

// WaveformOptions represents options for waveform generation
type WaveformOptions struct {
	Width   int      `json:"width,omitempty"`
	Height  int      `json:"height,omitempty"`
	Colors  []string `json:"colors,omitempty"`
	Format  string   `json:"format,omitempty"`
	Samples int      `json:"samples,omitempty"`
}

// Upload uploads a track with metadata
func (t *TracksResource) Upload(ctx context.Context, file io.Reader, filename string, metadata TrackMetadata, options *UploadOptions) (*Track, error) {
	// Convert metadata to map[string]string for upload
	metadataMap := map[string]string{
		"title":  metadata.Title,
		"artist": metadata.Artist,
	}
	
	if metadata.Album != "" {
		metadataMap["album"] = metadata.Album
	}
	if metadata.Genre != "" {
		metadataMap["genre"] = metadata.Genre
	}
	if metadata.ReleaseDate != "" {
		metadataMap["releaseDate"] = metadata.ReleaseDate
	}
	
	if options != nil && options.ChunkSize > 0 {
		metadataMap["chunkSize"] = strconv.Itoa(options.ChunkSize)
	}

	resp, err := t.client.UploadFile(ctx, "/tracks/upload", file, filename, metadataMap)
	if err != nil {
		return nil, err
	}

	var result Track
	// Convert response data to Track struct
	return &result, nil
}

// List gets list of tracks with filtering and pagination
func (t *TracksResource) List(ctx context.Context, page, perPage int, filter *TrackFilter) (*ListResponse, error) {
	params := map[string]string{
		"page":    strconv.Itoa(page),
		"perPage": strconv.Itoa(perPage),
	}
	
	if filter != nil {
		if filter.Status != "" {
			params["status"] = filter.Status
		}
		if filter.Genre != "" {
			params["genre"] = filter.Genre
		}
		if filter.Artist != "" {
			params["artist"] = filter.Artist
		}
		if filter.Album != "" {
			params["album"] = filter.Album
		}
		if filter.UploadedAfter != "" {
			params["uploadedAfter"] = filter.UploadedAfter
		}
		if filter.UploadedBefore != "" {
			params["uploadedBefore"] = filter.UploadedBefore
		}
		if filter.DurationMin > 0 {
			params["durationMin"] = strconv.Itoa(filter.DurationMin)
		}
		if filter.DurationMax > 0 {
			params["durationMax"] = strconv.Itoa(filter.DurationMax)
		}
		if filter.Search != "" {
			params["search"] = filter.Search
		}
	}

	var result ListResponse
	err := t.client.Get(ctx, "/tracks", params, &result)
	return &result, err
}

// Get retrieves a specific track by ID
func (t *TracksResource) Get(ctx context.Context, trackID string) (*Track, error) {
	var result Track
	err := t.client.Get(ctx, "/tracks/"+trackID, nil, &result)
	return &result, err
}

// Update updates track metadata
func (t *TracksResource) Update(ctx context.Context, trackID string, metadata TrackMetadata) (*Track, error) {
	var result Track
	err := t.client.Put(ctx, "/tracks/"+trackID, metadata, &result)
	return &result, err
}

// Delete deletes a track
func (t *TracksResource) Delete(ctx context.Context, trackID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := t.client.Delete(ctx, "/tracks/"+trackID, &result)
	return result, err
}

// UploadArtwork uploads artwork for a track
func (t *TracksResource) UploadArtwork(ctx context.Context, trackID string, artworkFile io.Reader, filename string) (map[string]interface{}, error) {
	resp, err := t.client.UploadFile(ctx, "/tracks/"+trackID+"/artwork", artworkFile, filename, nil)
	if err != nil {
		return nil, err
	}

	result := make(map[string]interface{})
	// Convert response data to map
	return result, nil
}

// BatchUpdateMetadata updates metadata for multiple tracks
func (t *TracksResource) BatchUpdateMetadata(ctx context.Context, updates []BatchUpdateItem) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"updates": updates,
	}

	var result map[string]interface{}
	err := t.client.Post(ctx, "/tracks/batch/metadata", requestData, &result)
	return result, err
}

// BatchProcess queues tracks for batch processing
func (t *TracksResource) BatchProcess(ctx context.Context, trackIDs []string, options *BatchProcessOptions) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"trackIds": trackIDs,
	}
	
	if options != nil {
		if len(options.Operations) > 0 {
			requestData["operations"] = options.Operations
		}
		if options.Priority != "" {
			requestData["priority"] = options.Priority
		}
		requestData["notify"] = options.Notify
	}

	var result map[string]interface{}
	err := t.client.Post(ctx, "/tracks/batch/process", requestData, &result)
	return result, err
}

// GetProcessingStatus gets track processing status
func (t *TracksResource) GetProcessingStatus(ctx context.Context, trackID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := t.client.Get(ctx, "/tracks/"+trackID+"/processing-status", nil, &result)
	return result, err
}

// GenerateWaveform generates waveform visualization for a track
func (t *TracksResource) GenerateWaveform(ctx context.Context, trackID string, options *WaveformOptions) (map[string]interface{}, error) {
	requestData := make(map[string]interface{})
	
	if options != nil {
		if options.Width > 0 {
			requestData["width"] = options.Width
		}
		if options.Height > 0 {
			requestData["height"] = options.Height
		}
		if len(options.Colors) > 0 {
			requestData["colors"] = options.Colors
		}
		if options.Format != "" {
			requestData["format"] = options.Format
		}
		if options.Samples > 0 {
			requestData["samples"] = options.Samples
		}
	}

	var result map[string]interface{}
	err := t.client.Post(ctx, "/tracks/"+trackID+"/waveform", requestData, &result)
	return result, err
}

// GetDownloadURL gets track download URL
func (t *TracksResource) GetDownloadURL(ctx context.Context, trackID string, format, quality string) (map[string]interface{}, error) {
	params := map[string]string{
		"format":  format,
		"quality": quality,
	}

	var result map[string]interface{}
	err := t.client.Get(ctx, "/tracks/"+trackID+"/download", params, &result)
	return result, err
}

// FindSimilar searches tracks by content similarity
func (t *TracksResource) FindSimilar(ctx context.Context, referenceTrackID string, limit int, minSimilarity float64, sameArtist, sameGenre bool) (map[string]interface{}, error) {
	params := map[string]string{
		"limit":         strconv.Itoa(limit),
		"minSimilarity": strconv.FormatFloat(minSimilarity, 'f', 2, 64),
		"sameArtist":    strconv.FormatBool(sameArtist),
		"sameGenre":     strconv.FormatBool(sameGenre),
	}

	var result map[string]interface{}
	err := t.client.Get(ctx, "/tracks/"+referenceTrackID+"/similar", params, &result)
	return result, err
}