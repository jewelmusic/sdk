package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Copilot resource for AI-powered music intelligence features.
 * <p>
 * This resource provides access to JewelMusic's AI copilot capabilities,
 * including music recommendations, genre classification, mood analysis,
 * and intelligent music discovery.
 *
 * @since 1.0.0
 */
public class CopilotResource extends BaseResource {
    
    /**
     * Creates a new copilot resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public CopilotResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/copilot";
    }
    
    /**
     * Gets AI-powered music recommendations based on user preferences.
     *
     * @return Map containing recommendation results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRecommendations() {
        return getRecommendations(null);
    }
    
    /**
     * Gets AI-powered music recommendations with specific parameters.
     *
     * @param params Recommendation parameters (genre, mood, tempo, etc.)
     * @return Map containing recommendation results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getRecommendations(Map<String, String> params) {
        return httpClient.get(getBasePath() + "/recommendations", params);
    }
    
    /**
     * Analyzes a track and provides AI-generated insights.
     *
     * @param trackId The ID of the track to analyze
     * @return Map containing analysis results and insights
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> analyzeTrack(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/analyze", params);
    }
    
    /**
     * Gets genre classification for a track using AI.
     *
     * @param trackId The ID of the track to classify
     * @return Map containing genre classification results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> classifyGenre(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/genre", params);
    }
    
    /**
     * Analyzes the mood and emotional content of a track.
     *
     * @param trackId The ID of the track to analyze
     * @return Map containing mood analysis results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> analyzeMood(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/mood", params);
    }
    
    /**
     * Finds similar tracks based on audio features and characteristics.
     *
     * @param trackId The ID of the reference track
     * @return Map containing similar tracks
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> findSimilar(String trackId) {
        return findSimilar(trackId, null);
    }
    
    /**
     * Finds similar tracks with specific search parameters.
     *
     * @param trackId The ID of the reference track
     * @param options Search options (limit, threshold, features to consider)
     * @return Map containing similar tracks
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> findSimilar(String trackId, Map<String, String> options) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        
        if (options != null) {
            params.putAll(options);
        }
        
        return httpClient.get(getBasePath() + "/similar", params);
    }
    
    /**
     * Generates AI-powered tags and keywords for a track.
     *
     * @param trackId The ID of the track to tag
     * @return Map containing generated tags and keywords
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> generateTags(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/tags", params);
    }
    
    /**
     * Creates an AI-generated playlist based on specified criteria.
     *
     * @param name The name for the playlist
     * @param criteria Playlist generation criteria
     * @return Map containing the created playlist
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createPlaylist(String name, Map<String, Object> criteria) {
        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        if (criteria != null) {
            data.putAll(criteria);
        }
        return httpClient.post(getBasePath() + "/playlist", data);
    }
    
    /**
     * Gets AI-powered insights about user listening patterns.
     *
     * @return Map containing listening pattern insights
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getListeningInsights() {
        return getListeningInsights(null);
    }
    
    /**
     * Gets AI-powered insights about user listening patterns with specific timeframe.
     *
     * @param timeframe The timeframe for analysis (week, month, year)
     * @return Map containing listening pattern insights
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getListeningInsights(String timeframe) {
        Map<String, String> params = new HashMap<>();
        if (timeframe != null && !timeframe.isEmpty()) {
            params.put("timeframe", timeframe);
        }
        return httpClient.get(getBasePath() + "/insights", params);
    }
    
    /**
     * Gets AI-powered music discovery suggestions based on trends.
     *
     * @return Map containing discovery suggestions
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDiscovery() {
        return getDiscovery(null);
    }
    
    /**
     * Gets AI-powered music discovery suggestions with filters.
     *
     * @param filters Discovery filters (genre, era, popularity, etc.)
     * @return Map containing discovery suggestions
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDiscovery(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/discovery", filters);
    }
}