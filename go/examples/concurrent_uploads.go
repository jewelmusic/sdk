package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/jewelmusic/sdk/go/jewelmusic"
)

func main() {
	fmt.Println("⚡ JewelMusic Go SDK - Concurrent Operations Example")
	fmt.Println("==================================================")

	// Check for API key
	apiKey := os.Getenv("JEWELMUSIC_API_KEY")
	if apiKey == "" {
		log.Fatal("❌ JEWELMUSIC_API_KEY environment variable not set")
	}

	fmt.Printf("🔑 Using API key: %s...\n", apiKey[:12])

	// Initialize the client
	client := jewelmusic.NewClient(apiKey)

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	// Run concurrent operation examples
	if err := runConcurrentExamples(ctx, client); err != nil {
		log.Printf("💥 Concurrent examples failed: %v", err)
		return
	}

	fmt.Println("\n✨ Concurrent operations examples completed successfully!")
}

func runConcurrentExamples(ctx context.Context, client *jewelmusic.Client) error {
	// 1. Concurrent track uploads
	if err := concurrentTrackUploads(ctx, client); err != nil {
		return fmt.Errorf("concurrent uploads failed: %w", err)
	}

	// 2. Concurrent analysis operations
	if err := concurrentAnalysis(ctx, client); err != nil {
		return fmt.Errorf("concurrent analysis failed: %w", err)
	}

	// 3. Batch metadata updates
	if err := batchMetadataUpdates(ctx, client); err != nil {
		return fmt.Errorf("batch updates failed: %w", err)
	}

	// 4. Concurrent AI generations
	if err := concurrentAIGenerations(ctx, client); err != nil {
		return fmt.Errorf("concurrent AI generations failed: %w", err)
	}

	return nil
}

// Track upload result
type UploadResult struct {
	FileName string
	Track    *jewelmusic.Track
	Error    error
	Duration time.Duration
}

func concurrentTrackUploads(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n📤 Concurrent track uploads example...")

	// Sample files for demonstration
	// In a real scenario, you'd have actual audio files
	sampleFiles := []string{
		"sample1.mp3",
		"sample2.wav", 
		"sample3.flac",
		"sample4.aiff",
		"sample5.mp3",
	}

	// Check if any sample files exist
	var existingFiles []string
	for _, file := range sampleFiles {
		if _, err := os.Stat(file); err == nil {
			existingFiles = append(existingFiles, file)
		}
	}

	if len(existingFiles) == 0 {
		fmt.Println("⚠️  No sample audio files found. Creating mock upload demonstration...")
		return mockConcurrentUploads(ctx, client)
	}

	// Use existing files for actual uploads
	fmt.Printf("📁 Found %d audio files to upload\n", len(existingFiles))

	const maxConcurrent = 3 // Limit concurrent uploads
	results := make(chan UploadResult, len(existingFiles))
	semaphore := make(chan struct{}, maxConcurrent)

	var wg sync.WaitGroup

	startTime := time.Now()

	// Start concurrent uploads
	for i, fileName := range existingFiles {
		wg.Add(1)
		go func(index int, file string) {
			defer wg.Done()

			// Acquire semaphore
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			uploadStart := time.Now()
			result := UploadResult{FileName: file}

			// Open file
			f, err := os.Open(file)
			if err != nil {
				result.Error = err
				result.Duration = time.Since(uploadStart)
				results <- result
				return
			}
			defer f.Close()

			// Upload with metadata
			track, err := client.Tracks.Upload(ctx, f, &jewelmusic.TrackMetadata{
				Title:  fmt.Sprintf("Concurrent Upload %d", index+1),
				Artist: "Go SDK Demo",
				Album:  "Concurrent Uploads Album",
				Genre:  "Electronic",
			})

			result.Track = track
			result.Error = err
			result.Duration = time.Since(uploadStart)
			results <- result
		}(i, fileName)
	}

	// Wait for all uploads to complete
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect and display results
	var successful, failed int
	for result := range results {
		if result.Error != nil {
			fmt.Printf("❌ %s failed: %v (%.2fs)\n", 
				result.FileName, result.Error, result.Duration.Seconds())
			failed++
		} else {
			fmt.Printf("✅ %s uploaded: %s (%.2fs)\n", 
				result.FileName, result.Track.ID, result.Duration.Seconds())
			successful++
		}
	}

	totalTime := time.Since(startTime)
	fmt.Printf("\n📊 Upload Summary:\n")
	fmt.Printf("   ✅ Successful: %d\n", successful)
	fmt.Printf("   ❌ Failed: %d\n", failed)
	fmt.Printf("   ⏱️  Total time: %.2fs\n", totalTime.Seconds())
	fmt.Printf("   📈 Average per file: %.2fs\n", totalTime.Seconds()/float64(len(existingFiles)))

	return nil
}

