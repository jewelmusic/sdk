<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * Webhooks resource for webhook endpoint and delivery configuration management
 */
class WebhooksResource extends BaseResource
{
    /**
     * Get list of webhooks with filtering and pagination
     *
     * @param int $page Page number
     * @param int $perPage Items per page
     * @param array $filters Webhook filters
     *                      - active: Filter by active status
     *                      - events: Filter by event types
     *                      - url: Filter by URL pattern
     * @return array Webhooks list
     */
    public function list(int $page = 1, int $perPage = 20, array $filters = []): array
    {
        $params = $this->buildParams([
            'page' => (string)$page,
            'perPage' => (string)$perPage
        ], $filters);
        
        $response = $this->httpClient->get('/webhooks', $params);
        return $this->extractData($response);
    }

    /**
     * Get a specific webhook by ID
     *
     * @param string $webhookId Webhook ID
     * @return array Webhook data
     */
    public function get(string $webhookId): array
    {
        $this->validateRequired(['webhookId' => $webhookId], ['webhookId']);
        
        $response = $this->httpClient->get("/webhooks/{$webhookId}");
        return $this->extractData($response);
    }

    /**
     * Create a new webhook endpoint
     *
     * @param array $webhookData Webhook configuration
     *                          - url: Webhook endpoint URL (required)
     *                          - events: Array of event types to listen for (required)
     *                          - secret: Secret for signature verification
     *                          - active: Whether webhook is active
     *                          - description: Webhook description
     *                          - headers: Custom headers to include
     *                          - timeout: Request timeout in seconds
     *                          - retryPolicy: Retry configuration
     * @return array Created webhook data
     */
    public function create(array $webhookData): array
    {
        $this->validateRequired($webhookData, ['url', 'events']);
        
        $response = $this->httpClient->post('/webhooks', $webhookData);
        return $this->extractData($response);
    }

    /**
     * Update an existing webhook
     *
     * @param string $webhookId Webhook ID
     * @param array $updates Webhook updates
     * @return array Updated webhook data
     */
    public function update(string $webhookId, array $updates): array
    {
        $this->validateRequired(['webhookId' => $webhookId], ['webhookId']);
        
        $response = $this->httpClient->put("/webhooks/{$webhookId}", $this->filterNullValues($updates));
        return $this->extractData($response);
    }

    /**
     * Delete a webhook
     *
     * @param string $webhookId Webhook ID
     * @return array Deletion confirmation
     */
    public function delete(string $webhookId): array
    {
        $this->validateRequired(['webhookId' => $webhookId], ['webhookId']);
        
        $response = $this->httpClient->delete("/webhooks/{$webhookId}");
        return $this->extractData($response);
    }

    /**
     * Test a webhook by sending a test event
     *
     * @param string $webhookId Webhook ID
     * @param string $eventType Event type for test (optional, defaults to webhook.test)
     * @return array Test result
     */
    public function test(string $webhookId, string $eventType = ''): array
    {
        $this->validateRequired(['webhookId' => $webhookId], ['webhookId']);
        
        $data = ['eventType' => $eventType ?: 'webhook.test'];
        $response = $this->httpClient->post("/webhooks/{$webhookId}/test", $data);
        return $this->extractData($response);
    }

    /**
     * Get webhook delivery history
     *
     * @param string $webhookId Webhook ID
     * @param int $page Page number
     * @param int $perPage Items per page
     * @param array $filters Delivery filters
     *                      - status: Delivery status (success, failed, pending)
     *                      - eventType: Event type filter
     *                      - startDate: Start date for delivery history
     *                      - endDate: End date for delivery history
     * @return array Delivery history
     */
    public function getDeliveries(string $webhookId, int $page = 1, int $perPage = 20, array $filters = []): array
    {
        $this->validateRequired(['webhookId' => $webhookId], ['webhookId']);
        
        $params = $this->buildParams([
            'page' => (string)$page,
            'perPage' => (string)$perPage
        ], $filters);
        
        $response = $this->httpClient->get("/webhooks/{$webhookId}/deliveries", $params);
        return $this->extractData($response);
    }

    /**
     * Get specific webhook delivery details
     *
     * @param string $webhookId Webhook ID
     * @param string $deliveryId Delivery ID
     * @return array Delivery details
     */
    public function getDelivery(string $webhookId, string $deliveryId): array
    {
        $this->validateRequired([
            'webhookId' => $webhookId,
            'deliveryId' => $deliveryId
        ], ['webhookId', 'deliveryId']);
        
        $response = $this->httpClient->get("/webhooks/{$webhookId}/deliveries/{$deliveryId}");
        return $this->extractData($response);
    }

    /**
     * Retry a failed webhook delivery
     *
     * @param string $webhookId Webhook ID
     * @param string $deliveryId Delivery ID
     * @return array Retry result
     */
    public function retryDelivery(string $webhookId, string $deliveryId): array
    {
        $this->validateRequired([
            'webhookId' => $webhookId,
            'deliveryId' => $deliveryId
        ], ['webhookId', 'deliveryId']);
        
        $response = $this->httpClient->post("/webhooks/{$webhookId}/deliveries/{$deliveryId}/retry", []);
        return $this->extractData($response);
    }

