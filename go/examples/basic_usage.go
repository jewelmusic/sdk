package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jewelmusic/sdk/go/jewelmusic"
)

func main() {
	fmt.Println("🎵 JewelMusic Go SDK - Basic Usage Example")
	fmt.Println("========================================")

	// Check for API key
	apiKey := os.Getenv("JEWELMUSIC_API_KEY")
	if apiKey == "" {
		log.Fatal("❌ JEWELMUSIC_API_KEY environment variable not set\nPlease set your API key: export JEWELMUSIC_API_KEY=your_key_here")
	}

	fmt.Printf("🔑 Using API key: %s...\n", apiKey[:12])

	// Initialize the client
	client := jewelmusic.NewClient(apiKey)

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	// Run basic usage example
	if err := basicUsageExample(ctx, client); err != nil {
		log.Printf("💥 Example failed: %v", err)
		return
	}

	fmt.Println("\n✨ Basic usage example completed successfully!")
	fmt.Println("\nNext steps:")
	fmt.Println("- Check out ai_generation.go for AI music creation")
	fmt.Println("- See webhook_server.go for webhook handling")
	fmt.Println("- Look at concurrent_uploads.go for batch operations")
}

func basicUsageExample(ctx context.Context, client *jewelmusic.Client) error {
	// Test connection
	fmt.Println("\n🔗 Testing API connection...")
	ping, err := client.Ping(ctx)
	if err != nil {
		return fmt.Errorf("failed to ping API: %w", err)
	}
	fmt.Printf("✅ Connected to JewelMusic API v%s\n", ping.Version)

	// Get user profile
	fmt.Println("\n👤 Getting user profile...")
	profile, err := client.User.GetProfile(ctx)
	if err != nil {
		return fmt.Errorf("failed to get profile: %w", err)
	}
	fmt.Printf("✅ User: %s\n", profile.Name)
	fmt.Printf("Plan: %s\n", profile.Subscription.Plan)

	// Check if sample audio file exists
	audioPath := "./sample-audio.mp3"
	if _, err := os.Stat(audioPath); os.IsNotExist(err) {
		fmt.Println("⚠️  Sample audio file not found. Creating placeholder for demonstration...")
		return handleMissingAudioFile(ctx, client)
	}

	return handleAudioFileExample(ctx, client, audioPath)
}

func handleMissingAudioFile(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("📋 Listing existing tracks...")
	tracks, err := client.Tracks.List(ctx, &jewelmusic.ListOptions{
		Page:    1,
		PerPage: 5,
	})
	if err != nil {
		return fmt.Errorf("failed to list tracks: %w", err)
	}

	fmt.Printf("✅ Found %d tracks\n", tracks.Pagination.Total)
	if len(tracks.Items) > 0 {
		fmt.Println("Recent tracks:")
		for i, track := range tracks.Items {
			if i >= 3 {
				break
			}
			fmt.Printf("- %s by %s\n", track.Title, track.Artist)
		}

		// Use first track for analysis example
		firstTrack := tracks.Items[0]
		return demonstrateAnalysisWithExistingTrack(ctx, client, firstTrack.ID)
	}

	fmt.Println("No tracks found. Please upload a track first or add sample-audio.mp3 to run the full example.")
	return nil
}

func handleAudioFileExample(ctx context.Context, client *jewelmusic.Client, audioPath string) error {
	fmt.Printf("📁 Found audio file: %s\n", audioPath)

	// Upload track with metadata
	fmt.Println("\n📤 Uploading track...")
	file, err := os.Open(audioPath)
	if err != nil {
		return fmt.Errorf("failed to open audio file: %w", err)
	}
	defer file.Close()

	// Progress callback
	progressCallback := func(loaded, total int64) {
		percentage := float64(loaded) / float64(total) * 100
		fmt.Printf("\rUpload progress: %.1f%%", percentage)
	}

	track, err := client.Tracks.UploadWithProgress(ctx, file, &jewelmusic.TrackMetadata{
		Title:       "Sample Song",
		Artist:      "Sample Artist",
		Album:       "Sample Album",
		Genre:       "Electronic",
		ReleaseDate: "2025-09-01",
	}, progressCallback)
	if err != nil {
		return fmt.Errorf("failed to upload track: %w", err)
	}

	fmt.Printf("\n✅ Track uploaded successfully!\n")
	fmt.Printf("Track ID: %s\n", track.ID)
	fmt.Printf("Status: %s\n", track.Status)
	fmt.Printf("Duration: %ds\n", track.Duration)

	// Basic analysis
	fmt.Println("\n🔍 Analyzing track...")
	_, err = os.Open(audioPath) // Reopen for analysis
	if err != nil {
		return fmt.Errorf("failed to reopen audio file: %w", err)
	}
	defer file.Close()

	analysis, err := client.Analysis.AnalyzeFile(ctx, file, &jewelmusic.AnalysisOptions{
		AnalysisTypes:  []string{"tempo", "key", "structure"},
		DetailedReport: false,
	})
	if err != nil {
		return fmt.Errorf("failed to analyze track: %w", err)
	}

	fmt.Println("✅ Analysis completed!")
	fmt.Printf("Tempo: %.1f BPM\n", analysis.Tempo.BPM)
	fmt.Printf("Key: %s %s\n", analysis.Key.Key, analysis.Key.Mode)
	
	if len(analysis.Structure.Sections) > 0 {
		fmt.Print("Structure: ")
		for i, section := range analysis.Structure.Sections {
			if i > 0 {
				fmt.Print(" - ")
			}
			fmt.Print(section.Type)
		}
		fmt.Println()
	}

	// Simple distribution setup (create release)
	fmt.Println("\n📡 Creating release for distribution...")
	release, err := client.Distribution.CreateRelease(ctx, &jewelmusic.Release{
		Type:        "single",
		Title:       track.Title,
		Artist:      track.Artist,
		ReleaseDate: "2025-09-01",
		Tracks: []jewelmusic.ReleaseTrack{
			{
				TrackID:  track.ID,
				Title:    track.Title,
				Duration: track.Duration,
			},
		},
		Territories: []string{"US", "CA", "GB"},
		Platforms:   []string{"spotify", "apple-music"},
	})
	if err != nil {
		return fmt.Errorf("failed to create release: %w", err)
	}

	fmt.Println("✅ Release created!")
	fmt.Printf("Release ID: %s\n", release.ID)
	fmt.Printf("Status: %s\n", release.Status)

	return nil
}

