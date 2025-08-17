package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import java.util.HashMap;
import java.util.Map;

/**
 * User resource for user account and profile management.
 * <p>
 * This resource provides comprehensive user management capabilities,
 * including profile operations, preferences, subscription management,
 * API key management, and account settings within the JewelMusic platform.
 *
 * @since 1.0.0
 */
public class UserResource extends BaseResource {
    
    /**
     * Creates a new user resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public UserResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/user";
    }
    
    /**
     * Gets the current user's profile information.
     *
     * @return Map containing user profile data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getProfile() {
        return httpClient.get(getBasePath() + "/profile");
    }
    
    /**
     * Updates the current user's profile information.
     *
     * @param profileData Updated profile information
     * @return Map containing the updated profile
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateProfile(Map<String, Object> profileData) {
        return httpClient.put(getBasePath() + "/profile", profileData);
    }
    
    /**
     * Gets the current user's account settings.
     *
     * @return Map containing account settings
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getSettings() {
        return httpClient.get(getBasePath() + "/settings");
    }
    
    /**
     * Updates the current user's account settings.
     *
     * @param settings Updated account settings
     * @return Map containing the updated settings
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateSettings(Map<String, Object> settings) {
        return httpClient.put(getBasePath() + "/settings", settings);
    }
    
    /**
     * Gets the current user's preferences.
     *
     * @return Map containing user preferences
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPreferences() {
        return httpClient.get(getBasePath() + "/preferences");
    }
    
    /**
     * Updates the current user's preferences.
     *
     * @param preferences Updated user preferences
     * @return Map containing the updated preferences
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updatePreferences(Map<String, Object> preferences) {
        return httpClient.put(getBasePath() + "/preferences", preferences);
    }
    
    /**
     * Gets the current user's subscription information.
     *
     * @return Map containing subscription details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getSubscription() {
        return httpClient.get(getBasePath() + "/subscription");
    }
    
    /**
     * Updates the current user's subscription.
     *
     * @param subscriptionData Updated subscription information
     * @return Map containing the updated subscription
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateSubscription(Map<String, Object> subscriptionData) {
        return httpClient.put(getBasePath() + "/subscription", subscriptionData);
    }
    
    /**
     * Gets the current user's billing information.
     *
     * @return Map containing billing details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getBilling() {
        return httpClient.get(getBasePath() + "/billing");
    }
    
    /**
     * Updates the current user's billing information.
     *
     * @param billingData Updated billing information
     * @return Map containing the updated billing information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateBilling(Map<String, Object> billingData) {
        return httpClient.put(getBasePath() + "/billing", billingData);
    }
    
    /**
     * Gets the current user's API usage statistics.
     *
     * @return Map containing API usage data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getUsage() {
        return getUsage(null);
    }
    
    /**
     * Gets API usage statistics for a specific time period.
     *
     * @param timeframe Timeframe for usage statistics (day, week, month)
     * @return Map containing API usage data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getUsage(String timeframe) {
        Map<String, String> params = new HashMap<>();
        if (timeframe != null && !timeframe.isEmpty()) {
            params.put("timeframe", timeframe);
        }
        return httpClient.get(getBasePath() + "/usage", params);
    }
    
    /**
     * Lists all API keys for the current user.
     *
     * @return Map containing list of API keys
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listApiKeys() {
        return httpClient.get(getBasePath() + "/api-keys");
    }
    
    /**
     * Creates a new API key.
     *
     * @param keyData API key configuration (name, permissions, expiration)
     * @return Map containing the new API key
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createApiKey(Map<String, Object> keyData) {
        return httpClient.post(getBasePath() + "/api-keys", keyData);
    }
    
    /**
     * Gets details of a specific API key.
     *
     * @param keyId The ID of the API key
     * @return Map containing API key details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getApiKey(String keyId) {
        return httpClient.get(getBasePath() + "/api-keys/" + keyId);
    }
    
    /**
     * Updates an existing API key.
     *
     * @param keyId The ID of the API key to update
     * @param updateData Updated API key information
     * @return Map containing the updated API key
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateApiKey(String keyId, Map<String, Object> updateData) {
        return httpClient.put(getBasePath() + "/api-keys/" + keyId, updateData);
    }
    
    /**
     * Deletes an API key.
     *
     * @param keyId The ID of the API key to delete
     * @return Map containing deletion confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> deleteApiKey(String keyId) {
        return httpClient.delete(getBasePath() + "/api-keys/" + keyId);
    }
    
    /**
     * Regenerates an API key.
     *
     * @param keyId The ID of the API key to regenerate
     * @return Map containing the new API key
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> regenerateApiKey(String keyId) {
        return httpClient.post(getBasePath() + "/api-keys/" + keyId + "/regenerate", null);
    }
    
    /**
     * Gets the current user's notification settings.
     *
     * @return Map containing notification settings
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getNotificationSettings() {
        return httpClient.get(getBasePath() + "/notifications");
    }
    
    /**
     * Updates the current user's notification settings.
     *
     * @param notificationSettings Updated notification settings
     * @return Map containing the updated settings
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateNotificationSettings(Map<String, Object> notificationSettings) {
        return httpClient.put(getBasePath() + "/notifications", notificationSettings);
    }
    
    /**
     * Gets the current user's security settings.
     *
     * @return Map containing security settings
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getSecuritySettings() {
        return httpClient.get(getBasePath() + "/security");
    }
    
    /**
     * Updates the current user's security settings.
     *
     * @param securitySettings Updated security settings
     * @return Map containing the updated settings
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateSecuritySettings(Map<String, Object> securitySettings) {
        return httpClient.put(getBasePath() + "/security", securitySettings);
    }
    
    /**
     * Changes the current user's password.
     *
     * @param passwordData Password change data (current password, new password)
     * @return Map containing password change confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> changePassword(Map<String, String> passwordData) {
        return httpClient.put(getBasePath() + "/password", passwordData);
    }
    
    /**
     * Gets the current user's account activity and audit log.
     *
     * @return Map containing account activity
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getActivity() {
        return getActivity(null);
    }
    
    /**
     * Gets account activity with specific filters.
     *
     * @param filters Activity filters (date range, action type, IP address)
     * @return Map containing filtered account activity
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getActivity(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/activity", filters);
    }
    
    /**
     * Gets the current user's export and data portability options.
     *
     * @return Map containing export options and status
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getExportOptions() {
        return httpClient.get(getBasePath() + "/export");
    }
    
    /**
     * Requests a data export for the current user.
     *
     * @param exportConfig Export configuration (data types, format, etc.)
     * @return Map containing export request details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> requestDataExport(Map<String, Object> exportConfig) {
        return httpClient.post(getBasePath() + "/export", exportConfig);
    }
    
    /**
     * Gets the status of a data export request.
     *
     * @param exportId The ID of the export request
     * @return Map containing export status and download information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getExportStatus(String exportId) {
        return httpClient.get(getBasePath() + "/export/" + exportId);
    }
    
    /**
     * Deletes the current user's account.
     *
     * @param confirmationData Account deletion confirmation data
     * @return Map containing account deletion confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> deleteAccount(Map<String, String> confirmationData) {
        return httpClient.delete(getBasePath() + "/account", confirmationData);
    }
}