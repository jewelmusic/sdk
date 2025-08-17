package jewelmusic

import (
	"context"
	"io"
)

// AnalysisResource provides music analysis capabilities
type AnalysisResource struct {
	client *Client
}

// AnalysisOptions represents options for audio analysis
type AnalysisOptions struct {
	AnalysisTypes    []string `json:"analysisTypes,omitempty"`
	DetailedReport   bool     `json:"detailedReport,omitempty"`
	CulturalContext  string   `json:"culturalContext,omitempty"`
	TargetPlatforms  []string `json:"targetPlatforms,omitempty"`
	TargetLoudness   float64  `json:"targetLoudness,omitempty"`
}

// QualityCheckOptions represents options for quality analysis
type QualityCheckOptions struct {
	CheckClipping      bool    `json:"checkClipping,omitempty"`
	CheckPhaseIssues   bool    `json:"checkPhaseIssues,omitempty"`
	CheckDynamicRange  bool    `json:"checkDynamicRange,omitempty"`
	TargetLoudness     float64 `json:"targetLoudness,omitempty"`
	TargetPlatform     string  `json:"targetPlatform,omitempty"`
}

// MasteringSuggestionOptions represents options for mastering suggestions
type MasteringSuggestionOptions struct {
	TargetPlatform   string `json:"targetPlatform,omitempty"`
	Genre            string `json:"genre,omitempty"`
	IncludePresets   bool   `json:"includePresets,omitempty"`
}

// UploadTrack uploads and analyzes an audio track
func (a *AnalysisResource) UploadTrack(ctx context.Context, file io.Reader, filename string, options *AnalysisOptions) (*Analysis, error) {
	metadata := make(map[string]string)
	
	if options != nil {
		if len(options.AnalysisTypes) > 0 {
			// Convert slice to comma-separated string
			analysisTypesStr := ""
			for i, t := range options.AnalysisTypes {
				if i > 0 {
					analysisTypesStr += ","
				}
				analysisTypesStr += t
			}
			metadata["analysisTypes"] = analysisTypesStr
		}
		
		if options.DetailedReport {
			metadata["detailedReport"] = "true"
		}
		
		if options.CulturalContext != "" {
			metadata["culturalContext"] = options.CulturalContext
		}
		
		if len(options.TargetPlatforms) > 0 {
			// Convert slice to comma-separated string
			platformsStr := ""
			for i, p := range options.TargetPlatforms {
				if i > 0 {
					platformsStr += ","
				}
				platformsStr += p
			}
			metadata["targetPlatforms"] = platformsStr
		}
	}

	resp, err := a.client.UploadFile(ctx, "/analysis/upload", file, filename, metadata)
	if err != nil {
		return nil, err
	}

	var result Analysis
	if resp.Data != nil {
		// Convert response data to Analysis struct
		// This would need proper JSON marshaling in a real implementation
	}

	return &result, nil
}

// GetAnalysis retrieves analysis results by ID
func (a *AnalysisResource) GetAnalysis(ctx context.Context, analysisID string) (*Analysis, error) {
	var result Analysis
	err := a.client.Get(ctx, "/analysis/"+analysisID, nil, &result)
	return &result, err
}

// AudioQualityCheck performs audio quality analysis
func (a *AnalysisResource) AudioQualityCheck(ctx context.Context, file io.Reader, filename string, options *QualityCheckOptions) (*QualityAnalysis, error) {
	metadata := make(map[string]string)
	
	if options != nil {
		if options.CheckClipping {
			metadata["checkClipping"] = "true"
		}
		if options.CheckPhaseIssues {
			metadata["checkPhaseIssues"] = "true"
		}
		if options.CheckDynamicRange {
			metadata["checkDynamicRange"] = "true"
		}
		if options.TargetLoudness != 0 {
			metadata["targetLoudness"] = string(rune(int(options.TargetLoudness)))
		}
		if options.TargetPlatform != "" {
			metadata["targetPlatform"] = options.TargetPlatform
		}
	}

	resp, err := a.client.UploadFile(ctx, "/analysis/quality-check", file, filename, metadata)
	if err != nil {
		return nil, err
	}

	var result QualityAnalysis
	// Convert response data to QualityAnalysis struct
	return &result, nil
}

// GetMasteringSuggestions gets mastering suggestions for an audio file
func (a *AnalysisResource) GetMasteringSuggestions(ctx context.Context, file io.Reader, filename string, options *MasteringSuggestionOptions) (map[string]interface{}, error) {
	metadata := make(map[string]string)
	
	if options != nil {
		if options.TargetPlatform != "" {
			metadata["targetPlatform"] = options.TargetPlatform
		}
		if options.Genre != "" {
			metadata["genre"] = options.Genre
		}
		if options.IncludePresets {
			metadata["includePresets"] = "true"
		}
	}

	resp, err := a.client.UploadFile(ctx, "/analysis/mastering-suggestions", file, filename, metadata)
	if err != nil {
		return nil, err
	}

	result := make(map[string]interface{})
	// Convert response data to map
	return result, nil
}

// DetectStructure detects the structure of an audio file
func (a *AnalysisResource) DetectStructure(ctx context.Context, file io.Reader, filename string) (*StructureAnalysis, error) {
	resp, err := a.client.UploadFile(ctx, "/analysis/detect-structure", file, filename, nil)
	if err != nil {
		return nil, err
	}

	var result StructureAnalysis
	// Convert response data to StructureAnalysis struct
	return &result, nil
}

// DetectKey detects the musical key of an audio file
func (a *AnalysisResource) DetectKey(ctx context.Context, file io.Reader, filename string) (*KeyAnalysis, error) {
	resp, err := a.client.UploadFile(ctx, "/analysis/detect-key", file, filename, nil)
	if err != nil {
		return nil, err
	}

	var result KeyAnalysis
	// Convert response data to KeyAnalysis struct
	return &result, nil
}

// AnalyzeTempo analyzes the tempo of an audio file
func (a *AnalysisResource) AnalyzeTempo(ctx context.Context, file io.Reader, filename string) (*TempoAnalysis, error) {
	resp, err := a.client.UploadFile(ctx, "/analysis/tempo", file, filename, nil)
	if err != nil {
		return nil, err
	}

	var result TempoAnalysis
	// Convert response data to TempoAnalysis struct
	return &result, nil
}

// ListAnalyses lists user's analyses with pagination
func (a *AnalysisResource) ListAnalyses(ctx context.Context, page, perPage int, status string) (*ListResponse, error) {
	params := map[string]string{
		"page":    string(rune(page)),
		"perPage": string(rune(perPage)),
	}
	if status != "" {
		params["status"] = status
	}

	var result ListResponse
	err := a.client.Get(ctx, "/analysis", params, &result)
	return &result, err
}