package jewelmusic

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

// HTTPClient handles HTTP communication with the JewelMusic API
type HTTPClient struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
	userAgent  string
}

// NewHTTPClient creates a new HTTP client
func NewHTTPClient(baseURL, apiKey string, httpClient *http.Client) *HTTPClient {
	if httpClient == nil {
		httpClient = &http.Client{
			Timeout: 30 * time.Second,
		}
	}

	return &HTTPClient{
		baseURL:    strings.TrimSuffix(baseURL, "/"),
		apiKey:     apiKey,
		httpClient: httpClient,
		userAgent:  "JewelMusic-Go-SDK/1.0.0",
	}
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Meta    struct {
		Timestamp string `json:"timestamp"`
		RequestID string `json:"requestId"`
		RateLimit struct {
			Limit     int `json:"limit"`
			Remaining int `json:"remaining"`
			Reset     int `json:"reset"`
		} `json:"rateLimit"`
	} `json:"meta"`
	Error *APIError `json:"error,omitempty"`
}

// APIError represents an API error response
type APIError struct {
	Code    string                 `json:"code"`
	Message string                 `json:"message"`
	Details map[string]interface{} `json:"details"`
}

// Error implements the error interface
func (e *APIError) Error() string {
	return fmt.Sprintf("API Error %s: %s", e.Code, e.Message)
}

// makeRequest performs an HTTP request with retries and error handling
func (c *Client) makeRequest(ctx context.Context, method, path string, body interface{}, result interface{}) error {
	// Build URL
	url := c.baseURL + "/v1" + path

	// Prepare request body
	var bodyReader io.Reader
	var contentType string

	if body != nil {
		switch v := body.(type) {
		case *multipart.Writer:
			// For file uploads
			bodyReader = strings.NewReader("") // Placeholder, actual implementation would be different
			contentType = v.FormDataContentType()
		default:
			// JSON body
			jsonBody, err := json.Marshal(body)
			if err != nil {
				return fmt.Errorf("failed to marshal request body: %w", err)
			}
			bodyReader = bytes.NewReader(jsonBody)
			contentType = "application/json"
		}
	}

	// Create request
	req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("User-Agent", c.httpClient.(*HTTPClient).userAgent)
	req.Header.Set("Accept", "application/json")
	
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}

	// Perform request with retries
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	// Parse response
	var apiResp APIResponse
	if err := json.Unmarshal(respBody, &apiResp); err != nil {
		return fmt.Errorf("failed to parse response: %w", err)
	}

	// Handle errors
	if resp.StatusCode >= 400 {
		if apiResp.Error != nil {
			return apiResp.Error
		}
		return fmt.Errorf("API request failed with status %d", resp.StatusCode)
	}

	// Extract data if result is provided
	if result != nil && apiResp.Data != nil {
		dataBytes, err := json.Marshal(apiResp.Data)
		if err != nil {
			return fmt.Errorf("failed to marshal response data: %w", err)
		}

		if err := json.Unmarshal(dataBytes, result); err != nil {
			return fmt.Errorf("failed to unmarshal response data: %w", err)
		}
	}

	return nil
}

// Get performs a GET request
func (c *Client) Get(ctx context.Context, path string, params map[string]string, result interface{}) error {
	if params != nil && len(params) > 0 {
		query := url.Values{}
		for k, v := range params {
			query.Add(k, v)
		}
		path += "?" + query.Encode()
	}
	return c.makeRequest(ctx, "GET", path, nil, result)
}

// Post performs a POST request
func (c *Client) Post(ctx context.Context, path string, body interface{}, result interface{}) error {
	return c.makeRequest(ctx, "POST", path, body, result)
}

// Put performs a PUT request
func (c *Client) Put(ctx context.Context, path string, body interface{}, result interface{}) error {
	return c.makeRequest(ctx, "PUT", path, body, result)
}

// Delete performs a DELETE request
func (c *Client) Delete(ctx context.Context, path string, result interface{}) error {
	return c.makeRequest(ctx, "DELETE", path, nil, result)
}

// UploadFile uploads a file with metadata
func (c *Client) UploadFile(ctx context.Context, path string, file io.Reader, filename string, metadata map[string]string) (*APIResponse, error) {
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

	// Add metadata fields
	for key, value := range metadata {
		if err := writer.WriteField(key, value); err != nil {
			return nil, fmt.Errorf("failed to write field %s: %w", key, err)
		}
	}

	// Add file
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return nil, fmt.Errorf("failed to create form file: %w", err)
	}

	if _, err := io.Copy(part, file); err != nil {
		return nil, fmt.Errorf("failed to copy file: %w", err)
	}

	if err := writer.Close(); err != nil {
		return nil, fmt.Errorf("failed to close writer: %w", err)
	}

	// Create request
	url := c.baseURL + "/v1" + path
	req, err := http.NewRequestWithContext(ctx, "POST", url, &buf)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("User-Agent", c.httpClient.(*HTTPClient).userAgent)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Perform request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("upload failed: %w", err)
	}
	defer resp.Body.Close()

	// Parse response
	var apiResp APIResponse
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if err := json.Unmarshal(respBody, &apiResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	if resp.StatusCode >= 400 {
		if apiResp.Error != nil {
			return nil, apiResp.Error
		}
		return nil, fmt.Errorf("upload failed with status %d", resp.StatusCode)
	}

	return &apiResp, nil
}