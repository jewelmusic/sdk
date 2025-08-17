package jewelmusic

import "time"

// Common types used across the SDK

// Track represents a music track
type Track struct {
	ID          string            `json:"id"`
	Title       string            `json:"title"`
	Artist      string            `json:"artist"`
	Album       string            `json:"album,omitempty"`
	Genre       string            `json:"genre,omitempty"`
	Duration    int               `json:"duration"`
	Status      string            `json:"status"`
	UploadedAt  time.Time         `json:"uploadedAt"`
	ProcessedAt *time.Time        `json:"processedAt,omitempty"`
	Metadata    map[string]string `json:"metadata,omitempty"`
	FileURL     string            `json:"fileUrl,omitempty"`
}

// TrackMetadata represents track metadata for uploads
type TrackMetadata struct {
	Title       string            `json:"title"`
	Artist      string            `json:"artist"`
	Album       string            `json:"album,omitempty"`
	Genre       string            `json:"genre,omitempty"`
	ReleaseDate string            `json:"releaseDate,omitempty"`
	Tags        []string          `json:"tags,omitempty"`
	Custom      map[string]string `json:"custom,omitempty"`
}

// Analysis represents audio analysis results
type Analysis struct {
	ID         string             `json:"id"`
	TrackID    string             `json:"trackId"`
	Status     string             `json:"status"`
	Tempo      TempoAnalysis      `json:"tempo"`
	Key        KeyAnalysis        `json:"key"`
	Structure  StructureAnalysis  `json:"structure"`
	Quality    QualityAnalysis    `json:"quality"`
	CreatedAt  time.Time          `json:"createdAt"`
	CompletedAt *time.Time        `json:"completedAt,omitempty"`
}

// TempoAnalysis represents tempo analysis
type TempoAnalysis struct {
	BPM        float64 `json:"bpm"`
	Confidence float64 `json:"confidence"`
	TimeSignature string `json:"timeSignature,omitempty"`
}

// KeyAnalysis represents key analysis
type KeyAnalysis struct {
	Key        string  `json:"key"`
	Mode       string  `json:"mode"`
	Confidence float64 `json:"confidence"`
}

// StructureAnalysis represents song structure analysis
type StructureAnalysis struct {
	Sections []Section `json:"sections"`
	Form     string    `json:"form,omitempty"`
}

// Section represents a song section
type Section struct {
	Type      string  `json:"type"`
	StartTime float64 `json:"startTime"`
	EndTime   float64 `json:"endTime"`
	Duration  float64 `json:"duration"`
}

// QualityAnalysis represents audio quality analysis
type QualityAnalysis struct {
	OverallScore float64            `json:"overallScore"`
	Details      map[string]float64 `json:"details"`
	Issues       []string           `json:"issues,omitempty"`
}

// Generation represents AI-generated content
type Generation struct {
	ID         string                 `json:"id"`
	Type       string                 `json:"type"`
	Status     string                 `json:"status"`
	Parameters map[string]interface{} `json:"parameters"`
	Result     interface{}            `json:"result,omitempty"`
	CreatedAt  time.Time             `json:"createdAt"`
	CompletedAt *time.Time            `json:"completedAt,omitempty"`
	PreviewURL string                 `json:"previewUrl,omitempty"`
	DownloadURL string                `json:"downloadUrl,omitempty"`
}

// Release represents a music release
type Release struct {
	ID          string      `json:"id"`
	Type        string      `json:"type"`
	Title       string      `json:"title"`
	Artist      string      `json:"artist"`
	ReleaseDate string      `json:"releaseDate"`
	Status      string      `json:"status"`
	Tracks      []ReleaseTrack `json:"tracks"`
	Platforms   []string    `json:"platforms"`
	Territories []string    `json:"territories"`
	CreatedAt   time.Time   `json:"createdAt"`
}

// ReleaseTrack represents a track in a release
type ReleaseTrack struct {
	TrackID   string `json:"trackId"`
	Title     string `json:"title"`
	Duration  int    `json:"duration"`
	ISRC      string `json:"isrc,omitempty"`
	Position  int    `json:"position"`
}

// Transcription represents AI transcription results
type Transcription struct {
	ID          string      `json:"id"`
	TrackID     string      `json:"trackId,omitempty"`
	Status      string      `json:"status"`
	Language    string      `json:"language"`
	Text        string      `json:"text"`
	Segments    []Segment   `json:"segments,omitempty"`
	Confidence  float64     `json:"confidence"`
	CreatedAt   time.Time   `json:"createdAt"`
	CompletedAt *time.Time  `json:"completedAt,omitempty"`
}

// Segment represents a transcription segment
type Segment struct {
	Text      string  `json:"text"`
	StartTime float64 `json:"startTime"`
	EndTime   float64 `json:"endTime"`
	Confidence float64 `json:"confidence"`
	Speaker   string  `json:"speaker,omitempty"`
}

// UserProfile represents user profile information
type UserProfile struct {
	ID           string       `json:"id"`
	Name         string       `json:"name"`
	Email        string       `json:"email"`
	Subscription Subscription `json:"subscription"`
	CreatedAt    time.Time    `json:"createdAt"`
}

// Subscription represents user subscription information
type Subscription struct {
	Plan            string    `json:"plan"`
	Status          string    `json:"status"`
	NextBillingDate time.Time `json:"nextBillingDate"`
	Features        []string  `json:"features"`
}

// AnalyticsData represents analytics data
type AnalyticsData struct {
	Summary    AnalyticsSummary  `json:"summary"`
	Data       []AnalyticsPoint  `json:"data"`
	Pagination PaginationInfo    `json:"pagination"`
}

// AnalyticsSummary represents analytics summary
type AnalyticsSummary struct {
	TotalStreams   int64   `json:"totalStreams"`
	TotalListeners int64   `json:"totalListeners"`
	TotalRevenue   float64 `json:"totalRevenue"`
	Period         string  `json:"period"`
}

// AnalyticsPoint represents a data point in analytics
type AnalyticsPoint struct {
	Date     string            `json:"date"`
	Metrics  map[string]int64  `json:"metrics"`
	Revenue  float64           `json:"revenue,omitempty"`
	Platform string            `json:"platform,omitempty"`
}

// Webhook represents a webhook configuration
type Webhook struct {
	ID          string   `json:"id"`
	URL         string   `json:"url"`
	Events      []string `json:"events"`
	Secret      string   `json:"secret,omitempty"`
	Active      bool     `json:"active"`
	Description string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// WebhookEvent represents a webhook event
type WebhookEvent struct {
	ID        string                 `json:"id"`
	Type      string                 `json:"type"`
	Data      map[string]interface{} `json:"data"`
	Timestamp time.Time              `json:"timestamp"`
}

// PaginationInfo represents pagination information
type PaginationInfo struct {
	Page        int `json:"page"`
	PerPage     int `json:"perPage"`
	Total       int `json:"total"`
	TotalPages  int `json:"totalPages"`
}

// ListResponse represents a paginated list response
type ListResponse struct {
	Items      interface{}    `json:"items"`
	Pagination PaginationInfo `json:"pagination"`
}