<?php

declare(strict_types=1);

namespace JewelMusic\Resources;

/**
 * Copilot resource for AI-powered music generation and assistance
 */
class CopilotResource extends BaseResource
{
    /**
     * Generate AI-powered melody
     *
     * @param array $options Melody generation options
     *                      - style: Musical style (pop, jazz, classical, etc.)
     *                      - genre: Musical genre
     *                      - mood: Desired mood (upbeat, melancholic, energetic, etc.)
     *                      - tempo: Tempo in BPM
     *                      - key: Musical key (C major, A minor, etc.)
     *                      - mode: Musical mode (major, minor, dorian, etc.)
     *                      - timeSignature: Time signature (4/4, 3/4, etc.)
     *                      - duration: Duration in bars
     *                      - instruments: Array of instruments
     *                      - complexity: Complexity level (simple, medium, complex)
     *                      - energy: Energy level (low, medium, high)
     *                      - creativity: Creativity factor (0.0 to 1.0)
     *                      - seed: Optional seed for reproducibility
     * @return array Generated melody data
     */
    public function generateMelody(array $options = []): array
    {
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/melody', $data);
        return $this->extractData($response);
    }

    /**
     * Generate harmony for existing melody
     *
     * @param array $options Harmony generation options
     *                      - melodyId: ID of the melody to harmonize
     *                      - style: Harmony style
     *                      - complexity: Complexity level
     *                      - voicing: Voicing type (close, open, etc.)
     *                      - instruments: Array of instruments
     *                      - creativity: Creativity factor (0.0 to 1.0)
     * @return array Generated harmony data
     */
    public function generateHarmony(array $options = []): array
    {
        if (isset($options['melodyId'])) {
            $this->validateRequired($options, ['melodyId']);
        }
        
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/harmony', $data);
        return $this->extractData($response);
    }

    /**
     * Generate AI-powered lyrics
     *
     * @param array $options Lyrics generation options
     *                      - theme: Lyrical theme
     *                      - genre: Musical genre
     *                      - language: Language code (en, es, fr, etc.)
     *                      - mood: Emotional mood
     *                      - structure: Song structure
     *                      - rhymeScheme: Rhyme scheme (ABAB, AABB, etc.)
     *                      - syllableCount: Syllable pattern
     *                      - inspirationText: Optional inspiration text
     *                      - verseCount: Number of verses
     *                      - chorusCount: Number of choruses
     *                      - bridgeCount: Number of bridges
     *                      - wordsPerLine: Words per line
     *                      - explicitContent: Allow explicit content
     *                      - keywords: Array of keywords to include
     *                      - referenceArtists: Array of reference artists
     * @return array Generated lyrics data
     */
    public function generateLyrics(array $options = []): array
    {
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/lyrics', $data);
        return $this->extractData($response);
    }

    /**
     * Generate a complete song with AI
     *
     * @param array $options Song generation options
     *                      - prompt: Text prompt describing the song
     *                      - melodyId: Optional existing melody ID
     *                      - harmonyId: Optional existing harmony ID
     *                      - lyricsId: Optional existing lyrics ID
     *                      - templateId: Optional template ID
     *                      - style: Musical style
     *                      - duration: Duration in seconds
     *                      - includeVocals: Include vocal generation
     *                      - vocalStyle: Vocal style (male, female, etc.)
     *                      - mixingStyle: Mixing style preset
     *                      - masteringPreset: Mastering preset
     *                      - completionType: Type of completion (intro, outro, bridge, full)
     *                      - addIntro: Add intro section
     *                      - addOutro: Add outro section
     *                      - addBridge: Add bridge section
     * @return array Generated song data
     */
    public function completeSong(array $options = []): array
    {
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/complete-song', $data);
        return $this->extractData($response);
    }

    /**
     * Apply style transfer to existing content
     *
     * @param array $options Style transfer options
     *                      - sourceId: Source content ID (required)
     *                      - targetStyle: Target style to apply (required)
     *                      - intensity: Transfer intensity (0.0 to 1.0)
     *                      - preserveStructure: Preserve original structure
     *                      - preserveTiming: Preserve original timing
     * @return array Style-transferred content
     */
    public function styleTransfer(array $options): array
    {
        $this->validateRequired($options, ['sourceId', 'targetStyle']);
        
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/style-transfer', $data);
        return $this->extractData($response);
    }

