#!/usr/bin/env ruby
# frozen_string_literal: true

# Complete Workflow Example for JewelMusic Ruby SDK
#
# This example demonstrates a comprehensive music production workflow:
# - Upload and process audio tracks
# - AI-powered analysis and enhancement
# - Automated transcription and lyrics enhancement
# - AI-assisted composition
# - Release creation and distribution
# - Analytics and monitoring

require_relative '../lib/jewelmusic'

# Initialize with environment variable
api_key = ENV['JEWELMUSIC_API_KEY']

if api_key.nil? || api_key.empty?
  puts "❌ JEWELMUSIC_API_KEY environment variable not set"
  puts "Please set your API key: export JEWELMUSIC_API_KEY=your_key_here"
  exit 1
end

puts "🎵 JewelMusic Ruby SDK - Complete Workflow Example"
puts "==================================================\n\n"
puts "🔑 Using API key: #{api_key[0, 12]}...\n\n"

begin
  # Initialize the SDK
  jewelmusic = JewelMusic::Client.new(api_key: api_key)
  
  # Run complete workflow
  results = run_complete_workflow(jewelmusic)
  
  puts "\n✨ Complete workflow examples completed successfully!"
  print_workflow_summary(results)
  
rescue JewelMusic::Exceptions::ApiError => e
  puts "\n💥 API Error: #{e.message}"
  puts "Status Code: #{e.status_code}"
  puts "Details: #{e.details}" if e.details
  exit 1
rescue StandardError => e
  puts "\n💥 Unexpected Error: #{e.message}"
  exit 1
end

def run_complete_workflow(jewelmusic)
  puts "🎵 JewelMusic Complete Workflow Example"
  puts "======================================"
  
  workflow_results = {}
  
  # Phase 1: Upload and Processing
  track = phase1_upload_and_processing(jewelmusic)
  workflow_results[:track] = track
  
  # Phase 2: AI Analysis
  analysis = phase2_ai_analysis(jewelmusic, track)
  workflow_results[:analysis] = analysis
  
  # Phase 3: Transcription and Lyrics
  transcription = phase3_transcription_and_lyrics(jewelmusic, track, analysis)
  workflow_results[:transcription] = transcription
  
  # Phase 4: AI Composition
  composition = phase4_ai_composition(jewelmusic, track, analysis)
  workflow_results[:composition] = composition
  
  # Phase 5: Release and Distribution
  distribution = phase5_release_and_distribution(jewelmusic, track, analysis)
  workflow_results[:distribution] = distribution
  
  # Phase 6: Analytics Setup
  analytics = phase6_analytics_setup(jewelmusic, distribution)
  workflow_results[:analytics] = analytics
  
  workflow_results
end

def phase1_upload_and_processing(jewelmusic)
  puts "\n📤 Phase 1: Track Upload and Processing"
  puts "--------------------------------------"
  
  # Check for sample audio file
  audio_file = 'sample-audio.mp3'
  
  if File.exist?(audio_file)
    puts "📁 Found sample audio file, uploading..."
    
    # Upload with metadata
    metadata = {
      title: 'Workflow Demo Track',
      artist: 'SDK Demo Artist',
      album: 'Demo Album',
      genre: 'Electronic',
      release_date: '2025-09-01'
    }
    
    track = jewelmusic.tracks.upload(audio_file, 'sample-audio.mp3', metadata)
    
    puts "✅ Track uploaded successfully!"
    puts "Track ID: #{track['id']}"
    puts "Status: #{track['status']}"
    
    # Wait for processing
    puts "\n⏳ Waiting for track processing..."
    processed_track = wait_for_processing(jewelmusic, track)
    puts "✅ Track processed: #{processed_track['status']}"
    
    processed_track
  else
    puts "⚠️  No sample audio file found, using existing track..."
    
    # Get an existing track
    tracks_response = jewelmusic.tracks.list(page: 1, per_page: 1)
    tracks = tracks_response['items']
    
    if tracks.empty?
      raise "No tracks available. Please upload a track first or add sample-audio.mp3"
    end
    
    track = tracks.first
    puts "✅ Using existing track: #{track['title']}"
    
    track
  end
end

