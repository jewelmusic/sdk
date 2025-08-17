<?php

/**
 * Webhook Handler Example
 * 
 * This example demonstrates how to handle JewelMusic webhooks
 * in your PHP application.
 */

require_once __DIR__ . '/../vendor/autoload.php';

use JewelMusic\JewelMusic;
use JewelMusic\Resources\WebhooksResource;
use JewelMusic\Exceptions\ApiException;

// Webhook endpoint handler
function handleWebhook() {
    // Get webhook payload and signature
    $payload = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_JEWELMUSIC_SIGNATURE'] ?? '';
    
    // Your webhook secret (store this securely!)
    $webhookSecret = 'your-webhook-secret-here';
    
    // Verify webhook signature
    if (!WebhooksResource::verifySignature($payload, $signature, $webhookSecret)) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid signature']);
        exit;
    }
    
    try {
        // Parse webhook event
        $event = WebhooksResource::parseEvent($payload);
        
        echo "Received webhook event: " . $event['type'] . "\n";
        echo "Event ID: " . $event['id'] . "\n";
        echo "Timestamp: " . $event['timestamp'] . "\n\n";
        
        // Handle different event types
        switch ($event['type']) {
            case 'track.uploaded':
                handleTrackUploaded($event['data']);
                break;
                
            case 'analysis.completed':
                handleAnalysisCompleted($event['data']);
                break;
                
            case 'distribution.submitted':
                handleDistributionSubmitted($event['data']);
                break;
                
            case 'transcription.completed':
                handleTranscriptionCompleted($event['data']);
                break;
                
            case 'user.subscription.updated':
                handleSubscriptionUpdated($event['data']);
                break;
                
            default:
                echo "Unhandled event type: " . $event['type'] . "\n";
                break;
        }
        
        // Return success response
        http_response_code(200);
        echo json_encode(['status' => 'success']);
        
    } catch (Exception $e) {
        error_log("Webhook error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
    }
}

function handleTrackUploaded($data) {
    echo "Track uploaded successfully!\n";
    echo "Track ID: " . $data['track']['id'] . "\n";
    echo "Title: " . $data['track']['title'] . "\n";
    echo "Artist: " . $data['track']['artist'] . "\n";
    
    // You could trigger automatic analysis here
    // $jewelMusic = new JewelMusic('your-api-key');
    // $analysis = $jewelMusic->analysis->analyze($data['track']['id']);
}

function handleAnalysisCompleted($data) {
    echo "Analysis completed!\n";
    echo "Analysis ID: " . $data['analysis']['id'] . "\n";
    echo "Track ID: " . $data['analysis']['trackId'] . "\n";
    echo "Status: " . $data['analysis']['status'] . "\n";
    
    if ($data['analysis']['status'] === 'completed') {
        echo "Key: " . $data['analysis']['results']['key']['key'] . "\n";
        echo "BPM: " . $data['analysis']['results']['tempo']['bpm'] . "\n";
        echo "Genre: " . $data['analysis']['results']['genre']['primary'] . "\n";
        
        // Send notification to user, update database, etc.
        notifyUser($data['analysis']['userId'], 'Your track analysis is ready!');
    }
}

function handleDistributionSubmitted($data) {
    echo "Distribution submitted!\n";
    echo "Release ID: " . $data['release']['id'] . "\n";
    echo "Title: " . $data['release']['title'] . "\n";
    echo "Platforms: " . implode(', ', $data['release']['platforms']) . "\n";
    echo "Status: " . $data['release']['status'] . "\n";
    
    // Update your database, send notifications, etc.
    updateReleaseStatus($data['release']['id'], $data['release']['status']);
}

function handleTranscriptionCompleted($data) {
    echo "Transcription completed!\n";
    echo "Transcription ID: " . $data['transcription']['id'] . "\n";
    echo "Track ID: " . $data['transcription']['trackId'] . "\n";
    echo "Language: " . $data['transcription']['language'] . "\n";
    
    if (isset($data['transcription']['lyrics'])) {
        echo "Lyrics preview: " . substr($data['transcription']['lyrics'], 0, 100) . "...\n";
    }
    
    // Process completed transcription
    processCompletedTranscription($data['transcription']);
}

