<?php

declare(strict_types=1);

namespace JewelMusic\Http;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Utils;
use JewelMusic\Exceptions\ApiException;
use JewelMusic\Exceptions\AuthenticationException;
use JewelMusic\Exceptions\RateLimitException;
use JewelMusic\Exceptions\ValidationException;
use JewelMusic\Exceptions\NotFoundException;
use Psr\Http\Message\ResponseInterface;

/**
 * HTTP client for making requests to the JewelMusic API
 */
class HttpClient
{
    private Client $client;
    private string $apiKey;
    private string $baseUrl;
    private int $timeout;
    private string $userAgent;
    private int $retries;
    private int $retryDelay;
    private bool $rateLimit;

    public function __construct(string $apiKey, array $options = [])
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $options['baseUrl'] ?? 'https://api.jewelmusic.art';
        $this->timeout = $options['timeout'] ?? 30;
        $this->userAgent = $options['userAgent'] ?? 'JewelMusic-PHP-SDK/1.0.0';
        $this->retries = $options['retries'] ?? 3;
        $this->retryDelay = $options['retryDelay'] ?? 1;
        $this->rateLimit = $options['rateLimit'] ?? true;

        $this->client = new Client([
            'base_uri' => $this->baseUrl . '/v1',
            'timeout' => $this->timeout,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'User-Agent' => $this->userAgent,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    /**
     * Make a GET request
     */
    public function get(string $path, array $params = []): array
    {
        $url = $path;
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

        return $this->makeRequest('GET', $url);
    }

    /**
     * Make a POST request
     */
    public function post(string $path, array $data = []): array
    {
        return $this->makeRequest('POST', $path, $data);
    }

    /**
     * Make a PUT request
     */
    public function put(string $path, array $data = []): array
    {
        return $this->makeRequest('PUT', $path, $data);
    }

    /**
     * Make a DELETE request
     */
    public function delete(string $path): array
    {
        return $this->makeRequest('DELETE', $path);
    }

    /**
     * Upload a file with optional metadata
     */
    public function uploadFile(string $path, $file, string $filename, array $metadata = []): array
    {
        $multipart = [
            [
                'name' => 'file',
                'contents' => is_string($file) ? Utils::tryFopen($file, 'r') : $file,
                'filename' => $filename,
            ],
        ];

        // Add metadata as form fields
        foreach ($metadata as $key => $value) {
            $multipart[] = [
                'name' => $key,
                'contents' => is_array($value) ? json_encode($value) : (string)$value,
            ];
        }

        return $this->makeRequestWithMultipart('POST', $path, $multipart);
    }

    /**
     * Upload file with chunked upload support
     */
    public function uploadFileChunked(string $path, $file, string $filename, array $metadata = [], int $chunkSize = 8388608): array
    {
        $fileSize = is_string($file) ? filesize($file) : fstat($file)['size'];
        
        if ($fileSize <= $chunkSize) {
            // File is small enough to upload in one chunk
            return $this->uploadFile($path, $file, $filename, $metadata);
        }

        // Initialize chunked upload
        $initResponse = $this->post($path . '/init', array_merge($metadata, [
            'filename' => $filename,
            'filesize' => $fileSize,
            'chunkSize' => $chunkSize,
        ]));

        $uploadId = $initResponse['uploadId'];
        $chunks = ceil($fileSize / $chunkSize);

        $fileHandle = is_string($file) ? fopen($file, 'rb') : $file;
        
        try {
            // Upload chunks
            for ($chunkIndex = 0; $chunkIndex < $chunks; $chunkIndex++) {
                $chunkData = fread($fileHandle, $chunkSize);
                
                $multipart = [
                    [
                        'name' => 'chunk',
                        'contents' => $chunkData,
                        'filename' => $filename . '.chunk.' . $chunkIndex,
                    ],
                    [
                        'name' => 'uploadId',
                        'contents' => $uploadId,
                    ],
                    [
                        'name' => 'chunkIndex',
                        'contents' => (string)$chunkIndex,
                    ],
                ];

                $this->makeRequestWithMultipart('POST', $path . '/chunk', $multipart);
            }

            // Complete the upload
            return $this->post($path . '/complete', ['uploadId' => $uploadId]);
        } finally {
            if (is_string($file)) {
                fclose($fileHandle);
            }
        }
    }

    /**
     * Make an HTTP request with retry logic
     */
    private function makeRequest(string $method, string $path, array $data = []): array
    {
        $attempt = 0;
        $lastException = null;

        while ($attempt <= $this->retries) {
            try {
                $options = [];
                
                if (!empty($data)) {
                    $options['json'] = $data;
                }

                $response = $this->client->request($method, $path, $options);
                return $this->handleResponse($response);

            } catch (RequestException $e) {
                $lastException = $e;
                $attempt++;

                if ($attempt <= $this->retries) {
                    sleep($this->retryDelay * $attempt);
                    continue;
                }

                throw $this->createExceptionFromResponse($e);
            }
        }

        throw $lastException;
    }

    /**
     * Make an HTTP request with multipart data
     */
    private function makeRequestWithMultipart(string $method, string $path, array $multipart): array
    {
        $attempt = 0;
        $lastException = null;

        while ($attempt <= $this->retries) {
            try {
                $response = $this->client->request($method, $path, [
                    'multipart' => $multipart,
                    'headers' => [
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'User-Agent' => $this->userAgent,
                        'Accept' => 'application/json',
                        // Don't set Content-Type for multipart, let Guzzle handle it
                    ],
                ]);

                return $this->handleResponse($response);

            } catch (RequestException $e) {
                $lastException = $e;
                $attempt++;

                if ($attempt <= $this->retries) {
                    sleep($this->retryDelay * $attempt);
                    continue;
                }

                throw $this->createExceptionFromResponse($e);
            }
        }

        throw $lastException;
    }

    /**
     * Handle HTTP response
     */
    private function handleResponse(ResponseInterface $response): array
    {
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new ApiException('Invalid JSON response from API', $response->getStatusCode());
        }

        if ($response->getStatusCode() >= 400) {
            throw $this->createExceptionFromErrorResponse($data, $response->getStatusCode());
        }

        return $data;
    }

    /**
     * Create appropriate exception from HTTP response
     */
    private function createExceptionFromResponse(RequestException $e): ApiException
    {
        $response = $e->getResponse();
        
        if ($response === null) {
            return new ApiException('Network error: ' . $e->getMessage(), 0, $e);
        }

        $statusCode = $response->getStatusCode();
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        return $this->createExceptionFromErrorResponse($data, $statusCode);
    }

    /**
     * Create appropriate exception from error response data
     */
    private function createExceptionFromErrorResponse(array $data, int $statusCode): ApiException
    {
        $message = $data['message'] ?? 'API request failed';
        $code = $data['code'] ?? 'UNKNOWN_ERROR';

        switch ($statusCode) {
            case 401:
                return new AuthenticationException($message, $statusCode);
            case 404:
                return new NotFoundException($message, $statusCode);
            case 422:
                return new ValidationException($message, $statusCode, $data['errors'] ?? []);
            case 429:
                $retryAfter = $data['retryAfter'] ?? null;
                return new RateLimitException($message, $statusCode, $retryAfter);
            default:
                return new ApiException($message, $statusCode);
        }
    }
}