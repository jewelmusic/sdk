<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * User resource for profile management, preferences, and account settings
 */
class UserResource extends BaseResource
{
    /**
     * Get user profile information
     *
     * @return array User profile data
     */
    public function getProfile(): array
    {
        $response = $this->httpClient->get('/user/profile');
        return $this->extractData($response);
    }

    /**
     * Update user profile information
     *
     * @param array $updates Profile updates
     *                      - name: User display name
     *                      - bio: User biography
     *                      - website: User website URL
     *                      - location: User location
     *                      - socialLinks: Social media links
     *                      - artistInfo: Artist-specific information
     * @return array Updated profile data
     */
    public function updateProfile(array $updates): array
    {
        $response = $this->httpClient->put('/user/profile', $this->filterNullValues($updates));
        return $this->extractData($response);
    }

    /**
     * Upload user avatar image
     *
     * @param string|resource $avatarFile Avatar image file
     * @param string $filename Avatar filename
     * @return array Avatar upload result
     */
    public function uploadAvatar($avatarFile, string $filename): array
    {
        $this->validateRequired([
            'avatarFile' => $avatarFile,
            'filename' => $filename
        ], ['avatarFile', 'filename']);
        
        $response = $this->httpClient->uploadFile('/user/avatar', $avatarFile, $filename);
        return $this->extractData($response);
    }

    /**
     * Get user preferences and settings
     *
     * @return array User preferences
     */
    public function getPreferences(): array
    {
        $response = $this->httpClient->get('/user/preferences');
        return $this->extractData($response);
    }

    /**
     * Update user preferences and settings
     *
     * @param array $preferences User preferences
     *                          - notifications: Notification preferences
     *                          - ui: UI preferences
     *                          - privacy: Privacy settings
     *                          - api: API preferences
     * @return array Updated preferences
     */
    public function updatePreferences(array $preferences): array
    {
        $response = $this->httpClient->put('/user/preferences', $this->filterNullValues($preferences));
        return $this->extractData($response);
    }

    /**
     * Get list of user's API keys
     *
     * @return array List of API keys
     */
    public function getApiKeys(): array
    {
        $response = $this->httpClient->get('/user/api-keys');
        return $this->extractData($response);
    }

    /**
     * Create a new API key
     *
     * @param string $name API key name
     * @param array $permissions API key permissions
     *                          - scopes: Permission scopes
     *                          - rateLimit: Rate limit for this key
     *                          - ipRestrictions: IP address restrictions
     *                          - expiresAt: Expiration date
     *                          - description: Key description
     * @return array Created API key data
     */
    public function createApiKey(string $name, array $permissions = []): array
    {
        $this->validateRequired(['name' => $name], ['name']);
        
        $data = array_merge(['name' => $name], $this->filterNullValues($permissions));
        $response = $this->httpClient->post('/user/api-keys', $data);
        return $this->extractData($response);
    }

    /**
     * Update an existing API key
     *
     * @param string $keyId API key ID
     * @param array $updates API key updates
     * @return array Updated API key data
     */
    public function updateApiKey(string $keyId, array $updates): array
    {
        $this->validateRequired(['keyId' => $keyId], ['keyId']);
        
        $response = $this->httpClient->put("/user/api-keys/{$keyId}", $this->filterNullValues($updates));
        return $this->extractData($response);
    }

    /**
     * Revoke (delete) an API key
     *
     * @param string $keyId API key ID
     * @return array Revocation confirmation
     */
    public function revokeApiKey(string $keyId): array
    {
        $this->validateRequired(['keyId' => $keyId], ['keyId']);
        
        $response = $this->httpClient->delete("/user/api-keys/{$keyId}");
        return $this->extractData($response);
    }

    /**
     * Get detailed API usage statistics
     *
     * @param array $options Usage statistics options
     *                      - period: Statistics period
     *                      - startDate: Start date for statistics
     *                      - endDate: End date for statistics
     *                      - groupBy: Data grouping method
     *                      - includeBreakdown: Include detailed breakdown
     *                      - apiKeyId: Specific API key to analyze
     * @return array Usage statistics
     */
    public function getUsageStats(array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get('/user/usage', $params);
        return $this->extractData($response);
    }

    /**
     * Get billing information and invoices
     *
     * @param array $options Billing query options
     *                      - includeInvoices: Include invoice history
     *                      - invoiceLimit: Number of invoices to return
     *                      - invoiceStatus: Filter by invoice status
     * @return array Billing information
     */
    public function getBilling(array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get('/user/billing', $params);
        return $this->extractData($response);
    }

    /**
     * Update billing information
     *
     * @param array $billingData Updated billing information
     *                          - paymentMethod: Payment method details
     *                          - billingAddress: Billing address
     *                          - taxId: Tax identification number
     *                          - company: Company information
     * @return array Updated billing information
     */
    public function updateBilling(array $billingData): array
    {
        $response = $this->httpClient->put('/user/billing', $this->filterNullValues($billingData));
        return $this->extractData($response);
    }

