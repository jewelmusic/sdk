package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/jewelmusic/sdk/go/jewelmusic"
)

const (
	defaultPort = 8080
	webhookPath = "/webhooks/jewelmusic"
)

func main() {
	fmt.Println("🔗 JewelMusic Go SDK - Webhook Server Example")
	fmt.Println("============================================")

	// Check for API key
	apiKey := os.Getenv("JEWELMUSIC_API_KEY")
	if apiKey == "" {
		log.Fatal("❌ JEWELMUSIC_API_KEY environment variable not set")
	}

	// Get port from environment or use default
	port := defaultPort
	if portStr := os.Getenv("PORT"); portStr != "" {
		if p, err := strconv.Atoi(portStr); err == nil {
			port = p
		}
	}

	fmt.Printf("🔑 Using API key: %s...\n", apiKey[:12])
	fmt.Printf("🌐 Starting webhook server on port %d\n", port)

	// Initialize the client
	client := jewelmusic.NewClient(apiKey)
	ctx := context.Background()

	// Setup webhook server
	server := &WebhookServer{
		client: client,
		port:   port,
		secret: generateWebhookSecret(),
	}

	// Create webhook endpoint
	if err := server.setupWebhook(ctx); err != nil {
		log.Printf("⚠️  Failed to setup webhook: %v\n", err)
		fmt.Println("Continuing with server anyway for demonstration...")
	}

	// Start the server
	if err := server.start(); err != nil {
		log.Fatalf("💥 Failed to start server: %v", err)
	}
}

type WebhookServer struct {
	client *jewelmusic.Client
	port   int
	secret string
	server *http.Server
}

func (ws *WebhookServer) setupWebhook(ctx context.Context) error {
	fmt.Println("\n🔧 Setting up webhook endpoint...")

	// In a real scenario, you'd use your actual server URL
	webhookURL := fmt.Sprintf("http://localhost:%d%s", ws.port, webhookPath)
	
	webhook, err := ws.client.Webhooks.Create(ctx, &jewelmusic.Webhook{
		URL: webhookURL,
		Events: []string{
			"track.uploaded",
			"track.processed",
			"analysis.completed",
			"transcription.completed",
			"distribution.live",
			"copilot.generation_completed",
		},
		Secret: ws.secret,
	})
	if err != nil {
		return err
	}

	fmt.Printf("✅ Webhook created successfully!\n")
	fmt.Printf("Webhook ID: %s\n", webhook.ID)
	fmt.Printf("URL: %s\n", webhook.URL)
	fmt.Printf("Events: %v\n", webhook.Events)
	fmt.Printf("Secret: %s...\n", ws.secret[:8])

	return nil
}

