package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Tracks resource for managing music tracks and metadata.
 * <p>
 * This resource provides comprehensive track management capabilities,
 * including upload, metadata management, search, organization,
 * and track lifecycle operations within the JewelMusic platform.
 *
 * @since 1.0.0
 */
public class TracksResource extends BaseResource {
    
    /**
     * Creates a new tracks resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public TracksResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/tracks";
    }
    
    /**
     * Uploads a new track from a file.
     *
     * @param file The audio file to upload
     * @param filename The filename to use for the upload
     * @return Map containing the uploaded track information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> uploadTrack(File file, String filename) {
        return httpClient.uploadFile(getBasePath() + "/upload", file, filename, null);
    }
    
    /**
     * Uploads a new track from an input stream.
     *
     * @param inputStream The audio input stream to upload
     * @param filename The filename to use for the upload
     * @return Map containing the uploaded track information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> uploadTrack(InputStream inputStream, String filename) {
        return httpClient.uploadFile(getBasePath() + "/upload", inputStream, filename, null);
    }
    
    /**
     * Uploads a track with metadata.
     *
     * @param file The audio file to upload
     * @param filename The filename to use for the upload
     * @param metadata Track metadata (title, artist, genre, etc.)
     * @return Map containing the uploaded track information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> uploadTrack(File file, String filename, Map<String, String> metadata) {
        return httpClient.uploadFile(getBasePath() + "/upload", file, filename, metadata);
    }
    
    /**
     * Gets a specific track by ID.
     *
     * @param trackId The ID of the track
     * @return Map containing track details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrack(String trackId) {
        return httpClient.get(getBasePath() + "/" + trackId);
    }
    
    /**
     * Updates track metadata.
     *
     * @param trackId The ID of the track to update
     * @param metadata Updated track metadata
     * @return Map containing the updated track
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateTrack(String trackId, Map<String, Object> metadata) {
        return httpClient.put(getBasePath() + "/" + trackId, metadata);
    }
    
    /**
     * Deletes a track.
     *
     * @param trackId The ID of the track to delete
     * @return Map containing deletion confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> deleteTrack(String trackId) {
        return httpClient.delete(getBasePath() + "/" + trackId);
    }
    
    /**
     * Lists all tracks for the authenticated user.
     *
     * @return Map containing list of tracks
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listTracks() {
        return listTracks(null);
    }
    
    /**
     * Lists tracks with specific filters.
     *
     * @param filters Query filters (genre, artist, date range, etc.)
     * @return Map containing filtered list of tracks
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listTracks(Map<String, String> filters) {
        return httpClient.get(getBasePath(), filters);
    }
    
    /**
     * Searches for tracks using text query.
     *
     * @param query Search query string
     * @return Map containing search results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> searchTracks(String query) {
        return searchTracks(query, null);
    }
    
    /**
     * Searches for tracks with additional filters.
     *
     * @param query Search query string
     * @param filters Additional search filters
     * @return Map containing search results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> searchTracks(String query, Map<String, String> filters) {
        Map<String, String> params = new HashMap<>();
        params.put("q", query);
        if (filters != null) {
            params.putAll(filters);
        }
        return httpClient.get(getBasePath() + "/search", params);
    }
    
    /**
     * Gets track metadata and information.
     *
     * @param trackId The ID of the track
     * @return Map containing track metadata
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrackMetadata(String trackId) {
        return httpClient.get(getBasePath() + "/" + trackId + "/metadata");
    }
    
    /**
     * Updates specific metadata fields for a track.
     *
     * @param trackId The ID of the track
     * @param metadata Metadata fields to update
     * @return Map containing updated metadata
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateMetadata(String trackId, Map<String, Object> metadata) {
        return httpClient.put(getBasePath() + "/" + trackId + "/metadata", metadata);
    }
    
    /**
     * Gets track audio information (format, bitrate, duration, etc.).
     *
     * @param trackId The ID of the track
     * @return Map containing audio information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getAudioInfo(String trackId) {
        return httpClient.get(getBasePath() + "/" + trackId + "/audio");
    }
    
    /**
     * Gets track download URL with optional format conversion.
     *
     * @param trackId The ID of the track
     * @return Map containing download URL and information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDownloadUrl(String trackId) {
        return getDownloadUrl(trackId, null);
    }
    
    /**
     * Gets track download URL in specific format.
     *
     * @param trackId The ID of the track
     * @param format Desired audio format (mp3, wav, flac, etc.)
     * @return Map containing download URL and information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDownloadUrl(String trackId, String format) {
        Map<String, String> params = new HashMap<>();
        if (format != null && !format.isEmpty()) {
            params.put("format", format);
        }
        return httpClient.get(getBasePath() + "/" + trackId + "/download", params);
    }
    
    /**
     * Gets streaming URL for a track.
     *
     * @param trackId The ID of the track
     * @return Map containing streaming URL and options
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getStreamingUrl(String trackId) {
        return getStreamingUrl(trackId, null);
    }
    
    /**
     * Gets streaming URL with specific quality settings.
     *
     * @param trackId The ID of the track
     * @param quality Stream quality (low, medium, high, lossless)
     * @return Map containing streaming URL and options
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getStreamingUrl(String trackId, String quality) {
        Map<String, String> params = new HashMap<>();
        if (quality != null && !quality.isEmpty()) {
            params.put("quality", quality);
        }
        return httpClient.get(getBasePath() + "/" + trackId + "/stream", params);
    }
    
    /**
     * Creates a track collection or playlist.
     *
     * @param collectionData Collection information (name, description, track IDs)
     * @return Map containing the created collection
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createCollection(Map<String, Object> collectionData) {
        return httpClient.post(getBasePath() + "/collections", collectionData);
    }
    
    /**
     * Adds a track to a collection.
     *
     * @param collectionId The ID of the collection
     * @param trackId The ID of the track to add
     * @return Map containing update confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> addToCollection(String collectionId, String trackId) {
        Map<String, String> data = new HashMap<>();
        data.put("track_id", trackId);
        return httpClient.post(getBasePath() + "/collections/" + collectionId + "/tracks", data);
    }
    
    /**
     * Removes a track from a collection.
     *
     * @param collectionId The ID of the collection
     * @param trackId The ID of the track to remove
     * @return Map containing update confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> removeFromCollection(String collectionId, String trackId) {
        return httpClient.delete(getBasePath() + "/collections/" + collectionId + "/tracks/" + trackId);
    }
    
    /**
     * Gets track statistics and analytics.
     *
     * @param trackId The ID of the track
     * @return Map containing track statistics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrackStats(String trackId) {
        return getTrackStats(trackId, null);
    }
    
    /**
     * Gets track statistics for a specific time period.
     *
     * @param trackId The ID of the track
     * @param timeframe Timeframe for statistics (day, week, month, year)
     * @return Map containing track statistics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrackStats(String trackId, String timeframe) {
        Map<String, String> params = new HashMap<>();
        if (timeframe != null && !timeframe.isEmpty()) {
            params.put("timeframe", timeframe);
        }
        return httpClient.get(getBasePath() + "/" + trackId + "/stats", params);
    }
    
    /**
     * Gets track activity and history.
     *
     * @param trackId The ID of the track
     * @return Map containing track activity history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrackActivity(String trackId) {
        return getTrackActivity(trackId, null);
    }
    
    /**
     * Gets track activity with specific filters.
     *
     * @param trackId The ID of the track
     * @param filters Activity filters (action type, date range)
     * @return Map containing filtered track activity
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTrackActivity(String trackId, Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/" + trackId + "/activity", filters);
    }
}