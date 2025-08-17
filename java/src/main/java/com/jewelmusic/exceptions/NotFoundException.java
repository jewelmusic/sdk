package com.jewelmusic.exceptions;

import java.util.Map;

/**
 * Exception thrown when a requested resource is not found.
 * <p>
 * This exception is typically thrown when:
 * <ul>
 *   <li>A resource ID does not exist</li>
 *   <li>A resource has been deleted</li>
 *   <li>The user lacks permission to access the resource</li>
 * </ul>
 *
 * @since 1.0.0
 */
public class NotFoundException extends JewelMusicException {
    
    /**
     * Creates a new not found exception with a default message.
     */
    public NotFoundException() {
        this("Resource not found");
    }
    
    /**
     * Creates a new not found exception with the specified message.
     *
     * @param message The error message
     */
    public NotFoundException(String message) {
        super(message, 404);
    }
    
    /**
     * Creates a new not found exception with message and details.
     *
     * @param message The error message
     * @param details Additional error details
     */
    public NotFoundException(String message, Map<String, Object> details) {
        super(message, 404, details);
    }
    
    /**
     * Creates a new not found exception with message and cause.
     *
     * @param message The error message
     * @param cause The underlying cause
     */
    public NotFoundException(String message, Throwable cause) {
        super(message, 404, null, cause);
    }
}