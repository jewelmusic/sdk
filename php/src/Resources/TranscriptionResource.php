<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * Transcription resource for AI-powered music transcription and lyrics processing
 */
class TranscriptionResource extends BaseResource
{
    /**
     * Create a new transcription from track ID or uploaded file
     *
     * @param string|null $trackId Existing track ID (optional)
     * @param string|resource|null $file File path or file resource (optional)
     * @param string|null $filename Original filename (required if file provided)
     * @param array $options Transcription options
     *                      - languages: Target languages for transcription
     *                      - includeTimestamps: Include word-level timestamps
     *                      - wordLevelTimestamps: Enable word-level timing
     *                      - speakerDiarization: Enable speaker identification
     *                      - model: Transcription model to use
     *                      - maxSpeakers: Maximum number of speakers
     * @return array Transcription data
     */
    public function create($trackId = null, $file = null, ?string $filename = null, array $options = []): array
    {
        if ($trackId) {
            // Create from existing track
            $data = array_merge(['trackId' => $trackId], $this->filterNullValues($options));
            $response = $this->httpClient->post('/transcription/create', $data);
            return $this->extractData($response);
        }
        
        if ($file && $filename) {
            // Create from uploaded file
            $metadata = [];
            foreach ($options as $key => $value) {
                if (is_array($value)) {
                    $metadata[$key] = implode(',', $value);
                } elseif (is_bool($value)) {
                    $metadata[$key] = $value ? 'true' : 'false';
                } else {
                    $metadata[$key] = (string)$value;
                }
            }
            
            $response = $this->httpClient->uploadFile('/transcription/create', $file, $filename, $metadata);
            return $this->extractData($response);
        }
        
        throw new \InvalidArgumentException('Either trackId or file with filename must be provided');
    }

    /**
     * Get transcription by ID
     *
     * @param string $transcriptionId Transcription ID
     * @return array Transcription data
     */
    public function get(string $transcriptionId): array
    {
        $response = $this->httpClient->get("/transcription/{$transcriptionId}");
        return $this->extractData($response);
    }

    /**
     * Get transcription status and progress
     *
     * @param string $transcriptionId Transcription ID
     * @return array Status information
     */
    public function getStatus(string $transcriptionId): array
    {
        $response = $this->httpClient->get("/transcription/{$transcriptionId}/status");
        return $this->extractData($response);
    }

    /**
     * Download transcription in specified format
     *
     * @param string $transcriptionId Transcription ID
     * @param string $format Download format (srt, vtt, txt, json, lrc)
     * @return array Download data or URL
     */
    public function download(string $transcriptionId, string $format = 'json'): array
    {
        $params = ['format' => $format];
        $response = $this->httpClient->get("/transcription/{$transcriptionId}/download", $params);
        return $this->extractData($response);
    }

    /**
     * Translate lyrics to target languages
     *
     * @param string $transcriptionId Transcription ID
     * @param array $targetLanguages Target languages for translation
     * @param array $options Translation options
     *                      - preserveRhyme: Maintain rhyme scheme
     *                      - preserveMeter: Maintain musical meter
     *                      - adaptCulturally: Adapt for cultural context
     * @return array Translation results
     */
    public function translateLyrics(string $transcriptionId, array $targetLanguages, array $options = []): array
    {
        $this->validateRequired([
            'transcriptionId' => $transcriptionId,
            'targetLanguages' => $targetLanguages
        ], ['transcriptionId', 'targetLanguages']);
        
        $data = array_merge(
            ['targetLanguages' => $targetLanguages],
            $this->filterNullValues($options)
        );
        
        $response = $this->httpClient->post("/transcription/{$transcriptionId}/translate", $data);
        return $this->extractData($response);
    }

    /**
     * Synchronize lyrics with audio file
     *
     * @param string $transcriptionId Transcription ID
     * @param string|resource $audioFile Audio file for synchronization
     * @param string $filename Audio filename
     * @return array Synchronization result
     */
    public function syncLyrics(string $transcriptionId, $audioFile, string $filename): array
    {
        $this->validateRequired([
            'transcriptionId' => $transcriptionId,
            'audioFile' => $audioFile,
            'filename' => $filename
        ], ['transcriptionId', 'audioFile', 'filename']);
        
        $response = $this->httpClient->uploadFile("/transcription/{$transcriptionId}/sync", $audioFile, $filename);
        return $this->extractData($response);
    }

    /**
     * Enhance lyrics with AI assistance
     *
     * @param string $lyrics Raw lyrics text
     * @param array $options Enhancement options
     *                      - improveMeter: Improve rhythmic meter
     *                      - enhanceRhyming: Enhance rhyme scheme
     *                      - adjustTone: Adjust emotional tone
     *                      - targetLanguage: Target language for enhancement
     *                      - preserveStyle: Preserve original style
     * @return array Enhanced lyrics
     */
    public function enhanceLyrics(string $lyrics, array $options = []): array
    {
        $this->validateRequired(['lyrics' => $lyrics], ['lyrics']);
        
        $data = array_merge(['lyrics' => $lyrics], $this->filterNullValues($options));
        $response = $this->httpClient->post('/transcription/enhance-lyrics', $data);
        return $this->extractData($response);
    }

