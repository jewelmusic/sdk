<?php

declare(strict_types=1);

namespace JewelMusic;

use JewelMusic\Http\HttpClient;
use JewelMusic\Resources\CopilotResource;
use JewelMusic\Resources\AnalysisResource;
use JewelMusic\Resources\DistributionResource;
use JewelMusic\Resources\TranscriptionResource;
use JewelMusic\Resources\TracksResource;
use JewelMusic\Resources\AnalyticsResource;
use JewelMusic\Resources\UserResource;
use JewelMusic\Resources\WebhooksResource;

/**
 * JewelMusic PHP SDK
 * 
 * The official PHP SDK for the JewelMusic AI-powered music distribution platform.
 * Provides comprehensive access to music analysis, distribution, transcription,
 * analytics, and user management features.
 */
class JewelMusic
{
    private HttpClient $httpClient;
    
    public readonly CopilotResource $copilot;
    public readonly AnalysisResource $analysis;
    public readonly DistributionResource $distribution;
    public readonly TranscriptionResource $transcription;
    public readonly TracksResource $tracks;
    public readonly AnalyticsResource $analytics;
    public readonly UserResource $user;
    public readonly WebhooksResource $webhooks;

    /**
     * Initialize the JewelMusic SDK
     *
     * @param string $apiKey Your JewelMusic API key
     * @param array $options Configuration options
     *                      - baseUrl: API base URL (default: https://api.jewelmusic.art)
     *                      - timeout: Request timeout in seconds (default: 30)
     *                      - userAgent: Custom user agent string
     *                      - retries: Number of retry attempts (default: 3)
     *                      - retryDelay: Delay between retries in seconds (default: 1)
     *                      - rateLimit: Enable rate limiting (default: true)
     */
    public function __construct(string $apiKey, array $options = [])
    {
        $this->httpClient = new HttpClient($apiKey, $options);
        
        // Initialize all resource managers
        $this->copilot = new CopilotResource($this->httpClient);
        $this->analysis = new AnalysisResource($this->httpClient);
        $this->distribution = new DistributionResource($this->httpClient);
        $this->transcription = new TranscriptionResource($this->httpClient);
        $this->tracks = new TracksResource($this->httpClient);
        $this->analytics = new AnalyticsResource($this->httpClient);
        $this->user = new UserResource($this->httpClient);
        $this->webhooks = new WebhooksResource($this->httpClient);
    }

    /**
     * Get the HTTP client instance
     */
    public function getHttpClient(): HttpClient
    {
        return $this->httpClient;
    }

    /**
     * Set a custom HTTP client
     */
    public function setHttpClient(HttpClient $httpClient): void
    {
        $this->httpClient = $httpClient;
    }

    /**
     * Get SDK version
     */
    public static function getVersion(): string
    {
        return '1.0.0';
    }

    /**
     * Get API information
     */
    public function getApiInfo(): array
    {
        return $this->httpClient->get('/info');
    }

    /**
     * Test API connection
     */
    public function ping(): array
    {
        return $this->httpClient->get('/ping');
    }
}