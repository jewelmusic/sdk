<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * Distribution resource for music platform distribution and release management
 */
class DistributionResource extends BaseResource
{
    /**
     * Create a new release for distribution
     *
     * @param array $releaseData Release information
     *                          - title: Release title
     *                          - artist: Artist name
     *                          - releaseDate: Release date
     *                          - tracks: Array of track IDs
     *                          - platforms: Target platforms
     *                          - metadata: Additional metadata
     * @return array Created release data
     */
    public function createRelease(array $releaseData): array
    {
        $this->validateRequired($releaseData, ['title', 'artist', 'releaseDate', 'tracks']);
        
        $response = $this->httpClient->post('/distribution/releases', $releaseData);
        return $this->extractData($response);
    }

    /**
     * Get release by ID
     *
     * @param string $releaseId Release ID
     * @return array Release data
     */
    public function getRelease(string $releaseId): array
    {
        $response = $this->httpClient->get("/distribution/releases/{$releaseId}");
        return $this->extractData($response);
    }

    /**
     * Update release information
     *
     * @param string $releaseId Release ID
     * @param array $updates Release updates
     * @return array Updated release data
     */
    public function updateRelease(string $releaseId, array $updates): array
    {
        $this->validateRequired(['releaseId' => $releaseId], ['releaseId']);
        
        $response = $this->httpClient->put("/distribution/releases/{$releaseId}", $updates);
        return $this->extractData($response);
    }

    /**
     * Submit release for platform distribution
     *
     * @param string $releaseId Release ID
     * @param array $platforms Target platforms
     * @param array $options Distribution options
     *                      - releaseDate: Specific release date
     *                      - territories: Geographic territories
     *                      - pricing: Pricing information
     * @return array Submission result
     */
    public function submitForDistribution(string $releaseId, array $platforms, array $options = []): array
    {
        $this->validateRequired(['releaseId' => $releaseId, 'platforms' => $platforms], ['releaseId', 'platforms']);
        
        $data = array_merge(
            ['platforms' => $platforms],
            $this->filterNullValues($options)
        );
        
        $response = $this->httpClient->post("/distribution/releases/{$releaseId}/submit", $data);
        return $this->extractData($response);
    }

    /**
     * Get distribution status for a release
     *
     * @param string $releaseId Release ID
     * @return array Distribution status
     */
    public function getDistributionStatus(string $releaseId): array
    {
        $response = $this->httpClient->get("/distribution/releases/{$releaseId}/status");
        return $this->extractData($response);
    }

    /**
     * Get available platforms for distribution
     *
     * @param array $filters Platform filters
     *                      - type: Platform type (streaming, download, social)
     *                      - regions: Supported regions
     *                      - features: Required features
     * @return array Available platforms
     */
    public function getPlatforms(array $filters = []): array
    {
        $params = $this->buildParams([], $filters);
        $response = $this->httpClient->get('/distribution/platforms', $params);
        return $this->extractData($response);
    }

    /**
     * Get platform-specific requirements
     *
     * @param string $platform Platform identifier
     * @return array Platform requirements
     */
    public function getPlatformRequirements(string $platform): array
    {
        $response = $this->httpClient->get("/distribution/platforms/{$platform}/requirements");
        return $this->extractData($response);
    }

    /**
     * Validate release for platform compliance
     *
     * @param string $releaseId Release ID
     * @param array $platforms Platforms to validate against
     * @return array Validation results
     */
    public function validateRelease(string $releaseId, array $platforms = []): array
    {
        $data = ['platforms' => $platforms];
        $response = $this->httpClient->post("/distribution/releases/{$releaseId}/validate", $data);
        return $this->extractData($response);
    }

    /**
     * Schedule release for future distribution
     *
     * @param string $releaseId Release ID
     * @param string $releaseDate Scheduled release date
     * @param array $platforms Target platforms
     * @param array $options Scheduling options
     *                      - timezone: Release timezone
     *                      - territories: Geographic territories
     *                      - preOrder: Enable pre-order
     * @return array Scheduling result
     */
    public function scheduleRelease(string $releaseId, string $releaseDate, array $platforms, array $options = []): array
    {
        $this->validateRequired([
            'releaseId' => $releaseId,
            'releaseDate' => $releaseDate,
            'platforms' => $platforms
        ], ['releaseId', 'releaseDate', 'platforms']);
        
        $data = array_merge([
            'releaseDate' => $releaseDate,
            'platforms' => $platforms
        ], $this->filterNullValues($options));
        
        $response = $this->httpClient->post("/distribution/releases/{$releaseId}/schedule", $data);
        return $this->extractData($response);
    }

