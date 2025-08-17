<?php

/**
 * AI Generation Example for JewelMusic PHP SDK
 * 
 * This example demonstrates AI-powered music generation:
 * - Melody generation
 * - Harmony creation
 * - Lyrics generation
 * - Complete song composition
 * - Style transfer
 * - Chord progressions
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
    
    echo "🤖 JewelMusic PHP SDK - AI Generation Example\n";
    echo "=============================================\n\n";
    echo "🔑 Using API key: " . substr($apiKey, 0, 12) . "...\n\n";
    
    // Initialize the SDK
    $jewelMusic = new JewelMusic($apiKey);
    
    // Run AI generation examples
    $results = runAIGenerationExamples($jewelMusic);
    
    echo "\n🎉 AI generation examples completed successfully!\n";
    
    // Print summary
    printGenerationSummary($results);
    
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

function runAIGenerationExamples($jewelMusic) {
    $results = [];
    
    // Generate melody
    $melody = generateMelodyExample($jewelMusic);
    $results['melody'] = $melody;
    
    // Generate lyrics
    $lyrics = generateLyricsExample($jewelMusic);
    $results['lyrics'] = $lyrics;
    
    // Generate harmony for the melody
    $harmony = generateHarmonyExample($jewelMusic, $melody['id']);
    $results['harmony'] = $harmony;
    
    // Generate chord progression
    $chordProgression = generateChordProgressionExample($jewelMusic);
    $results['chordProgression'] = $chordProgression;
    
    // Complete song generation
    $song = completeSongExample($jewelMusic);
    $results['song'] = $song;
    
    // Style transfer
    $styleVariation = styleTransferExample($jewelMusic, $melody['id']);
    $results['styleVariation'] = $styleVariation;
    
    // Get templates
    $templates = getTemplatesExample($jewelMusic);
    $results['templates'] = $templates;
    
    return $results;
}

function generateMelodyExample($jewelMusic) {
    echo "\n🎵 Generating AI melody...\n";
    echo "-------------------------\n";
    
    $options = [
        'style' => 'electronic',
        'genre' => 'electronic',
        'mood' => 'upbeat',
        'tempo' => 128,
        'key' => 'C',
        'mode' => 'major',
        'duration' => 30,
        'instruments' => ['synthesizer', 'bass', 'piano'],
        'complexity' => 'medium',
        'energy' => 'high',
        'creativity' => 0.7
    ];
    
    $melody = $jewelMusic->copilot->generateMelody($options);
    
    echo "✅ Melody generated successfully!\n";
    echo "Melody ID: " . $melody['id'] . "\n";
    echo "Style: " . $melody['style'] . "\n";
    echo "Tempo: " . $melody['tempo'] . " BPM\n";
    echo "Key: " . $melody['key'] . " " . $melody['mode'] . "\n";
    echo "Duration: " . $melody['duration'] . " seconds\n";
    
    if (isset($melody['previewUrl'])) {
        echo "Preview: " . $melody['previewUrl'] . "\n";
    }
    
    return $melody;
}

function generateLyricsExample($jewelMusic) {
    echo "\n📝 Generating AI lyrics...\n";
    echo "-------------------------\n";
    
    $options = [
        'theme' => 'technology and human connection',
        'genre' => 'electronic',
        'language' => 'en',
        'mood' => 'optimistic',
        'structure' => 'verse-chorus-verse-chorus-bridge-chorus',
        'rhymeScheme' => 'ABAB',
        'syllableCount' => '8-6-8-6',
        'verseCount' => 2,
        'chorusCount' => 1,
        'bridgeCount' => 1,
        'wordsPerLine' => 6,
        'explicitContent' => false,
        'keywords' => ['future', 'connection', 'digital', 'dreams'],
        'referenceArtists' => ['Daft Punk', 'Kraftwerk']
    ];
    
    $lyrics = $jewelMusic->copilot->generateLyrics($options);
    
    echo "✅ Lyrics generated successfully!\n";
    echo "Lyrics ID: " . $lyrics['id'] . "\n";
    echo "Theme: " . $lyrics['theme'] . "\n";
    echo "Structure: " . $lyrics['structure'] . "\n";
    echo "Language: " . $lyrics['language'] . "\n";
    
    $text = $lyrics['text'];
    $preview = strlen($text) > 200 ? substr($text, 0, 200) . "..." : $text;
    echo "\nGenerated lyrics preview:\n```\n" . $preview . "\n```\n";
    
    return $lyrics;
}

function generateHarmonyExample($jewelMusic, $melodyId) {
    echo "\n🎼 Generating AI harmony...\n";
    echo "--------------------------\n";
    
    $options = [
        'melodyId' => $melodyId,
        'style' => 'jazz',
        'complexity' => 'complex',
        'voicing' => 'close',
        'instruments' => ['piano', 'guitar'],
        'creativity' => 0.8
    ];
    
    $harmony = $jewelMusic->copilot->generateHarmony($options);
    
    echo "✅ Harmony generated successfully!\n";
    echo "Harmony ID: " . $harmony['id'] . "\n";
    echo "Reference Melody ID: " . $harmony['melodyId'] . "\n";
    echo "Style: " . $harmony['style'] . "\n";
    echo "Complexity: " . $harmony['complexity'] . "\n";
    echo "Voicing: " . $harmony['voicing'] . "\n";
    
    return $harmony;
}

function generateChordProgressionExample($jewelMusic) {
    echo "\n🎹 Generating chord progression...\n";
    echo "---------------------------------\n";
    
    $options = [
        'key' => 'C major',
        'style' => 'pop',
        'complexity' => 0.5,
        'length' => 8
    ];
    
    $progression = $jewelMusic->copilot->generateChordProgression($options);
    
    echo "✅ Chord progression generated!\n";
    echo "Progression ID: " . $progression['id'] . "\n";
    echo "Key: " . $progression['key'] . "\n";
    echo "Length: " . $progression['length'] . " chords\n";
    echo "Chords: " . implode(' - ', $progression['progression']) . "\n";
    
    return $progression;
}

function completeSongExample($jewelMusic) {
    echo "\n🎤 Generating complete AI song...\n";
    echo "--------------------------------\n";
    
    $options = [
        'prompt' => 'Create an uplifting electronic song about overcoming challenges and finding inner strength',
        'style' => 'electronic',
        'duration' => 180,
        'includeVocals' => true,
        'vocalStyle' => 'female-pop',
        'mixingStyle' => 'modern',
        'masteringPreset' => 'streaming',
        'completionType' => 'full',
        'addIntro' => true,
        'addOutro' => true,
        'addBridge' => true
    ];
    
    $song = $jewelMusic->copilot->generateCompleteSong($options);
    
    echo "✅ Complete song generated successfully!\n";
    echo "Song ID: " . $song['id'] . "\n";
    echo "Title: " . $song['title'] . "\n";
    echo "Duration: " . $song['duration'] . " seconds\n";
    echo "Style: " . $song['style'] . "\n";
    echo "Vocal Style: " . $song['vocalStyle'] . "\n";
    
    echo "Components:\n";
    if (isset($song['melodyId']) && !empty($song['melodyId'])) {
        echo "  - Melody: " . $song['melodyId'] . "\n";
    }
    if (isset($song['harmonyId']) && !empty($song['harmonyId'])) {
        echo "  - Harmony: " . $song['harmonyId'] . "\n";
    }
    if (isset($song['lyricsId']) && !empty($song['lyricsId'])) {
        echo "  - Lyrics: " . $song['lyricsId'] . "\n";
    }
    
    return $song;
}

function styleTransferExample($jewelMusic, $sourceId) {
    echo "\n🔄 Style transfer example...\n";
    echo "---------------------------\n";
    
    $options = [
        'sourceId' => $sourceId,
        'targetStyle' => 'jazz',
        'intensity' => 0.8,
        'preserveStructure' => true,
        'preserveTiming' => true
    ];
    
    $styleTransfer = $jewelMusic->copilot->applyStyleTransfer($options);
    
    echo "✅ Style transfer completed!\n";
    echo "Original Track ID: " . $sourceId . " (electronic)\n";
    echo "Transformed Track ID: " . $styleTransfer['id'] . " (jazz)\n";
    echo "Transfer Intensity: " . round($styleTransfer['intensity'], 1) . "\n";
    
    return $styleTransfer;
}

function getTemplatesExample($jewelMusic) {
    echo "\n📚 Getting available song templates...\n";
    echo "-------------------------------------\n";
    
    $query = [
        'genre' => 'electronic',
        'mood' => 'upbeat',
        'duration' => 180,
        'style' => 'modern'
    ];
    
    $response = $jewelMusic->copilot->getTemplates($query);
    $templates = $response['items'];
    
    echo "✅ Found " . count($templates) . " templates\n";
    
    if (!empty($templates)) {
        echo "Available templates:\n";
        $displayCount = min(5, count($templates));
        
        for ($i = 0; $i < $displayCount; $i++) {
            $template = $templates[$i];
            echo "  " . ($i + 1) . ". " . $template['name'] . " (" . $template['genre'] . ")\n";
            echo "     Style: " . $template['style'] . " | Mood: " . $template['mood'] . 
                 " | Duration: " . $template['duration'] . "s\n";
        }
        
        if (count($templates) > 5) {
            echo "     ... and " . (count($templates) - 5) . " more templates\n";
        }
        
        // Use first template for song generation
        $template = $templates[0];
        echo "\nUsing template '" . $template['name'] . "' for song generation...\n";
        
        $songOptions = [
            'templateId' => $template['id'],
            'prompt' => 'An energetic track perfect for workout sessions',
            'style' => $template['style'],
            'duration' => $template['duration'],
            'includeVocals' => true
        ];
        
        $songFromTemplate = $jewelMusic->copilot->generateCompleteSong($songOptions);
        
        echo "✅ Song generated from template!\n";
        echo "Template-based Song ID: " . $songFromTemplate['id'] . "\n";
    }
    
    return $templates;
}

function advancedAIWorkflowExample($jewelMusic) {
    echo "\n🚀 Advanced AI Workflow Example\n";
    echo "===============================\n";
    
    // Step 1: Create song from text prompt
    echo "📝 Creating song from prompt...\n";
    $prompt = "A dreamy synthwave track about driving through a neon-lit city at night, feeling nostalgic and hopeful about the future";
    
    $songOptions = [
        'prompt' => $prompt,
        'style' => 'synthwave',
        'duration' => 240,
        'includeVocals' => false, // Instrumental
        'energy' => 'medium',
        'complexity' => 'high'
    ];
    
    $songFromPrompt = $jewelMusic->copilot->generateCompleteSong($songOptions);
    
    echo "✅ Song created from prompt!\n";
    echo "Song ID: " . $songFromPrompt['id'] . "\n";
    
    // Step 2: Generate variations using parallel processing
    echo "\n🔄 Creating variations...\n";
    
    // Use promises/async-like approach with curl_multi
    $variations = generateVariationsInParallel($jewelMusic, $songFromPrompt['id']);
    
    echo "✅ Created " . count($variations) . " variations\n";
    
    // Step 3: Add lyrics to the best variation
    $bestVariation = $variations['ambient']; // Pick the ambient version
    echo "\n📝 Adding lyrics to ambient variation...\n";
    
    $lyricsOptions = [
        'theme' => 'nostalgia and future dreams',
        'genre' => 'ambient',
        'language' => 'en',
        'mood' => 'reflective',
        'structure' => 'verse-chorus-verse-chorus-outro',
        'inspirationText' => $prompt
    ];
    
    $lyricsForVariation = $jewelMusic->copilot->generateLyrics($lyricsOptions);
    
    echo "✅ Lyrics generated for variation\n";
    
    // Step 4: Create final song with vocals
    echo "\n🎤 Creating final version with vocals...\n";
    
    $finalSongOptions = [
        'sourceId' => $bestVariation['id'],
        'lyricsId' => $lyricsForVariation['id'],
        'includeVocals' => true,
        'vocalStyle' => 'ethereal',
        'mixingStyle' => 'atmospheric',
        'masteringPreset' => 'streaming'
    ];
    
    $finalSong = $jewelMusic->copilot->generateCompleteSong($finalSongOptions);
    
    echo "✅ Final song with vocals created!\n";
    echo "Final song ID: " . $finalSong['id'] . "\n";
    if (isset($finalSong['downloadUrl'])) {
        echo "Download URL: " . $finalSong['downloadUrl'] . "\n";
    }
}

function generateVariationsInParallel($jewelMusic, $sourceId) {
    // PHP doesn't have native async/await, but we can simulate parallel requests
    // with curl_multi for better performance
    
    $variations = [];
    $styleOptions = [
        'ambient' => ['targetStyle' => 'ambient', 'intensity' => 0.5],
        'house' => ['targetStyle' => 'house', 'intensity' => 0.8],
        'orchestral' => ['targetStyle' => 'orchestral', 'intensity' => 0.6]
    ];
    
    // For this example, we'll do them sequentially but in a real implementation
    // you could use curl_multi_* functions for parallel requests
    foreach ($styleOptions as $styleName => $options) {
        $options['sourceId'] = $sourceId;
        $variations[$styleName] = $jewelMusic->copilot->applyStyleTransfer($options);
    }
    
    return $variations;
}

function printGenerationSummary($results) {
    echo "\n📋 Generation Summary\n";
    echo "====================\n";
    
    echo "Generated assets:\n";
    
    if (isset($results['melody'])) {
        $melody = $results['melody'];
        $previewUrl = isset($melody['previewUrl']) ? $melody['previewUrl'] : 'N/A';
        echo "- Melody: " . $melody['id'] . " (preview: " . $previewUrl . ")\n";
    }
    
    if (isset($results['harmony'])) {
        $harmony = $results['harmony'];
        $previewUrl = isset($harmony['previewUrl']) ? $harmony['previewUrl'] : 'N/A';
        echo "- Harmony: " . $harmony['id'] . " (preview: " . $previewUrl . ")\n";
    }
    
    if (isset($results['lyrics'])) {
        $lyrics = $results['lyrics'];
        echo "- Lyrics: " . $lyrics['id'] . "\n";
    }
    
    if (isset($results['song'])) {
        $song = $results['song'];
        $downloadUrl = isset($song['downloadUrl']) ? $song['downloadUrl'] : 'N/A';
        echo "- Complete song: " . $song['id'] . " (download: " . $downloadUrl . ")\n";
    }
    
    if (isset($results['styleVariation'])) {
        $styleVariation = $results['styleVariation'];
        $previewUrl = isset($styleVariation['previewUrl']) ? $styleVariation['previewUrl'] : 'N/A';
        echo "- Style variation: " . $styleVariation['id'] . " (preview: " . $previewUrl . ")\n";
    }
    
    if (isset($results['chordProgression'])) {
        $progression = $results['chordProgression'];
        echo "- Chord progression: " . $progression['id'] . " (" . 
             implode(' - ', $progression['progression']) . ")\n";
    }
    
    if (isset($results['templates'])) {
        $templates = $results['templates'];
        echo "- Available templates: " . count($templates) . " found\n";
    }
    
    echo "\n🎯 Next Steps:\n";
    echo "1. Download generated assets for further editing\n";
    echo "2. Use style transfer to create more variations\n";
    echo "3. Combine elements to create unique compositions\n";
    echo "4. Export final tracks for distribution\n";
}