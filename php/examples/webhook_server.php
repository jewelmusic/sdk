<?php

/**
 * Complete Webhook Server Example for JewelMusic PHP SDK
 * 
 * This example demonstrates a comprehensive webhook server implementation:
 * - Signature verification and security
 * - Event handling and processing
 * - Error handling and logging
 * - Webhook management functions
 * - Real-time notifications
 */

require_once __DIR__ . '/../vendor/autoload.php';

use JewelMusic\JewelMusic;
use JewelMusic\Resources\WebhooksResource;
use JewelMusic\Exceptions\{
    ApiException,
    AuthenticationException,
    ValidationException
};

class JewelMusicWebhookServer {
    
    private $webhookSecret;
    private $logFile;
    private $jewelMusic;
    
    public function __construct($webhookSecret = null, $logFile = null) {
        $this->webhookSecret = $webhookSecret ?: ($_ENV['JEWELMUSIC_WEBHOOK_SECRET'] ?? getenv('JEWELMUSIC_WEBHOOK_SECRET'));
        $this->logFile = $logFile ?: __DIR__ . '/webhook.log';
        
        $apiKey = $_ENV['JEWELMUSIC_API_KEY'] ?? getenv('JEWELMUSIC_API_KEY');
        if ($apiKey) {
            $this->jewelMusic = new JewelMusic($apiKey);
        }
    }
    