    /**
     * Analyze rhyme scheme in lyrics
     *
     * @param string $lyrics Lyrics text to analyze
     * @return array Rhyme scheme analysis
     */
    public function checkRhymeScheme(string $lyrics): array
    {
        $this->validateRequired(['lyrics' => $lyrics], ['lyrics']);
        
        $data = ['lyrics' => $lyrics];
        $response = $this->httpClient->post('/transcription/check-rhyme-scheme', $data);
        return $this->extractData($response);
    }

    /**
     * Analyze sentiment and emotion in lyrics
     *
     * @param string $lyrics Lyrics text to analyze
     * @return array Sentiment analysis results
     */
    public function analyzeSentiment(string $lyrics): array
    {
        $this->validateRequired(['lyrics' => $lyrics], ['lyrics']);
        
        $data = ['lyrics' => $lyrics];
        $response = $this->httpClient->post('/transcription/analyze-sentiment', $data);
        return $this->extractData($response);
    }

    /**
     * Check language quality and grammar
     *
     * @param string $lyrics Lyrics text to check
     * @param string $language Language code for checking
     * @return array Language quality analysis
     */
    public function checkLanguageQuality(string $lyrics, string $language): array
    {
        $this->validateRequired([
            'lyrics' => $lyrics,
            'language' => $language
        ], ['lyrics', 'language']);
        
        $data = [
            'lyrics' => $lyrics,
            'language' => $language
        ];
        
        $response = $this->httpClient->post('/transcription/check-language-quality', $data);
        return $this->extractData($response);
    }

    /**
     * Generate alternative lyrics suggestions
     *
     * @param string $lyrics Original lyrics
     * @param array $options Generation options
     *                      - style: Musical style context
     *                      - mood: Target mood
     *                      - themes: Thematic elements to include
     *                      - constraints: Creative constraints
     * @return array Alternative lyrics suggestions
     */
    public function generateAlternatives(string $lyrics, array $options = []): array
    {
        $this->validateRequired(['lyrics' => $lyrics], ['lyrics']);
        
        $data = array_merge(['lyrics' => $lyrics], $this->filterNullValues($options));
        $response = $this->httpClient->post('/transcription/generate-alternatives', $data);
        return $this->extractData($response);
    }

    /**
     * Extract vocal parts from multi-track audio
     *
     * @param string|resource $audioFile Audio file containing multiple tracks
     * @param string $filename Audio filename
     * @param array $options Vocal extraction options
     *                      - isolationMethod: Method for vocal isolation
     *                      - enhanceVocals: Enhance extracted vocals
     *                      - removeBackingVocals: Remove backing vocals
     * @return array Vocal extraction results
     */
    public function extractVocals($audioFile, string $filename, array $options = []): array
    {
        $metadata = [];
        foreach ($options as $key => $value) {
            if (is_bool($value)) {
                $metadata[$key] = $value ? 'true' : 'false';
            } else {
                $metadata[$key] = (string)$value;
            }
        }
        
        $response = $this->httpClient->uploadFile('/transcription/extract-vocals', $audioFile, $filename, $metadata);
        return $this->extractData($response);
    }

    /**
     * Convert lyrics between different formats
     *
     * @param string $transcriptionId Transcription ID
     * @param string $targetFormat Target format (srt, vtt, lrc, txt, json)
     * @param array $options Conversion options
     *                      - includeTimestamps: Include timing information
     *                      - wordLevel: Word-level granularity
     * @return array Converted lyrics
     */
    public function convertFormat(string $transcriptionId, string $targetFormat, array $options = []): array
    {
        $data = array_merge(
            ['targetFormat' => $targetFormat],
            $this->filterNullValues($options)
        );
        
        $response = $this->httpClient->post("/transcription/{$transcriptionId}/convert", $data);
        return $this->extractData($response);
    }

    /**
     * Batch process multiple transcriptions
     *
     * @param array $transcriptionIds Array of transcription IDs
     * @param array $operations Operations to perform
     * @param array $options Batch processing options
     * @return array Batch processing results
     */
    public function batchProcess(array $transcriptionIds, array $operations, array $options = []): array
    {
        $data = array_merge([
            'transcriptionIds' => $transcriptionIds,
            'operations' => $operations
        ], $this->filterNullValues($options));
        
        $response = $this->httpClient->post('/transcription/batch-process', $data);
        return $this->extractData($response);
    }

    /**
     * List transcriptions with filtering and pagination
     *
     * @param int $page Page number
     * @param int $perPage Items per page
     * @param array $filters Transcription filters
     *                      - status: Processing status
     *                      - language: Language filter
     *                      - dateRange: Creation date range
     * @return array Transcriptions list
     */
    public function list(int $page = 1, int $perPage = 20, array $filters = []): array
    {
        $params = $this->buildParams([
            'page' => (string)$page,
            'perPage' => (string)$perPage
        ], $filters);
        
        $response = $this->httpClient->get('/transcription', $params);
        return $this->extractData($response);
    }
}