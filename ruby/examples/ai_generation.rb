#!/usr/bin/env ruby
# frozen_string_literal: true

# AI Generation Example for JewelMusic Ruby SDK
#
# This example demonstrates AI-powered music generation:
# - Melody generation
# - Harmony creation
# - Lyrics generation
# - Complete song composition
# - Style transfer
# - Chord progressions

require_relative '../lib/jewelmusic'

# Initialize with environment variable
api_key = ENV['JEWELMUSIC_API_KEY']

if api_key.nil? || api_key.empty?
  puts "❌ JEWELMUSIC_API_KEY environment variable not set"
  puts "Please set your API key: export JEWELMUSIC_API_KEY=your_key_here"
  exit 1
end

puts "🤖 JewelMusic Ruby SDK - AI Generation Example"
puts "===============================================\n\n"
puts "🔑 Using API key: #{api_key[0, 12]}...\n\n"

begin
  # Initialize the SDK
  jewelmusic = JewelMusic::Client.new(api_key: api_key)
  
  # Run AI generation examples
  results = run_ai_generation_examples(jewelmusic)
  
  puts "\n🎉 AI generation examples completed successfully!"
  
  # Print summary
  print_generation_summary(results)
  
rescue JewelMusic::Exceptions::ApiError => e
  puts "\n💥 API Error: #{e.message}"
  puts "Status Code: #{e.status_code}"
  puts "Details: #{e.details}" if e.details
  exit 1
rescue StandardError => e
  puts "\n💥 Unexpected Error: #{e.message}"
  exit 1
end

def run_ai_generation_examples(jewelmusic)
  results = {}
  
  # Generate melody
  melody = generate_melody_example(jewelmusic)
  results[:melody] = melody
  
  # Generate lyrics
  lyrics = generate_lyrics_example(jewelmusic)
  results[:lyrics] = lyrics
  
  # Generate harmony for the melody
  harmony = generate_harmony_example(jewelmusic, melody['id'])
  results[:harmony] = harmony
  
  # Generate chord progression
  chord_progression = generate_chord_progression_example(jewelmusic)
  results[:chord_progression] = chord_progression
  
  # Complete song generation
  song = complete_song_example(jewelmusic)
  results[:song] = song
  
  # Style transfer
  style_variation = style_transfer_example(jewelmusic, melody['id'])
  results[:style_variation] = style_variation
  
  # Get templates
  templates = get_templates_example(jewelmusic)
  results[:templates] = templates
  
  results
end

def generate_melody_example(jewelmusic)
  puts "\n🎵 Generating AI melody..."
  puts "-------------------------"
  
  options = {
    style: 'electronic',
    genre: 'electronic',
    mood: 'upbeat',
    tempo: 128,
    key: 'C',
    mode: 'major',
    duration: 30,
    instruments: %w[synthesizer bass piano],
    complexity: 'medium',
    energy: 'high',
    creativity: 0.7
  }
  
  melody = jewelmusic.copilot.generate_melody(options)
  
  puts "✅ Melody generated successfully!"
  puts "Melody ID: #{melody['id']}"
  puts "Style: #{melody['style']}"
  puts "Tempo: #{melody['tempo']} BPM"
  puts "Key: #{melody['key']} #{melody['mode']}"
  puts "Duration: #{melody['duration']} seconds"
  puts "Preview: #{melody['previewUrl']}" if melody['previewUrl']
  
  melody
end

def generate_lyrics_example(jewelmusic)
  puts "\n📝 Generating AI lyrics..."
  puts "-------------------------"
  
  options = {
    theme: 'technology and human connection',
    genre: 'electronic',
    language: 'en',
    mood: 'optimistic',
    structure: 'verse-chorus-verse-chorus-bridge-chorus',
    rhyme_scheme: 'ABAB',
    syllable_count: '8-6-8-6',
    verse_count: 2,
    chorus_count: 1,
    bridge_count: 1,
    words_per_line: 6,
    explicit_content: false,
    keywords: %w[future connection digital dreams],
    reference_artists: ['Daft Punk', 'Kraftwerk']
  }
  
  lyrics = jewelmusic.copilot.generate_lyrics(options)
  
  puts "✅ Lyrics generated successfully!"
  puts "Lyrics ID: #{lyrics['id']}"
  puts "Theme: #{lyrics['theme']}"
  puts "Structure: #{lyrics['structure']}"
  puts "Language: #{lyrics['language']}"
  
  text = lyrics['text']
  preview = text.length > 200 ? "#{text[0, 200]}..." : text
  puts "\nGenerated lyrics preview:\n```\n#{preview}\n```"
  
  lyrics
