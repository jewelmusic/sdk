<?php

/**
 * Complete Workflow Example for JewelMusic PHP SDK
 * 
 * This example demonstrates a comprehensive music production workflow:
 * - Upload and process audio tracks
 * - AI-powered analysis and enhancement
 * - Automated transcription and lyrics enhancement
 * - AI-assisted composition
 * - Release creation and distribution
 * - Analytics and monitoring
 */

require_once __DIR__ . '/../vendor/autoload.php';

use JewelMusic\JewelMusic;
use JewelMusic\Exceptions\ApiException;

try {
    // Initialize with environment variable
    $apiKey = $_ENV['JEWELMUSIC_API_KEY'] ?? getenv('JEWELMUSIC_API_KEY');
    
    if (empty($apiKey)) {
        echo "❌ JEWELMUSIC_API_KEY environment variable not set\n";
        echo "Please set your API key: export JEWELMUSIC_API_KEY=your_key_here\n";
        exit(1);
    }
    
    echo "🎵 JewelMusic PHP SDK - Complete Workflow Example\n";
    echo "=================================================\n\n";
    echo "🔑 Using API key: " . substr($apiKey, 0, 12) . "...\n\n";
    
    // Initialize the SDK
    $jewelMusic = new JewelMusic($apiKey);
    
    // Run complete workflow
    $results = runCompleteWorkflow($jewelMusic);
    
    echo "\n✨ Complete workflow examples completed successfully!\n";
    printWorkflowSummary($results);
    
} catch (ApiException $e) {
    echo "\n💥 API Error: " . $e->getMessage() . "\n";
    echo "Status Code: " . $e->getHttpStatusCode() . "\n";
    if ($e->getDetails()) {
        echo "Details: " . json_encode($e->getDetails(), JSON_PRETTY_PRINT) . "\n";
    }
    exit(1);
} catch (Exception $e) {
    echo "\n💥 Unexpected Error: " . $e->getMessage() . "\n";
    exit(1);
}

function runCompleteWorkflow($jewelMusic) {
    echo "🎵 JewelMusic Complete Workflow Example\n";
    echo "======================================\n";
    
    $workflowResults = [];
    
    // Phase 1: Upload and Processing
    $track = phase1UploadAndProcessing($jewelMusic);
    $workflowResults['track'] = $track;
    
    // Phase 2: AI Analysis
    $analysis = phase2AIAnalysis($jewelMusic, $track);
    $workflowResults['analysis'] = $analysis;
    
    // Phase 3: Transcription and Lyrics
    $transcription = phase3TranscriptionAndLyrics($jewelMusic, $track, $analysis);
    $workflowResults['transcription'] = $transcription;
    
    // Phase 4: AI Composition
    $composition = phase4AIComposition($jewelMusic, $track, $analysis);
    $workflowResults['composition'] = $composition;
    
    // Phase 5: Release and Distribution
    $distribution = phase5ReleaseAndDistribution($jewelMusic, $track, $analysis);
    $workflowResults['distribution'] = $distribution;
    
    // Phase 6: Analytics Setup
    $analytics = phase6AnalyticsSetup($jewelMusic, $distribution);
    $workflowResults['analytics'] = $analytics;
    
    return $workflowResults;
}

function phase1UploadAndProcessing($jewelMusic) {
    echo "\n📤 Phase 1: Track Upload and Processing\n";
    echo "--------------------------------------\n";
    
    // Check for sample audio file
    $audioFile = 'sample-audio.mp3';
    
    if (file_exists($audioFile)) {
        echo "📁 Found sample audio file, uploading...\n";
        
        // Upload with metadata
        $metadata = [
            'title' => 'Workflow Demo Track',
            'artist' => 'SDK Demo Artist',
            'album' => 'Demo Album',
            'genre' => 'Electronic',
            'releaseDate' => '2025-09-01'
        ];
        
        $track = $jewelMusic->tracks->upload($audioFile, 'sample-audio.mp3', $metadata);
        
        echo "✅ Track uploaded successfully!\n";
        echo "Track ID: " . $track['id'] . "\n";
        echo "Status: " . $track['status'] . "\n";
        
        // Wait for processing
        echo "\n⏳ Waiting for track processing...\n";
        $processedTrack = waitForProcessing($jewelMusic, $track);
        echo "✅ Track processed: " . $processedTrack['status'] . "\n";
        
        return $processedTrack;
        
    } else {
        echo "⚠️  No sample audio file found, using existing track...\n";
        
        // Get an existing track
        $tracksResponse = $jewelMusic->tracks->list(1, 1);
        $tracks = $tracksResponse['items'];
        
        if (empty($tracks)) {
            throw new Exception("No tracks available. Please upload a track first or add sample-audio.mp3");
        }
        
        $track = $tracks[0];
        echo "✅ Using existing track: " . $track['title'] . "\n";
        
        return $track;
    }
}

