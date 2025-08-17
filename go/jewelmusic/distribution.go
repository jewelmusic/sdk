package jewelmusic

import "context"

// DistributionResource manages music distribution to streaming platforms
type DistributionResource struct {
	client *Client
}

// CreateReleaseOptions represents options for creating a release
type CreateReleaseOptions struct {
	Type        string         `json:"type"`
	Title       string         `json:"title"`
	Artist      string         `json:"artist"`
	ReleaseDate string         `json:"releaseDate"`
	Tracks      []ReleaseTrack `json:"tracks"`
	Territories []string       `json:"territories,omitempty"`
	Platforms   []string       `json:"platforms,omitempty"`
	Label       string         `json:"label,omitempty"`
	Copyright   string         `json:"copyright,omitempty"`
	Genre       string         `json:"genre,omitempty"`
	Explicit    bool           `json:"explicit,omitempty"`
}

// SubmissionOptions represents options for platform submission
type SubmissionOptions struct {
	Platforms     []string `json:"platforms"`
	ScheduledDate string   `json:"scheduledDate,omitempty"`
	Priority      string   `json:"priority,omitempty"`
	AutoGo        bool     `json:"autoGo,omitempty"`
}

// TakedownOptions represents options for takedown requests
type TakedownOptions struct {
	Platforms []string `json:"platforms"`
	Reason    string   `json:"reason,omitempty"`
	Immediate bool     `json:"immediate,omitempty"`
}

// ReleaseFilter represents filters for listing releases
type ReleaseFilter struct {
	Status      string `json:"status,omitempty"`
	Type        string `json:"type,omitempty"`
	Artist      string `json:"artist,omitempty"`
	DateFrom    string `json:"dateFrom,omitempty"`
	DateTo      string `json:"dateTo,omitempty"`
	Platform    string `json:"platform,omitempty"`
}

// CreateRelease creates a new release for distribution
func (d *DistributionResource) CreateRelease(ctx context.Context, options CreateReleaseOptions) (*Release, error) {
	var result Release
	err := d.client.Post(ctx, "/distribution/releases", options, &result)
	return &result, err
}

// GetReleases lists releases with filtering and pagination
func (d *DistributionResource) GetReleases(ctx context.Context, page, perPage int, filter *ReleaseFilter) (*ListResponse, error) {
	params := map[string]string{
		"page":    string(rune(page)),
		"perPage": string(rune(perPage)),
	}
	
	if filter != nil {
		if filter.Status != "" {
			params["status"] = filter.Status
		}
		if filter.Type != "" {
			params["type"] = filter.Type
		}
		if filter.Artist != "" {
			params["artist"] = filter.Artist
		}
		if filter.DateFrom != "" {
			params["dateFrom"] = filter.DateFrom
		}
		if filter.DateTo != "" {
			params["dateTo"] = filter.DateTo
		}
		if filter.Platform != "" {
			params["platform"] = filter.Platform
		}
	}

	var result ListResponse
	err := d.client.Get(ctx, "/distribution/releases", params, &result)
	return &result, err
}

// GetRelease retrieves a specific release by ID
func (d *DistributionResource) GetRelease(ctx context.Context, releaseID string) (*Release, error) {
	var result Release
	err := d.client.Get(ctx, "/distribution/releases/"+releaseID, nil, &result)
	return &result, err
}

// UpdateRelease updates an existing release
func (d *DistributionResource) UpdateRelease(ctx context.Context, releaseID string, updates map[string]interface{}) (*Release, error) {
	var result Release
	err := d.client.Put(ctx, "/distribution/releases/"+releaseID, updates, &result)
	return &result, err
}

// CancelRelease cancels a release
func (d *DistributionResource) CancelRelease(ctx context.Context, releaseID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := d.client.Delete(ctx, "/distribution/releases/"+releaseID, &result)
	return result, err
}

// SubmitToPlatforms submits a release to streaming platforms
func (d *DistributionResource) SubmitToPlatforms(ctx context.Context, releaseID string, options SubmissionOptions) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := d.client.Post(ctx, "/distribution/releases/"+releaseID+"/submit", options, &result)
	return result, err
}

// GetDistributionStatus gets the distribution status of a release
func (d *DistributionResource) GetDistributionStatus(ctx context.Context, releaseID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := d.client.Get(ctx, "/distribution/releases/"+releaseID+"/status", nil, &result)
	return result, err
}

// TakedownFromPlatforms removes a release from platforms
func (d *DistributionResource) TakedownFromPlatforms(ctx context.Context, releaseID string, options TakedownOptions) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := d.client.Post(ctx, "/distribution/releases/"+releaseID+"/takedown", options, &result)
	return result, err
}

// GetSupportedPlatforms retrieves list of supported streaming platforms
func (d *DistributionResource) GetSupportedPlatforms(ctx context.Context) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	err := d.client.Get(ctx, "/distribution/platforms", nil, &result)
	return result, err
}

// ValidateRelease validates release data before submission
func (d *DistributionResource) ValidateRelease(ctx context.Context, releaseData CreateReleaseOptions) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := d.client.Post(ctx, "/distribution/validate", releaseData, &result)
	return result, err
}

// ScheduleRelease schedules a release for a specific date
func (d *DistributionResource) ScheduleRelease(ctx context.Context, releaseID string, date string) (map[string]interface{}, error) {
	options := map[string]string{"scheduledDate": date}
	var result map[string]interface{}
	err := d.client.Post(ctx, "/distribution/releases/"+releaseID+"/schedule", options, &result)
	return result, err
}

// GeneratePreview generates a preview for the release
func (d *DistributionResource) GeneratePreview(ctx context.Context, releaseID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := d.client.Post(ctx, "/distribution/releases/"+releaseID+"/preview", nil, &result)
	return result, err
}