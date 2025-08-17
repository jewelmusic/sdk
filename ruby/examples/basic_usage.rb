#!/usr/bin/env ruby
# frozen_string_literal: true

# Basic Usage Example for JewelMusic Ruby SDK
#
# This example demonstrates basic functionality:
# - Client initialization and authentication
# - Track upload and management
# - Music analysis
# - User profile management
# - Error handling

require_relative '../lib/jewelmusic'

# Initialize with environment variable
api_key = ENV['JEWELMUSIC_API_KEY']

if api_key.nil? || api_key.empty?
  puts "❌ JEWELMUSIC_API_KEY environment variable not set"
  puts "Please set your API key: export JEWELMUSIC_API_KEY=your_key_here"
  exit 1
end

puts "🎵 JewelMusic Ruby SDK - Basic Usage Example"
puts "============================================\n\n"
puts "🔑 Using API key: #{api_key[0, 12]}...\n\n"

begin
  # Initialize the SDK
  jewelmusic = JewelMusic::Client.new(
    api_key: api_key,
    timeout: 30,
    retries: 3,
    user_agent: 'RubySDKExample/1.0'
  )
  
  # Test connection and get user profile
  test_connection(jewelmusic)
  
  # Upload and manage tracks
  track = upload_and_manage_track(jewelmusic)
  
  # Analyze track
  analyze_track(jewelmusic, track['id'])
  
  # List and search tracks
  list_and_search_tracks(jewelmusic)
  
  # Demonstrate error handling
  demonstrate_error_handling(jewelmusic)
  
  puts "\n✨ Basic usage examples completed successfully!"
  
rescue JewelMusic::Exceptions::AuthenticationError => e
  puts "\n💥 Authentication Error: #{e.message}"
  puts "Status Code: #{e.status_code}"
  exit 1
rescue JewelMusic::Exceptions::ApiError => e
  puts "\n💥 API Error: #{e.message}"
  puts "Status Code: #{e.status_code}"
  puts "Details: #{e.details}" if e.details
  exit 1
rescue StandardError => e
  puts "\n💥 Unexpected Error: #{e.message}"
  exit 1
end

def test_connection(jewelmusic)
  puts "👤 Testing connection and getting user profile..."
  puts "-----------------------------------------------"
  
  profile = jewelmusic.user.get_profile
  puts "✅ Connected! User: #{profile['name']}"
  puts "Email: #{profile['email']}"
  puts "Plan: #{profile['subscription']['plan']}"
  puts "API Calls Used: #{profile['usage']['apiCalls']} / #{profile['usage']['limits']['apiCalls']}\n\n"
  
rescue StandardError => e
  puts "❌ Connection test failed: #{e.message}"
  raise e
end

def upload_and_manage_track(jewelmusic)
  puts "📤 Track upload and management..."
  puts "--------------------------------"
  
  sample_file = 'sample-audio.mp3'
  
  if File.exist?(sample_file)
    puts "📁 Found sample audio file, uploading..."
    
    # Upload track with metadata
    metadata = {
      title: 'Ruby SDK Demo Track',
      artist: 'SDK Demo Artist',
      album: 'Demo Album',
      genre: 'Electronic',
      release_date: '2025-09-01',
      explicit: false,
      tags: %w[demo sdk electronic]
    }
    
    # Upload with progress callback
    track = jewelmusic.tracks.upload(
      sample_file,
      'sample-audio.mp3',
      metadata
    ) do |bytes_uploaded, total_bytes|
      percent = (bytes_uploaded.to_f / total_bytes * 100).round(1)
      print "Upload progress: #{percent}%\r"
    end
    
    puts "\n✅ Track uploaded successfully!"
    puts "Track ID: #{track['id']}"
    puts "Title: #{track['title']}"
    puts "Artist: #{track['artist']}"
    puts "Duration: #{track['duration']} seconds"
    puts "Status: #{track['status']}"
    
    # Wait for processing
    puts "\n⏳ Waiting for track processing..."
    processed_track = wait_for_processing(jewelmusic, track)
    puts "✅ Track processed: #{processed_track['status']}\n\n"
    
    processed_track
  else
    puts "⚠️  No sample audio file found, using existing track..."
    
    # Get existing tracks
    tracks_response = jewelmusic.tracks.list(page: 1, per_page: 1)
    tracks = tracks_response['items']
    
    if tracks.empty?
      raise "No tracks available. Please upload a track first or add sample-audio.mp3"
    end
    
    track = tracks.first
    puts "✅ Using existing track: #{track['title']}\n\n"
    
    track
  end
  