    public function handleWebhook() {
        try {
            // Get webhook payload and signature
            $payload = file_get_contents('php://input');
            $signature = $_SERVER['HTTP_JEWELMUSIC_SIGNATURE'] ?? '';
            $eventId = $_SERVER['HTTP_JEWELMUSIC_EVENT_ID'] ?? uniqid();
            $timestamp = $_SERVER['HTTP_JEWELMUSIC_TIMESTAMP'] ?? time();
            
            $this->log("Received webhook event: $eventId");
            
            // Verify webhook signature
            if (!$this->verifySignature($payload, $signature)) {
                $this->log("Invalid signature for event: $eventId", 'ERROR');
                http_response_code(401);
                echo json_encode(['error' => 'Invalid signature']);
                return;
            }
            
            // Check timestamp to prevent replay attacks
            if (!$this->verifyTimestamp($timestamp)) {
                $this->log("Timestamp verification failed for event: $eventId", 'ERROR');
                http_response_code(400);
                echo json_encode(['error' => 'Invalid timestamp']);
                return;
            }
            
            // Parse webhook event
            $event = json_decode($payload, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->log("Invalid JSON payload for event: $eventId", 'ERROR');
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON']);
                return;
            }
            
            $this->log("Processing event: " . $event['type'] . " (ID: $eventId)");
            
            // Handle the event
            $result = $this->processEvent($event, $eventId);
            
            // Return success response
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'eventId' => $eventId,
                'result' => $result
            ]);
            
        } catch (Exception $e) {
            $this->log("Webhook error: " . $e->getMessage(), 'ERROR');
            error_log("JewelMusic Webhook Error: " . $e->getMessage());
            
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
    
    private function verifySignature($payload, $signature) {
        if (empty($this->webhookSecret)) {
            $this->log("No webhook secret configured", 'WARNING');
            return false;
        }
        
        return WebhooksResource::verifySignature($payload, $signature, $this->webhookSecret);
    }
    
    private function verifyTimestamp($timestamp) {
        // Allow 5 minutes tolerance
        $tolerance = 300;
        $currentTime = time();
        
        return abs($currentTime - $timestamp) <= $tolerance;
    }
    
    private function processEvent($event, $eventId) {
        $eventType = $event['type'] ?? 'unknown';
        $eventData = $event['data'] ?? [];
        
        switch ($eventType) {
            case 'track.uploaded':
                return $this->handleTrackUploaded($eventData, $eventId);
                
            case 'track.processed':
                return $this->handleTrackProcessed($eventData, $eventId);
                
            case 'analysis.started':
                return $this->handleAnalysisStarted($eventData, $eventId);
                
            case 'analysis.completed':
                return $this->handleAnalysisCompleted($eventData, $eventId);
                
            case 'analysis.failed':
                return $this->handleAnalysisFailed($eventData, $eventId);
                
            case 'transcription.started':
                return $this->handleTranscriptionStarted($eventData, $eventId);
                
            case 'transcription.completed':
                return $this->handleTranscriptionCompleted($eventData, $eventId);
                
            case 'copilot.generation.completed':
                return $this->handleAIGenerationCompleted($eventData, $eventId);
                
            case 'distribution.submitted':
                return $this->handleDistributionSubmitted($eventData, $eventId);
                
            case 'distribution.approved':
                return $this->handleDistributionApproved($eventData, $eventId);
                
            case 'distribution.rejected':
                return $this->handleDistributionRejected($eventData, $eventId);
                
            case 'distribution.live':
                return $this->handleDistributionLive($eventData, $eventId);
                
            case 'analytics.milestone':
                return $this->handleAnalyticsMilestone($eventData, $eventId);
                
            case 'user.subscription.updated':
                return $this->handleSubscriptionUpdated($eventData, $eventId);
                
            case 'user.quota.exceeded':
                return $this->handleQuotaExceeded($eventData, $eventId);
                
            case 'webhook.test':
                return $this->handleWebhookTest($eventData, $eventId);
                
            default:
                $this->log("Unhandled event type: $eventType", 'WARNING');
                return ['status' => 'ignored', 'reason' => 'unhandled_event_type'];
        }
    }
    
    private function handleTrackUploaded($data, $eventId) {
        $track = $data['track'] ?? [];
        
        $this->log("Track uploaded: {$track['id']} - {$track['title']} by {$track['artist']}");
        
        // Auto-trigger analysis for uploaded tracks
        if ($this->jewelMusic && isset($track['id'])) {
            try {
                $analysis = $this->jewelMusic->analysis->analyze($track['id'], [
                    'analysisTypes' => ['tempo', 'key', 'quality', 'mood'],
                    'priority' => 'high'
                ]);
                
                $this->log("Auto-triggered analysis: {$analysis['id']} for track: {$track['id']}");
            } catch (Exception $e) {
                $this->log("Failed to auto-trigger analysis: " . $e->getMessage(), 'ERROR');
            }
        }
        
        // Send notification
        $this->sendNotification($track['userId'] ?? null, [
            'type' => 'track_uploaded',
            'title' => 'Track Uploaded Successfully',
            'message' => "Your track '{$track['title']}' has been uploaded and is being processed.",
            'trackId' => $track['id']
        ]);
        
        return ['action' => 'notification_sent', 'analysis_triggered' => true];
    }
    
    private function handleTrackProcessed($data, $eventId) {
        $track = $data['track'] ?? [];
        
        $this->log("Track processed: {$track['id']} - Status: {$track['status']}");
        
        if ($track['status'] === 'ready') {
            // Track is ready for analysis and distribution
            $this->sendNotification($track['userId'] ?? null, [
                'type' => 'track_ready',
                'title' => 'Track Ready',
                'message' => "Your track '{$track['title']}' is ready for analysis and distribution.",
                'trackId' => $track['id']
            ]);
        }
        
        return ['action' => 'notification_sent'];
    }
    
    private function handleAnalysisCompleted($data, $eventId) {
        $analysis = $data['analysis'] ?? [];
        $track = $data['track'] ?? [];
        
        $this->log("Analysis completed: {$analysis['id']} for track: {$track['id']}");
        
        // Extract key insights
        $insights = [];
        if (isset($analysis['results'])) {
            $results = $analysis['results'];
            
            if (isset($results['tempo']['bpm'])) {
                $insights[] = "Tempo: " . round($results['tempo']['bpm'], 1) . " BPM";
            }
            
            if (isset($results['key'])) {
                $insights[] = "Key: {$results['key']['key']} {$results['key']['mode']}";
            }
            
            if (isset($results['quality']['overallScore'])) {
                $score = round($results['quality']['overallScore'] * 100, 1);
                $insights[] = "Quality: {$score}/100";
            }
            
            if (isset($results['mood']['primary'])) {
                $insights[] = "Mood: {$results['mood']['primary']}";
            }
        }
        
        $this->sendNotification($track['userId'] ?? null, [
            'type' => 'analysis_completed',
            'title' => 'Track Analysis Complete',
            'message' => "Analysis for '{$track['title']}' is complete. " . implode(', ', $insights),
            'trackId' => $track['id'],
            'analysisId' => $analysis['id']
        ]);
        
        return ['action' => 'notification_sent', 'insights_count' => count($insights)];
    }
    
    private function handleAnalysisFailed($data, $eventId) {
        $analysis = $data['analysis'] ?? [];
        $track = $data['track'] ?? [];
        $error = $data['error'] ?? [];
        
        $this->log("Analysis failed: {$analysis['id']} for track: {$track['id']} - Error: {$error['message']}", 'ERROR');
        
        $this->sendNotification($track['userId'] ?? null, [
            'type' => 'analysis_failed',
            'title' => 'Track Analysis Failed',
            'message' => "Analysis for '{$track['title']}' failed: {$error['message']}",
            'trackId' => $track['id'],
            'analysisId' => $analysis['id']
        ]);
        
        return ['action' => 'error_notification_sent'];
    }
    
    private function handleTranscriptionCompleted($data, $eventId) {
        $transcription = $data['transcription'] ?? [];
        $track = $data['track'] ?? [];
        
        $this->log("Transcription completed: {$transcription['id']} for track: {$track['id']}");
        
        $wordsCount = isset($transcription['text']) ? str_word_count($transcription['text']) : 0;
        $language = $transcription['language'] ?? 'unknown';
        $confidence = isset($transcription['confidence']) ? round($transcription['confidence'] * 100, 1) : 0;
        
        $this->sendNotification($track['userId'] ?? null, [
            'type' => 'transcription_completed',
            'title' => 'Transcription Complete',
            'message' => "Transcription for '{$track['title']}' is complete. {$wordsCount} words detected in {$language} (confidence: {$confidence}%)",
            'trackId' => $track['id'],
            'transcriptionId' => $transcription['id']
        ]);
        
        return ['action' => 'notification_sent', 'words_count' => $wordsCount];
    }
    
    private function handleAIGenerationCompleted($data, $eventId) {
        $generation = $data['generation'] ?? [];
        $type = $generation['type'] ?? 'unknown';
        
        $this->log("AI generation completed: {$generation['id']} - Type: {$type}");
        
        $this->sendNotification($generation['userId'] ?? null, [
            'type' => 'ai_generation_completed',
            'title' => 'AI Generation Complete',
            'message' => "Your {$type} generation is ready!",
            'generationId' => $generation['id']
        ]);
        
        return ['action' => 'notification_sent', 'generation_type' => $type];
    }
    
    private function handleDistributionSubmitted($data, $eventId) {
        $release = $data['release'] ?? [];
        $platforms = $release['platforms'] ?? [];
        
        $this->log("Distribution submitted: {$release['id']} to platforms: " . implode(', ', $platforms));
        
        $this->sendNotification($release['userId'] ?? null, [
            'type' => 'distribution_submitted',
            'title' => 'Release Submitted',
            'message' => "Your release '{$release['title']}' has been submitted to " . implode(', ', $platforms),
            'releaseId' => $release['id']
        ]);
        
        return ['action' => 'notification_sent', 'platforms_count' => count($platforms)];
    }
    
    private function handleDistributionApproved($data, $eventId) {
        $release = $data['release'] ?? [];
        $platform = $data['platform'] ?? [];
        
        $this->log("Distribution approved: {$release['id']} on {$platform['name']}");
        
        $this->sendNotification($release['userId'] ?? null, [
            'type' => 'distribution_approved',
            'title' => 'Release Approved',
            'message' => "Your release '{$release['title']}' has been approved on {$platform['name']}!",
            'releaseId' => $release['id'],
            'platform' => $platform['name']
        ]);
        
        return ['action' => 'notification_sent', 'platform' => $platform['name']];
    }
    
    private function handleDistributionLive($data, $eventId) {
        $release = $data['release'] ?? [];
        $platform = $data['platform'] ?? [];
        $liveUrl = $data['liveUrl'] ?? null;
        
        $this->log("Distribution live: {$release['id']} on {$platform['name']} - URL: {$liveUrl}");
        
        $message = "Your release '{$release['title']}' is now live on {$platform['name']}!";
        if ($liveUrl) {
            $message .= " Listen here: {$liveUrl}";
        }
        
        $this->sendNotification($release['userId'] ?? null, [
            'type' => 'distribution_live',
            'title' => 'Release is Live!',
            'message' => $message,
            'releaseId' => $release['id'],
            'platform' => $platform['name'],
            'liveUrl' => $liveUrl
        ]);
        
        return ['action' => 'notification_sent', 'platform' => $platform['name']];
    }
    
    private function handleAnalyticsMilestone($data, $eventId) {
        $milestone = $data['milestone'] ?? [];
        $track = $data['track'] ?? [];
        
        $this->log("Analytics milestone: {$milestone['type']} for track: {$track['id']} - Value: {$milestone['value']}");
        
        $this->sendNotification($track['userId'] ?? null, [
            'type' => 'analytics_milestone',
            'title' => 'Milestone Reached!',
            'message' => "Your track '{$track['title']}' reached {$milestone['value']} {$milestone['type']}!",
            'trackId' => $track['id'],
            'milestone' => $milestone
        ]);
        
        return ['action' => 'notification_sent', 'milestone_type' => $milestone['type']];
    }
    
    private function handleSubscriptionUpdated($data, $eventId) {
        $user = $data['user'] ?? [];
        $subscription = $data['subscription'] ?? [];
        
        $this->log("Subscription updated: User {$user['id']} - {$subscription['previousPlan']} → {$subscription['currentPlan']}");
        
        $this->sendNotification($user['id'], [
            'type' => 'subscription_updated',
            'title' => 'Subscription Updated',
            'message' => "Your plan has been updated from {$subscription['previousPlan']} to {$subscription['currentPlan']}",
            'subscription' => $subscription
        ]);
        
        return ['action' => 'notification_sent', 'new_plan' => $subscription['currentPlan']];
    }
    
    private function handleQuotaExceeded($data, $eventId) {
        $user = $data['user'] ?? [];
        $quota = $data['quota'] ?? [];
        
        $this->log("Quota exceeded: User {$user['id']} - {$quota['type']}: {$quota['used']}/{$quota['limit']}", 'WARNING');
        
        $this->sendNotification($user['id'], [
            'type' => 'quota_exceeded',
            'title' => 'Usage Limit Reached',
            'message' => "You've reached your {$quota['type']} limit ({$quota['used']}/{$quota['limit']}). Consider upgrading your plan.",
            'quota' => $quota
        ]);
        
        return ['action' => 'quota_warning_sent', 'quota_type' => $quota['type']];
    }
    
    private function handleWebhookTest($data, $eventId) {
        $this->log("Webhook test received: {$eventId}");
        
        return ['action' => 'test_successful', 'timestamp' => time()];
    }
    
    private function sendNotification($userId, $notification) {
        if (!$userId) {
            $this->log("No user ID provided for notification", 'WARNING');
            return;
        }
        
        // Here you would implement your notification system
        // Examples: email, push notifications, database updates, etc.
        
        $this->log("Notification sent to user {$userId}: {$notification['type']} - {$notification['title']}");
        
        // Example implementations:
        // $this->sendEmail($userId, $notification);
        // $this->sendPushNotification($userId, $notification);
        // $this->updateDatabase($userId, $notification);
    }
    
    private function log($message, $level = 'INFO') {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[{$timestamp}] [{$level}] {$message}\n";
        
        file_put_contents($this->logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        // Also output to console if running in CLI
        if (php_sapi_name() === 'cli') {
            echo $logEntry;
        }
    }
}

// Webhook management functions
class JewelMusicWebhookManager {
    
    private $jewelMusic;
    
    public function __construct($apiKey = null) {
        $apiKey = $apiKey ?: ($_ENV['JEWELMUSIC_API_KEY'] ?? getenv('JEWELMUSIC_API_KEY'));
        
        if (!$apiKey) {
            throw new Exception("JEWELMUSIC_API_KEY is required");
        }
        
        $this->jewelMusic = new JewelMusic($apiKey);
    }
    
    public function setupWebhooks($webhookUrl, $webhookSecret) {
        echo "🔧 Setting up JewelMusic Webhooks\n";
        echo "================================\n\n";
        
        try {
            // Create main webhook endpoint
            $webhook = $this->jewelMusic->webhooks->create([
                'url' => $webhookUrl,
                'events' => [
                    'track.uploaded',
                    'track.processed',
                    'analysis.started',
                    'analysis.completed',
                    'analysis.failed',
                    'transcription.started',
                    'transcription.completed',
                    'copilot.generation.completed',
                    'distribution.submitted',
                    'distribution.approved',
                    'distribution.rejected',
                    'distribution.live',
                    'analytics.milestone',
                    'user.subscription.updated',
                    'user.quota.exceeded'
                ],
                'secret' => $webhookSecret,
                'active' => true,
                'description' => 'Main webhook endpoint for all JewelMusic events'
            ]);
            
            echo "✅ Webhook created successfully!\n";
            echo "Webhook ID: {$webhook['id']}\n";
            echo "URL: {$webhook['url']}\n";
            echo "Events: " . implode(', ', $webhook['events']) . "\n\n";
            
            // Test the webhook
            echo "🧪 Testing webhook...\n";
            $testResult = $this->jewelMusic->webhooks->test($webhook['id']);
            echo "✅ Test result: {$testResult['status']}\n";
            
            if (isset($testResult['responseTime'])) {
                echo "Response time: {$testResult['responseTime']}ms\n";
            }
            
            echo "\n";
            
            return $webhook;
            
        } catch (ApiException $e) {
            echo "❌ Error setting up webhooks: " . $e->getMessage() . "\n";
            throw $e;
        }
    }
    
    public function listWebhooks() {
        echo "📋 Listing configured webhooks\n";
        echo "=============================\n\n";
        
        try {
            $webhooks = $this->jewelMusic->webhooks->list();
            
            echo "Total webhooks: " . count($webhooks['items']) . "\n\n";
            
            foreach ($webhooks['items'] as $i => $webhook) {
                echo ($i + 1) . ". {$webhook['url']}\n";
                echo "   ID: {$webhook['id']}\n";
                echo "   Status: {$webhook['status']}\n";
                echo "   Events: " . implode(', ', $webhook['events']) . "\n";
                echo "   Created: {$webhook['createdAt']}\n\n";
            }
            
        } catch (ApiException $e) {
            echo "❌ Error listing webhooks: " . $e->getMessage() . "\n";
            throw $e;
        }
    }
}

// Main execution
if (php_sapi_name() === 'cli') {
    // CLI mode - setup and management
    echo "🎵 JewelMusic PHP SDK - Webhook Server Example\n";
    echo "==============================================\n\n";
    
    echo "This script provides webhook server functionality:\n";
    echo "1. Webhook endpoint handler with signature verification\n";
    echo "2. Comprehensive event processing\n";
    echo "3. Webhook management and setup\n\n";
    
    $command = $argv[1] ?? 'help';
    
    switch ($command) {
        case 'setup':
            $webhookUrl = $argv[2] ?? 'https://your-domain.com/webhook';
            $webhookSecret = $argv[3] ?? 'your-webhook-secret';
            
            $manager = new JewelMusicWebhookManager();
            $manager->setupWebhooks($webhookUrl, $webhookSecret);
            break;
            
        case 'list':
            $manager = new JewelMusicWebhookManager();
            $manager->listWebhooks();
            break;
            
        case 'test':
            echo "🧪 Testing webhook server...\n\n";
            
            // Simulate webhook request
            $_SERVER['REQUEST_METHOD'] = 'POST';
            $_SERVER['HTTP_JEWELMUSIC_SIGNATURE'] = 'sha256=test-signature';
            $_SERVER['HTTP_JEWELMUSIC_EVENT_ID'] = 'test-event-123';
            $_SERVER['HTTP_JEWELMUSIC_TIMESTAMP'] = time();
            
            $server = new JewelMusicWebhookServer('test-secret');
            echo "Webhook server initialized.\n";
            echo "In production, this would handle incoming POST requests.\n";
            break;
            
        default:
            echo "Usage:\n";
            echo "  php webhook_server.php setup <webhook_url> <webhook_secret>\n";
            echo "  php webhook_server.php list\n";
            echo "  php webhook_server.php test\n\n";
            echo "For production use, deploy this script as a web endpoint.\n";
            break;
    }
    
} else {
    // Web mode - handle incoming webhooks
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SERVER['HTTP_JEWELMUSIC_SIGNATURE'])) {
        $server = new JewelMusicWebhookServer();
        $server->handleWebhook();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}