end

def generate_harmony_example(jewelmusic, melody_id)
  puts "\n🎼 Generating AI harmony..."
  puts "--------------------------"
  
  options = {
    melody_id: melody_id,
    style: 'jazz',
    complexity: 'complex',
    voicing: 'close',
    instruments: %w[piano guitar],
    creativity: 0.8
  }
  
  harmony = jewelmusic.copilot.generate_harmony(options)
  
  puts "✅ Harmony generated successfully!"
  puts "Harmony ID: #{harmony['id']}"
  puts "Reference Melody ID: #{harmony['melodyId']}"
  puts "Style: #{harmony['style']}"
  puts "Complexity: #{harmony['complexity']}"
  puts "Voicing: #{harmony['voicing']}"
  
  harmony
end

def generate_chord_progression_example(jewelmusic)
  puts "\n🎹 Generating chord progression..."
  puts "---------------------------------"
  
  options = {
    key: 'C major',
    style: 'pop',
    complexity: 0.5,
    length: 8
  }
  
  progression = jewelmusic.copilot.generate_chord_progression(options)
  
  puts "✅ Chord progression generated!"
  puts "Progression ID: #{progression['id']}"
  puts "Key: #{progression['key']}"
  puts "Length: #{progression['length']} chords"
  puts "Chords: #{progression['progression'].join(' - ')}"
  
  progression
end

def complete_song_example(jewelmusic)
  puts "\n🎤 Generating complete AI song..."
  puts "--------------------------------"
  
  options = {
    prompt: 'Create an uplifting electronic song about overcoming challenges and finding inner strength',
    style: 'electronic',
    duration: 180,
    include_vocals: true,
    vocal_style: 'female-pop',
    mixing_style: 'modern',
    mastering_preset: 'streaming',
    completion_type: 'full',
    add_intro: true,
    add_outro: true,
    add_bridge: true
  }
  
  song = jewelmusic.copilot.generate_complete_song(options)
  
  puts "✅ Complete song generated successfully!"
  puts "Song ID: #{song['id']}"
  puts "Title: #{song['title']}"
  puts "Duration: #{song['duration']} seconds"
  puts "Style: #{song['style']}"
  puts "Vocal Style: #{song['vocalStyle']}"
  
  puts "Components:"
  puts "  - Melody: #{song['melodyId']}" if song['melodyId']
  puts "  - Harmony: #{song['harmonyId']}" if song['harmonyId']
  puts "  - Lyrics: #{song['lyricsId']}" if song['lyricsId']
  
  song
end

def style_transfer_example(jewelmusic, source_id)
  puts "\n🔄 Style transfer example..."
  puts "---------------------------"
  
  options = {
    source_id: source_id,
    target_style: 'jazz',
    intensity: 0.8,
    preserve_structure: true,
    preserve_timing: true
  }
  
  style_transfer = jewelmusic.copilot.apply_style_transfer(options)
  
  puts "✅ Style transfer completed!"
  puts "Original Track ID: #{source_id} (electronic)"
  puts "Transformed Track ID: #{style_transfer['id']} (jazz)"
  puts "Transfer Intensity: #{style_transfer['intensity'].round(1)}"
  
  style_transfer
end

def get_templates_example(jewelmusic)
  puts "\n📚 Getting available song templates..."
  puts "-------------------------------------"
  
  query = {
    genre: 'electronic',
    mood: 'upbeat',
    duration: 180,
    style: 'modern'
  }
  
  response = jewelmusic.copilot.get_templates(query)
  templates = response['items']
  
  puts "✅ Found #{templates.length} templates"
  
  unless templates.empty?
    puts "Available templates:"
    display_count = [5, templates.length].min
    
    templates.first(display_count).each_with_index do |template, i|
      puts "  #{i + 1}. #{template['name']} (#{template['genre']})"
      puts "     Style: #{template['style']} | Mood: #{template['mood']} | Duration: #{template['duration']}s"
    end
    
    if templates.length > 5
      puts "     ... and #{templates.length - 5} more templates"
    end
    
    # Use first template for song generation
    template = templates.first
    puts "\nUsing template '#{template['name']}' for song generation..."
    
    song_options = {
      template_id: template['id'],
      prompt: 'An energetic track perfect for workout sessions',
      style: template['style'],
      duration: template['duration'],
      include_vocals: true
    }
    
    song_from_template = jewelmusic.copilot.generate_complete_song(song_options)
    
    puts "✅ Song generated from template!"
    puts "Template-based Song ID: #{song_from_template['id']}"
  end
  
  templates
