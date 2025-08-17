# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # Copilot resource for AI-powered music generation and assistance
    #
    class CopilotResource < BaseResource
      ##
      # Generate AI-powered melody
      #
      # @param options [Hash] Melody generation options
      # @option options [String] :style Musical style (pop, jazz, classical, etc.)
      # @option options [String] :genre Musical genre
      # @option options [String] :mood Desired mood (upbeat, melancholic, energetic, etc.)
      # @option options [Integer] :tempo Tempo in BPM
      # @option options [String] :key Musical key (C major, A minor, etc.)
      # @option options [String] :mode Musical mode (major, minor, dorian, etc.)
      # @option options [String] :time_signature Time signature (4/4, 3/4, etc.)
      # @option options [Integer] :duration Duration in bars
      # @option options [Array<String>] :instruments Array of instruments
      # @option options [String] :complexity Complexity level (simple, medium, complex)
      # @option options [String] :energy Energy level (low, medium, high)
      # @option options [Float] :creativity Creativity factor (0.0 to 1.0)
      # @option options [String] :seed Optional seed for reproducibility
      # @return [Hash] Generated melody data
      #
      def generate_melody(options = {})
        data = filter_nil_values(options)
        response = http_client.post('/copilot/melody', data)
        extract_data(response)
      end

      ##
      # Generate harmony for existing melody
      #
      # @param options [Hash] Harmony generation options
      # @option options [String] :melody_id ID of the melody to harmonize
      # @option options [String] :style Harmony style
      # @option options [String] :complexity Complexity level
      # @option options [String] :voicing Voicing type (close, open, etc.)
      # @option options [Array<String>] :instruments Array of instruments
      # @option options [Float] :creativity Creativity factor (0.0 to 1.0)
      # @return [Hash] Generated harmony data
      #
      def generate_harmony(options = {})
        validate_required(options, [:melody_id]) if options[:melody_id]
        
        data = filter_nil_values(options)
        response = http_client.post('/copilot/harmony', data)
        extract_data(response)
      end

      ##
      # Generate AI-powered lyrics
      #
      # @param options [Hash] Lyrics generation options
      # @option options [String] :theme Lyrical theme
      # @option options [String] :genre Musical genre
      # @option options [String] :language Language code (en, es, fr, etc.)
      # @option options [String] :mood Emotional mood
      # @option options [String] :structure Song structure
      # @option options [String] :rhyme_scheme Rhyme scheme (ABAB, AABB, etc.)
      # @option options [String] :syllable_count Syllable pattern
      # @option options [String] :inspiration_text Optional inspiration text
      # @option options [Integer] :verse_count Number of verses
      # @option options [Integer] :chorus_count Number of choruses
      # @option options [Integer] :bridge_count Number of bridges
      # @option options [Integer] :words_per_line Words per line
      # @option options [Boolean] :explicit_content Allow explicit content
      # @option options [Array<String>] :keywords Keywords to include
      # @option options [Array<String>] :reference_artists Reference artists
      # @return [Hash] Generated lyrics data
      #
      def generate_lyrics(options = {})
        data = filter_nil_values(options)
        response = http_client.post('/copilot/lyrics', data)
        extract_data(response)
      end

      ##
      # Generate a complete song with AI
      #
      # @param options [Hash] Song generation options
      # @option options [String] :prompt Text prompt describing the song
      # @option options [String] :melody_id Optional existing melody ID
      # @option options [String] :harmony_id Optional existing harmony ID
      # @option options [String] :lyrics_id Optional existing lyrics ID
      # @option options [String] :template_id Optional template ID
      # @option options [String] :style Musical style
      # @option options [Integer] :duration Duration in seconds
      # @option options [Boolean] :include_vocals Include vocal generation
      # @option options [String] :vocal_style Vocal style (male, female, etc.)
      # @option options [String] :mixing_style Mixing style preset
      # @option options [String] :mastering_preset Mastering preset
      # @option options [String] :completion_type Type of completion (intro, outro, bridge, full)
      # @option options [Boolean] :add_intro Add intro section
      # @option options [Boolean] :add_outro Add outro section
      # @option options [Boolean] :add_bridge Add bridge section
      # @return [Hash] Generated song data
      #
      def complete_song(options = {})
        data = filter_nil_values(options)
        response = http_client.post('/copilot/complete-song', data)
        extract_data(response)
      end

      ##
      # Apply style transfer to existing content
      #
      # @param options [Hash] Style transfer options
      # @option options [String] :source_id Source content ID (required)
      # @option options [String] :target_style Target style to apply (required)
      # @option options [Float] :intensity Transfer intensity (0.0 to 1.0)
      # @option options [Boolean] :preserve_structure Preserve original structure
      # @option options [Boolean] :preserve_timing Preserve original timing
      # @return [Hash] Style-transferred content
      #
      def style_transfer(options)
        validate_required(options, [:source_id, :target_style])
        
        data = filter_nil_values(options)
        response = http_client.post('/copilot/style-transfer', data)
        extract_data(response)
      end

      ##
      # Generate chord progression
      #
      # @param options [Hash] Chord progression options
      # @option options [String] :key Musical key (default: C major)
      # @option options [String] :style Musical style (default: pop)
      # @option options [Float] :complexity Complexity level (0.0 to 1.0)
      # @option options [Integer] :length Number of chords
      # @return [Hash] Generated chord progression
      #
      def generate_chord_progression(options = {})
        data = filter_nil_values(options)
        response = http_client.post('/copilot/chord-progression', data)
        extract_data(response)
      end

      ##
      # Get arrangement suggestions for a track
      #
      # @param options [Hash] Arrangement options
      # @option options [String] :track_id Track ID to analyze (required)
      # @option options [String] :target_style Target arrangement style
      # @return [Hash] Arrangement suggestions
      #
      def suggest_arrangement(options)
        validate_required(options, [:track_id])
        
        data = filter_nil_values(options)
        response = http_client.post('/copilot/suggest-arrangement', data)
        extract_data(response)
      end

      ##
      # Analyze genre and suggest improvements
      #
      # @param options [Hash] Genre analysis options
      # @option options [String] :track_id Track ID to analyze (required)
      # @option options [String] :target_genre Target genre for optimization
      # @return [Hash] Genre analysis and suggestions
      #
      def analyze_genre(options)
        validate_required(options, [:track_id])
        
        data = filter_nil_values(options)
        response = http_client.post('/copilot/genre-analysis', data)
        extract_data(response)
      end

      ##
      # Match music to target mood/emotion
      #
      # @param options [Hash] Mood matching options
      # @option options [String] :track_id Track ID to analyze (required)
      # @option options [String] :target_mood Target mood to match (required)
      # @option options [String] :adjustment_type Type of adjustment (tempo, key, arrangement, all)
      # @return [Hash] Mood matching suggestions
      #
      def match_mood(options)
        validate_required(options, [:track_id, :target_mood])
        
        data = filter_nil_values(options)
        response = http_client.post('/copilot/mood-matching', data)
        extract_data(response)
      end

      ##
      # Generate variations of existing composition
      #
      # @param options [Hash] Variation options
      # @option options [String] :source_id Source composition ID (required)
      # @option options [String] :variation_type Type of variation (melodic, rhythmic, harmonic, structural)
      # @option options [Integer] :count Number of variations to generate (1-10)
      # @return [Hash] Generated variations
      #
      def generate_variations(options)
        validate_required(options, [:source_id])
        
        if options[:count] && (options[:count] < 1 || options[:count] > 10)
          raise ArgumentError, 'Count must be between 1 and 10'
        end
        
        data = filter_nil_values(options)
        response = http_client.post('/copilot/generate-variations', data)
        extract_data(response)
      end

      ##
      # Get AI-powered mastering suggestions
      #
      # @param options [Hash] Mastering options
      # @option options [String] :track_id Track ID to analyze (required)
      # @option options [String] :target_platform Target platform for optimization
      # @return [Hash] Mastering suggestions
      #
      def get_mastering_suggestions(options)
        validate_required(options, [:track_id])
        
        data = filter_nil_values(options)
        response = http_client.post('/copilot/mastering-suggestions', data)
        extract_data(response)
      end

      ##
      # Get available song templates
      #
      # @param filters [Hash] Template filters
      # @option filters [String] :genre Filter by genre
      # @option filters [String] :mood Filter by mood
      # @option filters [String] :duration Filter by duration
      # @option filters [String] :style Filter by style
      # @return [Hash] Available templates
      #
      def get_templates(filters = {})
        params = build_params({}, filters)
        response = http_client.get('/copilot/templates', params)
        extract_data(response)
      end

      ##
      # Get a specific generation by ID
      #
      # @param generation_id [String] Generation ID
      # @return [Hash] Generation data
      #
      def get_generation(generation_id)
        validate_required({ generation_id: generation_id }, [:generation_id])
        response = http_client.get("/copilot/generations/#{generation_id}")
        extract_data(response)
      end

      ##
      # List user's generations with pagination
      #
      # @param page [Integer] Page number
      # @param per_page [Integer] Items per page
      # @param type [String, nil] Filter by generation type
      # @return [Hash] Generations list
      #
      def list_generations(page = 1, per_page = 20, type = nil)
        params = {
          page: page.to_s,
          per_page: per_page.to_s
        }
        
        params[:type] = type if type
        
        response = http_client.get('/copilot/generations', params)
        extract_data(response)
      end
    end
  end
end