package com.jewelmusic.resources;

import com.jewelmusic.http.HttpClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Webhooks resource for webhook management and verification.
 * <p>
 * This resource provides comprehensive webhook management capabilities,
 * including webhook registration, configuration, event handling,
 * signature verification, and webhook security within the JewelMusic platform.
 *
 * @since 1.0.0
 */
public class WebhooksResource extends BaseResource {
    
    /**
     * Creates a new webhooks resource with the specified HTTP client.
     *
     * @param httpClient The HTTP client for making API requests
     */
    public WebhooksResource(HttpClient httpClient) {
        super(httpClient);
    }
    
    @Override
    protected String getBasePath() {
        return "/webhooks";
    }
    
    /**
     * Lists all webhooks for the authenticated user.
     *
     * @return Map containing list of webhooks
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listWebhooks() {
        return listWebhooks(null);
    }
    
    /**
     * Lists webhooks with specific filters.
     *
     * @param filters Webhook filters (status, event types, URL patterns)
     * @return Map containing filtered list of webhooks
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> listWebhooks(Map<String, String> filters) {
        return httpClient.get(getBasePath(), filters);
    }
    
    /**
     * Creates a new webhook.
     *
     * @param webhookData Webhook configuration (URL, events, secret)
     * @return Map containing the created webhook
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> createWebhook(Map<String, Object> webhookData) {
        return httpClient.post(getBasePath(), webhookData);
    }
    
    /**
     * Gets a specific webhook by ID.
     *
     * @param webhookId The ID of the webhook
     * @return Map containing webhook details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getWebhook(String webhookId) {
        return httpClient.get(getBasePath() + "/" + webhookId);
    }
    
    /**
     * Updates an existing webhook.
     *
     * @param webhookId The ID of the webhook to update
     * @param updateData Updated webhook configuration
     * @return Map containing the updated webhook
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateWebhook(String webhookId, Map<String, Object> updateData) {
        return httpClient.put(getBasePath() + "/" + webhookId, updateData);
    }
    
    /**
     * Deletes a webhook.
     *
     * @param webhookId The ID of the webhook to delete
     * @return Map containing deletion confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> deleteWebhook(String webhookId) {
        return httpClient.delete(getBasePath() + "/" + webhookId);
    }
    
    /**
     * Tests a webhook by sending a test event.
     *
     * @param webhookId The ID of the webhook to test
     * @return Map containing test results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> testWebhook(String webhookId) {
        return testWebhook(webhookId, null);
    }
    
    /**
     * Tests a webhook with a specific event type.
     *
     * @param webhookId The ID of the webhook to test
     * @param eventType The type of event to simulate
     * @return Map containing test results
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> testWebhook(String webhookId, String eventType) {
        Map<String, String> data = new HashMap<>();
        if (eventType != null && !eventType.isEmpty()) {
            data.put("event_type", eventType);
        }
        return httpClient.post(getBasePath() + "/" + webhookId + "/test", data);
    }
    
    /**
     * Gets webhook delivery history and logs.
     *
     * @param webhookId The ID of the webhook
     * @return Map containing delivery history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDeliveries(String webhookId) {
        return getDeliveries(webhookId, null);
    }
    
    /**
     * Gets webhook delivery history with specific filters.
     *
     * @param webhookId The ID of the webhook
     * @param filters Delivery filters (date range, status, event type)
     * @return Map containing filtered delivery history
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDeliveries(String webhookId, Map<String, String> filters) {
        return httpClient.get(getBasePath() + "/" + webhookId + "/deliveries", filters);
    }
    
    /**
     * Gets details of a specific webhook delivery.
     *
     * @param webhookId The ID of the webhook
     * @param deliveryId The ID of the delivery
     * @return Map containing delivery details
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getDelivery(String webhookId, String deliveryId) {
        return httpClient.get(getBasePath() + "/" + webhookId + "/deliveries/" + deliveryId);
    }
    
    /**
     * Redelivers a webhook event.
     *
     * @param webhookId The ID of the webhook
     * @param deliveryId The ID of the delivery to redeliver
     * @return Map containing redelivery confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> redeliverEvent(String webhookId, String deliveryId) {
        return httpClient.post(getBasePath() + "/" + webhookId + "/deliveries/" + deliveryId + "/redeliver", null);
    }
    
    /**
     * Gets available webhook event types.
     *
     * @return Map containing list of available event types
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getEventTypes() {
        return httpClient.get(getBasePath() + "/events");
    }
    
    /**
     * Gets webhook configuration templates.
     *
     * @return Map containing webhook templates
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getTemplates() {
        return httpClient.get(getBasePath() + "/templates");
    }
    
    /**
     * Enables or disables a webhook.
     *
     * @param webhookId The ID of the webhook
     * @param enabled Whether to enable or disable the webhook
     * @return Map containing updated webhook status
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> setWebhookStatus(String webhookId, boolean enabled) {
        Map<String, Boolean> data = new HashMap<>();
        data.put("enabled", enabled);
        return httpClient.put(getBasePath() + "/" + webhookId + "/status", data);
    }
    
    /**
     * Updates webhook secret for signature verification.
     *
     * @param webhookId The ID of the webhook
     * @param newSecret The new webhook secret
     * @return Map containing secret update confirmation
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> updateSecret(String webhookId, String newSecret) {
        Map<String, String> data = new HashMap<>();
        data.put("secret", newSecret);
        return httpClient.put(getBasePath() + "/" + webhookId + "/secret", data);
    }
    
    /**
     * Gets webhook statistics and analytics.
     *
     * @param webhookId The ID of the webhook
     * @return Map containing webhook statistics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getWebhookStats(String webhookId) {
        return getWebhookStats(webhookId, null);
    }
    
    /**
     * Gets webhook statistics for a specific time period.
     *
     * @param webhookId The ID of the webhook
     * @param timeframe Timeframe for statistics (day, week, month)
     * @return Map containing webhook statistics
     * @throws com.jewelmusic.exceptions.JewelMusicException if the request fails
     */
    public Map<String, Object> getWebhookStats(String webhookId, String timeframe) {
        Map<String, String> params = new HashMap<>();
        if (timeframe != null && !timeframe.isEmpty()) {
            params.put("timeframe", timeframe);
        }
        return httpClient.get(getBasePath() + "/" + webhookId + "/stats", params);
    }
    
