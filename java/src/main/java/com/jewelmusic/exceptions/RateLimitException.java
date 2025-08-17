package com.jewelmusic.exceptions;

import java.time.Duration;
import java.util.Map;

/**
 * Exception thrown when the rate limit is exceeded.
 * <p>
 * This exception indicates that the client has made too many requests
 * in a given time period and should wait before making additional requests.
 *
 * @since 1.0.0
 */
public class RateLimitException extends JewelMusicException {
    
    private final Duration retryAfter;
    
    /**
     * Creates a new rate limit exception with a default message.
     */
    public RateLimitException() {
        this("Rate limit exceeded", null);
    }
    
    /**
     * Creates a new rate limit exception with the specified message.
     *
     * @param message The error message
     */
    public RateLimitException(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new rate limit exception with retry after duration.
     *
     * @param message The error message
     * @param retryAfter The duration to wait before retrying
     */
    public RateLimitException(String message, Duration retryAfter) {
        super(message, 429, retryAfter != null ? Map.of("retryAfter", retryAfter.getSeconds()) : null);
        this.retryAfter = retryAfter;
    }
    
    /**
     * Creates a new rate limit exception with retry after seconds.
     *
     * @param message The error message
     * @param retryAfterSeconds The number of seconds to wait before retrying
     */
    public RateLimitException(String message, long retryAfterSeconds) {
        this(message, retryAfterSeconds > 0 ? Duration.ofSeconds(retryAfterSeconds) : null);
    }
    
    /**
     * Gets the duration to wait before retrying the request.
     *
     * @return The retry-after duration, or null if not specified
     */
    public Duration getRetryAfter() {
        return retryAfter;
    }
    
    /**
     * Gets the number of seconds to wait before retrying the request.
     *
     * @return The retry-after duration in seconds, or -1 if not specified
     */
    public long getRetryAfterSeconds() {
        return retryAfter != null ? retryAfter.getSeconds() : -1;
    }
    
    /**
     * Checks if a retry-after duration is specified.
     *
     * @return true if a retry-after duration is available, false otherwise
     */
    public boolean hasRetryAfter() {
        return retryAfter != null;
    }
}