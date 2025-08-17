# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # Analysis resource for AI-powered music analysis and insights
    #
    class AnalysisResource < BaseResource
      ##
      # Analyze a track from existing track ID or upload new file
      #
      # @param track_id [String, nil] Existing track ID (optional)
      # @param file [String, File, IO, nil] File path or file object (optional)
      # @param filename [String, nil] Original filename (required if file provided)
      # @param options [Hash] Analysis options
      # @option options [Array<String>] :analysis_types Types of analysis to perform
      # @option options [Boolean] :include_visualization Include visual charts
      # @option options [Boolean] :reference_comparison Compare with reference tracks
      # @return [Hash] Analysis results
      #
      def analyze(track_id: nil, file: nil, filename: nil, **options)
        if track_id
          # Analyze existing track
          data = { track_id: track_id }.merge(filter_nil_values(options))
          response = http_client.post('/analysis/create', data)
          return extract_data(response)
        end
        
        if file && filename
          # Analyze uploaded file
          prepared_file = prepare_file(file)
          metadata = prepare_upload_metadata(options)
          
          response = http_client.upload_file('/analysis/create', prepared_file, filename, metadata)
          return extract_data(response)
        end
        
        raise ArgumentError, 'Either track_id or file with filename must be provided'
      end

      ##
      # Get analysis results by ID
      #
      # @param analysis_id [String] Analysis ID
      # @return [Hash] Analysis results
      #
      def get(analysis_id)
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        response = http_client.get("/analysis/#{analysis_id}")
        extract_data(response)
      end

      ##
      # Get analysis status and progress
      #
      # @param analysis_id [String] Analysis ID
      # @return [Hash] Status information
      #
      def get_status(analysis_id)
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        response = http_client.get("/analysis/#{analysis_id}/status")
        extract_data(response)
      end

      ##
      # Get musical key and scale analysis
      #
      # @param analysis_id [String] Analysis ID
      # @return [Hash] Key analysis results
      #
      def get_key_analysis(analysis_id)
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        response = http_client.get("/analysis/#{analysis_id}/key")
        extract_data(response)
      end

      ##
      # Get tempo and rhythm analysis
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Options for tempo analysis
      # @option options [Boolean] :include_beats Include beat detection
      # @option options [Boolean] :include_downbeats Include downbeat detection
      # @option options [Boolean] :include_tempo_changes Detect tempo variations
      # @return [Hash] Tempo analysis results
      #
      def get_tempo_analysis(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/tempo", params)
        extract_data(response)
      end

      ##
      # Get harmonic analysis (chords, progressions)
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Harmonic analysis options
      # @option options [Boolean] :include_inversions Include chord inversions
      # @option options [Boolean] :include_progressions Analyze chord progressions
      # @option options [Boolean] :include_modulations Detect key changes
      # @return [Hash] Harmonic analysis results
      #
      def get_harmonic_analysis(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/harmony", params)
        extract_data(response)
      end

      ##
      # Get structural analysis (intro, verse, chorus, etc.)
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Structural analysis options
      # @option options [Float] :confidence Minimum confidence threshold
      # @option options [Array<String>] :label_types Types of labels to detect
      # @return [Hash] Structural analysis results
      #
      def get_structural_analysis(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/structure", params)
        extract_data(response)
      end

      ##
      # Get spectral analysis (frequency content, timbral features)
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Spectral analysis options
      # @option options [Integer] :frame_size Analysis frame size
      # @option options [Integer] :hop_size Hop size for overlapping frames
      # @option options [String] :window_type Window function type
      # @return [Hash] Spectral analysis results
      #
      def get_spectral_analysis(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/spectral", params)
        extract_data(response)
      end

      ##
      # Get emotional characteristics and mood analysis
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Mood analysis options
      # @option options [String] :model Emotion recognition model to use
      # @option options [Array<String>] :dimensions Emotional dimensions to analyze
      # @return [Hash] Mood analysis results
      #
      def get_mood_analysis(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/mood", params)
        extract_data(response)
      end

      ##
      # Get genre classification and style analysis
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Genre analysis options
      # @option options [Integer] :top_genres Number of top genres to return
      # @option options [Boolean] :include_subgenres Include subgenre classification
      # @option options [Float] :confidence Minimum confidence threshold
      # @return [Hash] Genre analysis results
      #
      def get_genre_analysis(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/genre", params)
        extract_data(response)
      end

      ##
      # Get audio quality and technical analysis
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Quality analysis options
      # @option options [Boolean] :check_clipping Check for audio clipping
      # @option options [Boolean] :check_phase_issues Check for phase problems
      # @option options [Boolean] :analyze_dynamics Analyze dynamic range
      # @return [Hash] Quality analysis results
      #
      def get_quality_analysis(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/quality", params)
        extract_data(response)
      end

      ##
      # Compare with reference tracks or artists
      #
      # @param analysis_id [String] Analysis ID
      # @param references [Array] Reference tracks or artists
      # @param options [Hash] Comparison options
      # @option options [Array<String>] :metrics Specific metrics to compare
      # @option options [Boolean] :include_visualization Include comparison charts
      # @return [Hash] Comparison results
      #
      def compare_with_references(analysis_id, references, options = {})
        validate_required({ analysis_id: analysis_id, references: references }, [:analysis_id, :references])
        
        data = {
          references: references
        }.merge(filter_nil_values(options))
        
        response = http_client.post("/analysis/#{analysis_id}/compare", data)
        extract_data(response)
      end

      ##
      # Generate insights and recommendations
      #
      # @param analysis_id [String] Analysis ID
      # @param options [Hash] Insights options
      # @option options [Array<String>] :focus Areas to focus on (production, composition, performance)
      # @option options [String] :target_audience Target audience for recommendations
      # @option options [Boolean] :include_actionables Include actionable recommendations
      # @return [Hash] Insights and recommendations
      #
      def get_insights(analysis_id, options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({}, options)
        response = http_client.get("/analysis/#{analysis_id}/insights", params)
        extract_data(response)
      end

      ##
      # Export analysis results in various formats
      #
      # @param analysis_id [String] Analysis ID
      # @param format [String] Export format (json, pdf, midi, musicxml)
      # @param options [Hash] Export options
      # @option options [Boolean] :include_visualizations Include charts and graphs
      # @option options [Array<String>] :sections Specific sections to export
      # @return [Hash] Export data or download information
      #
      def export(analysis_id, format = 'json', options = {})
        validate_required({ analysis_id: analysis_id }, [:analysis_id])
        params = build_params({ format: format }, options)
        response = http_client.get("/analysis/#{analysis_id}/export", params)
        extract_data(response)
      end

      ##
      # List user's analysis history with filtering
      #
      # @param page [Integer] Page number
      # @param per_page [Integer] Items per page
      # @param filters [Hash] Optional filters
      # @option filters [String] :status Analysis status
      # @option filters [String] :date_range Date range filter
      # @option filters [String] :track_name Track name search
      # @return [Hash] Analysis list
      #
      def list(page = 1, per_page = 20, filters = {})
        params = build_params({
          page: page.to_s,
          per_page: per_page.to_s
        }, filters)
        
        response = http_client.get('/analysis', params)
        extract_data(response)
      end
    end
  end
end