package jewelmusic

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"
)

// WebhooksResource manages webhook endpoints and delivery configurations
type WebhooksResource struct {
	client *Client
}

// WebhookCreate represents webhook creation data
type WebhookCreate struct {
	URL         string            `json:"url"`
	Events      []string          `json:"events"`
	Secret      string            `json:"secret,omitempty"`
	Active      bool              `json:"active,omitempty"`
	Description string            `json:"description,omitempty"`
	Headers     map[string]string `json:"headers,omitempty"`
	Timeout     int               `json:"timeout,omitempty"`
	RetryPolicy *RetryPolicy      `json:"retryPolicy,omitempty"`
}

// WebhookUpdate represents webhook update data
type WebhookUpdate struct {
	URL         string            `json:"url,omitempty"`
	Events      []string          `json:"events,omitempty"`
	Secret      string            `json:"secret,omitempty"`
	Active      *bool             `json:"active,omitempty"`
	Description string            `json:"description,omitempty"`
	Headers     map[string]string `json:"headers,omitempty"`
	Timeout     int               `json:"timeout,omitempty"`
	RetryPolicy *RetryPolicy      `json:"retryPolicy,omitempty"`
}

// RetryPolicy represents webhook retry configuration
type RetryPolicy struct {
	MaxRetries        int `json:"maxRetries"`
	BackoffMultiplier int `json:"backoffMultiplier"`
	MaxBackoffDelay   int `json:"maxBackoffDelay"`
}

// WebhookFilter represents filters for listing webhooks
type WebhookFilter struct {
	Active bool     `json:"active,omitempty"`
	Events []string `json:"events,omitempty"`
	URL    string   `json:"url,omitempty"`
}

// DeliveryFilter represents filters for webhook deliveries
type DeliveryFilter struct {
	Status    string `json:"status,omitempty"`
	EventType string `json:"eventType,omitempty"`
	StartDate string `json:"startDate,omitempty"`
	EndDate   string `json:"endDate,omitempty"`
}

// StatisticsOptions represents options for webhook statistics
type StatisticsOptions struct {
	Period    string `json:"period,omitempty"`
	StartDate string `json:"startDate,omitempty"`
	EndDate   string `json:"endDate,omitempty"`
	GroupBy   string `json:"groupBy,omitempty"`
}

// List gets list of webhooks with filtering and pagination
func (w *WebhooksResource) List(ctx context.Context, page, perPage int, filter *WebhookFilter) (*ListResponse, error) {
	params := map[string]string{
		"page":    strconv.Itoa(page),
		"perPage": strconv.Itoa(perPage),
	}
	
	if filter != nil {
		if filter.Active {
			params["active"] = "true"
		}
		if len(filter.Events) > 0 {
			params["events"] = strings.Join(filter.Events, ",")
		}
		if filter.URL != "" {
			params["url"] = filter.URL
		}
	}

	var result ListResponse
	err := w.client.Get(ctx, "/webhooks", params, &result)
	return &result, err
}

// Get gets a specific webhook by ID
func (w *WebhooksResource) Get(ctx context.Context, webhookID string) (*Webhook, error) {
	var result Webhook
	err := w.client.Get(ctx, "/webhooks/"+webhookID, nil, &result)
	return &result, err
}

// Create creates a new webhook endpoint
func (w *WebhooksResource) Create(ctx context.Context, webhookData WebhookCreate) (*Webhook, error) {
	var result Webhook
	err := w.client.Post(ctx, "/webhooks", webhookData, &result)
	return &result, err
}

// Update updates an existing webhook
func (w *WebhooksResource) Update(ctx context.Context, webhookID string, updates WebhookUpdate) (*Webhook, error) {
	var result Webhook
	err := w.client.Put(ctx, "/webhooks/"+webhookID, updates, &result)
	return &result, err
}

// Delete deletes a webhook
func (w *WebhooksResource) Delete(ctx context.Context, webhookID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := w.client.Delete(ctx, "/webhooks/"+webhookID, &result)
	return result, err
}

// Test tests a webhook by sending a test event
func (w *WebhooksResource) Test(ctx context.Context, webhookID string, eventType string) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"eventType": eventType,
	}
	if eventType == "" {
		requestData["eventType"] = "webhook.test"
	}

	var result map[string]interface{}
	err := w.client.Post(ctx, "/webhooks/"+webhookID+"/test", requestData, &result)
	return result, err
}

