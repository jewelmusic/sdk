package jewelmusic

import (
	"context"
	"io"
	"strconv"
)

// UserResource manages user profile, preferences, and account settings
type UserResource struct {
	client *Client
}

// ProfileUpdate represents profile update data
type ProfileUpdate struct {
	Name        string                 `json:"name,omitempty"`
	Bio         string                 `json:"bio,omitempty"`
	Website     string                 `json:"website,omitempty"`
	Location    string                 `json:"location,omitempty"`
	SocialLinks map[string]string      `json:"socialLinks,omitempty"`
	ArtistInfo  map[string]interface{} `json:"artistInfo,omitempty"`
}

// Preferences represents user preferences
type Preferences struct {
	Notifications map[string]bool        `json:"notifications,omitempty"`
	UI            map[string]string      `json:"ui,omitempty"`
	Privacy       map[string]interface{} `json:"privacy,omitempty"`
	API           map[string]int         `json:"api,omitempty"`
}

// APIKeyPermissions represents API key permissions
type APIKeyPermissions struct {
	Scopes         []string `json:"scopes"`
	RateLimit      int      `json:"rateLimit,omitempty"`
	IPRestrictions []string `json:"ipRestrictions,omitempty"`
	ExpiresAt      string   `json:"expiresAt,omitempty"`
	Description    string   `json:"description,omitempty"`
}

// APIKeyUpdate represents API key update data
type APIKeyUpdate struct {
	Name           string   `json:"name,omitempty"`
	Scopes         []string `json:"scopes,omitempty"`
	RateLimit      int      `json:"rateLimit,omitempty"`
	IPRestrictions []string `json:"ipRestrictions,omitempty"`
	ExpiresAt      string   `json:"expiresAt,omitempty"`
	Description    string   `json:"description,omitempty"`
	Active         *bool    `json:"active,omitempty"`
}

// UsageStatsOptions represents options for usage statistics
type UsageStatsOptions struct {
	Period            string `json:"period,omitempty"`
	StartDate         string `json:"startDate,omitempty"`
	EndDate           string `json:"endDate,omitempty"`
	GroupBy           string `json:"groupBy,omitempty"`
	IncludeBreakdown  bool   `json:"includeBreakdown,omitempty"`
	APIKeyID          string `json:"apiKeyId,omitempty"`
}

// BillingOptions represents options for billing queries
type BillingOptions struct {
	IncludeInvoices bool   `json:"includeInvoices,omitempty"`
	InvoiceLimit    int    `json:"invoiceLimit,omitempty"`
	InvoiceStatus   string `json:"invoiceStatus,omitempty"`
}

// BillingUpdate represents billing information updates
type BillingUpdate struct {
	PaymentMethod  map[string]string `json:"paymentMethod,omitempty"`
	BillingAddress map[string]string `json:"billingAddress,omitempty"`
	TaxID          string            `json:"taxId,omitempty"`
	Company        string            `json:"company,omitempty"`
}

// ExportDataOptions represents options for data export
type ExportDataOptions struct {
	Format           string `json:"format,omitempty"`
	IncludeMetadata  bool   `json:"includeMetadata,omitempty"`
	IncludeTracks    bool   `json:"includeTracks,omitempty"`
	IncludeAnalytics bool   `json:"includeAnalytics,omitempty"`
	Email            string `json:"email,omitempty"`
}

// GetProfile gets user profile information
func (u *UserResource) GetProfile(ctx context.Context) (*UserProfile, error) {
	var result UserProfile
	err := u.client.Get(ctx, "/user/profile", nil, &result)
	return &result, err
}

// UpdateProfile updates user profile information
func (u *UserResource) UpdateProfile(ctx context.Context, updates ProfileUpdate) (*UserProfile, error) {
	var result UserProfile
	err := u.client.Put(ctx, "/user/profile", updates, &result)
	return &result, err
}

// UploadAvatar uploads user avatar image
func (u *UserResource) UploadAvatar(ctx context.Context, avatarFile io.Reader, filename string) (map[string]interface{}, error) {
	resp, err := u.client.UploadFile(ctx, "/user/avatar", avatarFile, filename, nil)
	if err != nil {
		return nil, err
	}

	result := make(map[string]interface{})
	// Convert response data to map
	return result, nil
}

// GetPreferences gets user preferences and settings
func (u *UserResource) GetPreferences(ctx context.Context) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := u.client.Get(ctx, "/user/preferences", nil, &result)
	return result, err
}