    /**
     * Get available webhook event types
     *
     * @return array Available event types
     */
    public function getEventTypes(): array
    {
        $response = $this->httpClient->get('/webhooks/events/types');
        return $this->extractData($response);
    }

    /**
     * Get webhook statistics and metrics
     *
     * @param string $webhookId Webhook ID
     * @param array $options Statistics options
     *                      - period: Statistics period
     *                      - startDate: Start date for statistics
     *                      - endDate: End date for statistics
     *                      - groupBy: Data grouping method
     * @return array Webhook statistics
     */
    public function getStatistics(string $webhookId, array $options = []): array
    {
        $this->validateRequired(['webhookId' => $webhookId], ['webhookId']);
        
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/webhooks/{$webhookId}/statistics", $params);
        return $this->extractData($response);
    }

    /**
     * Verify webhook signature
     * 
     * This is a static method that can be used to verify webhook signatures
     * without making an API call.
     *
     * @param string $payload Raw webhook payload
     * @param string $signature Webhook signature header
     * @param string $secret Webhook secret
     * @param int $tolerance Timestamp tolerance in seconds (default: 300)
     * @return bool True if signature is valid
     */
    public static function verifySignature(string $payload, string $signature, string $secret, int $tolerance = 300): bool
    {
        try {
            // Parse signature header (format: "t=timestamp,v1=hash")
            $elements = explode(',', $signature);
            $timestamp = null;
            $hash = null;
            
            foreach ($elements as $element) {
                if (strpos($element, 't=') === 0) {
                    $timestamp = (int)substr($element, 2);
                } elseif (strpos($element, 'v1=') === 0) {
                    $hash = substr($element, 3);
                }
            }
            
            if ($timestamp === null || $hash === null) {
                return false;
            }
            
            // Check timestamp tolerance
            $now = time();
            if (abs($now - $timestamp) > $tolerance) {
                return false;
            }
            
            // Verify signature
            $signedPayload = $timestamp . '.' . $payload;
            $expectedHash = hash_hmac('sha256', $signedPayload, $secret);
            
            return hash_equals($hash, $expectedHash);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Parse webhook event payload
     * 
     * This is a static method to safely parse webhook event data.
     *
     * @param string $payload Raw webhook payload
     * @return array Parsed event data
     * @throws \InvalidArgumentException If payload format is invalid
     */
    public static function parseEvent(string $payload): array
    {
        $data = json_decode($payload, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('Invalid webhook payload format: ' . json_last_error_msg());
        }
        
        return $data;
    }

    /**
     * Create webhook signature for testing
     * 
     * This utility method can be used for testing webhook signature verification.
     *
     * @param string $payload Webhook payload
     * @param string $secret Webhook secret
     * @param int|null $timestamp Timestamp (defaults to current time)
     * @return string Webhook signature header
     */
    public static function createSignature(string $payload, string $secret, ?int $timestamp = null): string
    {
        $timestamp = $timestamp ?? time();
        $signedPayload = $timestamp . '.' . $payload;
        $hash = hash_hmac('sha256', $signedPayload, $secret);
        
        return "t={$timestamp},v1={$hash}";
    }

    /**
     * Enable or disable a webhook
     *
     * @param string $webhookId Webhook ID
     * @param bool $active Whether to activate or deactivate
     * @return array Updated webhook data
     */
    public function setActive(string $webhookId, bool $active): array
    {
        $this->validateRequired(['webhookId' => $webhookId], ['webhookId']);
        
        $data = ['active' => $active];
        $response = $this->httpClient->put("/webhooks/{$webhookId}", $data);
        return $this->extractData($response);
    }

    /**
     * Batch update multiple webhooks
     *
     * @param array $updates Array of webhook updates
     *                      Each item should contain 'id' and update data
     * @return array Batch update results
     */
    public function batchUpdate(array $updates): array
    {
        foreach ($updates as $update) {
            $this->validateRequired($update, ['id']);
        }
        
        $data = ['updates' => $updates];
        $response = $this->httpClient->post('/webhooks/batch-update', $data);
        return $this->extractData($response);
    }

    /**
     * Get webhook configuration templates
     *
     * @param string $useCase Use case for webhook (analytics, distribution, etc.)
     * @return array Configuration templates
     */
    public function getTemplates(string $useCase = ''): array
    {
        $params = $useCase ? ['useCase' => $useCase] : [];
        $response = $this->httpClient->get('/webhooks/templates', $params);
        return $this->extractData($response);
    }

    /**
     * Validate webhook endpoint
     *
     * @param string $url Webhook URL to validate
     * @param array $events Events to test
     * @return array Validation results
     */
    public function validateEndpoint(string $url, array $events = []): array
    {
        $this->validateRequired(['url' => $url], ['url']);
        
        $data = [
            'url' => $url,
            'events' => $events
        ];
        
        $response = $this->httpClient->post('/webhooks/validate', $data);
        return $this->extractData($response);
    }
}