def phase2_ai_analysis(jewelmusic, track)
  puts "\n🔍 Phase 2: AI Analysis and Quality Assessment"
  puts "---------------------------------------------"
  
  # Comprehensive analysis
  analysis_options = {
    analysis_types: %w[tempo key structure quality loudness mood],
    detailed_report: true,
    cultural_context: 'global',
    target_platforms: %w[spotify apple-music youtube-music]
  }
  
  analysis = jewelmusic.analysis.analyze_with_options(track['id'], analysis_options)
  
  puts "✅ Analysis completed!"
  puts "📊 Results:"
  
  if analysis['tempo']
    tempo = analysis['tempo']
    puts "   Tempo: #{tempo['bpm'].round(1)} BPM " \
         "(confidence: #{(tempo['confidence'] * 100).round(1)}%)"
  end
  
  if analysis['key']
    key = analysis['key']
    puts "   Key: #{key['key']} #{key['mode']} " \
         "(confidence: #{(key['confidence'] * 100).round(1)}%)"
  end
  
  if analysis['quality']
    quality = analysis['quality']
    puts "   Quality Score: #{(quality['overallScore'] * 100).round(1)}/100"
  end
  
  if analysis['loudness']
    loudness = analysis['loudness']
    puts "   Loudness: #{loudness['lufs'].round(1)} LUFS"
  end
  
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
  
  analysis
end

def phase3_transcription_and_lyrics(jewelmusic, track, analysis)
  puts "\n📝 Phase 3: Transcription and Lyrics Enhancement"
  puts "-----------------------------------------------"
  
  begin
    # Create transcription
    transcription_options = {
      languages: %w[en auto-detect],
      include_timestamps: true,
      word_level_timestamps: true,
      speaker_diarization: true,
      model: 'large'
    }
    
    transcription = jewelmusic.transcription.create_transcription(track['id'], transcription_options)
    
    puts "✅ Transcription completed!"
    puts "Language detected: #{transcription['language']}"
    puts "Confidence: #{(transcription['confidence'] * 100).round(1)}%"
    
    text = transcription['text']
    preview = text.length > 150 ? "#{text[0, 150]}..." : text
    puts "Text preview: #{preview}"
    
    # Enhance lyrics with AI
    enhancement_options = {
      improve_meter: true,
      enhance_rhyming: true,
      adjust_tone: 'professional',
      preserve_original_meaning: true
    }
    
    enhanced_lyrics = jewelmusic.transcription.enhance_lyrics(text, enhancement_options)
    
    puts "✅ Lyrics enhanced!"
    puts "Enhancements applied: #{enhanced_lyrics['enhancements'].join(', ')}"
    
    enhanced_lyrics
    
  rescue StandardError => e
    puts "⚠️  Transcription not available (instrumental or processing failed)"
    puts "Proceeding with AI-generated lyrics instead..."
    
    # Generate AI lyrics based on mood and style
    mood_primary = analysis.dig('mood', 'primary') || 'uplifting'
    tempo_bpm = analysis.dig('tempo', 'bpm')&.to_i || 120
    key_str = if analysis['key']
                "#{analysis['key']['key']} #{analysis['key']['mode']}"
              else
                'C major'
              end
    
    lyrics_options = {
      theme: "#{mood_primary} electronic music",
      genre: track['genre'] || 'electronic',
      language: 'en',
      mood: mood_primary,
      structure: 'verse-chorus-verse-chorus-bridge-chorus',
      tempo: tempo_bpm,
      key: key_str
    }
    
    transcription = jewelmusic.copilot.generate_lyrics(lyrics_options)
    
    puts "✅ AI lyrics generated!"
    puts "Theme: #{transcription['theme']}"
    
    text = transcription['text']
    preview = text.length > 150 ? "#{text[0, 150]}..." : text
    puts "Text preview: #{preview}"
    
    transcription
  end
end