rescue StandardError => e
  puts "❌ Track upload/management failed: #{e.message}"
  raise e
end

def analyze_track(jewelmusic, track_id)
  puts "🔍 Analyzing track..."
  puts "--------------------"
  
  # Comprehensive analysis
  analysis_options = {
    analysis_types: %w[tempo key structure quality loudness mood],
    detailed_report: true,
    cultural_context: 'global',
    target_platforms: %w[spotify apple-music youtube-music]
  }
  
  analysis = jewelmusic.analysis.analyze_with_options(track_id, analysis_options)
  
  puts "✅ Analysis completed!"
  puts "📊 Results:"
  
  # Tempo analysis
  if analysis['tempo']
    tempo = analysis['tempo']
    puts "   Tempo: #{tempo['bpm'].round(1)} BPM " \
         "(confidence: #{(tempo['confidence'] * 100).round(1)}%)"
  end
  
  # Key analysis
  if analysis['key']
    key = analysis['key']
    puts "   Key: #{key['key']} #{key['mode']} " \
         "(confidence: #{(key['confidence'] * 100).round(1)}%)"
  end
  
  # Quality assessment
  if analysis['quality']
    quality = analysis['quality']
    puts "   Quality Score: #{(quality['overallScore'] * 100).round(1)}/100"
  end
  
  # Loudness analysis
  if analysis['loudness']
    loudness = analysis['loudness']
    puts "   Loudness: #{loudness['lufs'].round(1)} LUFS"
  end
  
  # Mood analysis
  if analysis['mood']
    mood = analysis['mood']
    puts "   Primary Mood: #{mood['primary']} (#{mood['energy']} energy)"
  end
  
  # Quality recommendations
  if analysis['quality']&.dig('recommendations')&.any?
    puts "\n💡 Quality Recommendations:"
    analysis['quality']['recommendations'].each do |rec|
      puts "   - #{rec['type']}: #{rec['suggestion']}"
    end
  end
  
  puts "\n"
  
rescue StandardError => e
  puts "❌ Track analysis failed: #{e.message}"
  # Don't raise here, analysis failure shouldn't stop the example
end

def list_and_search_tracks(jewelmusic)
  puts "📋 Listing and searching tracks..."
  puts "---------------------------------"
  
  # List tracks with pagination
  response = jewelmusic.tracks.list(page: 1, per_page: 5)
  tracks = response['items']
  pagination = response['pagination']
  
  puts "📁 Found #{pagination['total']} tracks (showing #{tracks.length}):"
  
  tracks.each_with_index do |track, i|
    puts "#{i + 1}. #{track['title']} by #{track['artist']} (#{track['duration']}s)"
  end
  
  # Search for tracks
  unless tracks.empty?
    search_query = 'demo'
    puts "\n🔍 Searching for tracks with query: '#{search_query}'"
    
    search_results = jewelmusic.tracks.search(
      search_query,
      limit: 10,
      filters: {
        genre: 'Electronic',
        duration: { min: 30 }
      }
    )
    
    found_tracks = search_results['items']
    puts "✅ Found #{found_tracks.length} tracks matching '#{search_query}'"
    
    unless found_tracks.empty?
      puts "Top results:"
      found_tracks.first(3).each_with_index do |track, i|
        puts "   #{i + 1}. #{track['title']} by #{track['artist']}"
      end
    end
  end
  
  puts "\n"
  
