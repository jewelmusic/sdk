package com.jewelmusic.exceptions;

/**
 * Exception thrown when network-related errors occur.
 * <p>
 * This exception is typically thrown when:
 * <ul>
 *   <li>Connection cannot be established</li>
 *   <li>Request times out</li>
 *   <li>Network is unreachable</li>
 *   <li>SSL/TLS errors occur</li>
 * </ul>
 *
 * @since 1.0.0
 */
public class NetworkException extends JewelMusicException {
    
    /**
     * Creates a new network exception with a default message.
     */
    public NetworkException() {
        this("Network error occurred");
    }
    
    /**
     * Creates a new network exception with the specified message.
     *
     * @param message The error message
     */
    public NetworkException(String message) {
        super(message);
    }
    
    /**
     * Creates a new network exception with message and cause.
     *
     * @param message The error message
     * @param cause The underlying cause
     */
    public NetworkException(String message, Throwable cause) {
        super(message, cause);
    }
}

/**
 * Exception thrown when request timeout occurs.
 *
 * @since 1.0.0
 */
class TimeoutException extends NetworkException {
    
    /**
     * Creates a new timeout exception with a default message.
     */
    public TimeoutException() {
        this("Request timeout");
    }
    
    /**
     * Creates a new timeout exception with the specified message.
     *
     * @param message The error message
     */
    public TimeoutException(String message) {
        super(message);
    }
    
    /**
     * Creates a new timeout exception with message and cause.
     *
     * @param message The error message
     * @param cause The underlying cause
     */
    public TimeoutException(String message, Throwable cause) {
        super(message, cause);
    }
}