func mockConcurrentUploads(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("🎭 Running mock concurrent upload demonstration...")

	// Get existing tracks to simulate upload operations
	tracks, err := client.Tracks.List(ctx, &jewelmusic.ListOptions{
		Page:    1,
		PerPage: 10,
	})
	if err != nil {
		return fmt.Errorf("failed to list tracks: %w", err)
	}

	if len(tracks.Items) == 0 {
		fmt.Println("⚠️  No existing tracks found for demonstration")
		return nil
	}

	fmt.Printf("📁 Using %d existing tracks for demonstration\n", len(tracks.Items))

	// Simulate concurrent operations on existing tracks
	const maxConcurrent = 3
	results := make(chan string, len(tracks.Items))
	semaphore := make(chan struct{}, maxConcurrent)

	var wg sync.WaitGroup
	startTime := time.Now()

	for i, track := range tracks.Items {
		wg.Add(1)
		go func(index int, t jewelmusic.Track) {
			defer wg.Done()

			// Acquire semaphore
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			operationStart := time.Now()

			// Simulate some processing time
			time.Sleep(time.Duration(500+index*100) * time.Millisecond)

			// Get track details (simulates upload completion)
			_, err := client.Tracks.Get(ctx, t.ID)
			
			duration := time.Since(operationStart)
			if err != nil {
				results <- fmt.Sprintf("❌ Track %d (%s) failed: %v (%.2fs)", 
					index+1, t.ID, err, duration.Seconds())
			} else {
				results <- fmt.Sprintf("✅ Track %d (%s) processed (%.2fs)", 
					index+1, t.ID, duration.Seconds())
			}
		}(i, track)
	}

	// Wait for all operations to complete
	go func() {
		wg.Wait()
		close(results)
	}()

	// Display results
	var count int
	for result := range results {
		fmt.Println(result)
		count++
	}

	totalTime := time.Since(startTime)
	fmt.Printf("\n📊 Mock Operation Summary:\n")
	fmt.Printf("   📁 Tracks processed: %d\n", count)
	fmt.Printf("   ⏱️  Total time: %.2fs\n", totalTime.Seconds())
	fmt.Printf("   📈 Average per track: %.2fs\n", totalTime.Seconds()/float64(count))

	return nil
}

