package jewelmusic

import (
	"context"
	"io"
	"strconv"
	"strings"
)

// TranscriptionResource provides AI transcription services
type TranscriptionResource struct {
	client *Client
}

// TranscriptionOptions represents options for transcription creation
type TranscriptionOptions struct {
	Languages            []string `json:"languages,omitempty"`
	IncludeTimestamps    bool     `json:"includeTimestamps,omitempty"`
	WordLevelTimestamps  bool     `json:"wordLevelTimestamps,omitempty"`
	SpeakerDiarization   bool     `json:"speakerDiarization,omitempty"`
	Model                string   `json:"model,omitempty"`
	MaxSpeakers          int      `json:"maxSpeakers,omitempty"`
}

// LyricsEnhancementOptions represents options for lyrics enhancement
type LyricsEnhancementOptions struct {
	ImproveMeter    bool   `json:"improveMeter,omitempty"`
	EnhanceRhyming  bool   `json:"enhanceRhyming,omitempty"`
	AdjustTone      string `json:"adjustTone,omitempty"`
	TargetLanguage  string `json:"targetLanguage,omitempty"`
	PreserveStyle   bool   `json:"preserveStyle,omitempty"`
}

// TranslationOptions represents options for lyrics translation
type TranslationOptions struct {
	PreserveRhyme   bool `json:"preserveRhyme,omitempty"`
	PreserveMeter   bool `json:"preserveMeter,omitempty"`
	AdaptCulturally bool `json:"adaptCulturally,omitempty"`
}

// Create creates a new transcription from track ID or file
func (tr *TranscriptionResource) Create(ctx context.Context, trackID string, file io.Reader, filename string, options *TranscriptionOptions) (*Transcription, error) {
	if trackID != "" {
		// Create from existing track
		requestData := map[string]interface{}{
			"trackId": trackID,
		}
		
		if options != nil {
			if len(options.Languages) > 0 {
				requestData["languages"] = options.Languages
			}
			if options.IncludeTimestamps {
				requestData["includeTimestamps"] = true
			}
			if options.WordLevelTimestamps {
				requestData["wordLevelTimestamps"] = true
			}
			if options.SpeakerDiarization {
				requestData["speakerDiarization"] = true
			}
			if options.Model != "" {
				requestData["model"] = options.Model
			}
			if options.MaxSpeakers > 0 {
				requestData["maxSpeakers"] = options.MaxSpeakers
			}
		}

		var result Transcription
		err := tr.client.Post(ctx, "/transcription/create", requestData, &result)
		return &result, err
	}
	
	if file != nil {
		// Create from file upload
		metadata := make(map[string]string)
		
		if options != nil {
			if len(options.Languages) > 0 {
				metadata["languages"] = strings.Join(options.Languages, ",")
			}
			if options.IncludeTimestamps {
				metadata["includeTimestamps"] = "true"
			}
			if options.WordLevelTimestamps {
				metadata["wordLevelTimestamps"] = "true"
			}
			if options.SpeakerDiarization {
				metadata["speakerDiarization"] = "true"
			}
			if options.Model != "" {
				metadata["model"] = options.Model
			}
			if options.MaxSpeakers > 0 {
				metadata["maxSpeakers"] = strconv.Itoa(options.MaxSpeakers)
			}
		}

		resp, err := tr.client.UploadFile(ctx, "/transcription/create", file, filename, metadata)
		if err != nil {
			return nil, err
		}

		var result Transcription
		// Convert response data to Transcription struct
		return &result, nil
	}
	
	return nil, &APIError{Code: "INVALID_REQUEST", Message: "Either trackId or file must be provided"}
}

// Get retrieves a transcription by ID
func (tr *TranscriptionResource) Get(ctx context.Context, transcriptionID string) (*Transcription, error) {
	var result Transcription
	err := tr.client.Get(ctx, "/transcription/"+transcriptionID, nil, &result)
	return &result, err
}

// GetStatus gets the status of a transcription
func (tr *TranscriptionResource) GetStatus(ctx context.Context, transcriptionID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := tr.client.Get(ctx, "/transcription/"+transcriptionID+"/status", nil, &result)
	return result, err
}

