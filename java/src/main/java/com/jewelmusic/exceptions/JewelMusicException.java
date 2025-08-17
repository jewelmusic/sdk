package com.jewelmusic.exceptions;

import java.util.Map;

/**
 * Base exception class for all JewelMusic SDK errors.
 * <p>
 * This is the root exception that all other JewelMusic exceptions inherit from.
 * It provides common properties and methods for handling API errors.
 *
 * @since 1.0.0
 */
public class JewelMusicException extends Exception {
    
    private final int statusCode;
    private final Map<String, Object> details;
    
    /**
     * Creates a new JewelMusic exception.
     *
     * @param message The error message
     */
    public JewelMusicException(String message) {
        this(message, 0, null, null);
    }
    
    /**
     * Creates a new JewelMusic exception with a cause.
     *
     * @param message The error message
     * @param cause The underlying cause
     */
    public JewelMusicException(String message, Throwable cause) {
        this(message, 0, null, cause);
    }
    
    /**
     * Creates a new JewelMusic exception with status code.
     *
     * @param message The error message
     * @param statusCode The HTTP status code
     */
    public JewelMusicException(String message, int statusCode) {
        this(message, statusCode, null, null);
    }
    
    /**
     * Creates a new JewelMusic exception with status code and details.
     *
     * @param message The error message
     * @param statusCode The HTTP status code
     * @param details Additional error details
     */
    public JewelMusicException(String message, int statusCode, Map<String, Object> details) {
        this(message, statusCode, details, null);
    }
    
    /**
     * Creates a new JewelMusic exception with all parameters.
     *
     * @param message The error message
     * @param statusCode The HTTP status code
     * @param details Additional error details
     * @param cause The underlying cause
     */
    public JewelMusicException(String message, int statusCode, Map<String, Object> details, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
        this.details = details;
    }
    
    /**
     * Gets the HTTP status code associated with this error.
     *
     * @return The HTTP status code, or 0 if not applicable
     */
    public int getStatusCode() {
        return statusCode;
    }
    
    /**
     * Gets additional error details.
     *
     * @return A map of error details, or null if not available
     */
    public Map<String, Object> getDetails() {
        return details;
    }
    
    /**
     * Checks if this is a client error (4xx status code).
     *
     * @return true if this is a client error, false otherwise
     */
    public boolean isClientError() {
        return statusCode >= 400 && statusCode < 500;
    }
    
    /**
     * Checks if this is a server error (5xx status code).
     *
     * @return true if this is a server error, false otherwise
     */
    public boolean isServerError() {
        return statusCode >= 500;
    }
    
    /**
     * Gets a detailed string representation of this exception.
     *
     * @return A string representation including status code and details
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        
        if (statusCode > 0) {
            sb.append(" (").append(statusCode).append(")");
        }
        
        sb.append(": ").append(getMessage());
        
        if (details != null && !details.isEmpty()) {
            sb.append(" [").append(details).append("]");
        }
        
        return sb.toString();
    }
}