def phase4_ai_composition(jewelmusic, track, analysis)
  puts "\n🤖 Phase 4: AI-Assisted Composition"
  puts "------------------------------------"
  
  # Extract analysis data
  key_name = analysis.dig('key', 'key') || 'C'
  key_mode = analysis.dig('key', 'mode') || 'major'
  tempo_bpm = analysis.dig('tempo', 'bpm')&.to_i || 120
  mood_primary = analysis.dig('mood', 'primary') || 'uplifting'
  mood_energy = analysis.dig('mood', 'energy') || 'medium'
  
  # Generate composition elements concurrently using threads
  compositions = {}
  threads = []
  
  # Generate harmony
  threads << Thread.new do
    harmony_options = {
      style: track['genre'] || 'electronic',
      key: key_name,
      mode: key_mode,
      tempo: tempo_bpm,
      complexity: 'medium',
      voicing: 'modern'
    }
    
    compositions[:harmony] = jewelmusic.copilot.generate_harmony(harmony_options)
  end
  
  # Generate chord progression
  threads << Thread.new do
    chord_options = {
      key: "#{key_name} #{key_mode}",
      style: track['genre'] || 'electronic',
      complexity: 0.5,
      length: 8
    }
    
    compositions[:chord_progression] = jewelmusic.copilot.generate_chord_progression(chord_options)
  end
  
  # Generate arrangement suggestions
  threads << Thread.new do
    arrangement_options = {
      track_id: track['id'],
      genre: track['genre'] || 'electronic',
      mood: mood_primary,
      duration: track['duration'] || 180,
      energy: mood_energy
    }
    
    compositions[:arrangement] = jewelmusic.copilot.suggest_arrangement(arrangement_options)
  end
  
  # Wait for all threads to complete
  threads.each(&:join)
  
  harmony = compositions[:harmony]
  chord_progression = compositions[:chord_progression]
  arrangement = compositions[:arrangement]
  
  puts "✅ AI composition elements generated!"
  puts "🎼 Harmony ID: #{harmony['id']}"
  puts "🎹 Chord progression: #{chord_progression['progression'].join(' - ')}"
  puts "🎛️  Suggested arrangement: #{arrangement['structure'].join(' → ')}"
  
  # Create a style variation
  style_options = {
    source_id: track['id'],
    target_style: 'ambient',
    intensity: 0.6,
    preserve_structure: true,
    preserve_timing: true
  }
  
  style_variation = jewelmusic.copilot.apply_style_transfer(style_options)
  
  puts "✅ Style variation created!"
  puts "🎨 Variation ID: #{style_variation['id']}"
  puts "Applied style: #{style_variation['appliedStyle']}"
  
  {
    harmony: harmony,
    chord_progression: chord_progression,
    arrangement: arrangement,
    style_variation: style_variation
  }
end

def phase5_release_and_distribution(jewelmusic, track, analysis)
  puts "\n📡 Phase 5: Release Creation and Distribution"
  puts "--------------------------------------------"
  
  # Create release
  track_data = {
    track_id: track['id'],
    title: track['title'],
    duration: track['duration'] || 180,
    isrc: generate_mock_isrc
  }
  
  release_data = {
    type: 'single',
    title: track['title'],
    artist: track['artist'],
    release_date: '2025-09-01',
    tracks: [track_data],
    artwork: {
      primary: true,
      type: 'cover'
    }
  }
  
  # Metadata from analysis
  metadata = {
    genre: track['genre'] || 'Electronic',
    explicit: false
  }
  
  metadata[:subgenre] = analysis.dig('style', 'subgenre') if analysis.dig('style', 'subgenre')
  metadata[:mood] = analysis.dig('mood', 'primary') if analysis.dig('mood', 'primary')
  metadata[:tempo] = analysis.dig('tempo', 'bpm') if analysis.dig('tempo', 'bpm')
  
  if analysis['key']
    metadata[:key] = "#{analysis['key']['key']} #{analysis['key']['mode']}"
  end
  
  metadata[:credits] = [
    { role: 'artist', name: track['artist'] },
    { role: 'producer', name: 'AI-Assisted Production' }
  ]
  
  release_data[:metadata] = metadata
  release_data[:territories] = ['worldwide']
  release_data[:platforms] = %w[spotify apple-music youtube-music soundcloud bandcamp]
  
  release = jewelmusic.distribution.create_release(release_data)
  
  puts "✅ Release created!"
  puts "📦 Release ID: #{release['id']}"
  puts "Status: #{release['status']}"
  
  # Validate release before submission
  validation = jewelmusic.distribution.validate_release(release['id'])
  
  puts "\n🔍 Release validation:"
  puts "Valid: #{validation['valid'] ? 'Yes' : 'No'}"
  
  unless validation['valid']
    puts "⚠️  Validation issues:"
    validation['issues'].each do |issue|
      puts "   - #{issue['severity']}: #{issue['message']}"
    end
  end
  
  # Submit for distribution (if valid)
  submission_result = nil
  if validation['valid']
    submission_data = {
      platforms: %w[spotify apple-music],
      scheduled_date: '2025-09-01T00:00:00Z',
      expedited: false
    }
    
    submission_result = jewelmusic.distribution.submit_to_platforms(release['id'], submission_data)
    
    puts "✅ Release submitted for distribution!"
    puts "Submission ID: #{submission_result['id']}"
    puts "Expected processing time: #{submission_result['estimatedProcessingTime']}"
  end
  
  {
    release: release,
    validation: validation,
    submission: submission_result
  }