// Download downloads transcription in the specified format
func (tr *TranscriptionResource) Download(ctx context.Context, transcriptionID string, format string) (map[string]interface{}, error) {
	params := map[string]string{
		"format": format,
	}

	var result map[string]interface{}
	err := tr.client.Get(ctx, "/transcription/"+transcriptionID+"/download", params, &result)
	return result, err
}

// TranslateLyrics translates lyrics to target languages
func (tr *TranscriptionResource) TranslateLyrics(ctx context.Context, transcriptionID string, targetLanguages []string, options *TranslationOptions) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"targetLanguages": targetLanguages,
	}
	
	if options != nil {
		if options.PreserveRhyme {
			requestData["preserveRhyme"] = true
		}
		if options.PreserveMeter {
			requestData["preserveMeter"] = true
		}
		if options.AdaptCulturally {
			requestData["adaptCulturally"] = true
		}
	}

	var result map[string]interface{}
	err := tr.client.Post(ctx, "/transcription/"+transcriptionID+"/translate", requestData, &result)
	return result, err
}

// SyncLyrics synchronizes lyrics with audio file
func (tr *TranscriptionResource) SyncLyrics(ctx context.Context, transcriptionID string, audioFile io.Reader, filename string) (map[string]interface{}, error) {
	resp, err := tr.client.UploadFile(ctx, "/transcription/"+transcriptionID+"/sync", audioFile, filename, nil)
	if err != nil {
		return nil, err
	}

	result := make(map[string]interface{})
	// Convert response data to map
	return result, nil
}

// EnhanceLyrics enhances lyrics with AI
func (tr *TranscriptionResource) EnhanceLyrics(ctx context.Context, lyrics string, options *LyricsEnhancementOptions) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"lyrics": lyrics,
	}
	
	if options != nil {
		if options.ImproveMeter {
			requestData["improveMeter"] = true
		}
		if options.EnhanceRhyming {
			requestData["enhanceRhyming"] = true
		}
		if options.AdjustTone != "" {
			requestData["adjustTone"] = options.AdjustTone
		}
		if options.TargetLanguage != "" {
			requestData["targetLanguage"] = options.TargetLanguage
		}
		if options.PreserveStyle {
			requestData["preserveStyle"] = true
		}
	}

	var result map[string]interface{}
	err := tr.client.Post(ctx, "/transcription/enhance-lyrics", requestData, &result)
	return result, err
}

// CheckRhymeScheme analyzes the rhyme scheme of lyrics
func (tr *TranscriptionResource) CheckRhymeScheme(ctx context.Context, lyrics string) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"lyrics": lyrics,
	}

	var result map[string]interface{}
	err := tr.client.Post(ctx, "/transcription/check-rhyme-scheme", requestData, &result)
	return result, err
}

// AnalyzeSentiment analyzes the sentiment of lyrics
func (tr *TranscriptionResource) AnalyzeSentiment(ctx context.Context, lyrics string) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"lyrics": lyrics,
	}

	var result map[string]interface{}
	err := tr.client.Post(ctx, "/transcription/analyze-sentiment", requestData, &result)
	return result, err
}

// CheckLanguageQuality checks the quality of lyrics in a specific language
func (tr *TranscriptionResource) CheckLanguageQuality(ctx context.Context, lyrics string, language string) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"lyrics":   lyrics,
		"language": language,
	}

	var result map[string]interface{}
	err := tr.client.Post(ctx, "/transcription/check-language-quality", requestData, &result)
	return result, err
}

// List lists user's transcriptions with pagination
func (tr *TranscriptionResource) List(ctx context.Context, page, perPage int, status, language string) (*ListResponse, error) {
	params := map[string]string{
		"page":    strconv.Itoa(page),
		"perPage": strconv.Itoa(perPage),
	}
	
	if status != "" {
		params["status"] = status
	}
	if language != "" {
		params["language"] = language
	}

	var result ListResponse
	err := tr.client.Get(ctx, "/transcription", params, &result)
	return &result, err
}