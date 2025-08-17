package com.jewelmusic.client;

import com.jewelmusic.http.HttpClient;
import com.jewelmusic.resources.*;

import java.time.Duration;
import java.util.Map;
import java.util.Objects;

/**
 * Main client class for the JewelMusic SDK.
 * <p>
 * Provides access to all SDK resources and manages the HTTP client configuration.
 * This class is thread-safe and can be shared across multiple threads.
 * 
 * @since 1.0.0
 */
public final class JewelMusicClient {
    
    private static final String DEFAULT_BASE_URL = "https://api.jewelmusic.art";
    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(30);
    private static final int DEFAULT_MAX_RETRIES = 3;
    
    private final HttpClient httpClient;
    private final CopilotResource copilot;
    private final AnalysisResource analysis;
    private final DistributionResource distribution;
    private final TranscriptionResource transcription;
    private final TracksResource tracks;
    private final AnalyticsResource analytics;
    private final UserResource user;
    private final WebhooksResource webhooks;
    
    private JewelMusicClient(Builder builder) {
        this.httpClient = new HttpClient(
            builder.apiKey,
            builder.baseUrl,
            builder.timeout,
            builder.maxRetries,
            builder.userAgent,
            builder.additionalHeaders
        );
        
        // Initialize all resource managers
        this.copilot = new CopilotResource(httpClient);
        this.analysis = new AnalysisResource(httpClient);
        this.distribution = new DistributionResource(httpClient);
        this.transcription = new TranscriptionResource(httpClient);
        this.tracks = new TracksResource(httpClient);
        this.analytics = new AnalyticsResource(httpClient);
        this.user = new UserResource(httpClient);
        this.webhooks = new WebhooksResource(httpClient);
    }
    
    /**
     * Creates a new builder for configuring a JewelMusic client.
     *
     * @return A new Builder instance
     */
    public static Builder builder() {
        return new Builder();
    }
    
    /**
     * Gets the copilot resource for AI-powered music creation assistance.
     *
     * @return The copilot resource
     */
    public CopilotResource copilot() {
        return copilot;
    }
    
    /**
     * Gets the analysis resource for AI-powered music analysis.
     *
     * @return The analysis resource
     */
    public AnalysisResource analysis() {
        return analysis;
    }
    
    /**
     * Gets the distribution resource for music platform distribution.
     *
     * @return The distribution resource
     */
    public DistributionResource distribution() {
        return distribution;
    }
    
    /**
     * Gets the transcription resource for lyrics transcription services.
     *
     * @return The transcription resource
     */
    public TranscriptionResource transcription() {
        return transcription;
    }
    
    /**
     * Gets the tracks resource for track management.
     *
     * @return The tracks resource
     */
    public TracksResource tracks() {
        return tracks;
    }
    
    /**
     * Gets the analytics resource for streaming analytics and reporting.
     *
     * @return The analytics resource
     */
    public AnalyticsResource analytics() {
        return analytics;
    }
    
    /**
     * Gets the user resource for profile and account management.
     *
     * @return The user resource
     */
    public UserResource user() {
        return user;
    }
    
    /**
     * Gets the webhooks resource for webhook management.
     *
     * @return The webhooks resource
     */
    public WebhooksResource webhooks() {
        return webhooks;
    }
    
    /**
     * Gets the underlying HTTP client.
     *
     * @return The HTTP client
     */
    public HttpClient getHttpClient() {
        return httpClient;
    }
    
    /**
     * Tests the API connection.
     *
     * @return Ping response data
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> ping() {
        return httpClient.get("/ping");
    }
    
    /**
     * Gets API information.
     *
     * @return API information
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getApiInfo() {
        return httpClient.get("/info");
    }
    
    /**
     * Gets the SDK version.
     *
     * @return The SDK version string
     */
    public String getVersion() {
        return "1.0.0";
    }
    
    /**
     * Builder class for configuring JewelMusic clients.
     */
    public static final class Builder {
        private String apiKey;
        private String baseUrl = DEFAULT_BASE_URL;
        private Duration timeout = DEFAULT_TIMEOUT;
        private int maxRetries = DEFAULT_MAX_RETRIES;
        private String userAgent;
        private Map<String, String> additionalHeaders;
        
        private Builder() {}
        
        /**
         * Sets the API key for authentication.
         *
         * @param apiKey Your JewelMusic API key
         * @return This builder instance
         * @throws IllegalArgumentException if apiKey is null or empty
         */
        public Builder apiKey(String apiKey) {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                throw new IllegalArgumentException("API key cannot be null or empty");
            }
            this.apiKey = apiKey.trim();
            return this;
        }
        
        /**
         * Sets the base URL for the API.
         *
         * @param baseUrl The API base URL
         * @return This builder instance
         * @throws IllegalArgumentException if baseUrl is null or empty
         */
        public Builder baseUrl(String baseUrl) {
            if (baseUrl == null || baseUrl.trim().isEmpty()) {
                throw new IllegalArgumentException("Base URL cannot be null or empty");
            }
            this.baseUrl = baseUrl.trim();
            return this;
        }
        
        /**
         * Sets the request timeout.
         *
         * @param timeout The request timeout duration
         * @return This builder instance
         * @throws IllegalArgumentException if timeout is null or negative
         */
        public Builder timeout(Duration timeout) {
            if (timeout == null || timeout.isNegative()) {
                throw new IllegalArgumentException("Timeout must be positive");
            }
            this.timeout = timeout;
            return this;
        }
        
        /**
         * Sets the maximum number of retry attempts.
         *
         * @param maxRetries The maximum number of retries
         * @return This builder instance
         * @throws IllegalArgumentException if maxRetries is negative
         */
        public Builder maxRetries(int maxRetries) {
            if (maxRetries < 0) {
                throw new IllegalArgumentException("Max retries cannot be negative");
            }
            this.maxRetries = maxRetries;
            return this;
        }
        
        /**
         * Sets a custom user agent string.
         *
         * @param userAgent The user agent string
         * @return This builder instance
         */
        public Builder userAgent(String userAgent) {
            this.userAgent = userAgent;
            return this;
        }
        
        /**
         * Sets additional headers to include with requests.
         *
         * @param headers Additional headers map
         * @return This builder instance
         */
        public Builder additionalHeaders(Map<String, String> headers) {
            this.additionalHeaders = headers;
            return this;
        }
        
        /**
         * Builds a new JewelMusic client with the configured settings.
         *
         * @return A new JewelMusicClient instance
         * @throws IllegalArgumentException if required fields are missing
         */
        public JewelMusicClient build() {
            Objects.requireNonNull(apiKey, "API key is required");
            return new JewelMusicClient(this);
        }
    }
}