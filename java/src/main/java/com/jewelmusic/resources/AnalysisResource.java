package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Analysis resource for music analysis and processing.
 * <p>
 * This resource provides access to JewelMusic's music analysis capabilities,
 * including audio feature extraction, spectral analysis, tempo detection,
 * key signature analysis, and comprehensive music intelligence.
 *
 * @since 1.0.0
 */
public class AnalysisResource extends BaseResource {
    
    /**
     * Creates a new analysis resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public AnalysisResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/analysis";
    }
    
    /**
     * Analyzes a music file for audio features and characteristics.
     *
     * @param file The audio file to analyze
     * @param filename The filename to use for the upload
     * @return Map containing analysis results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> analyzeFile(File file, String filename) {
        return httpClient.uploadFile(getBasePath() + "/file", file, filename, null);
    }
    
    /**
     * Analyzes a music file from an input stream.
     *
     * @param inputStream The audio input stream to analyze
     * @param filename The filename to use for the upload
     * @return Map containing analysis results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> analyzeFile(InputStream inputStream, String filename) {
        return httpClient.uploadFile(getBasePath() + "/file", inputStream, filename, null);
    }
    
    /**
     * Analyzes a music file with additional options.
     *
     * @param file The audio file to analyze
     * @param filename The filename to use for the upload
     * @param options Analysis options (format, quality, features to extract)
     * @return Map containing analysis results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> analyzeFile(File file, String filename, Map<String, String> options) {
        return httpClient.uploadFile(getBasePath() + "/file", file, filename, options);
    }
    
    /**
     * Analyzes a track by its ID.
     *
     * @param trackId The ID of the track to analyze
     * @return Map containing analysis results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> analyzeTrack(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/track", params);
    }
    
    /**
     * Gets detailed audio features for a track.
     *
     * @param trackId The ID of the track
     * @return Map containing audio features (tempo, key, energy, etc.)
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAudioFeatures(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/features", params);
    }
    
    /**
     * Detects the tempo (BPM) of a track.
     *
     * @param trackId The ID of the track
     * @return Map containing tempo detection results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> detectTempo(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/tempo", params);
    }
    
    /**
     * Analyzes the key signature and tonality of a track.
     *
     * @param trackId The ID of the track
     * @return Map containing key analysis results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> analyzeKey(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/key", params);
    }
    
    /**
     * Performs spectral analysis on a track.
     *
     * @param trackId The ID of the track
     * @return Map containing spectral analysis data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> spectralAnalysis(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/spectral", params);
    }
    
    /**
     * Analyzes the harmonic content of a track.
     *
     * @param trackId The ID of the track
     * @return Map containing harmonic analysis results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> harmonicAnalysis(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/harmonic", params);
    }
    
    /**
     * Detects beat and rhythm patterns in a track.
     *
     * @param trackId The ID of the track
     * @return Map containing beat detection results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> beatDetection(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/beats", params);
    }
    
    /**
     * Analyzes the structure and segments of a track.
     *
     * @param trackId The ID of the track
     * @return Map containing structure analysis (intro, verse, chorus, etc.)
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> structureAnalysis(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/structure", params);
    }
    
    /**
     * Gets comprehensive analysis results for a track.
     *
     * @param trackId The ID of the track
     * @return Map containing all available analysis data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getFullAnalysis(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/full", params);
    }
    
    /**
     * Compares two tracks and provides similarity metrics.
     *
     * @param trackId1 The ID of the first track
     * @param trackId2 The ID of the second track
     * @return Map containing comparison results and similarity scores
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> compareTracks(String trackId1, String trackId2) {
        Map<String, String> data = new HashMap<>();
        data.put("track_id_1", trackId1);
        data.put("track_id_2", trackId2);
        return httpClient.post(getBasePath() + "/compare", data);
    }
    
    /**
     * Gets analysis history for a user or track.
     *
     * @return Map containing analysis history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAnalysisHistory() {
        return getAnalysisHistory(null);
    }
    
    /**
     * Gets analysis history with specific filters.
     *
     * @param filters Query filters (date range, track type, etc.)
     * @return Map containing filtered analysis history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAnalysisHistory(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/history", filters);
    }
}