end

def advanced_ai_workflow_example(jewelmusic)
  puts "\n🚀 Advanced AI Workflow Example"
  puts "==============================="
  
  # Step 1: Create song from text prompt
  puts "📝 Creating song from prompt..."
  prompt = "A dreamy synthwave track about driving through a neon-lit city at night, feeling nostalgic and hopeful about the future"
  
  song_options = {
    prompt: prompt,
    style: 'synthwave',
    duration: 240,
    include_vocals: false, # Instrumental
    energy: 'medium',
    complexity: 'high'
  }
  
  song_from_prompt = jewelmusic.copilot.generate_complete_song(song_options)
  
  puts "✅ Song created from prompt!"
  puts "Song ID: #{song_from_prompt['id']}"
  
  # Step 2: Generate variations using parallel processing
  puts "\n🔄 Creating variations..."
  
  # Ruby has built-in support for concurrent processing
  variations = generate_variations_concurrently(jewelmusic, song_from_prompt['id'])
  
  puts "✅ Created #{variations.length} variations"
  
  # Step 3: Add lyrics to the best variation
  best_variation = variations[:ambient] # Pick the ambient version
  puts "\n📝 Adding lyrics to ambient variation..."
  
  lyrics_options = {
    theme: 'nostalgia and future dreams',
    genre: 'ambient',
    language: 'en',
    mood: 'reflective',
    structure: 'verse-chorus-verse-chorus-outro',
    inspiration_text: prompt
  }
  
  lyrics_for_variation = jewelmusic.copilot.generate_lyrics(lyrics_options)
  
  puts "✅ Lyrics generated for variation"
  
  # Step 4: Create final song with vocals
  puts "\n🎤 Creating final version with vocals..."
  
  final_song_options = {
    source_id: best_variation['id'],
    lyrics_id: lyrics_for_variation['id'],
    include_vocals: true,
    vocal_style: 'ethereal',
    mixing_style: 'atmospheric',
    mastering_preset: 'streaming'
  }
  
  final_song = jewelmusic.copilot.generate_complete_song(final_song_options)
  
  puts "✅ Final song with vocals created!"
  puts "Final song ID: #{final_song['id']}"
  puts "Download URL: #{final_song['downloadUrl']}" if final_song['downloadUrl']
end

def generate_variations_concurrently(jewelmusic, source_id)
  # Ruby's Thread support for concurrent operations
  style_options = {
    ambient: { target_style: 'ambient', intensity: 0.5 },
    house: { target_style: 'house', intensity: 0.8 },
    orchestral: { target_style: 'orchestral', intensity: 0.6 }
  }
  
  variations = {}
  threads = []
  
  style_options.each do |style_name, options|
    threads << Thread.new do
      options[:source_id] = source_id
      variations[style_name] = jewelmusic.copilot.apply_style_transfer(options)
    end
  end
  
  # Wait for all threads to complete
  threads.each(&:join)
  
  variations
end

def print_generation_summary(results)
  puts "\n📋 Generation Summary"
  puts "====================\n"
  
  puts "Generated assets:"
  
  if results[:melody]
    melody = results[:melody]
    preview_url = melody['previewUrl'] || 'N/A'
    puts "- Melody: #{melody['id']} (preview: #{preview_url})"
  end
  
  if results[:harmony]
    harmony = results[:harmony]
    preview_url = harmony['previewUrl'] || 'N/A'
    puts "- Harmony: #{harmony['id']} (preview: #{preview_url})"
  end
  
  if results[:lyrics]
    lyrics = results[:lyrics]
    puts "- Lyrics: #{lyrics['id']}"
  end
  
  if results[:song]
    song = results[:song]
    download_url = song['downloadUrl'] || 'N/A'
    puts "- Complete song: #{song['id']} (download: #{download_url})"
  end
  
  if results[:style_variation]
    style_variation = results[:style_variation]
    preview_url = style_variation['previewUrl'] || 'N/A'
    puts "- Style variation: #{style_variation['id']} (preview: #{preview_url})"
  end
  
  if results[:chord_progression]
    progression = results[:chord_progression]
    puts "- Chord progression: #{progression['id']} (#{progression['progression'].join(' - ')})"
  end
  
  if results[:templates]
    templates = results[:templates]
    puts "- Available templates: #{templates.length} found"
  end
  
  puts "\n🎯 Next Steps:"
  puts "1. Download generated assets for further editing"
  puts "2. Use style transfer to create more variations"
  puts "3. Combine elements to create unique compositions"
  puts "4. Export final tracks for distribution"
end