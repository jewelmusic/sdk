<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

use JewelMusic\Http\HttpClient;

/**
 * Base class for all resource classes
 */
abstract class BaseResource
{
    protected HttpClient $httpClient;

    public function __construct(HttpClient $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    /**
     * Extract data from API response
     */
    protected function extractData(array $response): array
    {
        return $response['data'] ?? $response;
    }

    /**
     * Build query parameters array from filters
     */
    protected function buildParams(array $baseParams, ?array $filters = null): array
    {
        $params = $baseParams;
        
        if ($filters) {
            foreach ($filters as $key => $value) {
                if ($value !== null && $value !== '') {
                    if (is_array($value)) {
                        $params[$key] = implode(',', $value);
                    } elseif (is_bool($value)) {
                        $params[$key] = $value ? 'true' : 'false';
                    } else {
                        $params[$key] = (string)$value;
                    }
                }
            }
        }
        
        return $params;
    }

    /**
     * Validate required parameters
     */
    protected function validateRequired(array $data, array $required): void
    {
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                throw new \InvalidArgumentException("Required field '{$field}' is missing or empty");
            }
        }
    }

    /**
     * Filter out null/empty values from array
     */
    protected function filterNullValues(array $data): array
    {
        return array_filter($data, function ($value) {
            return $value !== null && $value !== '';
        });
    }
}