    /**
     * Get earnings and royalty information
     *
     * @param string $releaseId Release ID (optional, for specific release)
     * @param array $filters Earnings filters
     *                      - startDate: Start date for earnings period
     *                      - endDate: End date for earnings period
     *                      - platforms: Specific platforms
     *                      - currency: Currency for earnings
     * @return array Earnings data
     */
    public function getEarnings(?string $releaseId = null, array $filters = []): array
    {
        $endpoint = $releaseId ? "/distribution/releases/{$releaseId}/earnings" : '/distribution/earnings';
        $params = $this->buildParams([], $filters);
        
        $response = $this->httpClient->get($endpoint, $params);
        return $this->extractData($response);
    }

    /**
     * Get streaming statistics
     *
     * @param string $releaseId Release ID
     * @param array $filters Statistics filters
     *                      - startDate: Start date for statistics
     *                      - endDate: End date for statistics
     *                      - platforms: Specific platforms
     *                      - metrics: Specific metrics to retrieve
     * @return array Streaming statistics
     */
    public function getStreamingStats(string $releaseId, array $filters = []): array
    {
        $params = $this->buildParams([], $filters);
        $response = $this->httpClient->get("/distribution/releases/{$releaseId}/stats", $params);
        return $this->extractData($response);
    }

    /**
     * Update release on specific platforms
     *
     * @param string $releaseId Release ID
     * @param array $platformUpdates Platform-specific updates
     * @return array Update results
     */
    public function updateOnPlatforms(string $releaseId, array $platformUpdates): array
    {
        $data = ['platformUpdates' => $platformUpdates];
        $response = $this->httpClient->post("/distribution/releases/{$releaseId}/platform-updates", $data);
        return $this->extractData($response);
    }

    /**
     * Takedown release from platforms
     *
     * @param string $releaseId Release ID
     * @param array $platforms Platforms to takedown from
     * @param array $options Takedown options
     *                      - reason: Takedown reason
     *                      - effective: Effective date
     * @return array Takedown result
     */
    public function takedownRelease(string $releaseId, array $platforms, array $options = []): array
    {
        $data = array_merge(
            ['platforms' => $platforms],
            $this->filterNullValues($options)
        );
        
        $response = $this->httpClient->post("/distribution/releases/{$releaseId}/takedown", $data);
        return $this->extractData($response);
    }

    /**
     * Get detailed distribution analytics
     *
     * @param string $releaseId Release ID
     * @param array $options Analytics options
     *                      - period: Analysis period
     *                      - breakdown: Data breakdown (platform, territory, time)
     *                      - metrics: Specific metrics to include
     * @return array Distribution analytics
     */
    public function getAnalytics(string $releaseId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/distribution/releases/{$releaseId}/analytics", $params);
        return $this->extractData($response);
    }

    /**
     * Generate distribution report
     *
     * @param array $options Report options
     *                      - releaseIds: Specific releases to include
     *                      - period: Report period
     *                      - format: Report format (pdf, csv, json)
     *                      - includeEarnings: Include earnings data
     * @return array Report data or download link
     */
    public function generateReport(array $options = []): array
    {
        $response = $this->httpClient->post('/distribution/reports', $this->filterNullValues($options));
        return $this->extractData($response);
    }

    /**
     * List releases with filtering and pagination
     *
     * @param int $page Page number
     * @param int $perPage Items per page
     * @param array $filters Release filters
     *                      - status: Release status
     *                      - artist: Artist name filter
     *                      - dateRange: Release date range
     *                      - platforms: Platform filter
     * @return array Releases list
     */
    public function listReleases(int $page = 1, int $perPage = 20, array $filters = []): array
    {
        $params = $this->buildParams([
            'page' => (string)$page,
            'perPage' => (string)$perPage
        ], $filters);
        
        $response = $this->httpClient->get('/distribution/releases', $params);
        return $this->extractData($response);
    }
}