// UpdatePreferences updates user preferences and settings
func (u *UserResource) UpdatePreferences(ctx context.Context, preferences Preferences) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := u.client.Put(ctx, "/user/preferences", preferences, &result)
	return result, err
}

// GetAPIKeys gets list of user's API keys
func (u *UserResource) GetAPIKeys(ctx context.Context) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	err := u.client.Get(ctx, "/user/api-keys", nil, &result)
	return result, err
}

// CreateAPIKey creates a new API key
func (u *UserResource) CreateAPIKey(ctx context.Context, name string, permissions APIKeyPermissions) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"name":        name,
		"scopes":      permissions.Scopes,
		"rateLimit":   permissions.RateLimit,
		"ipRestrictions": permissions.IPRestrictions,
		"expiresAt":   permissions.ExpiresAt,
		"description": permissions.Description,
	}

	var result map[string]interface{}
	err := u.client.Post(ctx, "/user/api-keys", requestData, &result)
	return result, err
}

// UpdateAPIKey updates an existing API key
func (u *UserResource) UpdateAPIKey(ctx context.Context, keyID string, updates APIKeyUpdate) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := u.client.Put(ctx, "/user/api-keys/"+keyID, updates, &result)
	return result, err
}

// RevokeAPIKey revokes (deletes) an API key
func (u *UserResource) RevokeAPIKey(ctx context.Context, keyID string) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := u.client.Delete(ctx, "/user/api-keys/"+keyID, &result)
	return result, err
}

// GetUsageStats gets detailed API usage statistics
func (u *UserResource) GetUsageStats(ctx context.Context, options *UsageStatsOptions) (map[string]interface{}, error) {
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
		if options.IncludeBreakdown {
			params["includeBreakdown"] = "true"
		}
		if options.APIKeyID != "" {
			params["apiKeyId"] = options.APIKeyID
		}
	}

	var result map[string]interface{}
	err := u.client.Get(ctx, "/user/usage", params, &result)
	return result, err
}

// GetBilling gets billing information and invoices
func (u *UserResource) GetBilling(ctx context.Context, options *BillingOptions) (map[string]interface{}, error) {
	params := make(map[string]string)
	
	if options != nil {
		if options.IncludeInvoices {
			params["includeInvoices"] = "true"
		}
		if options.InvoiceLimit > 0 {
			params["invoiceLimit"] = strconv.Itoa(options.InvoiceLimit)
		}
		if options.InvoiceStatus != "" {
			params["invoiceStatus"] = options.InvoiceStatus
		}
	}

	var result map[string]interface{}
	err := u.client.Get(ctx, "/user/billing", params, &result)
	return result, err
}

// UpdateBilling updates billing information
func (u *UserResource) UpdateBilling(ctx context.Context, billingData BillingUpdate) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := u.client.Put(ctx, "/user/billing", billingData, &result)
	return result, err
}

// DownloadInvoice downloads invoice by ID
func (u *UserResource) DownloadInvoice(ctx context.Context, invoiceID string, format string) (map[string]interface{}, error) {
	params := map[string]string{
		"format": format,
	}

	var result map[string]interface{}
	err := u.client.Get(ctx, "/user/billing/invoices/"+invoiceID, params, &result)
	return result, err
}

// GetLimits gets account limits and quotas
func (u *UserResource) GetLimits(ctx context.Context) (map[string]interface{}, error) {
	var result map[string]interface{}
	err := u.client.Get(ctx, "/user/limits", nil, &result)
	return result, err
}

// DeleteAccount deletes user account
func (u *UserResource) DeleteAccount(ctx context.Context, confirmEmail string, reason string, deleteData bool) (map[string]interface{}, error) {
	requestData := map[string]interface{}{
		"confirmEmail": confirmEmail,
		"reason":       reason,
		"deleteData":   deleteData,
	}

	var result map[string]interface{}
	err := u.client.Delete(ctx, "/user/account", &result)
	return result, err
}

// ExportData exports user data
func (u *UserResource) ExportData(ctx context.Context, options *ExportDataOptions) (map[string]interface{}, error) {
	requestData := make(map[string]interface{})
	
	if options != nil {
		if options.Format != "" {
			requestData["format"] = options.Format
		}
		if options.IncludeMetadata {
			requestData["includeMetadata"] = true
		}
		if options.IncludeTracks {
			requestData["includeTracks"] = true
		}
		if options.IncludeAnalytics {
			requestData["includeAnalytics"] = true
		}
		if options.Email != "" {
			requestData["email"] = options.Email
		}
	}

	var result map[string]interface{}
	err := u.client.Post(ctx, "/user/export", requestData, &result)
	return result, err
}