function phase2AIAnalysis($jewelMusic, $track) {
    echo "\n🔍 Phase 2: AI Analysis and Quality Assessment\n";
    echo "---------------------------------------------\n";
    
    // Comprehensive analysis
    $analysisOptions = [
        'analysisTypes' => ['tempo', 'key', 'structure', 'quality', 'loudness', 'mood'],
        'detailedReport' => true,
        'culturalContext' => 'global',
        'targetPlatforms' => ['spotify', 'apple-music', 'youtube-music']
    ];
    
    $analysis = $jewelMusic->analysis->analyzeWithOptions($track['id'], $analysisOptions);
    
    echo "✅ Analysis completed!\n";
    echo "📊 Results:\n";
    
    if (isset($analysis['tempo'])) {
        echo "   Tempo: " . round($analysis['tempo']['bpm'], 1) . " BPM " .
             "(confidence: " . round($analysis['tempo']['confidence'] * 100, 1) . "%)\n";
    }
    
    if (isset($analysis['key'])) {
        echo "   Key: " . $analysis['key']['key'] . " " . $analysis['key']['mode'] . 
             " (confidence: " . round($analysis['key']['confidence'] * 100, 1) . "%)\n";
    }
    
    if (isset($analysis['quality'])) {
        echo "   Quality Score: " . round($analysis['quality']['overallScore'] * 100, 1) . "/100\n";
    }
    
    if (isset($analysis['loudness'])) {
        echo "   Loudness: " . round($analysis['loudness']['lufs'], 1) . " LUFS\n";
    }
    
    if (isset($analysis['mood'])) {
        echo "   Primary Mood: " . $analysis['mood']['primary'] . 
             " (" . $analysis['mood']['energy'] . " energy)\n";
    }
    
    // Quality recommendations
    if (isset($analysis['quality']['recommendations']) && !empty($analysis['quality']['recommendations'])) {
        echo "\n💡 Quality Recommendations:\n";
        foreach ($analysis['quality']['recommendations'] as $rec) {
            echo "   - " . $rec['type'] . ": " . $rec['suggestion'] . "\n";
        }
    }
    
    return $analysis;
}