func demonstrateAnalysisWithExistingTrack(ctx context.Context, client *jewelmusic.Client, trackID string) error {
	fmt.Printf("\n🔍 Analyzing existing track: %s\n", trackID)

	analysis, err := client.Analysis.AnalyzeTrack(ctx, trackID, &jewelmusic.AnalysisOptions{
		AnalysisTypes:  []string{"tempo", "key", "structure"},
		DetailedReport: false,
	})
	if err != nil {
		return fmt.Errorf("failed to analyze track: %w", err)
	}

	fmt.Println("✅ Analysis completed!")
	fmt.Printf("Tempo: %.1f BPM\n", analysis.Tempo.BPM)
	fmt.Printf("Key: %s %s\n", analysis.Key.Key, analysis.Key.Mode)
	
	if len(analysis.Structure.Sections) > 0 {
		fmt.Print("Structure: ")
		for i, section := range analysis.Structure.Sections {
			if i > 0 {
				fmt.Print(" - ")
			}
			fmt.Print(section.Type)
		}
		fmt.Println()
	}

	return nil
}

// Error handling example
func errorHandlingExample(ctx context.Context, client *jewelmusic.Client) {
	fmt.Println("\n" + "="*50)
	fmt.Println("ERROR HANDLING EXAMPLE")
	fmt.Println("="*50)

	// Test with invalid track ID
	_, err := client.Tracks.Get(ctx, "invalid-track-id")
	if err != nil {
		switch e := err.(type) {
		case *jewelmusic.AuthenticationError:
			fmt.Printf("✅ Caught authentication error: %s\n", e.Message)
			fmt.Printf("   Request ID: %s\n", e.RequestID)
			fmt.Printf("   Status Code: %d\n", e.StatusCode)
		case *jewelmusic.ValidationError:
			fmt.Printf("✅ Caught validation error: %s\n", e.Message)
			fmt.Printf("   Validation errors: %v\n", e.ValidationErrors)
		case *jewelmusic.NotFoundError:
			fmt.Printf("✅ Caught not found error: %s\n", e.Message)
		case *jewelmusic.RateLimitError:
			fmt.Printf("✅ Caught rate limit error: %s\n", e.Message)
			fmt.Printf("   Retry after: %d seconds\n", e.RetryAfter)
		case *jewelmusic.NetworkError:
			fmt.Printf("✅ Caught network error: %s\n", e.Message)
		default:
			fmt.Printf("❌ Unexpected error: %v\n", err)
		}
	}
}

// Context cancellation example
func contextCancellationExample() {
	fmt.Println("\n" + "="*50)
	fmt.Println("CONTEXT CANCELLATION EXAMPLE")
	fmt.Println("="*50)

	client := jewelmusic.NewClient(os.Getenv("JEWELMUSIC_API_KEY"))

	// Context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Millisecond) // Very short timeout
	defer cancel()

	_, err := client.Tracks.List(ctx, &jewelmusic.ListOptions{
		Page:    1,
		PerPage: 20,
	})

	if err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			fmt.Println("✅ Request timed out as expected")
		} else if ctx.Err() == context.Canceled {
			fmt.Println("✅ Request was canceled as expected")
		} else {
			fmt.Printf("❌ Unexpected error: %v\n", err)
		}
	}
}

// Additional usage examples
func advancedExamples() {
	fmt.Println("\n" + "="*50)
	fmt.Println("ADVANCED CONFIGURATION EXAMPLE")
	fmt.Println("="*50)

	// Advanced client configuration
	config := &jewelmusic.Config{
		APIKey:      os.Getenv("JEWELMUSIC_API_KEY"),
		Environment: "production",
		APIVersion:  "v1",
		BaseURL:     "https://api.jewelmusic.art",
		Timeout:     30 * time.Second,
		MaxRetries:  3,
		RetryDelay:  1 * time.Second,
		UserAgent:   "GoSDKExample/1.0.0",
	}

	client := jewelmusic.NewClientWithConfig(config)
	ctx := context.Background()

	// Test connection with advanced client
	ping, err := client.Ping(ctx)
	if err != nil {
		fmt.Printf("❌ Advanced client test failed: %v\n", err)
		return
	}

	fmt.Printf("✅ Advanced client connected to API v%s\n", ping.Version)
}