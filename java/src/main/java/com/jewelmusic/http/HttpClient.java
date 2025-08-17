package com.jewelmusic.http;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.jewelmusic.exceptions.*;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * HTTP client for making requests to the JewelMusic API.
 * <p>
 * This class handles all HTTP communication with the JewelMusic API,
 * including authentication, retries, error handling, and file uploads.
 * It is thread-safe and can be shared across multiple threads.
 *
 * @since 1.0.0
 */
public class HttpClient {
    
    private static final Logger logger = LoggerFactory.getLogger(HttpClient.class);
    private static final String API_VERSION = "/v1";
    private static final String DEFAULT_USER_AGENT = "JewelMusic-Java-SDK/1.0.0";
    private static final MediaType JSON_MEDIA_TYPE = MediaType.get("application/json; charset=utf-8");
    private static final TypeReference<Map<String, Object>> MAP_TYPE_REF = new TypeReference<Map<String, Object>>() {};
    
    private final OkHttpClient client;
    private final String baseUrl;
    private final String apiKey;
    private final ObjectMapper objectMapper;
    
    /**
     * Creates a new HTTP client with the specified configuration.
     *
     * @param apiKey API key for authentication
     * @param baseUrl Base URL for the API
     * @param timeout Request timeout duration
     * @param maxRetries Maximum number of retry attempts
     * @param userAgent Custom user agent string
     * @param additionalHeaders Additional headers to include
     */
    public HttpClient(String apiKey, String baseUrl, Duration timeout, int maxRetries, 
                     String userAgent, Map<String, String> additionalHeaders) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.objectMapper = createObjectMapper();
        
        OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder()
                .connectTimeout(timeout)
                .readTimeout(timeout)
                .writeTimeout(timeout)
                .addInterceptor(new AuthenticationInterceptor(apiKey))
                .addInterceptor(new UserAgentInterceptor(userAgent != null ? userAgent : DEFAULT_USER_AGENT))
                .addInterceptor(new RetryInterceptor(maxRetries));
        
        if (additionalHeaders != null && !additionalHeaders.isEmpty()) {
            clientBuilder.addInterceptor(new HeadersInterceptor(additionalHeaders));
        }
        
