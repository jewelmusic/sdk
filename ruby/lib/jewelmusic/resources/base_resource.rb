# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # Base class for all resource classes
    #
    # Provides common functionality for API resources including
    # data extraction, parameter building, and validation.
    #
    class BaseResource
      attr_reader :http_client

      ##
      # Initialize base resource
      #
      # @param http_client [JewelMusic::Http::Client] HTTP client instance
      #
      def initialize(http_client)
        @http_client = http_client
      end

      private

      ##
      # Extract data from API response
      #
      # @param response [Hash] API response
      # @return [Hash] Extracted data
      #
      def extract_data(response)
        response['data'] || response
      end

      ##
      # Build query parameters from base params and filters
      #
      # @param base_params [Hash] Base parameters
      # @param filters [Hash, nil] Optional filters
      # @return [Hash] Combined parameters
      #
      def build_params(base_params = {}, filters = nil)
        params = base_params.dup
        
        return params unless filters

        filters.each do |key, value|
          next if value.nil? || value == ''

          params[key] = case value
                       when Array
                         value.join(',')
                       when TrueClass, FalseClass
                         value.to_s
                       else
                         value.to_s
                       end
        end

        params
      end

      ##
      # Validate required parameters
      #
      # @param data [Hash] Data to validate
      # @param required_fields [Array<String, Symbol>] Required field names
      # @raise [ArgumentError] If required fields are missing
      #
      def validate_required(data, required_fields)
        required_fields.each do |field|
          field_key = field.to_s
          field_sym = field.to_sym

          value = data[field_key] || data[field_sym]
          
          if value.nil? || value == ''
            raise ArgumentError, "Required field '#{field}' is missing or empty"
          end
        end
      end

      ##
      # Filter out nil and empty values from hash
      #
      # @param data [Hash] Data to filter
      # @return [Hash] Filtered data
      #
      def filter_nil_values(data)
        data.reject { |_key, value| value.nil? || value == '' }
      end

      ##
      # Convert hash keys to strings recursively
      #
      # @param hash [Hash] Hash to convert
      # @return [Hash] Hash with string keys
      #
      def stringify_keys(hash)
        return hash unless hash.is_a?(Hash)

        hash.transform_keys(&:to_s).transform_values do |value|
          value.is_a?(Hash) ? stringify_keys(value) : value
        end
      end

      ##
      # Convert file parameter to appropriate format for upload
      #
      # @param file [String, File, IO] File to convert
      # @return [String, IO] Converted file
      #
      def prepare_file(file)
        case file
        when String
          File.exist?(file) ? file : raise(ArgumentError, "File not found: #{file}")
        when File, IO, StringIO
          file
        else
          raise ArgumentError, "Invalid file type: #{file.class}"
        end
      end

      ##
      # Prepare metadata for file upload
      #
      # @param metadata [Hash] Metadata hash
      # @return [Hash] Prepared metadata with string values
      #
      def prepare_upload_metadata(metadata)
        return {} if metadata.nil? || metadata.empty?

        metadata.transform_values do |value|
          case value
          when Array
            value.join(',')
          when TrueClass, FalseClass
            value.to_s
          when Hash
            JSON.generate(value)
          else
            value.to_s
          end
        end
      end
    end
  end
end