rescue StandardError => e
  puts "❌ Track listing/searching failed: #{e.message}"
end

def demonstrate_error_handling(jewelmusic)
  puts "🛡️  Error Handling Demonstration"
  puts "--------------------------------"
  
  # Test with invalid track ID
  puts "Testing with invalid track ID..."
  jewelmusic.tracks.get('invalid-track-id')
  
rescue JewelMusic::Exceptions::AuthenticationError => e
  puts "✅ Caught AuthenticationError: #{e.message}"
  puts "   Request ID: #{e.request_id}"
  puts "   Status Code: #{e.status_code}"
  
rescue JewelMusic::Exceptions::ValidationError => e
  puts "✅ Caught ValidationError: #{e.message}"
  puts "   Field errors: #{e.field_errors}"
  
rescue JewelMusic::Exceptions::NotFoundError => e
  puts "✅ Caught NotFoundError: #{e.message}"
  
rescue JewelMusic::Exceptions::RateLimitError => e
  puts "✅ Caught RateLimitError: #{e.message}"
  puts "   Retry after: #{e.retry_after_seconds} seconds"
  
rescue JewelMusic::Exceptions::NetworkError => e
  puts "✅ Caught NetworkError: #{e.message}"
  
rescue JewelMusic::Exceptions::ApiError => e
  puts "✅ Caught ApiError: #{e.message}"
  puts "   Status code: #{e.status_code}"
  
rescue StandardError => e
  puts "❌ Unexpected exception: #{e.message}"
ensure
  puts "\n"
end

def advanced_configuration
  puts "⚙️  Advanced Configuration Example"
  puts "---------------------------------"
  
  api_key = ENV['JEWELMUSIC_API_KEY']
  
  # Advanced client configuration
  jewelmusic = JewelMusic::Client.new(
    api_key: api_key,
    base_url: 'https://api.jewelmusic.art',
    timeout: 30,
    retries: 5,
    user_agent: 'RubySDKExample/1.0',
    headers: {
      'X-Custom-Header' => 'MyApp-1.0'
    },
    rate_limit_retry: true,
    debug: false
  )
  
  # Test the advanced client
  profile = jewelmusic.user.get_profile
  puts "✅ Advanced client connected! User: #{profile['name']}"
  
rescue StandardError => e
  puts "❌ Advanced client test failed: #{e.message}"
ensure
  puts "\n"
end

def wait_for_processing(jewelmusic, track)
  # Simulate waiting for processing
  track_id = track['id']
  max_attempts = 10
  attempt = 0
  
  while attempt < max_attempts
    current_track = jewelmusic.tracks.get(track_id)
    status = current_track['status']
    
    return current_track if %w[processed ready].include?(status)
    
    raise "Track processing failed" if %w[failed error].include?(status)
    
    attempt += 1
    sleep(2) # Wait 2 seconds
  end
  
  raise "Track processing timeout"
end

def file_upload_demo(jewelmusic)
  puts "📤 File Upload Demonstration"
  puts "----------------------------"
  
  # Upload from file path
  audio_file = 'demo-track.mp3'
  if File.exist?(audio_file)
    puts "📁 Uploading from file..."
    
    track = jewelmusic.tracks.upload(audio_file, 'demo-track.mp3')
    puts "✅ File uploaded: #{track['id']}"
  end
  
  # Upload with metadata and custom options
  metadata = {
    title: 'Ruby Upload Demo',
    artist: 'Ruby Developer',
    genre: 'Demo'
  }
  
  options = {
    chunk_size: 1024 * 1024, # 1MB chunks
    timeout: 120, # 2 minutes timeout
    retries: 3
  }
  
  if File.exist?(audio_file)
    track_with_meta = jewelmusic.tracks.upload(
      audio_file,
      'demo-track.mp3',
      metadata,
      options
    )
    puts "✅ File with metadata uploaded: #{track_with_meta['id']}"
  end
  
rescue StandardError => e
  puts "⚠️  File upload demo skipped: #{e.message}"
ensure
  puts "\n"
end