function phase3TranscriptionAndLyrics($jewelMusic, $track, $analysis) {
    echo "\n📝 Phase 3: Transcription and Lyrics Enhancement\n";
    echo "-----------------------------------------------\n";
    
    try {
        // Create transcription
        $transcriptionOptions = [
            'languages' => ['en', 'auto-detect'],
            'includeTimestamps' => true,
            'wordLevelTimestamps' => true,
            'speakerDiarization' => true,
            'model' => 'large'
        ];
        
        $transcription = $jewelMusic->transcription->createTranscription($track['id'], $transcriptionOptions);
        
        echo "✅ Transcription completed!\n";
        echo "Language detected: " . $transcription['language'] . "\n";
        echo "Confidence: " . round($transcription['confidence'] * 100, 1) . "%\n";
        
        $text = $transcription['text'];
        $preview = strlen($text) > 150 ? substr($text, 0, 150) . "..." : $text;
        echo "Text preview: " . $preview . "\n";
        
        // Enhance lyrics with AI
        $enhancementOptions = [
            'improveMeter' => true,
            'enhanceRhyming' => true,
            'adjustTone' => 'professional',
            'preserveOriginalMeaning' => true
        ];
        
        $enhancedLyrics = $jewelMusic->transcription->enhanceLyrics($text, $enhancementOptions);
        
        echo "✅ Lyrics enhanced!\n";
        echo "Enhancements applied: " . implode(', ', $enhancedLyrics['enhancements']) . "\n";
        
        return $enhancedLyrics;
        
    } catch (Exception $e) {
        echo "⚠️  Transcription not available (instrumental or processing failed)\n";
        echo "Proceeding with AI-generated lyrics instead...\n";
        
        // Generate AI lyrics based on mood and style
        $moodPrimary = isset($analysis['mood']) ? $analysis['mood']['primary'] : 'uplifting';
        $tempoBpm = isset($analysis['tempo']) ? intval($analysis['tempo']['bpm']) : 120;
        $keyStr = 'C major';
        if (isset($analysis['key'])) {
            $keyStr = $analysis['key']['key'] . ' ' . $analysis['key']['mode'];
        }
        
        $lyricsOptions = [
            'theme' => $moodPrimary . ' electronic music',
            'genre' => $track['genre'] ?? 'electronic',
            'language' => 'en',
            'mood' => $moodPrimary,
            'structure' => 'verse-chorus-verse-chorus-bridge-chorus',
            'tempo' => $tempoBpm,
            'key' => $keyStr
        ];
        
        $transcription = $jewelMusic->copilot->generateLyrics($lyricsOptions);
        
        echo "✅ AI lyrics generated!\n";
        echo "Theme: " . $transcription['theme'] . "\n";
        
        $text = $transcription['text'];
        $preview = strlen($text) > 150 ? substr($text, 0, 150) . "..." : $text;
        echo "Text preview: " . $preview . "\n";
        
        return $transcription;
    }
}

function phase4AIComposition($jewelMusic, $track, $analysis) {
    echo "\n🤖 Phase 4: AI-Assisted Composition\n";
    echo "------------------------------------\n";
    
    // Extract analysis data
    $keyName = isset($analysis['key']) ? $analysis['key']['key'] : 'C';
    $keyMode = isset($analysis['key']) ? $analysis['key']['mode'] : 'major';
    $tempoBpm = isset($analysis['tempo']) ? intval($analysis['tempo']['bpm']) : 120;
    $moodPrimary = isset($analysis['mood']) ? $analysis['mood']['primary'] : 'uplifting';
    $moodEnergy = isset($analysis['mood']) ? $analysis['mood']['energy'] : 'medium';
    
    // Generate composition elements
    // Since PHP doesn't have native async, we'll do these sequentially
    // but in a real implementation you could use ReactPHP or similar for async
    
    // Generate harmony
    $harmonyOptions = [
        'style' => $track['genre'] ?? 'electronic',
        'key' => $keyName,
        'mode' => $keyMode,
        'tempo' => $tempoBpm,
        'complexity' => 'medium',
        'voicing' => 'modern'
    ];
    
    $harmony = $jewelMusic->copilot->generateHarmony($harmonyOptions);
    
    // Generate chord progression
    $chordOptions = [
        'key' => $keyName . ' ' . $keyMode,
        'style' => $track['genre'] ?? 'electronic',
        'complexity' => 0.5,
        'length' => 8
    ];
    
    $chordProgression = $jewelMusic->copilot->generateChordProgression($chordOptions);
    
    // Generate arrangement suggestions
    $arrangementOptions = [
        'trackId' => $track['id'],
        'genre' => $track['genre'] ?? 'electronic',
        'mood' => $moodPrimary,
        'duration' => $track['duration'] ?? 180,
        'energy' => $moodEnergy
    ];
    
    $arrangement = $jewelMusic->copilot->suggestArrangement($arrangementOptions);
    
    echo "✅ AI composition elements generated!\n";
    echo "🎼 Harmony ID: " . $harmony['id'] . "\n";
    echo "🎹 Chord progression: " . implode(' - ', $chordProgression['progression']) . "\n";
    echo "🎛️  Suggested arrangement: " . implode(' → ', $arrangement['structure']) . "\n";
    
    // Create a style variation
    $styleOptions = [
        'sourceId' => $track['id'],
        'targetStyle' => 'ambient',
        'intensity' => 0.6,
        'preserveStructure' => true,
        'preserveTiming' => true
    ];
    
    $styleVariation = $jewelMusic->copilot->applyStyleTransfer($styleOptions);
    
    echo "✅ Style variation created!\n";
    echo "🎨 Variation ID: " . $styleVariation['id'] . "\n";
    echo "Applied style: " . $styleVariation['appliedStyle'] . "\n";
    
    return [
        'harmony' => $harmony,
        'chordProgression' => $chordProgression,
        'arrangement' => $arrangement,
        'styleVariation' => $styleVariation
    ];
}

