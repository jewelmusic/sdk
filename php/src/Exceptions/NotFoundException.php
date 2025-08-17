<?php

declare(strict_types=1);

namespace JewelMusic\Exceptions;

/**
 * Exception thrown when a requested resource is not found
 */
class NotFoundException extends ApiException
{
    public function __construct(string $message = 'Resource not found', int $httpStatusCode = 404, array $details = [])
    {
        parent::__construct($message, $httpStatusCode, $details);
    }
}