"""
JewelMusic SDK Exception Classes

This module defines the exception hierarchy for the JewelMusic Python SDK.
All exceptions inherit from JewelMusicError for easy exception handling.
"""

from typing import Optional, Dict, Any


class JewelMusicError(Exception):
    """
    Base exception class for all JewelMusic SDK errors.
    
    All other SDK exceptions inherit from this class, allowing for
    easy exception handling with a single except clause.
    
    Attributes:
        message: Error message
        status_code: HTTP status code (if applicable)
        request_id: Request ID for debugging
        details: Additional error details
    """
    
    def __init__(
        self,
        message: str,
        status_code: Optional[int] = None,
        request_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.request_id = request_id
        self.details = details or {}
    
    def __str__(self) -> str:
        parts = [self.message]
        if self.request_id:
            parts.append(f"Request ID: {self.request_id}")
        if self.status_code:
            parts.append(f"Status: {self.status_code}")
        return " | ".join(parts)


class AuthenticationError(JewelMusicError):
    """
    Raised when API authentication fails (HTTP 401).
    
    This typically indicates:
    - Invalid API key
    - Expired API key
    - Missing authorization header
    """
    pass


class AuthorizationError(JewelMusicError):
    """
    Raised when the user lacks permission for the requested resource (HTTP 403).
    
    This typically indicates:
    - Insufficient API key permissions
    - Account limitations
    - Resource access restrictions
    """
    pass


class NotFoundError(JewelMusicError):
    """
    Raised when the requested resource is not found (HTTP 404).
    
    This typically indicates:
    - Invalid resource ID
    - Deleted resource
    - Incorrect endpoint URL
    """
    pass


class ValidationError(JewelMusicError):
    """
    Raised when request validation fails (HTTP 400).
    
    This typically indicates:
    - Invalid input parameters
    - Missing required fields
    - Data format errors
    - File validation failures
    
    Attributes:
        validation_errors: Detailed validation error information
    """
    
    def __init__(
        self,
        message: str,
        validation_errors: Optional[Dict[str, Any]] = None,
        **kwargs
    ):
        super().__init__(message, **kwargs)
        self.validation_errors = validation_errors or {}


class RateLimitError(JewelMusicError):
    """
    Raised when API rate limits are exceeded (HTTP 429).
    
    This indicates too many requests have been made in a given time period.
    
    Attributes:
        retry_after: Seconds to wait before retrying
        limit: Rate limit threshold
        remaining: Remaining requests in current window
        reset_time: When the rate limit window resets
    """
    
    def __init__(
        self,
        message: str,
        retry_after: Optional[int] = None,
        limit: Optional[int] = None,
        remaining: Optional[int] = None,
        reset_time: Optional[int] = None,
        **kwargs
    ):
        super().__init__(message, **kwargs)
        self.retry_after = retry_after
        self.limit = limit
        self.remaining = remaining
        self.reset_time = reset_time


class ServerError(JewelMusicError):
    """
    Raised when the server encounters an internal error (HTTP 5xx).
    
    This typically indicates:
    - Server-side processing errors
    - Database connectivity issues
    - Third-party service failures
    """
    pass


class NetworkError(JewelMusicError):
    """
    Raised when network connectivity issues occur.
    
    This typically indicates:
    - Connection timeouts
    - DNS resolution failures
    - Network connectivity issues
    - SSL/TLS errors
    """
    pass


class UnknownError(JewelMusicError):
    """
    Raised for unexpected errors that don't fit other categories.
    
    This is a catch-all for errors that don't have a specific exception type.
    """
    pass


class FileValidationError(ValidationError):
    """
    Raised when file validation fails.
    
    This typically indicates:
    - Unsupported file format
    - File size limits exceeded
    - Corrupted file data
    - Missing file metadata
    """
    pass


class ProcessingError(JewelMusicError):
    """
    Raised when audio or content processing fails.
    
    This typically indicates:
    - Audio processing failures
    - AI model errors
    - Content generation failures
    - Analysis processing errors
    """
    pass


class UploadError(JewelMusicError):
    """
    Raised when file upload operations fail.
    
    This typically indicates:
    - Upload timeout
    - Connection interruption
    - Server storage issues
    - File corruption during upload
    """
    pass


class ConfigurationError(JewelMusicError):
    """
    Raised when SDK configuration is invalid.
    
    This typically indicates:
    - Missing required configuration
    - Invalid configuration values
    - Environment setup issues
    """
    pass


def create_error_from_response(response_data: Dict[str, Any], status_code: int) -> JewelMusicError:
    """
    Create an appropriate exception from API response data.
    
    Args:
        response_data: API error response data
        status_code: HTTP status code
        
    Returns:
        Appropriate exception instance
    """
    message = response_data.get('error', {}).get('message', 'Unknown error')
    request_id = response_data.get('meta', {}).get('requestId')
    details = response_data.get('error', {}).get('details', {})
    
    error_kwargs = {
        'message': message,
        'status_code': status_code,
        'request_id': request_id,
        'details': details
    }
    
    if status_code == 400:
        return ValidationError(
            validation_errors=details.get('validation'),
            **error_kwargs
        )
    elif status_code == 401:
        return AuthenticationError(**error_kwargs)
    elif status_code == 403:
        return AuthorizationError(**error_kwargs)
    elif status_code == 404:
        return NotFoundError(**error_kwargs)
    elif status_code == 429:
        rate_limit_data = response_data.get('meta', {}).get('rateLimit', {})
        return RateLimitError(
            retry_after=rate_limit_data.get('reset'),
            limit=rate_limit_data.get('limit'),
            remaining=rate_limit_data.get('remaining'),
            reset_time=rate_limit_data.get('reset'),
            **error_kwargs
        )
    elif 500 <= status_code < 600:
        return ServerError(**error_kwargs)
    else:
        return UnknownError(**error_kwargs)