# frozen_string_literal: true

module JewelMusic
  ##
  # Base exception for all JewelMusic API errors
  #
  class ApiError < StandardError
    attr_reader :status_code, :details

    ##
    # Initialize a new API error
    #
    # @param message [String] Error message
    # @param status_code [Integer] HTTP status code
    # @param details [Hash] Additional error details
    #
    def initialize(message = '', status_code = 0, details = {})
      super(message)
      @status_code = status_code
      @details = details
    end

    ##
    # Check if this is a client error (4xx)
    #
    # @return [Boolean]
    #
    def client_error?
      status_code >= 400 && status_code < 500
    end

    ##
    # Check if this is a server error (5xx)
    #
    # @return [Boolean]
    #
    def server_error?
      status_code >= 500
    end

    ##
    # Get error details as JSON string
    #
    # @return [String]
    #
    def details_json
      JSON.pretty_generate(details)
    end
  end

  ##
  # Exception raised when authentication fails
  #
  class AuthenticationError < ApiError
    def initialize(message = 'Authentication failed', status_code = 401, details = {})
      super(message, status_code, details)
    end
  end

  ##
  # Exception raised when a resource is not found
  #
  class NotFoundError < ApiError
    def initialize(message = 'Resource not found', status_code = 404, details = {})
      super(message, status_code, details)
    end
  end

  ##
  # Exception raised when request validation fails
  #
  class ValidationError < ApiError
    attr_reader :validation_errors

    def initialize(message = 'Validation failed', status_code = 422, validation_errors = {})
      super(message, status_code, validation_errors)
      @validation_errors = validation_errors
    end

    ##
    # Check if a specific field has validation errors
    #
    # @param field [String, Symbol] Field name
    # @return [Boolean]
    #
    def field_error?(field)
      validation_errors.key?(field.to_s) || validation_errors.key?(field.to_sym)
    end

    ##
    # Get validation errors for a specific field
    #
    # @param field [String, Symbol] Field name
    # @return [Array]
    #
    def field_errors(field)
      validation_errors[field.to_s] || validation_errors[field.to_sym] || []
    end
  end

  ##
  # Exception raised when rate limit is exceeded
  #
  class RateLimitError < ApiError
    attr_reader :retry_after

    def initialize(message = 'Rate limit exceeded', status_code = 429, retry_after = nil)
      super(message, status_code, {})
      @retry_after = retry_after
    end

    ##
    # Check if retry after time is specified
    #
    # @return [Boolean]
    #
    def retry_after?
      !retry_after.nil?
    end
  end

  ##
  # Exception raised for network and connection errors
  #
  class ConnectionError < ApiError
    def initialize(message = 'Connection error', original_error = nil)
      super(message, 0, { original_error: original_error })
    end
  end

  ##
  # Exception raised for request timeout errors
  #
  class TimeoutError < ApiError
    def initialize(message = 'Request timeout', timeout = nil)
      super(message, 0, { timeout: timeout })
    end
  end
end