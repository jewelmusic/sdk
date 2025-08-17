package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Transcription resource for audio transcription and lyrics generation.
 * <p>
 * This resource provides access to JewelMusic's AI-powered transcription
 * capabilities, including speech-to-text conversion, lyrics transcription,
 * vocal isolation, and intelligent audio content extraction.
 *
 * @since 1.0.0
 */
public class TranscriptionResource extends BaseResource {
    
    /**
     * Creates a new transcription resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public TranscriptionResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/transcription";
    }
    
    /**
     * Transcribes audio content from a file.
     *
     * @param file The audio file to transcribe
     * @param filename The filename to use for the upload
     * @return Map containing transcription results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> transcribeFile(File file, String filename) {
        return httpClient.uploadFile(getBasePath() + "/file", file, filename, null);
    }
    
    /**
     * Transcribes audio content from an input stream.
     *
     * @param inputStream The audio input stream to transcribe
     * @param filename The filename to use for the upload
     * @return Map containing transcription results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> transcribeFile(InputStream inputStream, String filename) {
        return httpClient.uploadFile(getBasePath() + "/file", inputStream, filename, null);
    }
    
    /**
     * Transcribes audio content with specific options.
     *
     * @param file The audio file to transcribe
     * @param filename The filename to use for the upload
     * @param options Transcription options (language, format, timestamps, etc.)
     * @return Map containing transcription results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> transcribeFile(File file, String filename, Map<String, String> options) {
        return httpClient.uploadFile(getBasePath() + "/file", file, filename, options);
    }
    
    /**
     * Transcribes a track by its ID.
     *
     * @param trackId The ID of the track to transcribe
     * @return Map containing transcription results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> transcribeTrack(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/track", params);
    }
    
    /**
     * Transcribes a track with specific options.
     *
     * @param trackId The ID of the track to transcribe
     * @param options Transcription options (language, timestamps, confidence threshold)
     * @return Map containing transcription results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> transcribeTrack(String trackId, Map<String, String> options) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        if (options != null) {
            params.putAll(options);
        }
        return httpClient.get(getBasePath() + "/track", params);
    }
    
    /**
     * Extracts and transcribes lyrics from a track.
     *
     * @param trackId The ID of the track
     * @return Map containing extracted lyrics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> extractLyrics(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/lyrics", params);
    }
    
    /**
     * Isolates vocal tracks for better transcription accuracy.
     *
     * @param trackId The ID of the track
     * @return Map containing vocal isolation results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> isolateVocals(String trackId) {
        Map<String, String> params = new HashMap<>();
        params.put("track_id", trackId);
        return httpClient.get(getBasePath() + "/vocals", params);
    }
    
    /**
     * Gets available languages for transcription.
     *
     * @return Map containing supported languages and their codes
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getSupportedLanguages() {
        return httpClient.get(getBasePath() + "/languages");
    }
    
    /**
     * Gets transcription status for a processing job.
     *
     * @param jobId The transcription job ID
     * @return Map containing job status and progress
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getJobStatus(String jobId) {
        return httpClient.get(getBasePath() + "/jobs/" + jobId);
    }
    
    /**
     * Gets transcription results for a completed job.
     *
     * @param jobId The transcription job ID
     * @return Map containing full transcription results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getJobResults(String jobId) {
        return httpClient.get(getBasePath() + "/jobs/" + jobId + "/results");
    }
    
    /**
     * Cancels a running transcription job.
     *
     * @param jobId The transcription job ID to cancel
     * @return Map containing cancellation confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> cancelJob(String jobId) {
        return httpClient.delete(getBasePath() + "/jobs/" + jobId);
    }
    
    /**
     * Lists transcription jobs for the authenticated user.
     *
     * @return Map containing list of transcription jobs
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listJobs() {
        return listJobs(null);
    }
    
    /**
     * Lists transcription jobs with specific filters.
     *
     * @param filters Job filters (status, date range, language)
     * @return Map containing filtered list of jobs
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listJobs(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/jobs", filters);
    }
    
    /**
     * Starts a batch transcription job for multiple files.
     *
     * @param jobData Batch job configuration and file list
     * @return Map containing batch job details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createBatchJob(Map<String, Object> jobData) {
        return httpClient.post(getBasePath() + "/batch", jobData);
    }
    
    /**
     * Gets confidence scores and quality metrics for a transcription.
     *
     * @param jobId The transcription job ID
     * @return Map containing quality metrics and confidence scores
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getQualityMetrics(String jobId) {
        return httpClient.get(getBasePath() + "/jobs/" + jobId + "/quality");
    }
    
    /**
     * Exports transcription results in various formats.
     *
     * @param jobId The transcription job ID
     * @param format Export format (srt, vtt, txt, json)
     * @return Map containing export data or download URL
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> exportTranscription(String jobId, String format) {
        Map<String, String> params = new HashMap<>();
        params.put("format", format);
        return httpClient.get(getBasePath() + "/jobs/" + jobId + "/export", params);
    }
    
    /**
     * Corrects or edits existing transcription results.
     *
     * @param jobId The transcription job ID
     * @param corrections Map of corrections to apply
     * @return Map containing updated transcription
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> correctTranscription(String jobId, Map<String, Object> corrections) {
        return httpClient.put(getBasePath() + "/jobs/" + jobId + "/correct", corrections);
    }
    
    /**
     * Gets transcription history and analytics.
     *
     * @return Map containing transcription history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTranscriptionHistory() {
        return getTranscriptionHistory(null);
    }
    
    /**
     * Gets transcription history with specific filters.
     *
     * @param filters History filters (date range, language, accuracy threshold)
     * @return Map containing filtered transcription history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTranscriptionHistory(Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/history", filters);
    }
}