func concurrentAnalysis(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🔍 Concurrent analysis operations...")

	// Get some tracks to analyze
	tracks, err := client.Tracks.List(ctx, &jewelmusic.ListOptions{
		Page:    1,
		PerPage: 5,
	})
	if err != nil {
		return fmt.Errorf("failed to list tracks: %w", err)
	}

	if len(tracks.Items) == 0 {
		fmt.Println("⚠️  No tracks available for analysis")
		return nil
	}

	fmt.Printf("🎵 Analyzing %d tracks concurrently...\n", len(tracks.Items))

	type AnalysisResult struct {
		TrackID  string
		Analysis *jewelmusic.Analysis
		Error    error
		Duration time.Duration
	}

	const maxConcurrent = 2 // Limit concurrent analysis
	results := make(chan AnalysisResult, len(tracks.Items))
	semaphore := make(chan struct{}, maxConcurrent)

	var wg sync.WaitGroup
	startTime := time.Now()

	for _, track := range tracks.Items {
		wg.Add(1)
		go func(t jewelmusic.Track) {
			defer wg.Done()

			// Acquire semaphore
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			analysisStart := time.Now()
			result := AnalysisResult{TrackID: t.ID}

			// Start analysis
			analysis, err := client.Analysis.AnalyzeTrack(ctx, t.ID, &jewelmusic.AnalysisOptions{
				AnalysisTypes:  []string{"tempo", "key", "structure"},
				DetailedReport: false,
			})

			result.Analysis = analysis
			result.Error = err
			result.Duration = time.Since(analysisStart)
			results <- result
		}(track)
	}

	// Wait for all analysis to complete
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect and display results
	var successful, failed int
	for result := range results {
		if result.Error != nil {
			fmt.Printf("❌ Analysis failed for %s: %v (%.2fs)\n", 
				result.TrackID, result.Error, result.Duration.Seconds())
			failed++
		} else {
			fmt.Printf("✅ Analysis completed for %s: %.1f BPM, %s %s (%.2fs)\n", 
				result.TrackID, 
				result.Analysis.Tempo.BPM,
				result.Analysis.Key.Key,
				result.Analysis.Key.Mode,
				result.Duration.Seconds())
			successful++
		}
	}

	totalTime := time.Since(startTime)
	fmt.Printf("\n📊 Analysis Summary:\n")
	fmt.Printf("   ✅ Successful: %d\n", successful)
	fmt.Printf("   ❌ Failed: %d\n", failed)
	fmt.Printf("   ⏱️  Total time: %.2fs\n", totalTime.Seconds())

	return nil
}

func batchMetadataUpdates(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n📝 Batch metadata updates...")

	// Get tracks to update
	tracks, err := client.Tracks.List(ctx, &jewelmusic.ListOptions{
		Page:    1,
		PerPage: 5,
	})
	if err != nil {
		return fmt.Errorf("failed to list tracks: %w", err)
	}

	if len(tracks.Items) == 0 {
		fmt.Println("⚠️  No tracks available for metadata updates")
		return nil
	}

	fmt.Printf("📝 Updating metadata for %d tracks...\n", len(tracks.Items))

	type UpdateResult struct {
		TrackID  string
		Error    error
		Duration time.Duration
	}

	const maxConcurrent = 3
	results := make(chan UpdateResult, len(tracks.Items))
	semaphore := make(chan struct{}, maxConcurrent)

	var wg sync.WaitGroup
	startTime := time.Now()

	// Prepare batch updates
	updates := []jewelmusic.TrackUpdate{
		{Genre: "Electronic Dance"},
		{Genre: "Ambient Electronic"},
		{Genre: "Synthwave"},
		{Genre: "Downtempo"},
		{Genre: "Progressive Electronic"},
	}

	for i, track := range tracks.Items {
		wg.Add(1)
		go func(index int, t jewelmusic.Track) {
			defer wg.Done()

			// Acquire semaphore
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			updateStart := time.Now()
			result := UpdateResult{TrackID: t.ID}

			// Update track metadata
			update := updates[index%len(updates)]
			_, err := client.Tracks.Update(ctx, t.ID, &update)

			result.Error = err
			result.Duration = time.Since(updateStart)
			results <- result
		}(i, track)
	}

	// Wait for all updates to complete
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect and display results
	var successful, failed int
	for result := range results {
		if result.Error != nil {
			fmt.Printf("❌ Update failed for %s: %v (%.2fs)\n", 
				result.TrackID, result.Error, result.Duration.Seconds())
			failed++
		} else {
			fmt.Printf("✅ Updated metadata for %s (%.2fs)\n", 
				result.TrackID, result.Duration.Seconds())
			successful++
		}
	}

	totalTime := time.Since(startTime)
	fmt.Printf("\n📊 Update Summary:\n")
	fmt.Printf("   ✅ Successful: %d\n", successful)
	fmt.Printf("   ❌ Failed: %d\n", failed)
	fmt.Printf("   ⏱️  Total time: %.2fs\n", totalTime.Seconds())

	return nil
}

