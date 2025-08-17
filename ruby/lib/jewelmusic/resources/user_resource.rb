# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # User resource for profile management, preferences, and account settings
    #
    class UserResource < BaseResource
      ##
      # Get user profile information
      #
      # @return [Hash] User profile data
      #
      def get_profile
        response = http_client.get('/user/profile')
        extract_data(response)
      end

      ##
      # Update user profile information
      #
      # @param updates [Hash] Profile updates
      # @option updates [String] :name User display name
      # @option updates [String] :bio User biography
      # @option updates [String] :website User website URL
      # @option updates [String] :location User location
      # @option updates [Hash] :social_links Social media links
      # @option updates [Hash] :artist_info Artist-specific information
      # @return [Hash] Updated profile data
      #
      def update_profile(updates)
        response = http_client.put('/user/profile', filter_nil_values(updates))
        extract_data(response)
      end

      ##
      # Upload user avatar image
      #
      # @param avatar_file [String, File, IO] Avatar image file
      # @param filename [String] Avatar filename
      # @return [Hash] Avatar upload result
      #
      def upload_avatar(avatar_file, filename)
        validate_required({
          avatar_file: avatar_file,
          filename: filename
        }, [:avatar_file, :filename])
        
        prepared_file = prepare_file(avatar_file)
        response = http_client.upload_file('/user/avatar', prepared_file, filename)
        extract_data(response)
      end

      ##
      # Get user preferences and settings
      #
      # @return [Hash] User preferences
      #
      def get_preferences
        response = http_client.get('/user/preferences')
        extract_data(response)
      end

      ##
      # Update user preferences and settings
      #
      # @param preferences [Hash] User preferences
      # @option preferences [Hash] :notifications Notification preferences
      # @option preferences [Hash] :ui UI preferences
      # @option preferences [Hash] :privacy Privacy settings
      # @option preferences [Hash] :api API preferences
      # @return [Hash] Updated preferences
      #
      def update_preferences(preferences)
        response = http_client.put('/user/preferences', filter_nil_values(preferences))
        extract_data(response)
      end

      ##
      # Get list of user's API keys
      #
      # @return [Hash] List of API keys
      #
      def get_api_keys
        response = http_client.get('/user/api-keys')
        extract_data(response)
      end

      ##
      # Create a new API key
      #
      # @param name [String] API key name
      # @param permissions [Hash] API key permissions
      # @option permissions [Array<String>] :scopes Permission scopes
      # @option permissions [Integer] :rate_limit Rate limit for this key
      # @option permissions [Array<String>] :ip_restrictions IP address restrictions
      # @option permissions [String] :expires_at Expiration date
      # @option permissions [String] :description Key description
      # @return [Hash] Created API key data
      #
      def create_api_key(name, permissions = {})
        validate_required({ name: name }, [:name])
        
        data = { name: name }.merge(filter_nil_values(permissions))
        response = http_client.post('/user/api-keys', data)
        extract_data(response)
      end

      ##
      # Update an existing API key
      #
      # @param key_id [String] API key ID
      # @param updates [Hash] API key updates
      # @return [Hash] Updated API key data
      #
      def update_api_key(key_id, updates)
        validate_required({ key_id: key_id }, [:key_id])
        
        response = http_client.put("/user/api-keys/#{key_id}", filter_nil_values(updates))
        extract_data(response)
      end

      ##
      # Revoke (delete) an API key
      #
      # @param key_id [String] API key ID
      # @return [Hash] Revocation confirmation
      #
      def revoke_api_key(key_id)
        validate_required({ key_id: key_id }, [:key_id])
        
        response = http_client.delete("/user/api-keys/#{key_id}")
        extract_data(response)
      end

      ##
      # Get detailed API usage statistics
      #
      # @param options [Hash] Usage statistics options
      # @option options [String] :period Statistics period
      # @option options [String] :start_date Start date for statistics
      # @option options [String] :end_date End date for statistics
      # @option options [String] :group_by Data grouping method
      # @option options [Boolean] :include_breakdown Include detailed breakdown
      # @option options [String] :api_key_id Specific API key to analyze
      # @return [Hash] Usage statistics
      #
      def get_usage_stats(options = {})
        params = build_params({}, options)
        response = http_client.get('/user/usage', params)
        extract_data(response)
      end

      ##
      # Get billing information and invoices
      #
      # @param options [Hash] Billing query options
      # @option options [Boolean] :include_invoices Include invoice history
      # @option options [Integer] :invoice_limit Number of invoices to return
      # @option options [String] :invoice_status Filter by invoice status
      # @return [Hash] Billing information
      #
      def get_billing(options = {})
        params = build_params({}, options)
        response = http_client.get('/user/billing', params)
        extract_data(response)
      end

      ##
      # Update billing information
      #
      # @param billing_data [Hash] Updated billing information
      # @option billing_data [Hash] :payment_method Payment method details
      # @option billing_data [Hash] :billing_address Billing address
      # @option billing_data [String] :tax_id Tax identification number
      # @option billing_data [String] :company Company information
      # @return [Hash] Updated billing information
      #
      def update_billing(billing_data)
        response = http_client.put('/user/billing', filter_nil_values(billing_data))
        extract_data(response)
      end

      ##
      # Download invoice by ID
      #
      # @param invoice_id [String] Invoice ID
      # @param format [String] Download format (pdf, json)
      # @return [Hash] Invoice download data
      #
      def download_invoice(invoice_id, format = 'pdf')
        validate_required({ invoice_id: invoice_id }, [:invoice_id])
        
        params = { format: format }
        response = http_client.get("/user/billing/invoices/#{invoice_id}", params)
        extract_data(response)
      end

      ##
      # Get account limits and quotas
      #
      # @return [Hash] Account limits information
      #
      def get_limits
        response = http_client.get('/user/limits')
        extract_data(response)
      end

      ##
      # Get user activity log
      #
      # @param filters [Hash] Activity filters
      # @option filters [String] :start_date Start date for activity log
      # @option filters [String] :end_date End date for activity log
      # @option filters [String] :action_type Type of actions to include
      # @option filters [Integer] :limit Number of entries to return
      # @return [Hash] Activity log entries
      #
      def get_activity_log(filters = {})
        params = build_params({}, filters)
        response = http_client.get('/user/activity', params)
        extract_data(response)
      end

      ##
      # Get user notifications
      #
      # @param filters [Hash] Notification filters
      # @option filters [Boolean] :unread_only Show only unread notifications
      # @option filters [String] :type Notification type filter
      # @option filters [Integer] :limit Number of notifications to return
      # @return [Hash] User notifications
      #
      def get_notifications(filters = {})
        params = build_params({}, filters)
        response = http_client.get('/user/notifications', params)
        extract_data(response)
      end

      ##
      # Mark notifications as read
      #
      # @param notification_ids [Array<String>] Notification IDs to mark as read
      # @return [Hash] Update confirmation
      #
      def mark_notifications_read(notification_ids)
        validate_required({ notification_ids: notification_ids }, [:notification_ids])
        data = { notification_ids: notification_ids }
        response = http_client.post('/user/notifications/mark-read', data)
        extract_data(response)
      end

      ##
      # Update notification preferences
      #
      # @param preferences [Hash] Notification preferences
      # @option preferences [Hash] :email Email notification settings
      # @option preferences [Hash] :push Push notification settings
      # @option preferences [Hash] :sms SMS notification settings
      # @return [Hash] Updated notification preferences
      #
      def update_notification_preferences(preferences)
        response = http_client.put('/user/notifications/preferences', filter_nil_values(preferences))
        extract_data(response)
      end

      ##
      # Delete user account
      #
      # @param confirm_email [String] Email confirmation for account deletion
      # @param reason [String] Reason for account deletion
      # @param delete_data [Boolean] Whether to delete all user data
      # @return [Hash] Deletion confirmation
      #
      def delete_account(confirm_email, reason = '', delete_data = true)
        validate_required({ confirm_email: confirm_email }, [:confirm_email])
        
        data = {
          confirm_email: confirm_email,
          reason: reason,
          delete_data: delete_data
        }
        
        response = http_client.delete('/user/account', data)
        extract_data(response)
      end

      ##
      # Export user data
      #
      # @param options [Hash] Export options
      # @option options [String] :format Export format (json, csv)
      # @option options [Boolean] :include_metadata Include metadata in export
      # @option options [Boolean] :include_tracks Include track data
      # @option options [Boolean] :include_analytics Include analytics data
      # @option options [String] :email Email address for delivery
      # @return [Hash] Export job data
      #
      def export_data(options = {})
        response = http_client.post('/user/export', filter_nil_values(options))
        extract_data(response)
      end

      ##
      # Get user's subscription information
      #
      # @return [Hash] Subscription details
      #
      def get_subscription
        response = http_client.get('/user/subscription')
        extract_data(response)
      end

      ##
      # Upgrade or change user subscription
      #
      # @param subscription_data [Hash] Subscription details
      # @option subscription_data [String] :plan Subscription plan
      # @option subscription_data [String] :billing Billing frequency
      # @return [Hash] Updated subscription information
      #
      def update_subscription(subscription_data)
        response = http_client.put('/user/subscription', filter_nil_values(subscription_data))
        extract_data(response)
      end

      ##
      # Cancel user subscription
      #
      # @param cancellation_data [Hash] Cancellation details
      # @option cancellation_data [String] :reason Cancellation reason
      # @option cancellation_data [String] :feedback User feedback
      # @option cancellation_data [String] :effective Effective cancellation date
      # @return [Hash] Cancellation confirmation
      #
      def cancel_subscription(cancellation_data = {})
        response = http_client.post('/user/subscription/cancel', filter_nil_values(cancellation_data))
        extract_data(response)
      end
    end
  end
end