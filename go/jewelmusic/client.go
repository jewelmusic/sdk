// Package jewelmusic provides the official Go SDK for the JewelMusic platform
package jewelmusic

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

// Client represents the JewelMusic API client
type Client struct {
	apiKey     string
	baseURL    string
	httpClient *http.Client
	
	// Resource managers
	Copilot      *CopilotResource
	Analysis     *AnalysisResource
	Distribution *DistributionResource
	Transcription *TranscriptionResource
	Tracks       *TracksResource
	Analytics    *AnalyticsResource
	User         *UserResource
	Webhooks     *WebhooksResource
}

// ClientOption configures the client
type ClientOption func(*Client)

// NewClient creates a new JewelMusic API client
func NewClient(apiKey string, opts ...ClientOption) *Client {
	c := &Client{
		apiKey:  apiKey,
		baseURL: "https://api.jewelmusic.art",
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
	
	// Apply options
	for _, opt := range opts {
		opt(c)
	}
	
	// Initialize resource managers
	c.Copilot = &CopilotResource{client: c}
	c.Analysis = &AnalysisResource{client: c}
	c.Distribution = &DistributionResource{client: c}
	c.Transcription = &TranscriptionResource{client: c}
	c.Tracks = &TracksResource{client: c}
	c.Analytics = &AnalyticsResource{client: c}
	c.User = &UserResource{client: c}
	c.Webhooks = &WebhooksResource{client: c}
	
	return c
}

// WithEnvironment sets the environment (production, sandbox)
func WithEnvironment(env string) ClientOption {
	return func(c *Client) {
		switch env {
		case "sandbox":
			c.baseURL = "https://api-sandbox.jewelmusic.art"
		case "production":
			c.baseURL = "https://api.jewelmusic.art"
		default:
			c.baseURL = "https://api.jewelmusic.art"
		}
	}
}

// WithBaseURL sets a custom base URL
func WithBaseURL(baseURL string) ClientOption {
	return func(c *Client) {
		c.baseURL = baseURL
	}
}

// WithHTTPClient sets a custom HTTP client
func WithHTTPClient(httpClient *http.Client) ClientOption {
	return func(c *Client) {
		c.httpClient = httpClient
	}
}

// PingResponse represents the ping response
type PingResponse struct {
	Success   bool   `json:"success"`
	Timestamp string `json:"timestamp"`
	Version   string `json:"version"`
}

// Ping tests the API connection and authentication
func (c *Client) Ping(ctx context.Context) (*PingResponse, error) {
	var response PingResponse
	err := c.makeRequest(ctx, "GET", "/v1/ping", nil, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

// makeRequest is a helper method for making HTTP requests
func (c *Client) makeRequest(ctx context.Context, method, path string, body interface{}, result interface{}) error {
	// Implementation will be added in the next step
	return fmt.Errorf("makeRequest not implemented yet")
}

// Resource base types (placeholder implementations)
type CopilotResource struct{ client *Client }
type AnalysisResource struct{ client *Client }
type DistributionResource struct{ client *Client }
type TranscriptionResource struct{ client *Client }
type TracksResource struct{ client *Client }
type AnalyticsResource struct{ client *Client }
type UserResource struct{ client *Client }
type WebhooksResource struct{ client *Client }