        this.client = clientBuilder.build();
    }
    
    /**
     * Makes a GET request to the specified path.
     *
     * @param path The API endpoint path
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> get(String path) {
        return get(path, null);
    }
    
    /**
     * Makes a GET request to the specified path with query parameters.
     *
     * @param path The API endpoint path
     * @param params Query parameters
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> get(String path, Map<String, String> params) {
        HttpUrl.Builder urlBuilder = HttpUrl.parse(baseUrl + API_VERSION + path).newBuilder();
        
        if (params != null) {
            params.forEach((key, value) -> {
                if (value != null && !value.isEmpty()) {
                    urlBuilder.addQueryParameter(key, value);
                }
            });
        }
        
        Request request = new Request.Builder()
                .url(urlBuilder.build())
                .get()
                .build();
        
        return executeRequest(request);
    }
    
    /**
     * Makes a POST request to the specified path.
     *
     * @param path The API endpoint path
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> post(String path) {
        return post(path, null);
    }
    
    /**
     * Makes a POST request to the specified path with data.
     *
     * @param path The API endpoint path
     * @param data Request body data
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> post(String path, Object data) {
        RequestBody body = createJsonRequestBody(data);
        
        Request request = new Request.Builder()
                .url(baseUrl + API_VERSION + path)
                .post(body)
                .build();
        
        return executeRequest(request);
    }
    
    /**
     * Makes a PUT request to the specified path with data.
     *
     * @param path The API endpoint path
     * @param data Request body data
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> put(String path, Object data) {
        RequestBody body = createJsonRequestBody(data);
        
        Request request = new Request.Builder()
                .url(baseUrl + API_VERSION + path)
                .put(body)
                .build();
        
        return executeRequest(request);
    }
    
    /**
     * Makes a DELETE request to the specified path.
     *
     * @param path The API endpoint path
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> delete(String path) {
        return delete(path, null);
    }
    
    /**
     * Makes a DELETE request to the specified path with data.
     *
     * @param path The API endpoint path
     * @param data Request body data
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> delete(String path, Object data) {
        RequestBody body = data != null ? createJsonRequestBody(data) : RequestBody.create(new byte[0]);
        
        Request request = new Request.Builder()
                .url(baseUrl + API_VERSION + path)
                .delete(body)
                .build();
        
        return executeRequest(request);
    }
    
    /**
     * Uploads a file to the specified path.
     *
     * @param path The API endpoint path
     * @param file The file to upload
     * @param filename The filename to use
     * @param metadata Additional metadata fields
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> uploadFile(String path, File file, String filename, Map<String, String> metadata) {
        MultipartBody.Builder bodyBuilder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", filename, 
                    RequestBody.create(file, MediaType.parse("application/octet-stream")));
        
        if (metadata != null) {
            metadata.forEach(bodyBuilder::addFormDataPart);
        }
        
        Request request = new Request.Builder()
                .url(baseUrl + API_VERSION + path)
                .post(bodyBuilder.build())
                .build();
        
        return executeRequest(request);
    }
    
    /**
     * Uploads a file from an input stream to the specified path.
     *
     * @param path The API endpoint path
     * @param inputStream The input stream to upload
     * @param filename The filename to use
     * @param metadata Additional metadata fields
     * @return Response data as a map
     * @throws JewelMusicException if the request fails
     */
    public Map<String, Object> uploadFile(String path, InputStream inputStream, String filename, Map<String, String> metadata) {
        try {
            byte[] fileBytes = inputStream.readAllBytes();
            
            MultipartBody.Builder bodyBuilder = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("file", filename, 
                        RequestBody.create(fileBytes, MediaType.parse("application/octet-stream")));
            
            if (metadata != null) {
                metadata.forEach(bodyBuilder::addFormDataPart);
            }
            
            Request request = new Request.Builder()
                    .url(baseUrl + API_VERSION + path)
                    .post(bodyBuilder.build())
                    .build();
            
            return executeRequest(request);
        } catch (IOException e) {
            throw new NetworkException("Failed to read input stream", e);
        }
    }
    
    private RequestBody createJsonRequestBody(Object data) {
        if (data == null) {
            return RequestBody.create(new byte[0], JSON_MEDIA_TYPE);
        }
        
        try {
            String json = objectMapper.writeValueAsString(data);
            return RequestBody.create(json, JSON_MEDIA_TYPE);
        } catch (Exception e) {
            throw new JewelMusicException("Failed to serialize request data", e);
        }
    }
    
    private Map<String, Object> executeRequest(Request request) {
        try (Response response = client.newCall(request).execute()) {
            return handleResponse(response);
        } catch (IOException e) {
            logger.error("Network error during request to {}", request.url(), e);
            throw new NetworkException("Network error: " + e.getMessage(), e);
        }
    }
    
    private Map<String, Object> handleResponse(Response response) throws IOException {
        String responseBody = response.body() != null ? response.body().string() : "";
        
        if (response.isSuccessful()) {
            if (responseBody.isEmpty()) {
                return new HashMap<>();
            }
            
            try {
                return objectMapper.readValue(responseBody, MAP_TYPE_REF);
            } catch (Exception e) {
                logger.warn("Failed to parse successful response as JSON: {}", responseBody);
                return Map.of("data", responseBody);
            }
        } else {
            throw createExceptionFromResponse(response.code(), responseBody);
        }
    }
    
    private JewelMusicException createExceptionFromResponse(int statusCode, String responseBody) {
        Map<String, Object> errorData = parseErrorResponse(responseBody);
        String message = extractErrorMessage(errorData);
        
        switch (statusCode) {
            case 401:
                return new AuthenticationException(message, errorData);
            case 404:
                return new NotFoundException(message, errorData);
            case 422:
                return new ValidationException(message, extractValidationErrors(errorData));
            case 429:
                Duration retryAfter = extractRetryAfter(errorData);
                return new RateLimitException(message, retryAfter);
            default:
                return new JewelMusicException(message, statusCode, errorData);
        }
    }
    
    private Map<String, Object> parseErrorResponse(String responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return new HashMap<>();
        }
        
        try {
            return objectMapper.readValue(responseBody, MAP_TYPE_REF);
        } catch (Exception e) {
            logger.warn("Failed to parse error response as JSON: {}", responseBody);
            return Map.of("message", responseBody);
        }
    }
    
    private String extractErrorMessage(Map<String, Object> errorData) {
        if (errorData.containsKey("message")) {
            return errorData.get("message").toString();
        }
        
        if (errorData.containsKey("error")) {
            Object error = errorData.get("error");
            if (error instanceof String) {
                return (String) error;
            } else if (error instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> errorMap = (Map<String, Object>) error;
                if (errorMap.containsKey("message")) {
                    return errorMap.get("message").toString();
                }
            }
        }
        
        return "API request failed";
    }
    
    @SuppressWarnings("unchecked")
    private Map<String, List<String>> extractValidationErrors(Map<String, Object> errorData) {
        Object errors = errorData.get("errors");
        if (errors instanceof Map) {
            try {
                return (Map<String, List<String>>) errors;
            } catch (ClassCastException e) {
                logger.warn("Failed to extract validation errors from response", e);
            }
        }
        return null;
    }
    
    private Duration extractRetryAfter(Map<String, Object> errorData) {
        Object retryAfter = errorData.get("retryAfter");
        if (retryAfter instanceof Number) {
            return Duration.ofSeconds(((Number) retryAfter).longValue());
        }
        return null;
    }
    
    private ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
    
    // Interceptor classes
    
    private static class AuthenticationInterceptor implements Interceptor {
        private final String apiKey;
        
        AuthenticationInterceptor(String apiKey) {
            this.apiKey = apiKey;
        }
        
        @Override
        public Response intercept(Chain chain) throws IOException {
            Request original = chain.request();
            Request.Builder requestBuilder = original.newBuilder()
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json");
            
            // Only set Content-Type for requests with a body (not multipart)
            if (original.body() != null && !(original.body() instanceof MultipartBody)) {
                requestBuilder.header("Content-Type", "application/json");
            }
            
            return chain.proceed(requestBuilder.build());
        }
    }
    
    private static class UserAgentInterceptor implements Interceptor {
        private final String userAgent;
        
        UserAgentInterceptor(String userAgent) {
            this.userAgent = userAgent;
        }
        
        @Override
        public Response intercept(Chain chain) throws IOException {
            Request original = chain.request();
            Request request = original.newBuilder()
                    .header("User-Agent", userAgent)
                    .build();
            return chain.proceed(request);
        }
    }
    
    private static class HeadersInterceptor implements Interceptor {
        private final Map<String, String> headers;
        
        HeadersInterceptor(Map<String, String> headers) {
            this.headers = headers;
        }
        
        @Override
        public Response intercept(Chain chain) throws IOException {
            Request original = chain.request();
            Request.Builder requestBuilder = original.newBuilder();
            
            headers.forEach(requestBuilder::header);
            
            return chain.proceed(requestBuilder.build());
        }
    }
    
    private static class RetryInterceptor implements Interceptor {
        private final int maxRetries;
        
        RetryInterceptor(int maxRetries) {
            this.maxRetries = maxRetries;
        }
        
        @Override
        public Response intercept(Chain chain) throws IOException {
            Request request = chain.request();
            Response response = null;
            IOException lastException = null;
            
            for (int attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    if (response != null) {
                        response.close();
                    }
                    
                    response = chain.proceed(request);
                    
                    // Don't retry on successful responses or client errors
                    if (response.isSuccessful() || response.code() < 500) {
                        return response;
                    }
                    
                    if (attempt < maxRetries) {
                        logger.debug("Request failed with status {}, retrying... (attempt {}/{})", 
                                   response.code(), attempt + 1, maxRetries);
                        
                        // Wait before retrying
                        try {
                            TimeUnit.SECONDS.sleep(Math.min(attempt + 1, 5));
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            throw new IOException("Retry interrupted", e);
                        }
                    }
                } catch (IOException e) {
                    lastException = e;
                    
                    if (attempt < maxRetries) {
                        logger.debug("Request failed with exception, retrying... (attempt {}/{})", 
                                   attempt + 1, maxRetries, e);
                        
                        // Wait before retrying
                        try {
                            TimeUnit.SECONDS.sleep(Math.min(attempt + 1, 5));
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new IOException("Retry interrupted", ie);
                        }
                    }
                }
            }
            
            if (response != null) {
                return response;
            } else {
                throw lastException;
            }
        }
    }
}