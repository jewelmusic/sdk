<?php

/**
 * Track Upload and Analysis Example
 * 
 * This example demonstrates how to upload a track and perform
 * comprehensive AI analysis using the JewelMusic SDK.
 */

require_once __DIR__ . '/../vendor/autoload.php';

use JewelMusic\JewelMusic;
use JewelMusic\Exceptions\ApiException;

try {
    // Initialize the SDK
    $jewelMusic = new JewelMusic('your-api-key-here');
    
    echo "=== Track Upload and Analysis Example ===\n\n";
    
    // Configuration
    $audioFile = '/path/to/your/audio.mp3'; // Update this path
    $filename = 'my-song.mp3';
    
    // Check if file exists
    if (!file_exists($audioFile)) {
        echo "❌ Audio file not found: $audioFile\n";
        echo "Please update the \$audioFile variable with a valid path.\n";
        exit(1);
    }
    
    // 1. Upload the track
    echo "1. Uploading track: $filename\n";
    $track = $jewelMusic->tracks->upload(
        $audioFile,
        $filename,
        [
            'title' => 'My Amazing Song',
            'artist' => 'Demo Artist',
            'album' => 'Demo Album',
            'genre' => 'Electronic',
            'releaseDate' => '2024-01-01',
            'explicit' => false
        ]
    );
    
    echo "✓ Track uploaded successfully!\n";
    echo "   Track ID: " . $track['id'] . "\n";
    echo "   Duration: " . $track['duration'] . " seconds\n";
    echo "   File Size: " . round($track['fileSize'] / 1024 / 1024, 2) . " MB\n\n";
    
    // 2. Start AI analysis
    echo "2. Starting AI analysis...\n";
    $analysis = $jewelMusic->analysis->analyze(
        $track['id'],
        null,
        null,
        [
            'analysisTypes' => [
                'harmony', 'rhythm', 'mood', 'genre', 'structure', 'quality'
            ],
            'includeVisualization' => true
        ]
    );
    
    echo "✓ Analysis started!\n";
    echo "   Analysis ID: " . $analysis['id'] . "\n";
    echo "   Status: " . $analysis['status'] . "\n\n";
    
    // 3. Wait for analysis to complete (polling)
    echo "3. Waiting for analysis to complete...\n";
    $maxWaitTime = 300; // 5 minutes
    $waitTime = 0;
    $pollInterval = 5; // 5 seconds
    
    do {
        sleep($pollInterval);
        $waitTime += $pollInterval;
        
        $status = $jewelMusic->analysis->getStatus($analysis['id']);
        echo "   Status: " . $status['status'] . " (" . $status['progress'] . "%)\n";
        
        if ($status['status'] === 'completed') {
            break;
        }
        
        if ($status['status'] === 'failed') {
            throw new Exception("Analysis failed: " . $status['error']);
        }
        
    } while ($waitTime < $maxWaitTime);
    
    if ($waitTime >= $maxWaitTime) {
        echo "⚠️  Analysis taking longer than expected, continuing with example...\n\n";
    } else {
        echo "✓ Analysis completed!\n\n";
    }
    
    // 4. Get analysis results
    echo "4. Getting analysis results...\n";
    
    // Key and harmony analysis
    $keyAnalysis = $jewelMusic->analysis->getKeyAnalysis($analysis['id']);
    echo "✓ Key Analysis:\n";
    echo "   Key: " . $keyAnalysis['key'] . " " . $keyAnalysis['scale'] . "\n";
    echo "   Confidence: " . round($keyAnalysis['confidence'] * 100, 1) . "%\n\n";
    
    // Tempo analysis
    $tempoAnalysis = $jewelMusic->analysis->getTempoAnalysis($analysis['id'], [
        'includeBeats' => true,
        'includeTempoChanges' => true
    ]);
    echo "✓ Tempo Analysis:\n";
    echo "   BPM: " . round($tempoAnalysis['bpm'], 1) . "\n";
    echo "   Time Signature: " . $tempoAnalysis['timeSignature'] . "\n";
    echo "   Tempo Stability: " . round($tempoAnalysis['stability'] * 100, 1) . "%\n\n";
    
    // Mood analysis
    $moodAnalysis = $jewelMusic->analysis->getMoodAnalysis($analysis['id']);
    echo "✓ Mood Analysis:\n";
    echo "   Energy: " . round($moodAnalysis['energy'] * 100, 1) . "%\n";
    echo "   Valence: " . round($moodAnalysis['valence'] * 100, 1) . "%\n";
    echo "   Danceability: " . round($moodAnalysis['danceability'] * 100, 1) . "%\n";
    echo "   Primary Mood: " . $moodAnalysis['primaryMood'] . "\n\n";
    
    // Genre classification
    $genreAnalysis = $jewelMusic->analysis->getGenreAnalysis($analysis['id'], [
        'topGenres' => 3,
        'includeSubgenres' => true
    ]);
    echo "✓ Genre Classification:\n";
    foreach ($genreAnalysis['genres'] as $i => $genre) {
        echo "   " . ($i + 1) . ". " . $genre['name'] . " (" . round($genre['confidence'] * 100, 1) . "%)\n";
    }
    echo "\n";
    
    // 5. Get insights and recommendations
    echo "5. Getting AI insights...\n";
    $insights = $jewelMusic->analysis->getInsights($analysis['id'], [
        'focus' => ['production', 'composition'],
        'includeActionables' => true
    ]);
    
    echo "✓ AI Insights:\n";
    foreach ($insights['recommendations'] as $recommendation) {
        echo "   • " . $recommendation['title'] . "\n";
        echo "     " . $recommendation['description'] . "\n";
    }
    echo "\n";
    
    // 6. Generate waveform visualization
    echo "6. Generating waveform visualization...\n";
    $waveform = $jewelMusic->tracks->generateWaveform($track['id'], [
        'width' => 800,
        'height' => 200,
        'format' => 'png',
        'colors' => ['#3b82f6', '#1d4ed8']
    ]);
    
    echo "✓ Waveform generated!\n";
    echo "   URL: " . $waveform['url'] . "\n\n";
    
    echo "=== Track analysis example completed successfully! ===\n";
    
} catch (ApiException $e) {
    echo "❌ API Error: " . $e->getMessage() . "\n";
    echo "   Status Code: " . $e->getHttpStatusCode() . "\n";
    
    if ($e->getDetails()) {
        echo "   Details: " . json_encode($e->getDetails(), JSON_PRETTY_PRINT) . "\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}