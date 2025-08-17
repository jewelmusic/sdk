package com.jewelmusic.exceptions;

import java.util.Map;

/**
 * Exception thrown when authentication fails.
 * <p>
 * This exception is typically thrown when:
 * <ul>
 *   <li>An invalid API key is provided</li>
 *   <li>The API key has expired</li>
 *   <li>The API key lacks required permissions</li>
 * </ul>
 *
 * @since 1.0.0
 */
public class AuthenticationException extends JewelMusicException {
    
    /**
     * Creates a new authentication exception with a default message.
     */
    public AuthenticationException() {
        this("Authentication failed");
    }
    
    /**
     * Creates a new authentication exception with the specified message.
     *
     * @param message The error message
     */
    public AuthenticationException(String message) {
        super(message, 401);
    }
    
    /**
     * Creates a new authentication exception with message and details.
     *
     * @param message The error message
     * @param details Additional error details
     */
    public AuthenticationException(String message, Map<String, Object> details) {
        super(message, 401, details);
    }
    
    /**
     * Creates a new authentication exception with message and cause.
     *
     * @param message The error message
     * @param cause The underlying cause
     */
    public AuthenticationException(String message, Throwable cause) {
        super(message, 401, null, cause);
    }
}