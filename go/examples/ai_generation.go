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
	fmt.Println("🤖 JewelMusic Go SDK - AI Generation Example")
	fmt.Println("===========================================")

	// Check for API key
	apiKey := os.Getenv("JEWELMUSIC_API_KEY")
	if apiKey == "" {
		log.Fatal("❌ JEWELMUSIC_API_KEY environment variable not set")
	}

	fmt.Printf("🔑 Using API key: %s...\n", apiKey[:12])

	// Initialize the client
	client := jewelmusic.NewClient(apiKey)

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	// Run AI generation examples
	if err := runAIGenerationExamples(ctx, client); err != nil {
		log.Printf("💥 AI generation examples failed: %v", err)
		return
	}

	fmt.Println("\n✨ AI generation examples completed successfully!")
}

func runAIGenerationExamples(ctx context.Context, client *jewelmusic.Client) error {
	// 1. Generate melody
	if err := generateMelodyExample(ctx, client); err != nil {
		return fmt.Errorf("melody generation failed: %w", err)
	}

	// 2. Generate lyrics
	if err := generateLyricsExample(ctx, client); err != nil {
		return fmt.Errorf("lyrics generation failed: %w", err)
	}

	// 3. Generate harmony
	if err := generateHarmonyExample(ctx, client); err != nil {
		return fmt.Errorf("harmony generation failed: %w", err)
	}

	// 4. Complete song generation
	if err := completeSongExample(ctx, client); err != nil {
		return fmt.Errorf("complete song generation failed: %w", err)
	}

	// 5. Get templates
	if err := getTemplatesExample(ctx, client); err != nil {
		return fmt.Errorf("get templates failed: %w", err)
	}

	return nil
}

func generateMelodyExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🎵 Generating AI melody...")

	melody, err := client.Copilot.GenerateMelody(ctx, &jewelmusic.MelodyOptions{
		Style:       "electronic",
		Genre:       "electronic",
		Mood:        "upbeat",
		Tempo:       128,
		Key:         "C",
		Mode:        "major",
		Duration:    30,
		Instruments: []string{"synthesizer", "bass", "piano"},
		Complexity:  "medium",
		Energy:      "high",
		Creativity:  0.7,
	})
	if err != nil {
		return err
	}

	fmt.Println("✅ Melody generated successfully!")
	fmt.Printf("Melody ID: %s\n", melody.ID)
	fmt.Printf("Style: %s\n", melody.Style)
	fmt.Printf("Tempo: %d BPM\n", melody.Tempo)
	fmt.Printf("Key: %s %s\n", melody.Key, melody.Mode)
	fmt.Printf("Duration: %d seconds\n", melody.Duration)

	return nil
}

func generateLyricsExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n📝 Generating AI lyrics...")

	lyrics, err := client.Copilot.GenerateLyrics(ctx, &jewelmusic.LyricsOptions{
		Theme:           "technology and human connection",
		Genre:           "electronic",
		Language:        "en",
		Mood:            "optimistic",
		Structure:       "verse-chorus-verse-chorus-bridge-chorus",
		RhymeScheme:     "ABAB",
		SyllableCount:   "8-6-8-6",
		VerseCount:      2,
		ChorusCount:     1,
		BridgeCount:     1,
		WordsPerLine:    6,
		ExplicitContent: false,
		Keywords:        []string{"future", "connection", "digital", "dreams"},
		ReferenceArtists: []string{"Daft Punk", "Kraftwerk"},
	})
	if err != nil {
		return err
	}

	fmt.Println("✅ Lyrics generated successfully!")
	fmt.Printf("Lyrics ID: %s\n", lyrics.ID)
	fmt.Printf("Theme: %s\n", lyrics.Theme)
	fmt.Printf("Structure: %s\n", lyrics.Structure)
	fmt.Printf("Language: %s\n", lyrics.Language)
	fmt.Println("\nGenerated lyrics preview:")
	fmt.Printf("```\n%s\n```\n", lyrics.Text[:min(200, len(lyrics.Text))])
	if len(lyrics.Text) > 200 {
		fmt.Println("...")
	}

	return nil
}

func generateHarmonyExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🎼 Generating AI harmony...")

	// First generate a melody to use as reference
	melody, err := client.Copilot.GenerateMelody(ctx, &jewelmusic.MelodyOptions{
		Style:    "jazz",
		Tempo:    120,
		Key:      "C",
		Duration: 16,
	})
	if err != nil {
		return fmt.Errorf("failed to generate reference melody: %w", err)
	}

	// Generate harmony for the melody
	harmony, err := client.Copilot.GenerateHarmony(ctx, &jewelmusic.HarmonyOptions{
		MelodyID:    melody.ID,
		Style:       "jazz",
		Complexity:  "complex",
		Voicing:     "close",
		Instruments: []string{"piano", "guitar"},
		Creativity:  0.8,
	})
	if err != nil {
		return err
	}

	fmt.Println("✅ Harmony generated successfully!")
	fmt.Printf("Harmony ID: %s\n", harmony.ID)
	fmt.Printf("Reference Melody ID: %s\n", harmony.MelodyID)
	fmt.Printf("Style: %s\n", harmony.Style)
	fmt.Printf("Complexity: %s\n", harmony.Complexity)
	fmt.Printf("Voicing: %s\n", harmony.Voicing)

	return nil
}

func completeSongExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🎤 Generating complete AI song...")

	song, err := client.Copilot.CompleteSong(ctx, &jewelmusic.SongOptions{
		Prompt:         "Create an uplifting electronic song about overcoming challenges and finding inner strength",
		Style:          "electronic",
		Duration:       180,
		IncludeVocals:  true,
		VocalStyle:     "female-pop",
		MixingStyle:    "modern",
		MasteringPreset: "streaming",
		CompletionType: "full",
		AddIntro:       true,
		AddOutro:       true,
		AddBridge:      true,
	})
	if err != nil {
		return err
	}

	fmt.Println("✅ Complete song generated successfully!")
	fmt.Printf("Song ID: %s\n", song.ID)
	fmt.Printf("Title: %s\n", song.Title)
	fmt.Printf("Duration: %d seconds\n", song.Duration)
	fmt.Printf("Style: %s\n", song.Style)
	fmt.Printf("Vocal Style: %s\n", song.VocalStyle)
	fmt.Printf("Components:\n")
	if song.MelodyID != "" {
		fmt.Printf("  - Melody: %s\n", song.MelodyID)
	}
	if song.HarmonyID != "" {
		fmt.Printf("  - Harmony: %s\n", song.HarmonyID)
	}
	if song.LyricsID != "" {
		fmt.Printf("  - Lyrics: %s\n", song.LyricsID)
	}

	return nil
}

func getTemplatesExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n📚 Getting available song templates...")

	templates, err := client.Copilot.GetTemplates(ctx, &jewelmusic.TemplateQuery{
		Genre:    "electronic",
		Mood:     "upbeat",
		Duration: 180,
		Style:    "modern",
	})
	if err != nil {
		return err
	}

	fmt.Printf("✅ Found %d templates\n", len(templates.Items))
	
	if len(templates.Items) > 0 {
		fmt.Println("Available templates:")
		for i, template := range templates.Items {
			if i >= 5 { // Show only first 5
				break
			}
			fmt.Printf("  %d. %s (%s)\n", i+1, template.Name, template.Genre)
			fmt.Printf("     Style: %s | Mood: %s | Duration: %ds\n", 
				template.Style, template.Mood, template.Duration)
		}
		
		if len(templates.Items) > 5 {
			fmt.Printf("     ... and %d more templates\n", len(templates.Items)-5)
		}

		// Use first template as example
		template := templates.Items[0]
		fmt.Printf("\nUsing template '%s' for song generation...\n", template.Name)
		
		songFromTemplate, err := client.Copilot.CompleteSong(ctx, &jewelmusic.SongOptions{
			TemplateID:     template.ID,
			Prompt:         "An energetic track perfect for workout sessions",
			Style:          template.Style,
			Duration:       template.Duration,
			IncludeVocals:  true,
		})
		if err != nil {
			return fmt.Errorf("failed to generate song from template: %w", err)
		}

		fmt.Printf("✅ Song generated from template!\n")
		fmt.Printf("Template-based Song ID: %s\n", songFromTemplate.ID)
	}

	return nil
}

// Style transfer example
func styleTransferExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🔄 Style transfer example...")

	// First generate a source track
	sourceTrack, err := client.Copilot.GenerateMelody(ctx, &jewelmusic.MelodyOptions{
		Style:    "pop",
		Tempo:    120,
		Key:      "C",
		Duration: 30,
	})
	if err != nil {
		return fmt.Errorf("failed to generate source track: %w", err)
	}

	// Apply style transfer
	styleTransfer, err := client.Copilot.StyleTransfer(ctx, &jewelmusic.StyleTransferOptions{
		SourceID:         sourceTrack.ID,
		TargetStyle:      "jazz",
		Intensity:        0.8,
		PreserveStructure: true,
		PreserveTiming:   true,
	})
	if err != nil {
		return err
	}

	fmt.Println("✅ Style transfer completed!")
	fmt.Printf("Original Track ID: %s (pop)\n", sourceTrack.ID)
	fmt.Printf("Transformed Track ID: %s (jazz)\n", styleTransfer.ID)
	fmt.Printf("Transfer Intensity: %.1f\n", styleTransfer.Intensity)

	return nil
}

// Chord progression example
func chordProgressionExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🎹 Generating chord progression...")

	progression, err := client.Copilot.ChordProgression(ctx, &jewelmusic.ChordProgressionOptions{
		Key:        "C major",
		Style:      "pop",
		Complexity: 0.5,
		Length:     8,
	})
	if err != nil {
		return err
	}

	fmt.Println("✅ Chord progression generated!")
	fmt.Printf("Progression ID: %s\n", progression.ID)
	fmt.Printf("Key: %s\n", progression.Key)
	fmt.Printf("Length: %d chords\n", progression.Length)
	fmt.Printf("Chords: %s\n", progression.ChordSequence)

	return nil
}

// AI analysis and suggestions
func aiAnalysisExample(ctx context.Context, client *jewelmusic.Client) error {
	fmt.Println("\n🧠 AI music analysis and suggestions...")

	// Assume we have a track ID from previous uploads
	// In a real scenario, you'd get this from your track library
	trackID := "existing_track_id"

	// Get genre analysis suggestions
	genreAnalysis, err := client.Copilot.GenreAnalysis(ctx, &jewelmusic.GenreAnalysisOptions{
		TrackID:      trackID,
		TargetGenre:  "electronic",
	})
	if err != nil {
		// Skip if track doesn't exist
		fmt.Printf("⚠️  Skipping genre analysis (track not found): %v\n", err)
		return nil
	}

	fmt.Println("✅ Genre analysis completed!")
	fmt.Printf("Current Genre: %s\n", genreAnalysis.CurrentGenre)
	fmt.Printf("Target Genre: %s\n", genreAnalysis.TargetGenre)
	fmt.Printf("Similarity Score: %.2f\n", genreAnalysis.SimilarityScore)
	fmt.Printf("Suggestions:\n")
	for _, suggestion := range genreAnalysis.Suggestions {
		fmt.Printf("  - %s\n", suggestion)
	}

	return nil
}

// Utility functions
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}