func (ws *WebhookServer) start() error {
	// Setup HTTP routes
	mux := http.NewServeMux()
	mux.HandleFunc("/", ws.handleRoot)
	mux.HandleFunc("/health", ws.handleHealth)
	mux.HandleFunc(webhookPath, ws.handleWebhook)

	// Create server
	ws.server = &http.Server{
		Addr:         fmt.Sprintf(":%d", ws.port),
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		fmt.Printf("\n🚀 Webhook server listening on http://localhost:%d\n", ws.port)
		fmt.Printf("📍 Webhook endpoint: http://localhost:%d%s\n", ws.port, webhookPath)
		fmt.Printf("🏥 Health check: http://localhost:%d/health\n", ws.port)
		fmt.Println("\nPress Ctrl+C to stop the server")

		if err := ws.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("💥 Server error: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown
	return ws.waitForShutdown()
}

func (ws *WebhookServer) waitForShutdown() error {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("\n🛑 Shutting down webhook server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := ws.server.Shutdown(ctx); err != nil {
		return fmt.Errorf("server forced to shutdown: %w", err)
	}

	fmt.Println("✅ Webhook server stopped gracefully")
	return nil
}

func (ws *WebhookServer) handleRoot(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	html := `
<!DOCTYPE html>
<html>
<head>
    <title>JewelMusic Webhook Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { color: #333; }
        .endpoint { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        .status { color: #28a745; }
    </style>
</head>
<body>
    <h1 class="header">🎵 JewelMusic Webhook Server</h1>
    <p class="status">✅ Server is running and ready to receive webhooks</p>
    
    <h2>Endpoints:</h2>
    <div class="endpoint">
        <strong>Webhook:</strong> <code>POST %s</code><br>
        <strong>Health Check:</strong> <code>GET /health</code>
    </div>

    <h2>Configuration:</h2>
    <ul>
        <li><strong>Port:</strong> %d</li>
        <li><strong>Secret:</strong> %s... (truncated)</li>
    </ul>

    <h2>Supported Events:</h2>
    <ul>
        <li>track.uploaded</li>
        <li>track.processed</li>
        <li>analysis.completed</li>
        <li>transcription.completed</li>
        <li>distribution.live</li>
        <li>copilot.generation_completed</li>
    </ul>
</body>
</html>`

	w.Header().Set("Content-Type", "text/html")
	fmt.Fprintf(w, html, webhookPath, ws.port, ws.secret[:8])
}

func (ws *WebhookServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"service":   "jewelmusic-webhook-server",
		"version":   "1.0.0",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"status":"%s","timestamp":"%s","service":"%s","version":"%s"}`, 
		response["status"], response["timestamp"], response["service"], response["version"])
}

func (ws *WebhookServer) handleWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("❌ Failed to read request body: %v", err)
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Get the signature from headers
	signature := r.Header.Get("X-JewelMusic-Signature")
	if signature == "" {
		log.Println("❌ Missing webhook signature")
		http.Error(w, "Missing webhook signature", http.StatusBadRequest)
		return
	}

	// Verify webhook signature
	if !jewelmusic.VerifyWebhookSignature(body, signature, ws.secret) {
		log.Println("❌ Invalid webhook signature")
		http.Error(w, "Invalid webhook signature", http.StatusUnauthorized)
		return
	}

	// Parse webhook event
	event, err := jewelmusic.ParseWebhookEvent(body)
	if err != nil {
		log.Printf("❌ Failed to parse webhook event: %v", err)
		http.Error(w, "Failed to parse webhook event", http.StatusBadRequest)
		return
	}

	// Process the webhook event
	if err := ws.processWebhookEvent(event); err != nil {
		log.Printf("❌ Failed to process webhook event: %v", err)
		http.Error(w, "Failed to process webhook event", http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"received": true, "event_type": "%s", "event_id": "%s"}`, 
		event.Type, event.ID)
}

func (ws *WebhookServer) processWebhookEvent(event *jewelmusic.WebhookEvent) error {
	timestamp := time.Now().Format("15:04:05")
	
	fmt.Printf("\n[%s] 📨 Received webhook event: %s\n", timestamp, event.Type)
	fmt.Printf("         Event ID: %s\n", event.ID)
	fmt.Printf("         Timestamp: %s\n", event.Timestamp.Format(time.RFC3339))

	// Handle different event types
	switch event.Type {
	case "track.uploaded":
		return ws.handleTrackUploaded(event)
	case "track.processed":
		return ws.handleTrackProcessed(event)
	case "analysis.completed":
		return ws.handleAnalysisCompleted(event)
	case "transcription.completed":
		return ws.handleTranscriptionCompleted(event)
	case "distribution.live":
		return ws.handleDistributionLive(event)
	case "copilot.generation_completed":
		return ws.handleCopilotGenerationCompleted(event)
	default:
		fmt.Printf("         ⚠️  Unknown event type: %s\n", event.Type)
		return nil
	}
}

func (ws *WebhookServer) handleTrackUploaded(event *jewelmusic.WebhookEvent) error {
	track, ok := event.Data["track"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid track data in webhook")
	}

	fmt.Printf("         🎵 Track uploaded: '%s' by %s\n", 
		track["title"], track["artist"])
	fmt.Printf("         📁 Track ID: %s\n", track["id"])
	fmt.Printf("         ⏱️  Duration: %.0fs\n", track["duration"])

	return nil
}

func (ws *WebhookServer) handleTrackProcessed(event *jewelmusic.WebhookEvent) error {
	track, ok := event.Data["track"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid track data in webhook")
	}

	fmt.Printf("         ✅ Track processed: '%s'\n", track["title"])
	fmt.Printf("         📁 Track ID: %s\n", track["id"])
	fmt.Printf("         📊 Status: %s\n", track["status"])

	return nil
}