function phase5ReleaseAndDistribution($jewelMusic, $track, $analysis) {
    echo "\n📡 Phase 5: Release Creation and Distribution\n";
    echo "--------------------------------------------\n";
    
    // Create release
    $trackData = [
        'trackId' => $track['id'],
        'title' => $track['title'],
        'duration' => $track['duration'] ?? 180,
        'isrc' => generateMockISRC()
    ];
    
    $releaseData = [
        'type' => 'single',
        'title' => $track['title'],
        'artist' => $track['artist'],
        'releaseDate' => '2025-09-01',
        'tracks' => [$trackData],
        'artwork' => [
            'primary' => true,
            'type' => 'cover'
        ]
    ];
    
    // Metadata from analysis
    $metadata = [
        'genre' => $track['genre'] ?? 'Electronic',
        'explicit' => false
    ];
    
    if (isset($analysis['style']['subgenre'])) {
        $metadata['subgenre'] = $analysis['style']['subgenre'];
    }
    
    if (isset($analysis['mood']['primary'])) {
        $metadata['mood'] = $analysis['mood']['primary'];
    }
    
    if (isset($analysis['tempo']['bpm'])) {
        $metadata['tempo'] = $analysis['tempo']['bpm'];
    }
    
    if (isset($analysis['key'])) {
        $metadata['key'] = $analysis['key']['key'] . ' ' . $analysis['key']['mode'];
    }
    
    $metadata['credits'] = [
        ['role' => 'artist', 'name' => $track['artist']],
        ['role' => 'producer', 'name' => 'AI-Assisted Production']
    ];
    
    $releaseData['metadata'] = $metadata;
    $releaseData['territories'] = ['worldwide'];
    $releaseData['platforms'] = ['spotify', 'apple-music', 'youtube-music', 'soundcloud', 'bandcamp'];
    
    $release = $jewelMusic->distribution->createRelease($releaseData);
    
    echo "✅ Release created!\n";
    echo "📦 Release ID: " . $release['id'] . "\n";
    echo "Status: " . $release['status'] . "\n";
    
    // Validate release before submission
    $validation = $jewelMusic->distribution->validateRelease($release['id']);
    
    echo "\n🔍 Release validation:\n";
    echo "Valid: " . ($validation['valid'] ? 'Yes' : 'No') . "\n";
    
    if (!$validation['valid']) {
        echo "⚠️  Validation issues:\n";
        foreach ($validation['issues'] as $issue) {
            echo "   - " . $issue['severity'] . ": " . $issue['message'] . "\n";
        }
    }
    
    // Submit for distribution (if valid)
    $submissionResult = null;
    if ($validation['valid']) {
        $submissionData = [
            'platforms' => ['spotify', 'apple-music'],
            'scheduledDate' => '2025-09-01T00:00:00Z',
            'expedited' => false
        ];
        
        $submissionResult = $jewelMusic->distribution->submitToPlatforms($release['id'], $submissionData);
        
        echo "✅ Release submitted for distribution!\n";
        echo "Submission ID: " . $submissionResult['id'] . "\n";
        echo "Expected processing time: " . $submissionResult['estimatedProcessingTime'] . "\n";
    }
    
    return [
        'release' => $release,
        'validation' => $validation,
        'submission' => $submissionResult
    ];
}

