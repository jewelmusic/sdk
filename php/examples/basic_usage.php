<?php

/**
 * Basic Usage Example for JewelMusic PHP SDK
 * 
 * This example demonstrates basic functionality:
 * - Client initialization and authentication
 * - Track upload and management
 * - Music analysis
 * - User profile management
 * - Error handling
 */

require_once __DIR__ . '/../vendor/autoload.php';

use JewelMusic\JewelMusic;
use JewelMusic\Exceptions\{
    ApiException,
    AuthenticationException,
    ValidationException,
    NotFoundException,
    RateLimitException
};

try {
    // Initialize with environment variable
    $apiKey = $_ENV['JEWELMUSIC_API_KEY'] ?? getenv('JEWELMUSIC_API_KEY');
    
    if (empty($apiKey)) {
        echo "❌ JEWELMUSIC_API_KEY environment variable not set\n";
        echo "Please set your API key: export JEWELMUSIC_API_KEY=your_key_here\n";
        exit(1);
    }
    
    echo "🎵 JewelMusic PHP SDK - Basic Usage Example\n";
    echo "==========================================\n\n";
    echo "🔑 Using API key: " . substr($apiKey, 0, 12) . "...\n\n";
    
    // Initialize the SDK
    $jewelMusic = new JewelMusic($apiKey, [
        'timeout' => 30,
        'retries' => 3,
        'userAgent' => 'PHPSDKExample/1.0'
    ]);
    
    // Test connection and get user profile
    testConnection($jewelMusic);
    
    // Upload and manage tracks
    $track = uploadAndManageTrack($jewelMusic);
    
    // Analyze track
    analyzeTrack($jewelMusic, $track['id']);
    
    // List and search tracks
    listAndSearchTracks($jewelMusic);
    
    // Demonstrate error handling
    demonstrateErrorHandling($jewelMusic);
    
    echo "\n✨ Basic usage examples completed successfully!\n";
    
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

function testConnection($jewelMusic) {
    echo "👤 Testing connection and getting user profile...\n";
    echo "-----------------------------------------------\n";
    
    try {
        $profile = $jewelMusic->user->getProfile();
        echo "✅ Connected! User: " . $profile['name'] . "\n";
        echo "Email: " . $profile['email'] . "\n";
        echo "Plan: " . $profile['subscription']['plan'] . "\n";
        echo "API Calls Used: " . $profile['usage']['apiCalls'] . " / " . $profile['usage']['limits']['apiCalls'] . "\n\n";
        
    } catch (Exception $e) {
        echo "❌ Connection test failed: " . $e->getMessage() . "\n";
        throw $e;
    }
}

function uploadAndManageTrack($jewelMusic) {
    echo "📤 Track upload and management...\n";
    echo "--------------------------------\n";
    
    try {
        $sampleFile = 'sample-audio.mp3';
        
        if (file_exists($sampleFile)) {
            echo "📁 Found sample audio file, uploading...\n";
            
            // Upload track with metadata
            $metadata = [
                'title' => 'PHP SDK Demo Track',
                'artist' => 'SDK Demo Artist',
                'album' => 'Demo Album',
                'genre' => 'Electronic',
                'releaseDate' => '2025-09-01',
                'explicit' => false,
                'tags' => ['demo', 'sdk', 'electronic']
            ];
            
            // Upload with progress callback
            $track = $jewelMusic->tracks->upload(
                $sampleFile,
                'sample-audio.mp3',
                $metadata,
                function($bytesUploaded, $totalBytes) {
                    $percent = round(($bytesUploaded / $totalBytes) * 100, 1);
                    echo "Upload progress: {$percent}%\r";
                }
            );
            
            echo "\n✅ Track uploaded successfully!\n";
            echo "Track ID: " . $track['id'] . "\n";
            echo "Title: " . $track['title'] . "\n";
            echo "Artist: " . $track['artist'] . "\n";
            echo "Duration: " . $track['duration'] . " seconds\n";
            echo "Status: " . $track['status'] . "\n";
            
            // Wait for processing
            echo "\n⏳ Waiting for track processing...\n";
            $processedTrack = waitForProcessing($jewelMusic, $track);
            echo "✅ Track processed: " . $processedTrack['status'] . "\n\n";
            
            return $processedTrack;
            
        } else {
            echo "⚠️  No sample audio file found, using existing track...\n";
            
            // Get existing tracks
            $tracksResponse = $jewelMusic->tracks->list(1, 1);
            $tracks = $tracksResponse['items'];
            
            if (empty($tracks)) {
                throw new Exception("No tracks available. Please upload a track first or add sample-audio.mp3");
            }
            
            $track = $tracks[0];
            echo "✅ Using existing track: " . $track['title'] . "\n\n";
            
            return $track;
        }
        
    } catch (Exception $e) {
        echo "❌ Track upload/management failed: " . $e->getMessage() . "\n";
        throw $e;
    }
}

function analyzeTrack($jewelMusic, $trackId) {
    echo "🔍 Analyzing track...\n";
    echo "--------------------\n";
    
    try {
        // Comprehensive analysis
        $analysisOptions = [
            'analysisTypes' => ['tempo', 'key', 'structure', 'quality', 'loudness', 'mood'],
            'detailedReport' => true,
            'culturalContext' => 'global',
            'targetPlatforms' => ['spotify', 'apple-music', 'youtube-music']
        ];
        
        $analysis = $jewelMusic->analysis->analyzeWithOptions($trackId, $analysisOptions);
        
        echo "✅ Analysis completed!\n";
        echo "📊 Results:\n";
        
        // Tempo analysis
        if (isset($analysis['tempo'])) {
            echo "   Tempo: " . round($analysis['tempo']['bpm'], 1) . " BPM " .
                 "(confidence: " . round($analysis['tempo']['confidence'] * 100, 1) . "%)\n";
        }
        
        // Key analysis
        if (isset($analysis['key'])) {
            echo "   Key: " . $analysis['key']['key'] . " " . $analysis['key']['mode'] . 
                 " (confidence: " . round($analysis['key']['confidence'] * 100, 1) . "%)\n";
        }
        
        // Quality assessment
        if (isset($analysis['quality'])) {
            echo "   Quality Score: " . round($analysis['quality']['overallScore'] * 100, 1) . "/100\n";
        }
        
        // Loudness analysis
        if (isset($analysis['loudness'])) {
            echo "   Loudness: " . round($analysis['loudness']['lufs'], 1) . " LUFS\n";
        }
        
        // Mood analysis
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
        
        echo "\n";
        
    } catch (Exception $e) {
        echo "❌ Track analysis failed: " . $e->getMessage() . "\n";
        // Don't throw here, analysis failure shouldn't stop the example
    }
}

function listAndSearchTracks($jewelMusic) {
    echo "📋 Listing and searching tracks...\n";
    echo "---------------------------------\n";
    
    try {
        // List tracks with pagination
        $response = $jewelMusic->tracks->list(1, 5);
        $tracks = $response['items'];
        $pagination = $response['pagination'];
        
        echo "📁 Found " . $pagination['total'] . " tracks (showing " . count($tracks) . "):\n";
        
        foreach ($tracks as $i => $track) {
            echo ($i + 1) . ". " . $track['title'] . " by " . $track['artist'] . 
                 " (" . $track['duration'] . "s)\n";
        }
        
        // Search for tracks
        if (!empty($tracks)) {
            $searchQuery = 'demo';
            echo "\n🔍 Searching for tracks with query: '$searchQuery'\n";
            
            $searchResults = $jewelMusic->tracks->search($searchQuery, [
                'limit' => 10,
                'filters' => [
                    'genre' => 'Electronic',
                    'duration' => ['min' => 30]
                ]
            ]);
            
            $foundTracks = $searchResults['items'];
            echo "✅ Found " . count($foundTracks) . " tracks matching '$searchQuery'\n";
            
            if (!empty($foundTracks)) {
                echo "Top results:\n";
                foreach (array_slice($foundTracks, 0, 3) as $i => $track) {
                    echo "   " . ($i + 1) . ". " . $track['title'] . " by " . $track['artist'] . "\n";
                }
            }
        }
        
        echo "\n";
        
    } catch (Exception $e) {
        echo "❌ Track listing/searching failed: " . $e->getMessage() . "\n";
    }
}

function demonstrateErrorHandling($jewelMusic) {
    echo "🛡️  Error Handling Demonstration\n";
    echo "--------------------------------\n";
    
    // Test with invalid track ID
    try {
        echo "Testing with invalid track ID...\n";
        $track = $jewelMusic->tracks->get('invalid-track-id');
        
    } catch (AuthenticationException $e) {
        echo "✅ Caught AuthenticationException: " . $e->getMessage() . "\n";
        echo "   Request ID: " . $e->getRequestId() . "\n";
        echo "   Status Code: " . $e->getHttpStatusCode() . "\n";
        
    } catch (ValidationException $e) {
        echo "✅ Caught ValidationException: " . $e->getMessage() . "\n";
        echo "   Field errors: " . json_encode($e->getFieldErrors()) . "\n";
        
    } catch (NotFoundException $e) {
        echo "✅ Caught NotFoundException: " . $e->getMessage() . "\n";
        
    } catch (RateLimitException $e) {
        echo "✅ Caught RateLimitException: " . $e->getMessage() . "\n";
        echo "   Retry after: " . $e->getRetryAfterSeconds() . " seconds\n";
        
    } catch (ApiException $e) {
        echo "✅ Caught ApiException: " . $e->getMessage() . "\n";
        echo "   Status code: " . $e->getHttpStatusCode() . "\n";
        
    } catch (Exception $e) {
        echo "❌ Unexpected exception: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
}

function advancedConfiguration() {
    echo "⚙️  Advanced Configuration Example\n";
    echo "---------------------------------\n";
    
    $apiKey = $_ENV['JEWELMUSIC_API_KEY'] ?? getenv('JEWELMUSIC_API_KEY');
    
    // Advanced client configuration
    $jewelMusic = new JewelMusic($apiKey, [
        'baseUrl' => 'https://api.jewelmusic.art',
        'timeout' => 30,
        'retries' => 5,
        'userAgent' => 'PHPSDKExample/1.0',
        'headers' => [
            'X-Custom-Header' => 'MyApp-1.0'
        ],
        'rateLimitRetry' => true,
        'debug' => false
    ]);
    
    try {
        // Test the advanced client
        $profile = $jewelMusic->user->getProfile();
        echo "✅ Advanced client connected! User: " . $profile['name'] . "\n";
        
    } catch (Exception $e) {
        echo "❌ Advanced client test failed: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
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

function fileUploadDemo($jewelMusic) {
    echo "📤 File Upload Demonstration\n";
    echo "----------------------------\n";
    
    try {
        // Upload from file path
        $audioFile = 'demo-track.mp3';
        if (file_exists($audioFile)) {
            echo "📁 Uploading from file...\n";
            
            $track = $jewelMusic->tracks->upload($audioFile, 'demo-track.mp3');
            echo "✅ File uploaded: " . $track['id'] . "\n";
        }
        
        // Upload with metadata and custom options
        $metadata = [
            'title' => 'PHP Upload Demo',
            'artist' => 'PHP Developer',
            'genre' => 'Demo'
        ];
        
        $options = [
            'chunkSize' => 1024 * 1024, // 1MB chunks
            'timeout' => 120, // 2 minutes timeout
            'retries' => 3
        ];
        
        if (file_exists($audioFile)) {
            $trackWithMeta = $jewelMusic->tracks->upload(
                $audioFile, 
                'demo-track.mp3', 
                $metadata, 
                null, // progress callback
                $options
            );
            echo "✅ File with metadata uploaded: " . $trackWithMeta['id'] . "\n";
        }
        
    } catch (Exception $e) {
        echo "⚠️  File upload demo skipped: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
}