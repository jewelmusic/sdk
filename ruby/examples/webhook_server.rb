#!/usr/bin/env ruby
# frozen_string_literal: true

# Complete Webhook Server Example for JewelMusic Ruby SDK
#
# This example demonstrates a comprehensive webhook server implementation:
# - Signature verification and security
# - Event handling and processing
# - Error handling and logging
# - Webhook management functions
# - Real-time notifications using Sinatra

require 'sinatra'
require 'json'
require 'logger'
require 'openssl'
require_relative '../lib/jewelmusic'

# Webhook Server Class
class JewelMusicWebhookServer < Sinatra::Base
  
  configure do
    set :port, ENV['PORT'] || 4567
    set :bind, '0.0.0.0'
    set :logging, true
    
    # Initialize logger
    set :logger, Logger.new($stdout)
    settings.logger.level = Logger::INFO
  end
  
  def initialize(app = nil)
    super(app)
    @webhook_secret = ENV['JEWELMUSIC_WEBHOOK_SECRET']
    @api_key = ENV['JEWELMUSIC_API_KEY']
    
    if @api_key
      @jewelmusic = JewelMusic::Client.new(api_key: @api_key)
    end
  end
  
  # Main webhook endpoint
  post '/webhook' do
    begin
      # Get webhook payload and headers
      payload = request.body.read
      signature = request.env['HTTP_JEWELMUSIC_SIGNATURE']
      event_id = request.env['HTTP_JEWELMUSIC_EVENT_ID'] || SecureRandom.uuid
      timestamp = request.env['HTTP_JEWELMUSIC_TIMESTAMP']&.to_i || Time.now.to_i
      
      logger.info "Received webhook event: #{event_id}"
      
      # Verify webhook signature
      unless verify_signature?(payload, signature)
        logger.error "Invalid signature for event: #{event_id}"
        halt 401, { error: 'Invalid signature' }.to_json
      end
      
      # Check timestamp to prevent replay attacks
      unless verify_timestamp?(timestamp)
        logger.error "Timestamp verification failed for event: #{event_id}"
        halt 400, { error: 'Invalid timestamp' }.to_json
      end
      
      # Parse webhook event
      event_data = JSON.parse(payload)
      
      logger.info "Processing event: #{event_data['type']} (ID: #{event_id})"
      
      # Handle the event
      result = process_event(event_data, event_id)
      
      # Return success response
      content_type :json
      {
        status: 'success',
        event_id: event_id,
        result: result
      }.to_json
      
    rescue JSON::ParserError => e
      logger.error "Invalid JSON payload for event: #{event_id} - #{e.message}"
      halt 400, { error: 'Invalid JSON' }.to_json
      
    rescue StandardError => e
      logger.error "Webhook error: #{e.message}"
      logger.error e.backtrace.join("\n")
      
      halt 500, { error: 'Internal server error' }.to_json
    end
  end
  
  # Health check endpoint
  get '/health' do
    content_type :json
    {
      status: 'healthy',
      timestamp: Time.now.iso8601,
      version: JewelMusic::VERSION
    }.to_json
  end
  
  # Webhook test endpoint
  get '/test' do
    content_type :json
    {
      message: 'JewelMusic Webhook Server is running',
      endpoints: {
        webhook: '/webhook',
        health: '/health',
        test: '/test'
      }
    }.to_json
  end
  
  private
  
  def verify_signature?(payload, signature)
    return false if @webhook_secret.nil? || @webhook_secret.empty?
    return false if signature.nil? || signature.empty?
    
    expected_signature = "sha256=#{OpenSSL::HMAC.hexdigest('SHA256', @webhook_secret, payload)}"
    Rack::Utils.secure_compare(signature, expected_signature)
  end
  
  def verify_timestamp?(timestamp)
    # Allow 5 minutes tolerance
    tolerance = 300
    current_time = Time.now.to_i
    
    (current_time - timestamp).abs <= tolerance
  end
  
  def process_event(event, event_id)
    event_type = event['type'] || 'unknown'
    event_data = event['data'] || {}
    
    case event_type
    when 'track.uploaded'
      handle_track_uploaded(event_data, event_id)
    when 'track.processed'
      handle_track_processed(event_data, event_id)
    when 'analysis.started'
      handle_analysis_started(event_data, event_id)
    when 'analysis.completed'
      handle_analysis_completed(event_data, event_id)
    when 'analysis.failed'
      handle_analysis_failed(event_data, event_id)
    when 'transcription.started'
      handle_transcription_started(event_data, event_id)
    when 'transcription.completed'
      handle_transcription_completed(event_data, event_id)
    when 'copilot.generation.completed'
      handle_ai_generation_completed(event_data, event_id)
    when 'distribution.submitted'
      handle_distribution_submitted(event_data, event_id)
    when 'distribution.approved'
      handle_distribution_approved(event_data, event_id)
    when 'distribution.rejected'
      handle_distribution_rejected(event_data, event_id)
    when 'distribution.live'
      handle_distribution_live(event_data, event_id)
    when 'analytics.milestone'
      handle_analytics_milestone(event_data, event_id)
    when 'user.subscription.updated'
      handle_subscription_updated(event_data, event_id)
    when 'user.quota.exceeded'
      handle_quota_exceeded(event_data, event_id)
    when 'webhook.test'
      handle_webhook_test(event_data, event_id)
    else
      logger.warn "Unhandled event type: #{event_type}"
      { status: 'ignored', reason: 'unhandled_event_type' }
    end
  end
  
  def handle_track_uploaded(data, event_id)
    track = data['track'] || {}
    
    logger.info "Track uploaded: #{track['id']} - #{track['title']} by #{track['artist']}"
    
    # Auto-trigger analysis for uploaded tracks
    if @jewelmusic && track['id']
      begin
        analysis = @jewelmusic.analysis.analyze(track['id'], {
          analysis_types: %w[tempo key quality mood],
          priority: 'high'
        })
        
        logger.info "Auto-triggered analysis: #{analysis['id']} for track: #{track['id']}"
      rescue StandardError => e
        logger.error "Failed to auto-trigger analysis: #{e.message}"
      end
    end
    
    # Send notification
    send_notification(track['userId'], {
      type: 'track_uploaded',
      title: 'Track Uploaded Successfully',
      message: "Your track '#{track['title']}' has been uploaded and is being processed.",
      track_id: track['id']
    })
    
    { action: 'notification_sent', analysis_triggered: true }
  end
  
  def handle_track_processed(data, event_id)
    track = data['track'] || {}
    
    logger.info "Track processed: #{track['id']} - Status: #{track['status']}"
    
    if track['status'] == 'ready'
      send_notification(track['userId'], {
        type: 'track_ready',
        title: 'Track Ready',
        message: "Your track '#{track['title']}' is ready for analysis and distribution.",
        track_id: track['id']
      })
    end
    
    { action: 'notification_sent' }
  end
  
  def handle_analysis_completed(data, event_id)
    analysis = data['analysis'] || {}
    track = data['track'] || {}
    
    logger.info "Analysis completed: #{analysis['id']} for track: #{track['id']}"
    
    # Extract key insights
    insights = []
    if analysis['results']
      results = analysis['results']
      
      insights << "Tempo: #{results.dig('tempo', 'bpm')&.round(1)} BPM" if results.dig('tempo', 'bpm')
      insights << "Key: #{results.dig('key', 'key')} #{results.dig('key', 'mode')}" if results.dig('key', 'key')
      insights << "Quality: #{(results.dig('quality', 'overallScore') * 100).round(1)}/100" if results.dig('quality', 'overallScore')
      insights << "Mood: #{results.dig('mood', 'primary')}" if results.dig('mood', 'primary')
    end
    
    send_notification(track['userId'], {
      type: 'analysis_completed',
      title: 'Track Analysis Complete',
      message: "Analysis for '#{track['title']}' is complete. #{insights.join(', ')}",
      track_id: track['id'],
      analysis_id: analysis['id']
    })
    
    { action: 'notification_sent', insights_count: insights.length }
  end
  
  def handle_analysis_failed(data, event_id)
    analysis = data['analysis'] || {}
    track = data['track'] || {}
    error = data['error'] || {}
    
    logger.error "Analysis failed: #{analysis['id']} for track: #{track['id']} - Error: #{error['message']}"
    
    send_notification(track['userId'], {
      type: 'analysis_failed',
      title: 'Track Analysis Failed',
      message: "Analysis for '#{track['title']}' failed: #{error['message']}",
      track_id: track['id'],
      analysis_id: analysis['id']
    })
    
    { action: 'error_notification_sent' }
  end
  
  def handle_transcription_completed(data, event_id)
    transcription = data['transcription'] || {}
    track = data['track'] || {}
    
    logger.info "Transcription completed: #{transcription['id']} for track: #{track['id']}"
    
    words_count = transcription['text'] ? transcription['text'].split.length : 0
    language = transcription['language'] || 'unknown'
    confidence = transcription['confidence'] ? (transcription['confidence'] * 100).round(1) : 0
    
    send_notification(track['userId'], {
      type: 'transcription_completed',
      title: 'Transcription Complete',
      message: "Transcription for '#{track['title']}' is complete. #{words_count} words detected in #{language} (confidence: #{confidence}%)",
      track_id: track['id'],
      transcription_id: transcription['id']
    })
    
    { action: 'notification_sent', words_count: words_count }
  end
  
  def handle_ai_generation_completed(data, event_id)
    generation = data['generation'] || {}
    type = generation['type'] || 'unknown'
    
    logger.info "AI generation completed: #{generation['id']} - Type: #{type}"
    
    send_notification(generation['userId'], {
      type: 'ai_generation_completed',
      title: 'AI Generation Complete',
      message: "Your #{type} generation is ready!",
      generation_id: generation['id']
    })
    
    { action: 'notification_sent', generation_type: type }
  end
  
  def handle_distribution_submitted(data, event_id)
    release = data['release'] || {}
    platforms = release['platforms'] || []
    
    logger.info "Distribution submitted: #{release['id']} to platforms: #{platforms.join(', ')}"
    
    send_notification(release['userId'], {
      type: 'distribution_submitted',
      title: 'Release Submitted',
      message: "Your release '#{release['title']}' has been submitted to #{platforms.join(', ')}",
      release_id: release['id']
    })
    
    { action: 'notification_sent', platforms_count: platforms.length }
  end
  
  def handle_distribution_approved(data, event_id)
    release = data['release'] || {}
    platform = data['platform'] || {}
    
    logger.info "Distribution approved: #{release['id']} on #{platform['name']}"
    
    send_notification(release['userId'], {
      type: 'distribution_approved',
      title: 'Release Approved',
      message: "Your release '#{release['title']}' has been approved on #{platform['name']}!",
      release_id: release['id'],
      platform: platform['name']
    })
    
    { action: 'notification_sent', platform: platform['name'] }
  end
  
  def handle_distribution_live(data, event_id)
    release = data['release'] || {}
    platform = data['platform'] || {}
    live_url = data['liveUrl']
    
    logger.info "Distribution live: #{release['id']} on #{platform['name']} - URL: #{live_url}"
    
    message = "Your release '#{release['title']}' is now live on #{platform['name']}!"
    message += " Listen here: #{live_url}" if live_url
    
    send_notification(release['userId'], {
      type: 'distribution_live',
      title: 'Release is Live!',
      message: message,
      release_id: release['id'],
      platform: platform['name'],
      live_url: live_url
    })
    
    { action: 'notification_sent', platform: platform['name'] }
  end
  
  def handle_analytics_milestone(data, event_id)
    milestone = data['milestone'] || {}
    track = data['track'] || {}
    
    logger.info "Analytics milestone: #{milestone['type']} for track: #{track['id']} - Value: #{milestone['value']}"
    
    send_notification(track['userId'], {
      type: 'analytics_milestone',
      title: 'Milestone Reached!',
      message: "Your track '#{track['title']}' reached #{milestone['value']} #{milestone['type']}!",
      track_id: track['id'],
      milestone: milestone
    })
    
    { action: 'notification_sent', milestone_type: milestone['type'] }
  end
  
  def handle_subscription_updated(data, event_id)
    user = data['user'] || {}
    subscription = data['subscription'] || {}
    
    logger.info "Subscription updated: User #{user['id']} - #{subscription['previousPlan']} → #{subscription['currentPlan']}"
    
    send_notification(user['id'], {
      type: 'subscription_updated',
      title: 'Subscription Updated',
      message: "Your plan has been updated from #{subscription['previousPlan']} to #{subscription['currentPlan']}",
      subscription: subscription
    })
    
    { action: 'notification_sent', new_plan: subscription['currentPlan'] }
  end
  
  def handle_quota_exceeded(data, event_id)
    user = data['user'] || {}
    quota = data['quota'] || {}
    
    logger.warn "Quota exceeded: User #{user['id']} - #{quota['type']}: #{quota['used']}/#{quota['limit']}"
    
    send_notification(user['id'], {
      type: 'quota_exceeded',
      title: 'Usage Limit Reached',
      message: "You've reached your #{quota['type']} limit (#{quota['used']}/#{quota['limit']}). Consider upgrading your plan.",
      quota: quota
    })
    
    { action: 'quota_warning_sent', quota_type: quota['type'] }
  end
  
  def handle_webhook_test(data, event_id)
    logger.info "Webhook test received: #{event_id}"
    
    { action: 'test_successful', timestamp: Time.now.to_i }
  end
  
  def send_notification(user_id, notification)
    return unless user_id
    
    # Here you would implement your notification system
    # Examples: email, push notifications, database updates, etc.
    
    logger.info "Notification sent to user #{user_id}: #{notification[:type]} - #{notification[:title]}"
    
    # Example implementations:
    # send_email(user_id, notification)
    # send_push_notification(user_id, notification)
    # update_database(user_id, notification)
  end
