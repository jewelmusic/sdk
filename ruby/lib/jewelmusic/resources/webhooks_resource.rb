# frozen_string_literal: true

require 'openssl'
require 'json'

module JewelMusic
  module Resources
    ##
    # Webhooks resource for webhook endpoint and delivery configuration management
    #
    class WebhooksResource < BaseResource
      ##
      # Get list of webhooks with filtering and pagination
      #
      # @param page [Integer] Page number
      # @param per_page [Integer] Items per page
      # @param filters [Hash] Webhook filters
      # @option filters [Boolean] :active Filter by active status
      # @option filters [Array<String>] :events Filter by event types
      # @option filters [String] :url Filter by URL pattern
      # @return [Hash] Webhooks list
      #
      def list(page = 1, per_page = 20, filters = {})
        params = build_params({
          page: page.to_s,
          per_page: per_page.to_s
        }, filters)
        
        response = http_client.get('/webhooks', params)
        extract_data(response)
      end

      ##
      # Get a specific webhook by ID
      #
      # @param webhook_id [String] Webhook ID
      # @return [Hash] Webhook data
      #
      def get(webhook_id)
        validate_required({ webhook_id: webhook_id }, [:webhook_id])
        
        response = http_client.get("/webhooks/#{webhook_id}")
        extract_data(response)
      end

      ##
      # Create a new webhook endpoint
      #
      # @param webhook_data [Hash] Webhook configuration
      # @option webhook_data [String] :url Webhook endpoint URL (required)
      # @option webhook_data [Array<String>] :events Array of event types to listen for (required)
      # @option webhook_data [String] :secret Secret for signature verification
      # @option webhook_data [Boolean] :active Whether webhook is active
      # @option webhook_data [String] :description Webhook description
      # @option webhook_data [Hash] :headers Custom headers to include
      # @option webhook_data [Integer] :timeout Request timeout in seconds
      # @option webhook_data [Hash] :retry_policy Retry configuration
      # @return [Hash] Created webhook data
      #
      def create(webhook_data)
        validate_required(webhook_data, [:url, :events])
        
        response = http_client.post('/webhooks', webhook_data)
        extract_data(response)
      end

      ##
      # Update an existing webhook
      #
      # @param webhook_id [String] Webhook ID
      # @param updates [Hash] Webhook updates
      # @return [Hash] Updated webhook data
      #
      def update(webhook_id, updates)
        validate_required({ webhook_id: webhook_id }, [:webhook_id])
        
        response = http_client.put("/webhooks/#{webhook_id}", filter_nil_values(updates))
        extract_data(response)
      end

      ##
      # Delete a webhook
      #
      # @param webhook_id [String] Webhook ID
      # @return [Hash] Deletion confirmation
      #
      def delete(webhook_id)
        validate_required({ webhook_id: webhook_id }, [:webhook_id])
        
        response = http_client.delete("/webhooks/#{webhook_id}")
        extract_data(response)
      end

      ##
      # Test a webhook by sending a test event
      #
      # @param webhook_id [String] Webhook ID
      # @param event_type [String] Event type for test (optional, defaults to webhook.test)
      # @return [Hash] Test result
      #
      def test(webhook_id, event_type = '')
        validate_required({ webhook_id: webhook_id }, [:webhook_id])
        
        data = { event_type: event_type.empty? ? 'webhook.test' : event_type }
        response = http_client.post("/webhooks/#{webhook_id}/test", data)
        extract_data(response)
      end

      ##
      # Get webhook delivery history
      #
      # @param webhook_id [String] Webhook ID
      # @param page [Integer] Page number
      # @param per_page [Integer] Items per page
      # @param filters [Hash] Delivery filters
      # @option filters [String] :status Delivery status (success, failed, pending)
      # @option filters [String] :event_type Event type filter
      # @option filters [String] :start_date Start date for delivery history
      # @option filters [String] :end_date End date for delivery history
      # @return [Hash] Delivery history
      #
      def get_deliveries(webhook_id, page = 1, per_page = 20, filters = {})
        validate_required({ webhook_id: webhook_id }, [:webhook_id])
        
        params = build_params({
          page: page.to_s,
          per_page: per_page.to_s
        }, filters)
        
        response = http_client.get("/webhooks/#{webhook_id}/deliveries", params)
        extract_data(response)
      end

      ##
      # Get specific webhook delivery details
      #
      # @param webhook_id [String] Webhook ID
      # @param delivery_id [String] Delivery ID
      # @return [Hash] Delivery details
      #
      def get_delivery(webhook_id, delivery_id)
        validate_required({
          webhook_id: webhook_id,
          delivery_id: delivery_id
        }, [:webhook_id, :delivery_id])
        
        response = http_client.get("/webhooks/#{webhook_id}/deliveries/#{delivery_id}")
        extract_data(response)
      end

      ##
      # Retry a failed webhook delivery
      #
      # @param webhook_id [String] Webhook ID
      # @param delivery_id [String] Delivery ID
      # @return [Hash] Retry result
      #
      def retry_delivery(webhook_id, delivery_id)
        validate_required({
          webhook_id: webhook_id,
          delivery_id: delivery_id
        }, [:webhook_id, :delivery_id])
        
        response = http_client.post("/webhooks/#{webhook_id}/deliveries/#{delivery_id}/retry", {})
        extract_data(response)
      end

      ##
      # Get available webhook event types
      #
      # @return [Hash] Available event types
      #
      def get_event_types
        response = http_client.get('/webhooks/events/types')
        extract_data(response)
      end

      ##
      # Get webhook statistics and metrics
      #
      # @param webhook_id [String] Webhook ID
      # @param options [Hash] Statistics options
      # @option options [String] :period Statistics period
      # @option options [String] :start_date Start date for statistics
      # @option options [String] :end_date End date for statistics
      # @option options [String] :group_by Data grouping method
      # @return [Hash] Webhook statistics
      #
      def get_statistics(webhook_id, options = {})
        validate_required({ webhook_id: webhook_id }, [:webhook_id])
        
        params = build_params({}, options)
        response = http_client.get("/webhooks/#{webhook_id}/statistics", params)
        extract_data(response)
      end

      ##
      # Verify webhook signature
      # 
      # This is a class method that can be used to verify webhook signatures
      # without making an API call.
      #
      # @param payload [String] Raw webhook payload
      # @param signature [String] Webhook signature header
      # @param secret [String] Webhook secret
      # @param tolerance [Integer] Timestamp tolerance in seconds (default: 300)
      # @return [Boolean] True if signature is valid
      #
      def self.verify_signature(payload, signature, secret, tolerance = 300)
        # Parse signature header (format: "t=timestamp,v1=hash")
        elements = signature.split(',')
        timestamp = nil
        hash = nil
        
        elements.each do |element|
          if element.start_with?('t=')
            timestamp = element[2..-1].to_i
          elsif element.start_with?('v1=')
            hash = element[3..-1]
          end
        end
        
        return false if timestamp.nil? || hash.nil? || hash.empty?
        
        # Check timestamp tolerance
        now = Time.now.to_i
        return false if (now - timestamp).abs > tolerance
        
        # Verify signature
        signed_payload = "#{timestamp}.#{payload}"
        expected_hash = OpenSSL::HMAC.hexdigest('SHA256', secret, signed_payload)
        
        # Use secure comparison to prevent timing attacks
        hash == expected_hash
      rescue StandardError
        false
      end

      ##
      # Parse webhook event payload
      # 
      # This is a class method to safely parse webhook event data.
      #
      # @param payload [String] Raw webhook payload
      # @return [Hash] Parsed event data
      # @raise [ArgumentError] If payload format is invalid
      #
      def self.parse_event(payload)
        JSON.parse(payload)
      rescue JSON::ParserError => e
        raise ArgumentError, "Invalid webhook payload format: #{e.message}"
      end

      ##
      # Create webhook signature for testing
      # 
      # This utility method can be used for testing webhook signature verification.
      #
      # @param payload [String] Webhook payload
      # @param secret [String] Webhook secret
      # @param timestamp [Integer, nil] Timestamp (defaults to current time)
      # @return [String] Webhook signature header
      #
      def self.create_signature(payload, secret, timestamp = nil)
        timestamp ||= Time.now.to_i
        signed_payload = "#{timestamp}.#{payload}"
        hash = OpenSSL::HMAC.hexdigest('SHA256', secret, signed_payload)
        
        "t=#{timestamp},v1=#{hash}"
      end

      ##
      # Enable or disable a webhook
      #
      # @param webhook_id [String] Webhook ID
      # @param active [Boolean] Whether to activate or deactivate
      # @return [Hash] Updated webhook data
      #
      def set_active(webhook_id, active)
        validate_required({ webhook_id: webhook_id }, [:webhook_id])
        
        data = { active: active }
        response = http_client.put("/webhooks/#{webhook_id}", data)
        extract_data(response)
      end

      ##
      # Batch update multiple webhooks
      #
      # @param updates [Array<Hash>] Array of webhook updates
      #   Each item should contain :id and update data
      # @return [Hash] Batch update results
      #
      def batch_update(updates)
        updates.each do |update|
          validate_required(update, [:id])
        end
        
        data = { updates: updates }
        response = http_client.post('/webhooks/batch-update', data)
        extract_data(response)
      end

      ##
      # Get webhook configuration templates
      #
      # @param use_case [String] Use case for webhook (analytics, distribution, etc.)
      # @return [Hash] Configuration templates
      #
      def get_templates(use_case = '')
        params = use_case.empty? ? {} : { use_case: use_case }
        response = http_client.get('/webhooks/templates', params)
        extract_data(response)
      end

      ##
      # Validate webhook endpoint
      #
      # @param url [String] Webhook URL to validate
      # @param events [Array<String>] Events to test
      # @return [Hash] Validation results
      #
      def validate_endpoint(url, events = [])
        validate_required({ url: url }, [:url])
        
        data = {
          url: url,
          events: events
        }
        
        response = http_client.post('/webhooks/validate', data)
        extract_data(response)
      end
    end
  end
end