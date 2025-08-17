package com.jewelmusic;

import com.jewelmusic.http.HttpClient;
import com.jewelmusic.resources.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Main client implementation for the JewelMusic SDK.
 * <p>
 * This class provides the main entry point for interacting with the JewelMusic API.
 * It manages the HTTP client configuration and provides access to all API resources.
 * <p>
 * Example usage:
 * <pre>{@code
 * JewelMusicClient client = new JewelMusicClient("your-api-key");
 * 
 * // Or with custom configuration
 * JewelMusicClient client = JewelMusicClient.builder()
 *     .apiKey("your-api-key")
 *     .baseUrl("https://custom-api.jewelmusic.com")
 *     .timeout(Duration.ofSeconds(30))
 *     .build();
 * }</pre>
 *
 * @since 1.0.0
 */
public class JewelMusicClient implements JewelMusic {
    
    private static final String DEFAULT_BASE_URL = "https://api.jewelmusic.com";
    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(60);
    private static final int DEFAULT_MAX_RETRIES = 3;
    
    private final HttpClient httpClient;
    private final CopilotResource copilotResource;
    private final AnalysisResource analysisResource;
    private final DistributionResource distributionResource;
    private final TranscriptionResource transcriptionResource;
    private final TracksResource tracksResource;
    private final AnalyticsResource analyticsResource;
    private final UserResource userResource;
    private final WebhooksResource webhooksResource;
    
    /**
     * Creates a new JewelMusic client with the specified API key.
     *
     * @param apiKey The API key for authentication
     * @throws IllegalArgumentException if apiKey is null or empty
     */
    public JewelMusicClient(String apiKey) {
        this(new Builder(apiKey));
    }
    
    /**
     * Creates a new JewelMusic client with the specified builder configuration.
     *
     * @param builder The builder with client configuration
     */
    private JewelMusicClient(Builder builder) {
        this.httpClient = new HttpClient(
            builder.apiKey,
            builder.baseUrl,
            builder.timeout,
            builder.maxRetries,
            builder.userAgent,
            builder.additionalHeaders
        );
        
        // Initialize all resources
        this.copilotResource = new CopilotResource(httpClient);
        this.analysisResource = new AnalysisResource(httpClient);
        this.distributionResource = new DistributionResource(httpClient);
        this.transcriptionResource = new TranscriptionResource(httpClient);
        this.tracksResource = new TracksResource(httpClient);
        this.analyticsResource = new AnalyticsResource(httpClient);
        this.userResource = new UserResource(httpClient);
        this.webhooksResource = new WebhooksResource(httpClient);
    }
    
    @Override
    public CopilotResource copilot() {
        return copilotResource;
    }
    
    @Override
    public AnalysisResource analysis() {
        return analysisResource;
    }
    
    @Override
    public DistributionResource distribution() {
        return distributionResource;
    }
    
    @Override
    public TranscriptionResource transcription() {
        return transcriptionResource;
    }
    
    @Override
    public TracksResource tracks() {
        return tracksResource;
    }
    
    @Override
    public AnalyticsResource analytics() {
        return analyticsResource;
    }
    
    @Override
    public UserResource user() {
        return userResource;
    }
    
    @Override
    public WebhooksResource webhooks() {
        return webhooksResource;
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
     * Builder class for configuring JewelMusic client instances.
     * <p>
     * Provides a fluent API for customizing client configuration including
     * base URL, timeout, retry behavior, and custom headers.
     */
    public static class Builder {
        private String apiKey;
        private String baseUrl = DEFAULT_BASE_URL;
        private Duration timeout = DEFAULT_TIMEOUT;
        private int maxRetries = DEFAULT_MAX_RETRIES;
        private String userAgent;
        private Map<String, String> additionalHeaders;
        
        /**
         * Creates a new builder with no API key set.
         */
        public Builder() {
            this.additionalHeaders = new HashMap<>();
        }
        
        /**
         * Creates a new builder with the specified API key.
         *
         * @param apiKey The API key for authentication
         */
        public Builder(String apiKey) {
            this();
            this.apiKey = apiKey;
        }
        
        /**
         * Sets the API key for authentication.
         *
         * @param apiKey The API key
         * @return This builder instance
         * @throws IllegalArgumentException if apiKey is null or empty
         */
        public Builder apiKey(String apiKey) {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                throw new IllegalArgumentException("API key cannot be null or empty");
            }
            this.apiKey = apiKey;
            return this;
        }
        
        /**
         * Sets the base URL for the API.
         *
         * @param baseUrl The base URL (e.g., "https://api.jewelmusic.com")
         * @return This builder instance
         * @throws IllegalArgumentException if baseUrl is null or empty
         */
        public Builder baseUrl(String baseUrl) {
            if (baseUrl == null || baseUrl.trim().isEmpty()) {
                throw new IllegalArgumentException("Base URL cannot be null or empty");
            }
            // Remove trailing slash if present
            if (baseUrl.endsWith("/")) {
                baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
            }
            this.baseUrl = baseUrl;
            return this;
        }
        
        /**
         * Sets the request timeout duration.
         *
         * @param timeout The timeout duration
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
         * Sets the maximum number of retry attempts for failed requests.
         *
         * @param maxRetries The maximum number of retries (0 to disable)
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
         * @param userAgent The custom user agent
         * @return This builder instance
         */
        public Builder userAgent(String userAgent) {
            this.userAgent = userAgent;
            return this;
        }
        
        /**
         * Adds a custom header to be included with all requests.
         *
         * @param name The header name
         * @param value The header value
         * @return This builder instance
         * @throws IllegalArgumentException if name is null or empty
         */
        public Builder addHeader(String name, String value) {
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Header name cannot be null or empty");
            }
            if (this.additionalHeaders == null) {
                this.additionalHeaders = new HashMap<>();
            }
            this.additionalHeaders.put(name, value);
            return this;
        }
        
        /**
         * Sets additional headers to be included with all requests.
         *
         * @param headers Map of header names to values
         * @return This builder instance
         */
        public Builder additionalHeaders(Map<String, String> headers) {
            if (headers != null) {
                if (this.additionalHeaders == null) {
                    this.additionalHeaders = new HashMap<>();
                }
                this.additionalHeaders.putAll(headers);
            }
            return this;
        }
        
        /**
         * Builds a new JewelMusic client with the configured settings.
         *
         * @return A new JewelMusicClient instance
         * @throws IllegalStateException if API key is not set
         */
        public JewelMusicClient build() {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                throw new IllegalStateException("API key must be set before building the client");
            }
            return new JewelMusicClient(this);
        }
    }
}