function handleSubscriptionUpdated($data) {
    echo "Subscription updated!\n";
    echo "User ID: " . $data['user']['id'] . "\n";
    echo "Old Plan: " . $data['subscription']['previousPlan'] . "\n";
    echo "New Plan: " . $data['subscription']['currentPlan'] . "\n";
    echo "Effective Date: " . $data['subscription']['effectiveDate'] . "\n";
    
    // Update user permissions, features, etc.
    updateUserSubscription($data['user']['id'], $data['subscription']);
}

// Helper functions (implement according to your needs)
function notifyUser($userId, $message) {
    // Send email, push notification, etc.
    echo "📧 Notifying user $userId: $message\n";
}

function updateReleaseStatus($releaseId, $status) {
    // Update database record
    echo "💾 Updating release $releaseId status to: $status\n";
}

function processCompletedTranscription($transcription) {
    // Process transcription results
    echo "🎵 Processing transcription: " . $transcription['id'] . "\n";
}

function updateUserSubscription($userId, $subscription) {
    // Update user's subscription in your system
    echo "👤 Updating user $userId subscription to: " . $subscription['currentPlan'] . "\n";
}

// Management functions for setting up webhooks
function setupWebhooks() {
    try {
        $jewelMusic = new JewelMusic('your-api-key-here');
        
        echo "=== Setting up JewelMusic Webhooks ===\n\n";
        
        // Create webhook endpoint
        $webhook = $jewelMusic->webhooks->create([
            'url' => 'https://your-domain.com/webhooks/jewelmusic',
            'events' => [
                'track.uploaded',
                'analysis.completed',
                'distribution.submitted',
                'transcription.completed',
                'user.subscription.updated'
            ],
            'secret' => 'your-webhook-secret-here',
            'active' => true,
            'description' => 'Main webhook endpoint for JewelMusic events'
        ]);
        
        echo "✓ Webhook created successfully!\n";
        echo "Webhook ID: " . $webhook['id'] . "\n";
        echo "URL: " . $webhook['url'] . "\n";
        echo "Events: " . implode(', ', $webhook['events']) . "\n\n";
        
        // Test the webhook
        echo "Testing webhook...\n";
        $testResult = $jewelMusic->webhooks->test($webhook['id']);
        echo "✓ Test result: " . $testResult['status'] . "\n\n";
        
        // List all webhooks
        $webhooks = $jewelMusic->webhooks->list();
        echo "Total webhooks configured: " . count($webhooks['items']) . "\n";
        
        foreach ($webhooks['items'] as $wh) {
            echo "- " . $wh['url'] . " (" . $wh['status'] . ")\n";
        }
        
    } catch (ApiException $e) {
        echo "❌ Error setting up webhooks: " . $e->getMessage() . "\n";
    }
}

// Example webhook verification for testing
function testWebhookVerification() {
    echo "=== Testing Webhook Signature Verification ===\n\n";
    
    $payload = json_encode(['test' => 'data', 'timestamp' => time()]);
    $secret = 'test-secret';
    
    // Create signature
    $signature = WebhooksResource::createSignature($payload, $secret);
    echo "Generated signature: $signature\n";
    
    // Verify signature
    $isValid = WebhooksResource::verifySignature($payload, $signature, $secret);
    echo "Verification result: " . ($isValid ? '✓ Valid' : '❌ Invalid') . "\n\n";
    
    // Test with wrong secret
    $isInvalid = WebhooksResource::verifySignature($payload, $signature, 'wrong-secret');
    echo "Wrong secret verification: " . ($isInvalid ? '❌ Should be invalid' : '✓ Correctly invalid') . "\n\n";
}

// Check if this is being called as a webhook endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SERVER['HTTP_JEWELMUSIC_SIGNATURE'])) {
    handleWebhook();
} else {
    // Run setup and testing examples
    echo "=== JewelMusic Webhook Example ===\n\n";
    
    echo "This script can be used in two ways:\n";
    echo "1. As a webhook endpoint (when receiving POST requests with JewelMusic signature)\n";
    echo "2. As a setup/testing script (when run directly)\n\n";
    
    testWebhookVerification();
    
    echo "To set up webhooks, uncomment the line below and add your API key:\n";
    echo "// setupWebhooks();\n\n";
    
    echo "To use as webhook endpoint, deploy this script to your server and configure\n";
    echo "the webhook URL in your JewelMusic dashboard.\n";
}