    /**
     * Download invoice by ID
     *
     * @param string $invoiceId Invoice ID
     * @param string $format Download format (pdf, json)
     * @return array Invoice download data
     */
    public function downloadInvoice(string $invoiceId, string $format = 'pdf'): array
    {
        $this->validateRequired(['invoiceId' => $invoiceId], ['invoiceId']);
        
        $params = ['format' => $format];
        $response = $this->httpClient->get("/user/billing/invoices/{$invoiceId}", $params);
        return $this->extractData($response);
    }

    /**
     * Get account limits and quotas
     *
     * @return array Account limits information
     */
    public function getLimits(): array
    {
        $response = $this->httpClient->get('/user/limits');
        return $this->extractData($response);
    }

    /**
     * Get user activity log
     *
     * @param array $filters Activity filters
     *                      - startDate: Start date for activity log
     *                      - endDate: End date for activity log
     *                      - actionType: Type of actions to include
     *                      - limit: Number of entries to return
     * @return array Activity log entries
     */
    public function getActivityLog(array $filters = []): array
    {
        $params = $this->buildParams([], $filters);
        $response = $this->httpClient->get('/user/activity', $params);
        return $this->extractData($response);
    }

    /**
     * Get user notifications
     *
     * @param array $filters Notification filters
     *                      - unreadOnly: Show only unread notifications
     *                      - type: Notification type filter
     *                      - limit: Number of notifications to return
     * @return array User notifications
     */
    public function getNotifications(array $filters = []): array
    {
        $params = $this->buildParams([], $filters);
        $response = $this->httpClient->get('/user/notifications', $params);
        return $this->extractData($response);
    }

    /**
     * Mark notifications as read
     *
     * @param array $notificationIds Notification IDs to mark as read
     * @return array Update confirmation
     */
    public function markNotificationsRead(array $notificationIds): array
    {
        $data = ['notificationIds' => $notificationIds];
        $response = $this->httpClient->post('/user/notifications/mark-read', $data);
        return $this->extractData($response);
    }

    /**
     * Update notification preferences
     *
     * @param array $preferences Notification preferences
     *                          - email: Email notification settings
     *                          - push: Push notification settings
     *                          - sms: SMS notification settings
     * @return array Updated notification preferences
     */
    public function updateNotificationPreferences(array $preferences): array
    {
        $response = $this->httpClient->put('/user/notifications/preferences', $this->filterNullValues($preferences));
        return $this->extractData($response);
    }

    /**
     * Delete user account
     *
     * @param string $confirmEmail Email confirmation for account deletion
     * @param string $reason Reason for account deletion
     * @param bool $deleteData Whether to delete all user data
     * @return array Deletion confirmation
     */
    public function deleteAccount(string $confirmEmail, string $reason = '', bool $deleteData = true): array
    {
        $this->validateRequired(['confirmEmail' => $confirmEmail], ['confirmEmail']);
        
        $data = [
            'confirmEmail' => $confirmEmail,
            'reason' => $reason,
            'deleteData' => $deleteData
        ];
        
        $response = $this->httpClient->delete('/user/account', $data);
        return $this->extractData($response);
    }

    /**
     * Export user data
     *
     * @param array $options Export options
     *                      - format: Export format (json, csv)
     *                      - includeMetadata: Include metadata in export
     *                      - includeTracks: Include track data
     *                      - includeAnalytics: Include analytics data
     *                      - email: Email address for delivery
     * @return array Export job data
     */
    public function exportData(array $options = []): array
    {
        $response = $this->httpClient->post('/user/export', $this->filterNullValues($options));
        return $this->extractData($response);
    }

    /**
     * Get user's subscription information
     *
     * @return array Subscription details
     */
    public function getSubscription(): array
    {
        $response = $this->httpClient->get('/user/subscription');
        return $this->extractData($response);
    }

    /**
     * Upgrade or change user subscription
     *
     * @param array $subscriptionData Subscription details
     *                               - plan: Subscription plan
     *                               - billing: Billing frequency
     * @return array Updated subscription information
     */
    public function updateSubscription(array $subscriptionData): array
    {
        $response = $this->httpClient->put('/user/subscription', $this->filterNullValues($subscriptionData));
        return $this->extractData($response);
    }

    /**
     * Cancel user subscription
     *
     * @param array $cancellationData Cancellation details
     *                               - reason: Cancellation reason
     *                               - feedback: User feedback
     *                               - effective: Effective cancellation date
     * @return array Cancellation confirmation
     */
    public function cancelSubscription(array $cancellationData = []): array
    {
        $response = $this->httpClient->post('/user/subscription/cancel', $this->filterNullValues($cancellationData));
        return $this->extractData($response);
    }
}