func concurrentAIGenerations(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🤖 Concurrent AI generations...")

	// Define different generation requests
	generationTasks := []struct {
		Name        string
		Type        string
		GenerateFunc func() (string, error)
	}{
		{
			Name: "Electronic Melody",
			Type: "melody",
			GenerateFunc: func() (string, error) {
				melody, err := client.Copilot.GenerateMelody(ctx, &jewelmusic.MelodyOptions{
					Style:    "electronic",
					Tempo:    128,
					Key:      "C",
					Duration: 16,
				})
				if err != nil {
					return "", err
				}
				return melody.ID, nil
			},
		},
		{
			Name: "Uplifting Lyrics",
			Type: "lyrics",
			GenerateFunc: func() (string, error) {
				lyrics, err := client.Copilot.GenerateLyrics(ctx, &jewelmusic.LyricsOptions{
					Theme:    "hope and inspiration",
					Genre:    "pop",
					Language: "en",
					Mood:     "uplifting",
				})
				if err != nil {
					return "", err
				}
				return lyrics.ID, nil
			},
		},
		{
			Name: "Jazz Chord Progression",
			Type: "chords",
			GenerateFunc: func() (string, error) {
				progression, err := client.Copilot.ChordProgression(ctx, &jewelmusic.ChordProgressionOptions{
					Key:        "C major",
					Style:      "jazz",
					Complexity: 0.7,
					Length:     8,
				})
				if err != nil {
					return "", err
				}
				return progression.ID, nil
			},
		},
	}

	type GenerationResult struct {
		Name     string
		Type     string
		ID       string
		Error    error
		Duration time.Duration
	}

	results := make(chan GenerationResult, len(generationTasks))
	var wg sync.WaitGroup
	startTime := time.Now()

	// Start concurrent generations
	for _, task := range generationTasks {
		wg.Add(1)
		go func(t struct {
			Name        string
			Type        string
			GenerateFunc func() (string, error)
		}) {
			defer wg.Done()

			generationStart := time.Now()
			result := GenerationResult{
				Name: t.Name,
				Type: t.Type,
			}

			// Generate content
			id, err := t.GenerateFunc()
			result.ID = id
			result.Error = err
			result.Duration = time.Since(generationStart)

			results <- result
		}(task)
	}

	// Wait for all generations to complete
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect and display results
	var successful, failed int
	for result := range results {
		if result.Error != nil {
			fmt.Printf("❌ %s (%s) failed: %v (%.2fs)\n", 
				result.Name, result.Type, result.Error, result.Duration.Seconds())
			failed++
		} else {
			fmt.Printf("✅ %s (%s) generated: %s (%.2fs)\n", 
				result.Name, result.Type, result.ID, result.Duration.Seconds())
			successful++
		}
	}

	totalTime := time.Since(startTime)
	fmt.Printf("\n📊 Generation Summary:\n")
	fmt.Printf("   ✅ Successful: %d\n", successful)
	fmt.Printf("   ❌ Failed: %d\n", failed)
	fmt.Printf("   ⏱️  Total time: %.2fs\n", totalTime.Seconds())

	return nil
}

// Utility function for file operations
func findAudioFiles(directory string) ([]string, error) {
	var audioFiles []string
	
	audioExtensions := map[string]bool{
		".mp3":  true,
		".wav":  true,
		".flac": true,
		".aiff": true,
		".m4a":  true,
		".ogg":  true,
	}

	err := filepath.Walk(directory, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() {
			ext := filepath.Ext(strings.ToLower(path))
			if audioExtensions[ext] {
				audioFiles = append(audioFiles, path)
			}
		}

		return nil
	})

	return audioFiles, err
}

// Progress tracker for concurrent operations
type ProgressTracker struct {
	total     int
	completed int
	mutex     sync.RWMutex
}

func NewProgressTracker(total int) *ProgressTracker {
	return &ProgressTracker{total: total}
}

func (pt *ProgressTracker) Increment() {
	pt.mutex.Lock()
	defer pt.mutex.Unlock()
	pt.completed++
}

func (pt *ProgressTracker) Progress() (int, int) {
	pt.mutex.RLock()
	defer pt.mutex.RUnlock()
	return pt.completed, pt.total
}

func (pt *ProgressTracker) Percentage() float64 {
	completed, total := pt.Progress()
	if total == 0 {
		return 0
	}
	return float64(completed) / float64(total) * 100
}