function phase6AnalyticsSetup($jewelMusic, $distribution) {
    echo "\n📊 Phase 6: Analytics Setup and Monitoring\n";
    echo "------------------------------------------\n";
    
    $release = $distribution['release'];
    
    // Setup analytics alerts
    $alertData = [
        'name' => 'Track Performance Alert',
        'releaseId' => $release['id'],
        'conditions' => [
            [
                'metric' => 'streams',
                'operator' => 'greater_than',
                'threshold' => 1000,
                'period' => 'day'
            ],
            [
                'metric' => 'completion_rate',
                'operator' => 'less_than',
                'threshold' => 0.5,
                'period' => 'day'
            ]
        ],
        'notifications' => [
            'email' => true,
            'webhook' => true,
            'dashboard' => true
        ]
    ];
    
    $alert = $jewelMusic->analytics->setupAlert($alertData);
    
    echo "✅ Analytics alert created!\n";
    echo "Alert ID: " . $alert['id'] . "\n";
    
    // Try to get initial analytics (if track has existing data)
    try {
        $tracks = $release['tracks'];
        $trackId = $tracks[0]['trackId'];
        
        $analyticsQuery = [
            'startDate' => '2025-01-01',
            'endDate' => '2025-01-31',
            'metrics' => ['streams', 'listeners', 'completion_rate', 'skip_rate'],
            'groupBy' => 'day'
        ];
        
        $initialAnalytics = $jewelMusic->analytics->getTrackAnalytics($trackId, $analyticsQuery);
        
        $summary = $initialAnalytics['summary'];
        $totalStreams = $summary['totalStreams'];
        
        if ($totalStreams > 0) {
            echo "📈 Initial analytics:\n";
            echo "   Total streams: " . $summary['totalStreams'] . "\n";
            echo "   Unique listeners: " . $summary['uniqueListeners'] . "\n";
            echo "   Completion rate: " . round($summary['completionRate'] * 100, 1) . "%\n";
        }
    } catch (Exception $e) {
        echo "⚠️  No analytics data available yet (new track)\n";
    }
    
    return ['alert' => $alert];
}

function waitForProcessing($jewelMusic, $track) {
    // Simulate waiting for processing
    $trackId = $track['id'];
    $maxAttempts = 10;
    $attempt = 0;
    
    while ($attempt < $maxAttempts) {
        $currentTrack = $jewelMusic->tracks->get($trackId);
        $status = $currentTrack['status'];
        
        if (in_array($status, ['processed', 'ready'])) {
            return $currentTrack;
        }
        
        if (in_array($status, ['failed', 'error'])) {
            throw new Exception("Track processing failed");
        }
        
        $attempt++;
        sleep(2); // Wait 2 seconds
    }
    
    throw new Exception("Track processing timeout");
}

function generateMockISRC() {
    // Generate a mock ISRC code
    $timestamp = time();
    return 'US' . substr($timestamp, -8);
}

function printWorkflowSummary($results) {
    echo "\n✨ Phase 7: Workflow Summary\n";
    echo "----------------------------\n";
    
    $track = $results['track'];
    $analysis = $results['analysis'];
    $composition = $results['composition'];
    $transcription = $results['transcription'];
    $distribution = $results['distribution'];
    $analytics = $results['analytics'];
    
    echo "🎉 Workflow completed successfully!\n";
    echo "\n📋 Summary:\n";
    
    // Track summary
    echo "Track: " . $track['title'] . " by " . $track['artist'] . " (ID: " . $track['id'] . ")\n";
    
    // Analysis summary
    if (isset($analysis['tempo'], $analysis['key'], $analysis['quality'])) {
        echo "Analysis: " . round($analysis['tempo']['bpm'], 1) . " BPM, " .
             $analysis['key']['key'] . " " . $analysis['key']['mode'] . ", " .
             "Quality " . round($analysis['quality']['overallScore'] * 100, 1) . "/100\n";
    }
    
    // Composition summary
    if (isset($composition['harmony'], $composition['styleVariation'])) {
        echo "Composition: Harmony " . $composition['harmony']['id'] . ", " .
             "Style variation " . $composition['styleVariation']['id'] . "\n";
    }
    
    // Distribution summary
    if (isset($distribution['release'], $distribution['validation'])) {
        $release = $distribution['release'];
        $validation = $distribution['validation'];
        echo "Distribution: Release " . $release['id'] . " (" . $release['status'] . "), " .
             "Valid: " . ($validation['valid'] ? 'Yes' : 'No') . "\n";
    }
    
    echo "\n🚀 Next Steps:\n";
    echo "1. Monitor distribution status for platform approval\n";
    echo "2. Track analytics and streaming performance\n";
    echo "3. Use AI insights for future compositions\n";
    echo "4. Create variations and remixes using style transfer\n";
    echo "5. Optimize release strategy based on performance data\n";
}