end

def phase6_analytics_setup(jewelmusic, distribution)
  puts "\n📊 Phase 6: Analytics Setup and Monitoring"
  puts "------------------------------------------"
  
  release = distribution[:release]
  
  # Setup analytics alerts
  alert_data = {
    name: 'Track Performance Alert',
    release_id: release['id'],
    conditions: [
      {
        metric: 'streams',
        operator: 'greater_than',
        threshold: 1000,
        period: 'day'
      },
      {
        metric: 'completion_rate',
        operator: 'less_than',
        threshold: 0.5,
        period: 'day'
      }
    ],
    notifications: {
      email: true,
      webhook: true,
      dashboard: true
    }
  }
  
  alert = jewelmusic.analytics.setup_alert(alert_data)
  
  puts "✅ Analytics alert created!"
  puts "Alert ID: #{alert['id']}"
  
  # Try to get initial analytics (if track has existing data)
  begin
    tracks = release['tracks']
    track_id = tracks.first['trackId']
    
    analytics_query = {
      start_date: '2025-01-01',
      end_date: '2025-01-31',
      metrics: %w[streams listeners completion_rate skip_rate],
      group_by: 'day'
    }
    
    initial_analytics = jewelmusic.analytics.get_track_analytics(track_id, analytics_query)
    
    summary = initial_analytics['summary']
    total_streams = summary['totalStreams']
    
    if total_streams > 0
      puts "📈 Initial analytics:"
      puts "   Total streams: #{summary['totalStreams']}"
      puts "   Unique listeners: #{summary['uniqueListeners']}"
      puts "   Completion rate: #{(summary['completionRate'] * 100).round(1)}%"
    end
  rescue StandardError
    puts "⚠️  No analytics data available yet (new track)"
  end
  
  { alert: alert }
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

def generate_mock_isrc
  # Generate a mock ISRC code
  timestamp = Time.now.to_i
  "US#{timestamp.to_s[-8..-1]}"
end

def print_workflow_summary(results)
  puts "\n✨ Phase 7: Workflow Summary"
  puts "----------------------------"
  
  track = results[:track]
  analysis = results[:analysis]
  composition = results[:composition]
  transcription = results[:transcription]
  distribution = results[:distribution]
  analytics = results[:analytics]
  
  puts "🎉 Workflow completed successfully!"
  puts "\n📋 Summary:"
  
  # Track summary
  puts "Track: #{track['title']} by #{track['artist']} (ID: #{track['id']})"
  
  # Analysis summary
  if analysis&.dig('tempo') && analysis&.dig('key') && analysis&.dig('quality')
    tempo = analysis['tempo']['bpm'].round(1)
    key = "#{analysis['key']['key']} #{analysis['key']['mode']}"
    quality = (analysis['quality']['overallScore'] * 100).round(1)
    puts "Analysis: #{tempo} BPM, #{key}, Quality #{quality}/100"
  end
  
  # Composition summary
  if composition&.dig(:harmony) && composition&.dig(:style_variation)
    harmony_id = composition[:harmony]['id']
    variation_id = composition[:style_variation]['id']
    puts "Composition: Harmony #{harmony_id}, Style variation #{variation_id}"
  end
  
  # Distribution summary
  if distribution&.dig(:release) && distribution&.dig(:validation)
    release = distribution[:release]
    validation = distribution[:validation]
    valid_text = validation['valid'] ? 'Yes' : 'No'
    puts "Distribution: Release #{release['id']} (#{release['status']}), Valid: #{valid_text}"
  end
  
  puts "\n🚀 Next Steps:"
  puts "1. Monitor distribution status for platform approval"
  puts "2. Track analytics and streaming performance"
  puts "3. Use AI insights for future compositions"
  puts "4. Create variations and remixes using style transfer"
  puts "5. Optimize release strategy based on performance data"
end