// GetDeliveries gets webhook delivery history
func (w *WebhooksResource) GetDeliveries(ctx context.Context, webhookID string, page, perPage int, filter *DeliveryFilter) (*ListResponse, error) {
	params := map[string]string{
		"page":    strconv.Itoa(page),
		"perPage": strconv.Itoa(perPage),
	}
	
	if filter != nil {
		if filter.Status != "" {
			params["status"] = filter.Status
		}
		if filter.EventType != "" {
			params["eventType"] = filter.EventType
		}
		if filter.StartDate != "" {
			params["startDate"] = filter.StartDate
		}
		if filter.EndDate != "" {
			params["endDate"] = filter.EndDate
		}
	}

	var result ListResponse
	err := w.client.Get(ctx, "/webhooks/"+webhookID+"/deliveries", params, &result)
	return &result, err
}

// GetDelivery gets specific webhook delivery details
func (w *WebhooksResource) GetDelivery(ctx context.Context, webhookID, deliveryID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := w.client.Get(ctx, "/webhooks/"+webhookID+"/deliveries/"+deliveryID, nil, &result)
	return result, err
}

// RetryDelivery retries a failed webhook delivery
func (w *WebhooksResource) RetryDelivery(ctx context.Context, webhookID, deliveryID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := w.client.Post(ctx, "/webhooks/"+webhookID+"/deliveries/"+deliveryID+"/retry", nil, &result)
	return result, err
}

// GetEventTypes gets available webhook event types
func (w *WebhooksResource) GetEventTypes(ctx context.Context) ([]string, error) {
	var result []string
	err := w.client.Get(ctx, "/webhooks/events/types", nil, &result)
	return result, err
}

// GetStatistics gets webhook statistics and metrics
func (w *WebhooksResource) GetStatistics(ctx context.Context, webhookID string, options *StatisticsOptions) (map[string]interface{}, error) {
	params := make(map[string]string)
	
	if options != nil {
		if options.Period != "" {
			params["period"] = options.Period
		}
		if options.StartDate != "" {
			params["startDate"] = options.StartDate
		}
		if options.EndDate != "" {
			params["endDate"] = options.EndDate
		}
		if options.GroupBy != "" {
			params["groupBy"] = options.GroupBy
		}
	}

	var result map[string]interface{}
	err := w.client.Get(ctx, "/webhooks/"+webhookID+"/statistics", params, &result)
	return result, err
}

// VerifySignature verifies webhook signature
// This is a static method that can be used to verify webhook signatures
// without making an API call.
func VerifySignature(payload []byte, signature, secret string, tolerance int) bool {
	// Parse signature header (format: "t=timestamp,v1=hash")
	elements := strings.Split(signature, ",")
	var timestamp int64
	var hash string
	
	for _, element := range elements {
		if strings.HasPrefix(element, "t=") {
			timestampStr := strings.TrimPrefix(element, "t=")
			var err error
			timestamp, err = strconv.ParseInt(timestampStr, 10, 64)
			if err != nil {
				return false
			}
		} else if strings.HasPrefix(element, "v1=") {
			hash = strings.TrimPrefix(element, "v1=")
		}
	}
	
	if timestamp == 0 || hash == "" {
		return false
	}
	
	// Check timestamp tolerance
	now := time.Now().Unix()
	if abs(now-timestamp) > int64(tolerance) {
		return false
	}
	
	// Verify signature
	signedPayload := fmt.Sprintf("%d.%s", timestamp, string(payload))
	expectedHash := hmac.New(sha256.New, []byte(secret))
	expectedHash.Write([]byte(signedPayload))
	expectedHashHex := hex.EncodeToString(expectedHash.Sum(nil))
	
	return hmac.Equal([]byte(hash), []byte(expectedHashHex))
}

// ParseEvent parses webhook event payload
// This is a static method to safely parse webhook event data.
func ParseEvent(payload []byte) (*WebhookEvent, error) {
	var event WebhookEvent
	err := json.Unmarshal(payload, &event)
	if err != nil {
		return nil, fmt.Errorf("invalid webhook payload format: %w", err)
	}
	return &event, nil
}

// CreateSignature creates webhook signature for testing
// This utility method can be used for testing webhook signature verification.
func CreateSignature(payload []byte, secret string, timestamp *int64) string {
	var ts int64
	if timestamp != nil {
		ts = *timestamp
	} else {
		ts = time.Now().Unix()
	}
	
	signedPayload := fmt.Sprintf("%d.%s", ts, string(payload))
	hash := hmac.New(sha256.New, []byte(secret))
	hash.Write([]byte(signedPayload))
	hashHex := hex.EncodeToString(hash.Sum(nil))
	
	return fmt.Sprintf("t=%d,v1=%s", ts, hashHex)
}

// Helper function for absolute value
func abs(x int64) int64 {
	if x < 0 {
		return -x
	}
	return x
}