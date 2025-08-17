package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

/**
 * Base class for all API resources.
 * <p>
 * This class provides common functionality for all resource classes,
 * including access to the HTTP client and base configuration.
 *
 * @since 1.0.0
 */
public abstract class BaseResource {
    
    protected final HttpClient httpClient;
    
    /**
     * Creates a new base resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    protected BaseResource(HttpClient httpClient) {
        this.httpClient = httpClient;
    }
    
    /**
     * Gets the base path for this resource's endpoints.
     * <p>
     * This method should be implemented by subclasses to return
     * the appropriate path prefix for their API endpoints.
     *
     * @return The base path for this resource
     */
    protected abstract String getBasePath();
}