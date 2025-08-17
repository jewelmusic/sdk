<?php

declare(strict_types=1);

namespace JewelMusic\Exceptions;

/**
 * Exception thrown when rate limit is exceeded
 */
class RateLimitException extends ApiException
{
    private ?int $retryAfter;

    public function __construct(string $message = 'Rate limit exceeded', int $httpStatusCode = 429, ?int $retryAfter = null)
    {
        parent::__construct($message, $httpStatusCode);
        $this->retryAfter = $retryAfter;
    }

    /**
     * Get the number of seconds to wait before retrying
     */
    public function getRetryAfter(): ?int
    {
        return $this->retryAfter;
    }

    /**
     * Check if retry after time is specified
     */
    public function hasRetryAfter(): bool
    {
        return $this->retryAfter !== null;
    }
}