    // Static utility methods for webhook signature verification
    
    /**
     * Verifies the signature of a webhook payload.
     *
     * @param payload The webhook payload as bytes
     * @param signature The signature from the webhook headers
     * @param secret The webhook secret
     * @param tolerance Tolerance in seconds for timestamp verification
     * @return true if the signature is valid, false otherwise
     */
    public static boolean verifySignature(byte[] payload, String signature, String secret, int tolerance) {
        if (payload == null || signature == null || secret == null) {
            return false;
        }
        
        try {
            // Extract timestamp and hash from signature
            String[] parts = signature.split(",");
            long timestamp = 0;
            String hash = null;
            
            for (String part : parts) {
                String[] keyValue = part.split("=", 2);
                if (keyValue.length == 2) {
                    if ("t".equals(keyValue[0])) {
                        timestamp = Long.parseLong(keyValue[1]);
                    } else if ("v1".equals(keyValue[0])) {
                        hash = keyValue[1];
                    }
                }
            }
            
            if (timestamp == 0 || hash == null) {
                return false;
            }
            
            // Check timestamp tolerance
            long currentTime = Instant.now().getEpochSecond();
            if (Math.abs(currentTime - timestamp) > tolerance) {
                return false;
            }
            
            // Compute expected signature
            String signedPayload = timestamp + "." + new String(payload, StandardCharsets.UTF_8);
            String expectedHash = computeHmacSha256(signedPayload, secret);
            
            // Compare signatures
            return MessageDigest.isEqual(hash.getBytes(StandardCharsets.UTF_8), 
                                       expectedHash.getBytes(StandardCharsets.UTF_8));
            
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verifies the signature of a webhook payload with default tolerance.
     *
     * @param payload The webhook payload as bytes
     * @param signature The signature from the webhook headers
     * @param secret The webhook secret
     * @return true if the signature is valid, false otherwise
     */
    public static boolean verifySignature(byte[] payload, String signature, String secret) {
        return verifySignature(payload, signature, secret, 300); // 5 minutes default tolerance
    }
    
    /**
     * Verifies the signature of a webhook payload from string.
     *
     * @param payload The webhook payload as string
     * @param signature The signature from the webhook headers
     * @param secret The webhook secret
     * @param tolerance Tolerance in seconds for timestamp verification
     * @return true if the signature is valid, false otherwise
     */
    public static boolean verifySignature(String payload, String signature, String secret, int tolerance) {
        if (payload == null) {
            return false;
        }
        return verifySignature(payload.getBytes(StandardCharsets.UTF_8), signature, secret, tolerance);
    }
    
    /**
     * Verifies the signature of a webhook payload from string with default tolerance.
     *
     * @param payload The webhook payload as string
     * @param signature The signature from the webhook headers
     * @param secret The webhook secret
     * @return true if the signature is valid, false otherwise
     */
    public static boolean verifySignature(String payload, String signature, String secret) {
        return verifySignature(payload, signature, secret, 300);
    }
    
    /**
     * Computes HMAC-SHA256 hash for webhook signature verification.
     *
     * @param data The data to hash
     * @param secret The secret key
     * @return The computed HMAC-SHA256 hash as hexadecimal string
     */
    private static String computeHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            
            // Convert to hexadecimal
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
            
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to compute HMAC-SHA256", e);
        }
    }
    
    /**
     * Generates a webhook signature for testing purposes.
     *
     * @param payload The webhook payload
     * @param secret The webhook secret
     * @param timestamp The timestamp to use (current time if 0)
     * @return The generated signature string
     */
    public static String generateSignature(String payload, String secret, long timestamp) {
        if (timestamp == 0) {
            timestamp = Instant.now().getEpochSecond();
        }
        
        String signedPayload = timestamp + "." + payload;
        String hash = computeHmacSha256(signedPayload, secret);
        
        return "t=" + timestamp + ",v1=" + hash;
    }
    
    /**
     * Generates a webhook signature for testing purposes with current timestamp.
     *
     * @param payload The webhook payload
     * @param secret The webhook secret
     * @return The generated signature string
     */
    public static String generateSignature(String payload, String secret) {
        return generateSignature(payload, secret, 0);
    }
}