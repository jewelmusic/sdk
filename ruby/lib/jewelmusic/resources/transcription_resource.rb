# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # Transcription resource for AI-powered music transcription and lyrics processing
    #
    class TranscriptionResource < BaseResource
      ##
      # Create a new transcription from track ID or uploaded file
      #
      # @param track_id [String, nil] Existing track ID (optional)
      # @param file [String, File, IO, nil] File path or file object (optional)
      # @param filename [String, nil] Original filename (required if file provided)
      # @param options [Hash] Transcription options
      # @option options [Array<String>] :languages Target languages for transcription
      # @option options [Boolean] :include_timestamps Include word-level timestamps
      # @option options [Boolean] :word_level_timestamps Enable word-level timing
      # @option options [Boolean] :speaker_diarization Enable speaker identification
      # @option options [String] :model Transcription model to use
      # @option options [Integer] :max_speakers Maximum number of speakers
      # @return [Hash] Transcription data
      #
      def create(track_id: nil, file: nil, filename: nil, **options)
        if track_id
          # Create from existing track
          data = { track_id: track_id }.merge(filter_nil_values(options))
          response = http_client.post('/transcription/create', data)
          return extract_data(response)
        end
        
        if file && filename
          # Create from uploaded file
          prepared_file = prepare_file(file)
          metadata = prepare_upload_metadata(options)
          
          response = http_client.upload_file('/transcription/create', prepared_file, filename, metadata)
          return extract_data(response)
        end
        
        raise ArgumentError, 'Either track_id or file with filename must be provided'
      end

      ##
      # Get transcription by ID
      #
      # @param transcription_id [String] Transcription ID
      # @return [Hash] Transcription data
      #
      def get(transcription_id)
        validate_required({ transcription_id: transcription_id }, [:transcription_id])
        response = http_client.get("/transcription/#{transcription_id}")
        extract_data(response)
      end

      ##
      # Get transcription status and progress
      #
      # @param transcription_id [String] Transcription ID
      # @return [Hash] Status information
      #
      def get_status(transcription_id)
        validate_required({ transcription_id: transcription_id }, [:transcription_id])
        response = http_client.get("/transcription/#{transcription_id}/status")
        extract_data(response)
      end

      ##
      # Download transcription in specified format
      #
      # @param transcription_id [String] Transcription ID
      # @param format [String] Download format (srt, vtt, txt, json, lrc)
      # @return [Hash] Download data or URL
      #
      def download(transcription_id, format = 'json')
        validate_required({ transcription_id: transcription_id }, [:transcription_id])
        params = { format: format }
        response = http_client.get("/transcription/#{transcription_id}/download", params)
        extract_data(response)
      end

      ##
      # Translate lyrics to target languages
      #
      # @param transcription_id [String] Transcription ID
      # @param target_languages [Array<String>] Target languages for translation
      # @param options [Hash] Translation options
      # @option options [Boolean] :preserve_rhyme Maintain rhyme scheme
      # @option options [Boolean] :preserve_meter Maintain musical meter
      # @option options [Boolean] :adapt_culturally Adapt for cultural context
      # @return [Hash] Translation results
      #
      def translate_lyrics(transcription_id, target_languages, options = {})
        validate_required({
          transcription_id: transcription_id,
          target_languages: target_languages
        }, [:transcription_id, :target_languages])
        
        data = {
          target_languages: target_languages
        }.merge(filter_nil_values(options))
        
        response = http_client.post("/transcription/#{transcription_id}/translate", data)
        extract_data(response)
      end

      ##
      # Synchronize lyrics with audio file
      #
      # @param transcription_id [String] Transcription ID
      # @param audio_file [String, File, IO] Audio file for synchronization
      # @param filename [String] Audio filename
      # @return [Hash] Synchronization result
      #
      def sync_lyrics(transcription_id, audio_file, filename)
        validate_required({
          transcription_id: transcription_id,
          audio_file: audio_file,
          filename: filename
        }, [:transcription_id, :audio_file, :filename])
        
        prepared_file = prepare_file(audio_file)
        response = http_client.upload_file("/transcription/#{transcription_id}/sync", prepared_file, filename)
        extract_data(response)
      end

      ##
      # Enhance lyrics with AI assistance
      #
      # @param lyrics [String] Raw lyrics text
      # @param options [Hash] Enhancement options
      # @option options [Boolean] :improve_meter Improve rhythmic meter
      # @option options [Boolean] :enhance_rhyming Enhance rhyme scheme
      # @option options [String] :adjust_tone Adjust emotional tone
      # @option options [String] :target_language Target language for enhancement
      # @option options [Boolean] :preserve_style Preserve original style
      # @return [Hash] Enhanced lyrics
      #
      def enhance_lyrics(lyrics, options = {})
        validate_required({ lyrics: lyrics }, [:lyrics])
        
        data = { lyrics: lyrics }.merge(filter_nil_values(options))
        response = http_client.post('/transcription/enhance-lyrics', data)
        extract_data(response)
      end

      ##
      # Analyze rhyme scheme in lyrics
      #
      # @param lyrics [String] Lyrics text to analyze
      # @return [Hash] Rhyme scheme analysis
      #
      def check_rhyme_scheme(lyrics)
        validate_required({ lyrics: lyrics }, [:lyrics])
        
        data = { lyrics: lyrics }
        response = http_client.post('/transcription/check-rhyme-scheme', data)
        extract_data(response)
      end

      ##
      # Analyze sentiment and emotion in lyrics
      #
      # @param lyrics [String] Lyrics text to analyze
      # @return [Hash] Sentiment analysis results
      #
      def analyze_sentiment(lyrics)
        validate_required({ lyrics: lyrics }, [:lyrics])
        
        data = { lyrics: lyrics }
        response = http_client.post('/transcription/analyze-sentiment', data)
        extract_data(response)
      end

      ##
      # Check language quality and grammar
      #
      # @param lyrics [String] Lyrics text to check
      # @param language [String] Language code for checking
      # @return [Hash] Language quality analysis
      #
      def check_language_quality(lyrics, language)
        validate_required({ lyrics: lyrics, language: language }, [:lyrics, :language])
        
        data = {
          lyrics: lyrics,
          language: language
        }
        
        response = http_client.post('/transcription/check-language-quality', data)
        extract_data(response)
      end

      ##
      # Generate alternative lyrics suggestions
      #
      # @param lyrics [String] Original lyrics
      # @param options [Hash] Generation options
      # @option options [String] :style Musical style context
      # @option options [String] :mood Target mood
      # @option options [Array<String>] :themes Thematic elements to include
      # @option options [Hash] :constraints Creative constraints
      # @return [Hash] Alternative lyrics suggestions
      #
      def generate_alternatives(lyrics, options = {})
        validate_required({ lyrics: lyrics }, [:lyrics])
        
        data = { lyrics: lyrics }.merge(filter_nil_values(options))
        response = http_client.post('/transcription/generate-alternatives', data)
        extract_data(response)
      end

      ##
      # Extract vocal parts from multi-track audio
      #
      # @param audio_file [String, File, IO] Audio file containing multiple tracks
      # @param filename [String] Audio filename
      # @param options [Hash] Vocal extraction options
      # @option options [String] :isolation_method Method for vocal isolation
      # @option options [Boolean] :enhance_vocals Enhance extracted vocals
      # @option options [Boolean] :remove_backing_vocals Remove backing vocals
      # @return [Hash] Vocal extraction results
      #
      def extract_vocals(audio_file, filename, options = {})
        validate_required({ audio_file: audio_file, filename: filename }, [:audio_file, :filename])
        
        prepared_file = prepare_file(audio_file)
        metadata = prepare_upload_metadata(options)
        
        response = http_client.upload_file('/transcription/extract-vocals', prepared_file, filename, metadata)
        extract_data(response)
      end

      ##
      # Convert lyrics between different formats
      #
      # @param transcription_id [String] Transcription ID
      # @param target_format [String] Target format (srt, vtt, lrc, txt, json)
      # @param options [Hash] Conversion options
      # @option options [Boolean] :include_timestamps Include timing information
      # @option options [Boolean] :word_level Word-level granularity
      # @return [Hash] Converted lyrics
      #
      def convert_format(transcription_id, target_format, options = {})
        validate_required({ transcription_id: transcription_id, target_format: target_format }, [:transcription_id, :target_format])
        
        data = {
          target_format: target_format
        }.merge(filter_nil_values(options))
        
        response = http_client.post("/transcription/#{transcription_id}/convert", data)
        extract_data(response)
      end

      ##
      # Batch process multiple transcriptions
      #
      # @param transcription_ids [Array<String>] Array of transcription IDs
      # @param operations [Array<String>] Operations to perform
      # @param options [Hash] Batch processing options
      # @return [Hash] Batch processing results
      #
      def batch_process(transcription_ids, operations, options = {})
        validate_required({ transcription_ids: transcription_ids, operations: operations }, [:transcription_ids, :operations])
        
        data = {
          transcription_ids: transcription_ids,
          operations: operations
        }.merge(filter_nil_values(options))
        
        response = http_client.post('/transcription/batch-process', data)
        extract_data(response)
      end

      ##
      # List transcriptions with filtering and pagination
      #
      # @param page [Integer] Page number
      # @param per_page [Integer] Items per page
      # @param filters [Hash] Transcription filters
      # @option filters [String] :status Processing status
      # @option filters [String] :language Language filter
      # @option filters [String] :date_range Creation date range
      # @return [Hash] Transcriptions list
      #
      def list(page = 1, per_page = 20, filters = {})
        params = build_params({
          page: page.to_s,
          per_page: per_page.to_s
        }, filters)
        
        response = http_client.get('/transcription', params)
        extract_data(response)
      end
    end
  end
end