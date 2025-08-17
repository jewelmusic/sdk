package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import java.util.HashMap;
import java.util.Map;

/**
 * Distribution resource for music distribution and publishing.
 * <p>
 * This resource provides access to JewelMusic's distribution platform,
 * allowing artists to distribute their music to streaming platforms,
 * manage releases, track distribution status, and handle publishing.
 *
 * @since 1.0.0
 */
public class DistributionResource extends BaseResource {
    
    /**
     * Creates a new distribution resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public DistributionResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/distribution";
    }
    
    /**
     * Creates a new music release for distribution.
     *
     * @param releaseData Release information (title, artist, genre, etc.)
     * @return Map containing the created release
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createRelease(Map<String, Object> releaseData) {
        return httpClient.post(getBasePath() + "/releases", releaseData);
    }
    
    /**
     * Gets a specific release by ID.
     *
     * @param releaseId The ID of the release
     * @return Map containing release details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRelease(String releaseId) {
        return httpClient.get(getBasePath() + "/releases/" + releaseId);
    }
    
    /**
     * Updates an existing release.
     *
     * @param releaseId The ID of the release to update
     * @param updateData Updated release information
     * @return Map containing the updated release
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateRelease(String releaseId, Map<String, Object> updateData) {
        return httpClient.put(getBasePath() + "/releases/" + releaseId, updateData);
    }
    
    /**
     * Deletes a release.
     *
     * @param releaseId The ID of the release to delete
     * @return Map containing deletion confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> deleteRelease(String releaseId) {
        return httpClient.delete(getBasePath() + "/releases/" + releaseId);
    }
    
    /**
     * Lists all releases for the authenticated user.
     *
     * @return Map containing list of releases
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listReleases() {
        return listReleases(null);
    }
    
    /**
     * Lists releases with specific filters.
     *
     * @param filters Query filters (status, date range, genre, etc.)
     * @return Map containing filtered list of releases
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listReleases(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/releases", filters);
    }
    
    /**
     * Submits a release for distribution to streaming platforms.
     *
     * @param releaseId The ID of the release to distribute
     * @param platforms List of platforms to distribute to
     * @return Map containing distribution submission details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> distributeRelease(String releaseId, Map<String, Object> platforms) {
        Map<String, Object> data = new HashMap<>();
        data.put("platforms", platforms);
        return httpClient.post(getBasePath() + "/releases/" + releaseId + "/distribute", data);
    }
    
    /**
     * Gets the distribution status of a release.
     *
     * @param releaseId The ID of the release
     * @return Map containing distribution status for each platform
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDistributionStatus(String releaseId) {
        return httpClient.get(getBasePath() + "/releases/" + releaseId + "/status");
    }
    
    /**
     * Gets available distribution platforms.
     *
     * @return Map containing list of available platforms
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPlatforms() {
        return httpClient.get(getBasePath() + "/platforms");
    }
    
    /**
     * Gets platform-specific requirements and guidelines.
     *
     * @param platformId The ID of the platform
     * @return Map containing platform requirements
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPlatformRequirements(String platformId) {
        return httpClient.get(getBasePath() + "/platforms/" + platformId + "/requirements");
    }
    
    /**
     * Gets pricing information for distribution services.
     *
     * @return Map containing pricing details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getPricing() {
        return httpClient.get(getBasePath() + "/pricing");
    }
    
    /**
     * Creates a distribution package with multiple releases.
     *
     * @param packageData Package information and release IDs
     * @return Map containing the created package
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createPackage(Map<String, Object> packageData) {
        return httpClient.post(getBasePath() + "/packages", packageData);
    }
    
    /**
     * Gets distribution analytics and statistics.
     *
     * @param releaseId The ID of the release
     * @return Map containing distribution analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAnalytics(String releaseId) {
        return getAnalytics(releaseId, null);
    }
    
    /**
     * Gets distribution analytics with specific parameters.
     *
     * @param releaseId The ID of the release
     * @param params Analytics parameters (date range, platforms, metrics)
     * @return Map containing distribution analytics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAnalytics(String releaseId, Map<String, String> params) {
        Map<String, String> queryParams = new HashMap<>();
        if (params != null) {
            queryParams.putAll(params);
        }
        return httpClient.get(getBasePath() + "/releases/" + releaseId + "/analytics", queryParams);
    }
    
    /**
     * Gets revenue and royalty information for a release.
     *
     * @param releaseId The ID of the release
     * @return Map containing revenue and royalty data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRevenue(String releaseId) {
        return getRevenue(releaseId, null);
    }
    
    /**
     * Gets revenue and royalty information with specific timeframe.
     *
     * @param releaseId The ID of the release
     * @param timeframe The timeframe for revenue data (month, quarter, year)
     * @return Map containing revenue and royalty data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRevenue(String releaseId, String timeframe) {
        Map<String, String> params = new HashMap<>();
        if (timeframe != null && !timeframe.isEmpty()) {
            params.put("timeframe", timeframe);
        }
        return httpClient.get(getBasePath() + "/releases/" + releaseId + "/revenue", params);
    }
    
    /**
     * Withdraws a release from distribution platforms.
     *
     * @param releaseId The ID of the release to withdraw
     * @param platforms Platforms to withdraw from (optional)
     * @return Map containing withdrawal confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> withdrawRelease(String releaseId, Map<String, Object> platforms) {
        Map<String, Object> data = new HashMap<>();
        if (platforms != null) {
            data.put("platforms", platforms);
        }
        return httpClient.post(getBasePath() + "/releases/" + releaseId + "/withdraw", data);
    }
    
    /**
     * Gets distribution history and audit trail.
     *
     * @return Map containing distribution history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDistributionHistory() {
        return getDistributionHistory(null);
    }
    
    /**
     * Gets distribution history with specific filters.
     *
     * @param filters History filters (date range, action type, platform)
     * @return Map containing filtered distribution history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDistributionHistory(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/history", filters);
    }
}