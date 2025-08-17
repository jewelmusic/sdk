<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * Analysis resource for AI-powered music analysis and insights
 */
class AnalysisResource extends BaseResource
{
    /**
     * Analyze a track from existing track ID or upload new file
     *
     * @param string|null $trackId Existing track ID (optional)
     * @param string|resource|null $file File path or file resource (optional)
     * @param string|null $filename Original filename (required if file provided)
     * @param array $options Analysis options
     *                      - analysisTypes: Types of analysis to perform
     *                      - includeVisualization: Include visual charts
     *                      - referenceComparison: Compare with reference tracks
     * @return array Analysis results
     */
    public function analyze($trackId = null, $file = null, ?string $filename = null, array $options = []): array
    {
        if ($trackId) {
            // Analyze existing track
            $data = array_merge(['trackId' => $trackId], $this->filterNullValues($options));
            $response = $this->httpClient->post('/analysis/create', $data);
            return $this->extractData($response);
        }
        
        if ($file && $filename) {
            // Analyze uploaded file
            $metadata = [];
            foreach ($options as $key => $value) {
                if (is_array($value)) {
                    $metadata[$key] = implode(',', $value);
                } else {
                    $metadata[$key] = (string)$value;
                }
            }
            
            $response = $this->httpClient->uploadFile('/analysis/create', $file, $filename, $metadata);
            return $this->extractData($response);
        }
        
        throw new \InvalidArgumentException('Either trackId or file with filename must be provided');
    }

    /**
     * Get analysis results by ID
     *
     * @param string $analysisId Analysis ID
     * @return array Analysis results
     */
    public function get(string $analysisId): array
    {
        $response = $this->httpClient->get("/analysis/{$analysisId}");
        return $this->extractData($response);
    }

    /**
     * Get analysis status and progress
     *
     * @param string $analysisId Analysis ID
     * @return array Status information
     */
    public function getStatus(string $analysisId): array
    {
        $response = $this->httpClient->get("/analysis/{$analysisId}/status");
        return $this->extractData($response);
    }

    /**
     * Get musical key and scale analysis
     *
     * @param string $analysisId Analysis ID
     * @return array Key analysis results
     */
    public function getKeyAnalysis(string $analysisId): array
    {
        $response = $this->httpClient->get("/analysis/{$analysisId}/key");
        return $this->extractData($response);
    }

    /**
     * Get tempo and rhythm analysis
     *
     * @param string $analysisId Analysis ID
     * @param array $options Options for tempo analysis
     *                      - includeBeats: Include beat detection
     *                      - includeDownbeats: Include downbeat detection
     *                      - includeTempoChanges: Detect tempo variations
     * @return array Tempo analysis results
     */
    public function getTempoAnalysis(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/tempo", $params);
        return $this->extractData($response);
    }

    /**
     * Get harmonic analysis (chords, progressions)
     *
     * @param string $analysisId Analysis ID
     * @param array $options Harmonic analysis options
     *                      - includeInversions: Include chord inversions
     *                      - includeProgressions: Analyze chord progressions
     *                      - includeModulations: Detect key changes
     * @return array Harmonic analysis results
     */
    public function getHarmonicAnalysis(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/harmony", $params);
        return $this->extractData($response);
    }

    /**
     * Get structural analysis (intro, verse, chorus, etc.)
     *
     * @param string $analysisId Analysis ID
     * @param array $options Structural analysis options
     *                      - confidence: Minimum confidence threshold
     *                      - labelTypes: Types of labels to detect
     * @return array Structural analysis results
     */
    public function getStructuralAnalysis(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/structure", $params);
        return $this->extractData($response);
    }

    /**
     * Get spectral analysis (frequency content, timbral features)
     *
     * @param string $analysisId Analysis ID
     * @param array $options Spectral analysis options
     *                      - frameSize: Analysis frame size
     *                      - hopSize: Hop size for overlapping frames
     *                      - windowType: Window function type
     * @return array Spectral analysis results
     */
    public function getSpectralAnalysis(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/spectral", $params);
        return $this->extractData($response);
    }

    /**
     * Get emotional characteristics and mood analysis
     *
     * @param string $analysisId Analysis ID
     * @param array $options Mood analysis options
     *                      - model: Emotion recognition model to use
     *                      - dimensions: Emotional dimensions to analyze
     * @return array Mood analysis results
     */
    public function getMoodAnalysis(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/mood", $params);
        return $this->extractData($response);
    }

    /**
     * Get genre classification and style analysis
     *
     * @param string $analysisId Analysis ID
     * @param array $options Genre analysis options
     *                      - topGenres: Number of top genres to return
     *                      - includeSubgenres: Include subgenre classification
     *                      - confidence: Minimum confidence threshold
     * @return array Genre analysis results
     */
    public function getGenreAnalysis(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/genre", $params);
        return $this->extractData($response);
    }

    /**
     * Get audio quality and technical analysis
     *
     * @param string $analysisId Analysis ID
     * @param array $options Quality analysis options
     *                      - checkClipping: Check for audio clipping
     *                      - checkPhaseIssues: Check for phase problems
     *                      - analyzeDynamics: Analyze dynamic range
     * @return array Quality analysis results
     */
    public function getQualityAnalysis(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/quality", $params);
        return $this->extractData($response);
    }

    /**
     * Compare with reference tracks or artists
     *
     * @param string $analysisId Analysis ID
     * @param array $references Reference tracks or artists
     * @param array $options Comparison options
     *                      - metrics: Specific metrics to compare
     *                      - includeVisualization: Include comparison charts
     * @return array Comparison results
     */
    public function compareWithReferences(string $analysisId, array $references, array $options = []): array
    {
        $data = array_merge(
            ['references' => $references],
            $this->filterNullValues($options)
        );
        
        $response = $this->httpClient->post("/analysis/{$analysisId}/compare", $data);
        return $this->extractData($response);
    }

    /**
     * Generate insights and recommendations
     *
     * @param string $analysisId Analysis ID
     * @param array $options Insights options
     *                      - focus: Areas to focus on (production, composition, performance)
     *                      - targetAudience: Target audience for recommendations
     *                      - includeActionables: Include actionable recommendations
     * @return array Insights and recommendations
     */
    public function getInsights(string $analysisId, array $options = []): array
    {
        $params = $this->buildParams([], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/insights", $params);
        return $this->extractData($response);
    }

    /**
     * Export analysis results in various formats
     *
     * @param string $analysisId Analysis ID
     * @param string $format Export format (json, pdf, midi, musicxml)
     * @param array $options Export options
     *                      - includeVisualizations: Include charts and graphs
     *                      - sections: Specific sections to export
     * @return array Export data or download information
     */
    public function export(string $analysisId, string $format = 'json', array $options = []): array
    {
        $params = $this->buildParams(['format' => $format], $options);
        $response = $this->httpClient->get("/analysis/{$analysisId}/export", $params);
        return $this->extractData($response);
    }

    /**
     * List user's analysis history with filtering
     *
     * @param int $page Page number
     * @param int $perPage Items per page
     * @param array $filters Optional filters
     *                      - status: Analysis status
     *                      - dateRange: Date range filter
     *                      - trackName: Track name search
     * @return array Analysis list
     */
    public function list(int $page = 1, int $perPage = 20, array $filters = []): array
    {
        $params = $this->buildParams([
            'page' => (string)$page,
            'perPage' => (string)$perPage
        ], $filters);
        
        $response = $this->httpClient->get('/analysis', $params);
        return $this->extractData($response);
    }
}