    /**
     * Generate chord progression
     *
     * @param array $options Chord progression options
     *                      - key: Musical key (default: C major)
     *                      - style: Musical style (default: pop)
     *                      - complexity: Complexity level (0.0 to 1.0)
     *                      - length: Number of chords
     * @return array Generated chord progression
     */
    public function generateChordProgression(array $options = []): array
    {
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/chord-progression', $data);
        return $this->extractData($response);
    }

    /**
     * Get arrangement suggestions for a track
     *
     * @param array $options Arrangement options
     *                      - trackId: Track ID to analyze (required)
     *                      - targetStyle: Target arrangement style
     * @return array Arrangement suggestions
     */
    public function suggestArrangement(array $options): array
    {
        $this->validateRequired($options, ['trackId']);
        
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/suggest-arrangement', $data);
        return $this->extractData($response);
    }

    /**
     * Analyze genre and suggest improvements
     *
     * @param array $options Genre analysis options
     *                      - trackId: Track ID to analyze (required)
     *                      - targetGenre: Target genre for optimization
     * @return array Genre analysis and suggestions
     */
    public function analyzeGenre(array $options): array
    {
        $this->validateRequired($options, ['trackId']);
        
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/genre-analysis', $data);
        return $this->extractData($response);
    }

    /**
     * Match music to target mood/emotion
     *
     * @param array $options Mood matching options
     *                      - trackId: Track ID to analyze (required)
     *                      - targetMood: Target mood to match (required)
     *                      - adjustmentType: Type of adjustment (tempo, key, arrangement, all)
     * @return array Mood matching suggestions
     */
    public function matchMood(array $options): array
    {
        $this->validateRequired($options, ['trackId', 'targetMood']);
        
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/mood-matching', $data);
        return $this->extractData($response);
    }

    /**
     * Generate variations of existing composition
     *
     * @param array $options Variation options
     *                      - sourceId: Source composition ID (required)
     *                      - variationType: Type of variation (melodic, rhythmic, harmonic, structural)
     *                      - count: Number of variations to generate (1-10)
     * @return array Generated variations
     */
    public function generateVariations(array $options): array
    {
        $this->validateRequired($options, ['sourceId']);
        
        if (isset($options['count'])) {
            if ($options['count'] < 1 || $options['count'] > 10) {
                throw new \InvalidArgumentException('Count must be between 1 and 10');
            }
        }
        
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/generate-variations', $data);
        return $this->extractData($response);
    }

    /**
     * Get AI-powered mastering suggestions
     *
     * @param array $options Mastering options
     *                      - trackId: Track ID to analyze (required)
     *                      - targetPlatform: Target platform for optimization
     * @return array Mastering suggestions
     */
    public function getMasteringSuggestions(array $options): array
    {
        $this->validateRequired($options, ['trackId']);
        
        $data = $this->filterNullValues($options);
        $response = $this->httpClient->post('/copilot/mastering-suggestions', $data);
        return $this->extractData($response);
    }

    /**
     * Get available song templates
     *
     * @param array $filters Template filters
     *                      - genre: Filter by genre
     *                      - mood: Filter by mood
     *                      - duration: Filter by duration
     *                      - style: Filter by style
     * @return array Available templates
     */
    public function getTemplates(array $filters = []): array
    {
        $params = $this->buildParams([], $filters);
        $response = $this->httpClient->get('/copilot/templates', $params);
        return $this->extractData($response);
    }

    /**
     * Get a specific generation by ID
     *
     * @param string $generationId Generation ID
     * @return array Generation data
     */
    public function getGeneration(string $generationId): array
    {
        $response = $this->httpClient->get("/copilot/generations/{$generationId}");
        return $this->extractData($response);
    }

    /**
     * List user's generations with pagination
     *
     * @param int $page Page number
     * @param int $perPage Items per page
     * @param string|null $type Filter by generation type
     * @return array Generations list
     */
    public function listGenerations(int $page = 1, int $perPage = 20, ?string $type = null): array
    {
        $params = [
            'page' => (string)$page,
            'perPage' => (string)$perPage
        ];
        
        if ($type !== null) {
            $params['type'] = $type;
        }
        
        $response = $this->httpClient->get('/copilot/generations', $params);
        return $this->extractData($response);
    }
}