func (ws *WebhookServer) handleAnalysisCompleted(event *jewelmusic.WebhookEvent) error {
	analysis, ok := event.Data["analysis"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid analysis data in webhook")
	}

	fmt.Printf("         🔍 Analysis completed: %s\n", analysis["id"])
	
	if trackID, exists := analysis["track_id"]; exists {
		fmt.Printf("         🎵 Track ID: %s\n", trackID)
	}
	
	if tempo, exists := analysis["tempo"]; exists {
		if tempoMap, ok := tempo.(map[string]interface{}); ok {
			if bpm, exists := tempoMap["bpm"]; exists {
				fmt.Printf("         🥁 Tempo: %.1f BPM\n", bpm)
			}
		}
	}
	
	if key, exists := analysis["key"]; exists {
		if keyMap, ok := key.(map[string]interface{}); ok {
			if keyName, exists := keyMap["key"]; exists {
				if mode, exists := keyMap["mode"]; exists {
					fmt.Printf("         🎹 Key: %s %s\n", keyName, mode)
				}
			}
		}
	}

	return nil
}

func (ws *WebhookServer) handleTranscriptionCompleted(event *jewelmusic.WebhookEvent) error {
	transcription, ok := event.Data["transcription"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid transcription data in webhook")
	}

	fmt.Printf("         📝 Transcription completed: %s\n", transcription["id"])
	
	if trackID, exists := transcription["track_id"]; exists {
		fmt.Printf("         🎵 Track ID: %s\n", trackID)
	}
	
	if language, exists := transcription["language"]; exists {
		fmt.Printf("         🌐 Language: %s\n", language)
	}
	
	if text, exists := transcription["text"]; exists {
		if textStr, ok := text.(string); ok {
			preview := textStr
			if len(preview) > 100 {
				preview = preview[:100] + "..."
			}
			fmt.Printf("         📄 Text preview: %s\n", preview)
		}
	}

	return nil
}

func (ws *WebhookServer) handleDistributionLive(event *jewelmusic.WebhookEvent) error {
	release, ok := event.Data["release"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid release data in webhook")
	}

	fmt.Printf("         🚀 Release is now live: '%s'\n", release["title"])
	fmt.Printf("         📁 Release ID: %s\n", release["id"])
	fmt.Printf("         🎤 Artist: %s\n", release["artist"])
	
	if platforms, exists := release["platforms"]; exists {
		if platformList, ok := platforms.([]interface{}); ok {
			fmt.Printf("         📱 Platforms: ")
			for i, platform := range platformList {
				if i > 0 {
					fmt.Printf(", ")
				}
				fmt.Printf("%s", platform)
			}
			fmt.Println()
		}
	}

	return nil
}

func (ws *WebhookServer) handleCopilotGenerationCompleted(event *jewelmusic.WebhookEvent) error {
	generation, ok := event.Data["generation"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid generation data in webhook")
	}

	fmt.Printf("         🤖 AI generation completed: %s\n", generation["id"])
	
	if genType, exists := generation["type"]; exists {
		fmt.Printf("         🎯 Type: %s\n", genType)
	}
	
	if title, exists := generation["title"]; exists {
		fmt.Printf("         📝 Title: %s\n", title)
	}
	
	if style, exists := generation["style"]; exists {
		fmt.Printf("         🎨 Style: %s\n", style)
	}

	return nil
}

// generateWebhookSecret generates a secure random secret for webhook verification
func generateWebhookSecret() string {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		// Fallback to a default secret if random generation fails
		return "default_webhook_secret_change_in_production"
	}
	return hex.EncodeToString(bytes)
}

// Example of how to use the webhook server programmatically
func exampleProgrammaticUsage() {
	client := jewelmusic.NewClient(os.Getenv("JEWELMUSIC_API_KEY"))
	ctx := context.Background()

	// List existing webhooks
	webhooks, err := client.Webhooks.List(ctx)
	if err != nil {
		log.Printf("Failed to list webhooks: %v", err)
		return
	}

	fmt.Printf("Found %d existing webhooks:\n", len(webhooks.Items))
	for _, webhook := range webhooks.Items {
		fmt.Printf("- %s: %s\n", webhook.ID, webhook.URL)
	}

	// Test a webhook
	if len(webhooks.Items) > 0 {
		webhook := webhooks.Items[0]
		err := client.Webhooks.Test(ctx, webhook.ID)
		if err != nil {
			log.Printf("Failed to test webhook: %v", err)
		} else {
			fmt.Printf("✅ Webhook test sent to %s\n", webhook.URL)
		}
	}
}