# frozen_string_literal: true

require 'faraday'
require 'faraday/multipart'
require 'faraday/retry'
require 'json'
require 'mime/types'

module JewelMusic
  module Http
    ##
    # HTTP client for making requests to the JewelMusic API
    #
    class Client
      DEFAULT_BASE_URL = 'https://api.jewelmusic.art'
      DEFAULT_TIMEOUT = 30
      DEFAULT_USER_AGENT = "JewelMusic-Ruby-SDK/#{JewelMusic::VERSION}"
      DEFAULT_RETRIES = 3
      DEFAULT_RETRY_DELAY = 1.0

      attr_reader :api_key, :base_url, :timeout, :user_agent, :connection

      ##
      # Initialize HTTP client
      #
      # @param api_key [String] API key for authentication
      # @param options [Hash] Configuration options
      #
      def initialize(api_key, options = {})
        @api_key = api_key
        @base_url = options[:base_url] || DEFAULT_BASE_URL
        @timeout = options[:timeout] || DEFAULT_TIMEOUT
        @user_agent = options[:user_agent] || DEFAULT_USER_AGENT
        @retries = options[:retries] || DEFAULT_RETRIES
        @retry_delay = options[:retry_delay] || DEFAULT_RETRY_DELAY

        setup_connection
      end

      ##
      # Make a GET request
      #
      # @param path [String] API endpoint path
      # @param params [Hash] Query parameters
      # @return [Hash] Response data
      #
      def get(path, params = {})
        handle_response do
          connection.get("#{base_path}#{path}") do |req|
            req.params = params if params.any?
          end
        end
      end

      ##
      # Make a POST request
      #
      # @param path [String] API endpoint path
      # @param data [Hash] Request body data
      # @return [Hash] Response data
      #
      def post(path, data = {})
        handle_response do
          connection.post("#{base_path}#{path}") do |req|
            req.body = data.to_json if data.any?
          end
        end
      end

      ##
      # Make a PUT request
      #
      # @param path [String] API endpoint path
      # @param data [Hash] Request body data
      # @return [Hash] Response data
      #
      def put(path, data = {})
        handle_response do
          connection.put("#{base_path}#{path}") do |req|
            req.body = data.to_json if data.any?
          end
        end
      end

      ##
      # Make a DELETE request
      #
      # @param path [String] API endpoint path
      # @param data [Hash] Request body data (optional)
      # @return [Hash] Response data
      #
      def delete(path, data = {})
        handle_response do
          connection.delete("#{base_path}#{path}") do |req|
            req.body = data.to_json if data.any?
          end
        end
      end

      ##
      # Upload a file with multipart form data
      #
      # @param path [String] API endpoint path
      # @param file [String, IO] File path or IO object
      # @param filename [String] Original filename
      # @param metadata [Hash] Additional metadata fields
      # @return [Hash] Response data
      #
      def upload_file(path, file, filename, metadata = {})
        file_io = file.is_a?(String) ? File.open(file, 'rb') : file
        mime_type = MIME::Types.type_for(filename).first&.content_type || 'application/octet-stream'

        payload = {
          file: Faraday::Multipart::FilePart.new(file_io, mime_type, filename)
        }

        # Add metadata fields
        metadata.each do |key, value|
          payload[key] = value.is_a?(Array) ? value.join(',') : value.to_s
        end

        handle_response do
          connection.post("#{base_path}#{path}") do |req|
            req.headers['Content-Type'] = 'multipart/form-data'
            req.body = payload
          end
        end
      ensure
        file_io.close if file.is_a?(String) && file_io
      end

      ##
      # Upload file with chunked upload support
      #
      # @param path [String] API endpoint path
      # @param file [String, IO] File path or IO object
      # @param filename [String] Original filename
      # @param metadata [Hash] Additional metadata fields
      # @param chunk_size [Integer] Chunk size in bytes
      # @return [Hash] Response data
      #
      def upload_file_chunked(path, file, filename, metadata = {}, chunk_size = 8_388_608)
        file_io = file.is_a?(String) ? File.open(file, 'rb') : file
        file_size = file_io.stat.size

        if file_size <= chunk_size
          # File is small enough for single upload
          return upload_file(path, file, filename, metadata)
        end

        # Initialize chunked upload
        init_response = post("#{path}/init", metadata.merge(
          filename: filename,
          filesize: file_size,
          chunk_size: chunk_size
        ))

        upload_id = init_response['uploadId']
        total_chunks = (file_size.to_f / chunk_size).ceil

        # Upload chunks
        (0...total_chunks).each do |chunk_index|
          chunk_data = file_io.read(chunk_size)
          
          chunk_payload = {
            chunk: Faraday::Multipart::FilePart.new(
              StringIO.new(chunk_data),
              'application/octet-stream',
              "#{filename}.chunk.#{chunk_index}"
            ),
            uploadId: upload_id,
            chunkIndex: chunk_index.to_s
          }

          handle_response do
            connection.post("#{base_path}#{path}/chunk") do |req|
              req.headers['Content-Type'] = 'multipart/form-data'
              req.body = chunk_payload
            end
          end
        end

        # Complete the upload
        post("#{path}/complete", { uploadId: upload_id })
      ensure
        file_io.close if file.is_a?(String) && file_io
      end

      private

      def setup_connection
        @connection = Faraday.new(url: base_url) do |conn|
          conn.request :json
          conn.request :multipart
          conn.request :retry, 
                      max: @retries,
                      interval: @retry_delay,
                      exceptions: [Faraday::ConnectionFailed, Faraday::TimeoutError]

          conn.response :json, content_type: /\bjson$/
          conn.adapter Faraday.default_adapter

          conn.headers = {
            'Authorization' => "Bearer #{api_key}",
            'User-Agent' => user_agent,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
          }

          conn.options.timeout = timeout
        end
      end

      def base_path
        '/v1'
      end

      def handle_response
        response = yield
        
        if response.success?
          return response.body || {}
        else
          raise create_exception_from_response(response)
        end
      rescue Faraday::ConnectionFailed => e
        raise ConnectionError.new('Connection failed', e)
      rescue Faraday::TimeoutError => e
        raise TimeoutError.new('Request timeout', timeout)
      rescue Faraday::Error => e
        raise ApiError.new("HTTP error: #{e.message}", 0, { original_error: e })
      end

      def create_exception_from_response(response)
        status = response.status
        body = response.body || {}
        message = body['message'] || 'API request failed'

        case status
        when 401
          AuthenticationError.new(message, status, body)
        when 404
          NotFoundError.new(message, status, body)
        when 422
          ValidationError.new(message, status, body['errors'] || {})
        when 429
          retry_after = body['retryAfter'] || response.headers['retry-after']&.to_i
          RateLimitError.new(message, status, retry_after)
        else
          ApiError.new(message, status, body)
        end
      end
    end
  end
end