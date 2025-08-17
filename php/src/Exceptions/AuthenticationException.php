<?php

declare(strict_types=1);

namespace JewelMusic\Exceptions;

/**
 * Exception thrown when authentication fails
 */
class AuthenticationException extends ApiException
{
    public function __construct(string $message = 'Authentication failed', int $httpStatusCode = 401, array $details = [])
    {
        parent::__construct($message, $httpStatusCode, $details);
    }
}