end

# Webhook management CLI
class JewelMusicWebhookManager
  def initialize(api_key = nil)
    api_key ||= ENV['JEWELMUSIC_API_KEY']
    
    raise "JEWELMUSIC_API_KEY is required" unless api_key
    
    @jewelmusic = JewelMusic::Client.new(api_key: api_key)
  end
  
  def setup_webhooks(webhook_url, webhook_secret)
    puts "🔧 Setting up JewelMusic Webhooks"
    puts "================================\n\n"
    
    # Create main webhook endpoint
    webhook = @jewelmusic.webhooks.create({
      url: webhook_url,
      events: %w[
        track.uploaded
        track.processed
        analysis.started
        analysis.completed
        analysis.failed
        transcription.started
        transcription.completed
        copilot.generation.completed
        distribution.submitted
        distribution.approved
        distribution.rejected
        distribution.live
        analytics.milestone
        user.subscription.updated
        user.quota.exceeded
      ],
      secret: webhook_secret,
      active: true,
      description: 'Main webhook endpoint for all JewelMusic events'
    })
    
    puts "✅ Webhook created successfully!"
    puts "Webhook ID: #{webhook['id']}"
    puts "URL: #{webhook['url']}"
    puts "Events: #{webhook['events'].join(', ')}\n\n"
    
    # Test the webhook
    puts "🧪 Testing webhook..."
    test_result = @jewelmusic.webhooks.test(webhook['id'])
    puts "✅ Test result: #{test_result['status']}"
    puts "Response time: #{test_result['responseTime']}ms" if test_result['responseTime']
    puts "\n"
    
    webhook
    
  rescue JewelMusic::Exceptions::ApiError => e
    puts "❌ Error setting up webhooks: #{e.message}"
    raise e
  end
  
  def list_webhooks
    puts "📋 Listing configured webhooks"
    puts "=============================\n\n"
    
    webhooks = @jewelmusic.webhooks.list
    
    puts "Total webhooks: #{webhooks['items'].length}\n\n"
    
    webhooks['items'].each_with_index do |webhook, i|
      puts "#{i + 1}. #{webhook['url']}"
      puts "   ID: #{webhook['id']}"
      puts "   Status: #{webhook['status']}"
      puts "   Events: #{webhook['events'].join(', ')}"
      puts "   Created: #{webhook['createdAt']}\n\n"
    end
    
  rescue JewelMusic::Exceptions::ApiError => e
    puts "❌ Error listing webhooks: #{e.message}"
    raise e
  end
