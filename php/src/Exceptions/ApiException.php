<?php

declare(strict_types=1);

namespace JewelMusic\Exceptions;

use Exception;

/**
 * Base exception for all JewelMusic API errors
 */
class ApiException extends Exception
{
    protected int $httpStatusCode;
    protected array $details;

    public function __construct(string $message = '', int $httpStatusCode = 0, array $details = [], ?Exception $previous = null)
    {
        parent::__construct($message, $httpStatusCode, $previous);
        $this->httpStatusCode = $httpStatusCode;
        $this->details = $details;
    }

    /**
     * Get the HTTP status code
     */
    public function getHttpStatusCode(): int
    {
        return $this->httpStatusCode;
    }

    /**
     * Get additional error details
     */
    public function getDetails(): array
    {
        return $this->details;
    }

    /**
     * Get error details as JSON string
     */
    public function getDetailsAsJson(): string
    {
        return json_encode($this->details, JSON_PRETTY_PRINT);
    }

    /**
     * Check if this is a client error (4xx)
     */
    public function isClientError(): bool
    {
        return $this->httpStatusCode >= 400 && $this->httpStatusCode < 500;
    }

    /**
     * Check if this is a server error (5xx)
     */
    public function isServerError(): bool
    {
        return $this->httpStatusCode >= 500;
    }
}