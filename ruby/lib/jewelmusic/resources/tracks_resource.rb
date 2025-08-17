# frozen_string_literal: true

module JewelMusic
  module Resources
    ##
    # Tracks resource for track upload, metadata management, and organization
    #
    class TracksResource < BaseResource
      ##
      # Upload a track with metadata
      #
      # @param file [String, File, IO] Audio file to upload
      # @param filename [String] Original filename
      # @param metadata [Hash] Track metadata
      # @option metadata [String] :title Track title (required)
      # @option metadata [String] :artist Artist name (required)
      # @option metadata [String] :album Album name
      # @option metadata [String] :genre Music genre
      # @option metadata [String] :release_date Release date
      # @option metadata [Integer] :duration Track duration
      # @option metadata [Boolean] :explicit Explicit content flag
      # @option metadata [String] :isrc ISRC code
      # @param options [Hash] Upload options
      # @option options [Integer] :chunk_size Size for chunked upload
      # @option options [String] :quality Audio quality preference
      # @return [Hash] Uploaded track data
      #
      def upload(file, filename, metadata, options = {})
        validate_required(metadata, [:title, :artist])
        
        prepared_file = prepare_file(file)
        upload_metadata = prepare_upload_metadata(metadata.merge(options))
        
        response = http_client.upload_file('/tracks/upload', prepared_file, filename, upload_metadata)
        extract_data(response)
      end

      ##
      # Upload track with chunked upload for large files
      #
      # @param file [String, File, IO] Audio file to upload
      # @param filename [String] Original filename
      # @param metadata [Hash] Track metadata
      # @param chunk_size [Integer] Chunk size in bytes (default: 8MB)
      # @return [Hash] Uploaded track data
      #
      def upload_chunked(file, filename, metadata, chunk_size = 8_388_608)
        validate_required(metadata, [:title, :artist])
        
        prepared_file = prepare_file(file)
        upload_metadata = prepare_upload_metadata(metadata)
        
        response = http_client.upload_file_chunked('/tracks/upload', prepared_file, filename, upload_metadata, chunk_size)
        extract_data(response)
      end

      ##
      # Get track by ID
      #
      # @param track_id [String] Track ID
      # @return [Hash] Track data
      #
      def get(track_id)
        validate_required({ track_id: track_id }, [:track_id])
        response = http_client.get("/tracks/#{track_id}")
        extract_data(response)
      end

      ##
      # Update track metadata
      #
      # @param track_id [String] Track ID
      # @param metadata [Hash] Updated metadata
      # @return [Hash] Updated track data
      #
      def update(track_id, metadata)
        validate_required({ track_id: track_id }, [:track_id])
        
        response = http_client.put("/tracks/#{track_id}", metadata)
        extract_data(response)
      end

      ##
      # Delete a track
      #
      # @param track_id [String] Track ID
      # @return [Hash] Deletion confirmation
      #
      def delete(track_id)
        validate_required({ track_id: track_id }, [:track_id])
        
        response = http_client.delete("/tracks/#{track_id}")
        extract_data(response)
      end

      ##
      # Upload artwork for a track
      #
      # @param track_id [String] Track ID
      # @param artwork_file [String, File, IO] Artwork image file
      # @param filename [String] Artwork filename
      # @return [Hash] Artwork upload result
      #
      def upload_artwork(track_id, artwork_file, filename)
        validate_required({
          track_id: track_id,
          artwork_file: artwork_file,
          filename: filename
        }, [:track_id, :artwork_file, :filename])
        
        prepared_file = prepare_file(artwork_file)
        response = http_client.upload_file("/tracks/#{track_id}/artwork", prepared_file, filename)
        extract_data(response)
      end

      ##
      # Batch update metadata for multiple tracks
      #
      # @param updates [Array<Hash>] Array of track updates
      #   Each item should contain :id and :metadata keys
      # @return [Hash] Batch update results
      #
      def batch_update_metadata(updates)
        updates.each do |update|
          validate_required(update, [:id, :metadata])
        end
        
        data = { updates: updates }
        response = http_client.post('/tracks/batch/metadata', data)
        extract_data(response)
      end

      ##
      # Queue tracks for batch processing
      #
      # @param track_ids [Array<String>] Array of track IDs
      # @param operations [Array<String>] Processing operations to perform
      # @param options [Hash] Batch processing options
      # @option options [String] :priority Processing priority
      # @option options [Boolean] :notify Send notification when complete
      # @return [Hash] Batch processing job data
      #
      def batch_process(track_ids, operations, options = {})
        validate_required({ track_ids: track_ids, operations: operations }, [:track_ids, :operations])
        
        data = {
          track_ids: track_ids,
          operations: operations
        }.merge(filter_nil_values(options))
        
        response = http_client.post('/tracks/batch/process', data)
        extract_data(response)
      end

      ##
      # Get track processing status
      #
      # @param track_id [String] Track ID
      # @return [Hash] Processing status information
      #
      def get_processing_status(track_id)
        validate_required({ track_id: track_id }, [:track_id])
        response = http_client.get("/tracks/#{track_id}/processing-status")
        extract_data(response)
      end

      ##
      # Generate waveform visualization for a track
      #
      # @param track_id [String] Track ID
      # @param options [Hash] Waveform generation options
      # @option options [Integer] :width Image width in pixels
      # @option options [Integer] :height Image height in pixels
      # @option options [Array<String>] :colors Color scheme for waveform
      # @option options [String] :format Output format (png, svg, json)
      # @option options [Integer] :samples Number of sample points
      # @return [Hash] Waveform data or image URL
      #
      def generate_waveform(track_id, options = {})
        validate_required({ track_id: track_id }, [:track_id])
        response = http_client.post("/tracks/#{track_id}/waveform", filter_nil_values(options))
        extract_data(response)
      end

      ##
      # Get download URL for a track
      #
      # @param track_id [String] Track ID
      # @param format [String] Audio format (mp3, wav, flac, etc.)
      # @param quality [String] Audio quality (high, medium, low)
      # @return [Hash] Download URL and metadata
      #
      def get_download_url(track_id, format = 'mp3', quality = 'high')
        validate_required({ track_id: track_id }, [:track_id])
        
        params = {
          format: format,
          quality: quality
        }
        
        response = http_client.get("/tracks/#{track_id}/download", params)
        extract_data(response)
      end

      ##
      # Find similar tracks based on content analysis
      #
      # @param reference_track_id [String] Reference track ID
      # @param options [Hash] Similarity search options
      # @option options [Integer] :limit Maximum number of results
      # @option options [Float] :min_similarity Minimum similarity threshold
      # @option options [Boolean] :same_artist Include tracks from same artist
      # @option options [Boolean] :same_genre Include tracks from same genre
      # @option options [Array<String>] :features Specific features to compare
      # @return [Hash] Similar tracks
      #
      def find_similar(reference_track_id, options = {})
        validate_required({ reference_track_id: reference_track_id }, [:reference_track_id])
        params = build_params({}, options)
        response = http_client.get("/tracks/#{reference_track_id}/similar", params)
        extract_data(response)
      end

      ##
      # Get track audio features and characteristics
      #
      # @param track_id [String] Track ID
      # @param features [Array<String>] Specific features to retrieve
      #   Options: tempo, key, energy, mood
      # @return [Hash] Audio features
      #
      def get_audio_features(track_id, features = [])
        validate_required({ track_id: track_id }, [:track_id])
        params = build_params({}, { features: features })
        response = http_client.get("/tracks/#{track_id}/features", params)
        extract_data(response)
      end

      ##
      # Create playlist from tracks
      #
      # @param track_ids [Array<String>] Array of track IDs
      # @param playlist_data [Hash] Playlist metadata
      # @option playlist_data [String] :name Playlist name (required)
      # @option playlist_data [String] :description Playlist description
      # @option playlist_data [Boolean] :public Public visibility
      # @return [Hash] Created playlist data
      #
      def create_playlist(track_ids, playlist_data)
        validate_required(playlist_data, [:name])
        validate_required({ track_ids: track_ids }, [:track_ids])
        
        data = { track_ids: track_ids }.merge(playlist_data)
        response = http_client.post('/tracks/playlists', data)
        extract_data(response)
      end

      ##
      # Tag tracks with custom labels
      #
      # @param track_id [String] Track ID
      # @param tags [Array<String>] Array of tags to add
      # @return [Hash] Updated track with tags
      #
      def add_tags(track_id, tags)
        validate_required({ track_id: track_id, tags: tags }, [:track_id, :tags])
        data = { tags: tags }
        response = http_client.post("/tracks/#{track_id}/tags", data)
        extract_data(response)
      end

      ##
      # Remove tags from track
      #
      # @param track_id [String] Track ID
      # @param tags [Array<String>] Array of tags to remove
      # @return [Hash] Updated track
      #
      def remove_tags(track_id, tags)
        validate_required({ track_id: track_id, tags: tags }, [:track_id, :tags])
        data = { tags: tags }
        response = http_client.delete("/tracks/#{track_id}/tags", data)
        extract_data(response)
      end

      ##
      # List tracks with filtering and pagination
      #
      # @param page [Integer] Page number
      # @param per_page [Integer] Items per page
      # @param filters [Hash] Track filters
      # @option filters [String] :status Processing status
      # @option filters [String] :genre Genre filter
      # @option filters [String] :artist Artist name filter
      # @option filters [String] :album Album filter
      # @option filters [String] :uploaded_after Date filter
      # @option filters [String] :uploaded_before Date filter
      # @option filters [Integer] :duration_min Minimum duration
      # @option filters [Integer] :duration_max Maximum duration
      # @option filters [String] :search Text search in metadata
      # @return [Hash] Tracks list
      #
      def list(page = 1, per_page = 20, filters = {})
        params = build_params({
          page: page.to_s,
          per_page: per_page.to_s
        }, filters)
        
        response = http_client.get('/tracks', params)
        extract_data(response)
      end
    end
  end
end