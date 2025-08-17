package jewelmusic

import "context"

// CopilotResource provides AI-powered music generation capabilities
type CopilotResource struct {
	client *Client
}

// MelodyOptions represents options for melody generation
type MelodyOptions struct {
	Style       string   `json:"style"`
	Tempo       int      `json:"tempo,omitempty"`
	Key         string   `json:"key,omitempty"`
	Mode        string   `json:"mode,omitempty"`
	Duration    int      `json:"duration,omitempty"`
	Instruments []string `json:"instruments,omitempty"`
	Complexity  string   `json:"complexity,omitempty"`
	Energy      string   `json:"energy,omitempty"`
}

// HarmonyOptions represents options for harmony generation
type HarmonyOptions struct {
	MelodyID    string   `json:"melodyId,omitempty"`
	Style       string   `json:"style,omitempty"`
	Complexity  string   `json:"complexity,omitempty"`
	Voicing     string   `json:"voicing,omitempty"`
	Instruments []string `json:"instruments,omitempty"`
}

// LyricsOptions represents options for lyrics generation
type LyricsOptions struct {
	Theme          string `json:"theme"`
	Genre          string `json:"genre,omitempty"`
	Language       string `json:"language,omitempty"`
	Mood           string `json:"mood,omitempty"`
	Structure      string `json:"structure,omitempty"`
	RhymeScheme    string `json:"rhymeScheme,omitempty"`
	SyllableCount  string `json:"syllableCount,omitempty"`
	InspirationText string `json:"inspirationText,omitempty"`
}

// SongOptions represents options for complete song generation
type SongOptions struct {
	Prompt         string `json:"prompt,omitempty"`
	MelodyID       string `json:"melodyId,omitempty"`
	HarmonyID      string `json:"harmonyId,omitempty"`
	LyricsID       string `json:"lyricsId,omitempty"`
	TemplateID     string `json:"templateId,omitempty"`
	Style          string `json:"style,omitempty"`
	Duration       int    `json:"duration,omitempty"`
	IncludeVocals  bool   `json:"includeVocals,omitempty"`
	VocalStyle     string `json:"vocalStyle,omitempty"`
	MixingStyle    string `json:"mixingStyle,omitempty"`
	MasteringPreset string `json:"masteringPreset,omitempty"`
}

// StyleTransferOptions represents options for style transfer
type StyleTransferOptions struct {
	SourceID          string  `json:"sourceId"`
	TargetStyle       string  `json:"targetStyle"`
	Intensity         float64 `json:"intensity,omitempty"`
	PreserveStructure bool    `json:"preserveStructure,omitempty"`
	PreserveTiming    bool    `json:"preserveTiming,omitempty"`
}

// TemplateFilter represents filters for song templates
type TemplateFilter struct {
	Genre    string `json:"genre,omitempty"`
	Mood     string `json:"mood,omitempty"`
	Duration string `json:"duration,omitempty"`
	Style    string `json:"style,omitempty"`
}

// GenerateMelody generates an AI melody
func (c *CopilotResource) GenerateMelody(ctx context.Context, options MelodyOptions) (*Generation, error) {
	var result Generation
	err := c.client.Post(ctx, "/copilot/melody", options, &result)
	return &result, err
}

// GenerateHarmony generates AI harmony for a melody
func (c *CopilotResource) GenerateHarmony(ctx context.Context, options HarmonyOptions) (*Generation, error) {
	var result Generation
	err := c.client.Post(ctx, "/copilot/harmony", options, &result)
	return &result, err
}

// GenerateLyrics generates AI lyrics
func (c *CopilotResource) GenerateLyrics(ctx context.Context, options LyricsOptions) (*Generation, error) {
	var result Generation
	err := c.client.Post(ctx, "/copilot/lyrics", options, &result)
	return &result, err
}

// CompleteSong generates a complete song with AI
func (c *CopilotResource) CompleteSong(ctx context.Context, options SongOptions) (*Generation, error) {
	var result Generation
	err := c.client.Post(ctx, "/copilot/complete-song", options, &result)
	return &result, err
}

// GetTemplates retrieves available song templates
func (c *CopilotResource) GetTemplates(ctx context.Context, filter *TemplateFilter) ([]map[string]interface{}, error) {
	params := make(map[string]string)
	if filter != nil {
		if filter.Genre != "" {
			params["genre"] = filter.Genre
		}
		if filter.Mood != "" {
			params["mood"] = filter.Mood
		}
		if filter.Duration != "" {
			params["duration"] = filter.Duration
		}
		if filter.Style != "" {
			params["style"] = filter.Style
		}
	}

	var result []map[string]interface{}
	err := c.client.Get(ctx, "/copilot/templates", params, &result)
	return result, err
}

// StyleTransfer applies style transfer to existing content
func (c *CopilotResource) StyleTransfer(ctx context.Context, options StyleTransferOptions) (*Generation, error) {
	var result Generation
	err := c.client.Post(ctx, "/copilot/style-transfer", options, &result)
	return &result, err
}

// GetGeneration retrieves a generation by ID
func (c *CopilotResource) GetGeneration(ctx context.Context, generationID string) (*Generation, error) {
	var result Generation
	err := c.client.Get(ctx, "/copilot/generations/"+generationID, nil, &result)
	return &result, err
}

// ListGenerations lists user's generations with pagination
func (c *CopilotResource) ListGenerations(ctx context.Context, page, perPage int, generationType string) (*ListResponse, error) {
	params := map[string]string{
		"page":    string(rune(page)),
		"perPage": string(rune(perPage)),
	}
	if generationType != "" {
		params["type"] = generationType
	}

	var result ListResponse
	err := c.client.Get(ctx, "/copilot/generations", params, &result)
	return &result, err
}