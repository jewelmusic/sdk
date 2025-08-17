<?php

declare(strict_types=1);

namespace JewelMusic\Exceptions;

/**
 * Exception thrown when request validation fails
 */
class ValidationException extends ApiException
{
    private array $validationErrors;

    public function __construct(string $message = 'Validation failed', int $httpStatusCode = 422, array $validationErrors = [])
    {
        parent::__construct($message, $httpStatusCode, $validationErrors);
        $this->validationErrors = $validationErrors;
    }

    /**
     * Get validation errors
     */
    public function getValidationErrors(): array
    {
        return $this->validationErrors;
    }

    /**
     * Check if a specific field has validation errors
     */
    public function hasFieldError(string $field): bool
    {
        return isset($this->validationErrors[$field]);
    }

    /**
     * Get validation errors for a specific field
     */
    public function getFieldErrors(string $field): array
    {
        return $this->validationErrors[$field] ?? [];
    }
}