end

# CLI interface
if __FILE__ == $PROGRAM_NAME
  if ARGV.empty?
    puts "🎵 JewelMusic Ruby SDK - Webhook Server Example"
    puts "===============================================\n\n"
    
    puts "Usage:"
    puts "  ruby webhook_server.rb server          # Start webhook server"
    puts "  ruby webhook_server.rb setup <url> <secret>  # Set up webhooks"
    puts "  ruby webhook_server.rb list            # List webhooks"
    puts "  ruby webhook_server.rb test            # Test webhook functionality\n\n"
    
    puts "Environment variables:"
    puts "  JEWELMUSIC_API_KEY        # Your JewelMusic API key"
    puts "  JEWELMUSIC_WEBHOOK_SECRET # Webhook secret for signature verification"
    puts "  PORT                      # Server port (default: 4567)"
    
    exit 0
  end
  
  command = ARGV[0]
  
  case command
  when 'server'
    puts "🚀 Starting JewelMusic Webhook Server..."
    puts "Listening on port #{ENV['PORT'] || 4567}"
    puts "Webhook endpoint: POST /webhook"
    puts "Health check: GET /health\n\n"
    
    JewelMusicWebhookServer.run!
    
  when 'setup'
    webhook_url = ARGV[1] || 'https://your-domain.com/webhook'
    webhook_secret = ARGV[2] || 'your-webhook-secret'
    
    manager = JewelMusicWebhookManager.new
    manager.setup_webhooks(webhook_url, webhook_secret)
    
  when 'list'
    manager = JewelMusicWebhookManager.new
    manager.list_webhooks
    
  when 'test'
    puts "🧪 Testing webhook server functionality...\n\n"
    
    # Test signature verification
    payload = { test: 'data', timestamp: Time.now.to_i }.to_json
    secret = 'test-secret'
    
    signature = "sha256=#{OpenSSL::HMAC.hexdigest('SHA256', secret, payload)}"
    puts "Generated signature: #{signature}"
    
    expected_signature = "sha256=#{OpenSSL::HMAC.hexdigest('SHA256', secret, payload)}"
    is_valid = Rack::Utils.secure_compare(signature, expected_signature)
    puts "Verification result: #{is_valid ? '✅ Valid' : '❌ Invalid'}\n\n"
    
    # Test with wrong secret
    wrong_signature = "sha256=#{OpenSSL::HMAC.hexdigest('SHA256', 'wrong-secret', payload)}"
    is_invalid = Rack::Utils.secure_compare(signature, wrong_signature)
    puts "Wrong secret verification: #{is_invalid ? '❌ Should be invalid' : '✅ Correctly invalid'}"
    
  else
    puts "❌ Unknown command: #{command}"
    puts "Run without arguments to see usage information."
    exit 1
  end
end