package com.jewelmusic.exceptions;

import java.util.List;
import java.util.Map;

/**
 * Exception thrown when request validation fails.
 * <p>
 * This exception is typically thrown when:
 * <ul>
 *   <li>Required fields are missing</li>
 *   <li>Field values are invalid</li>
 *   <li>Business rules are violated</li>
 * </ul>
 *
 * @since 1.0.0
 */
public class ValidationException extends JewelMusicException {
    
    private final Map<String, List<String>> validationErrors;
    
    /**
     * Creates a new validation exception with a default message.
     */
    public ValidationException() {
        this("Validation failed", null);
    }
    
    /**
     * Creates a new validation exception with the specified message.
     *
     * @param message The error message
     */
    public ValidationException(String message) {
        this(message, null);
    }
    
    /**
     * Creates a new validation exception with validation errors.
     *
     * @param message The error message
     * @param validationErrors Map of field names to error messages
     */
    public ValidationException(String message, Map<String, List<String>> validationErrors) {
        super(message, 422, validationErrors != null ? Map.of("errors", validationErrors) : null);
        this.validationErrors = validationErrors;
    }
    
    /**
     * Gets the validation errors for all fields.
     *
     * @return A map of field names to lists of error messages, or null if not available
     */
    public Map<String, List<String>> getValidationErrors() {
        return validationErrors;
    }
    
    /**
     * Checks if a specific field has validation errors.
     *
     * @param field The field name to check
     * @return true if the field has errors, false otherwise
     */
    public boolean hasFieldError(String field) {
        return validationErrors != null && validationErrors.containsKey(field);
    }
    
    /**
     * Gets validation errors for a specific field.
     *
     * @param field The field name
     * @return A list of error messages for the field, or null if not found
     */
    public List<String> getFieldErrors(String field) {
        return validationErrors != null ? validationErrors.get(field) : null;
    }
    
    /**
     * Gets the first validation error for a specific field.
     *
     * @param field The field name
     * @return The first error message for the field, or null if not found
     */
    public String getFirstFieldError(String field) {
        List<String> errors = getFieldErrors(field);
        return errors != null && !errors.isEmpty() ? errors.get(0) : null;
    }
}