/**
 * AI Generation Example for JewelMusic Java SDK
 * 
 * This example demonstrates AI-powered music generation:
 * - Melody generation
 * - Harmony creation
 * - Lyrics generation
 * - Complete song composition
 * - Style transfer
 * - Chord progressions
 */

import com.jewelmusic.JewelMusic;
import com.jewelmusic.JewelMusicClient;
import com.jewelmusic.exceptions.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

public class AIGenerationExample {
    
    private static final String API_KEY = System.getenv("JEWELMUSIC_API_KEY");
    
    public static void main(String[] args) {
        System.out.println("🤖 JewelMusic Java SDK - AI Generation Example");
        System.out.println("===============================================");
        
        // Check for API key
        if (API_KEY == null || API_KEY.isEmpty()) {
            System.err.println("❌ JEWELMUSIC_API_KEY environment variable not set");
            System.out.println("Please set your API key: export JEWELMUSIC_API_KEY=your_key_here");
            System.exit(1);
        }
        
        System.out.printf("🔑 Using API key: %s...%n", API_KEY.substring(0, 12));
        
        // Initialize the client
        JewelMusic client = new JewelMusicClient(API_KEY);
        
        try {
            // Run AI generation examples
            Map<String, Object> results = runAIGenerationExamples(client);
            
            System.out.println("\n🎉 AI generation examples completed successfully!");
            
            // Print summary
            printGenerationSummary(results);
            
        } catch (Exception e) {
            System.err.printf("\n💥 AI generation examples failed: %s%n", e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    private static Map<String, Object> runAIGenerationExamples(JewelMusic client) throws Exception {
        Map<String, Object> results = new HashMap<>();
        
        // Generate melody
        Map<String, Object> melody = generateMelodyExample(client);
        results.put("melody", melody);
        
        // Generate lyrics
        Map<String, Object> lyrics = generateLyricsExample(client);
        results.put("lyrics", lyrics);
        
        // Generate harmony for the melody
        Map<String, Object> harmony = generateHarmonyExample(client, (String) melody.get("id"));
        results.put("harmony", harmony);
        
        // Generate chord progression
        Map<String, Object> chordProgression = generateChordProgressionExample(client);
        results.put("chordProgression", chordProgression);
        
        // Complete song generation
        Map<String, Object> song = completeSongExample(client);
        results.put("song", song);
        
        // Style transfer
        Map<String, Object> styleVariation = styleTransferExample(client, (String) melody.get("id"));
        results.put("styleVariation", styleVariation);
        
        // Get templates
        List<Map<String, Object>> templates = getTemplatesExample(client);
        results.put("templates", templates);
        
        return results;
    }
    
    private static Map<String, Object> generateMelodyExample(JewelMusic client) throws Exception {
        System.out.println("\n🎵 Generating AI melody...");
        
        Map<String, Object> options = new HashMap<>();
        options.put("style", "electronic");
        options.put("genre", "electronic");
        options.put("mood", "upbeat");
        options.put("tempo", 128);
        options.put("key", "C");
        options.put("mode", "major");
        options.put("duration", 30);
        options.put("instruments", Arrays.asList("synthesizer", "bass", "piano"));
        options.put("complexity", "medium");
        options.put("energy", "high");
        options.put("creativity", 0.7);
        
        Map<String, Object> melody = client.copilot().generateMelody(options);
        
        System.out.println("✅ Melody generated successfully!");
        System.out.printf("Melody ID: %s%n", melody.get("id"));
        System.out.printf("Style: %s%n", melody.get("style"));
        System.out.printf("Tempo: %s BPM%n", melody.get("tempo"));
        System.out.printf("Key: %s %s%n", melody.get("key"), melody.get("mode"));
        System.out.printf("Duration: %s seconds%n", melody.get("duration"));
        
        return melody;
    }
    
    private static Map<String, Object> generateLyricsExample(JewelMusic client) throws Exception {
        System.out.println("\n📝 Generating AI lyrics...");
        
        Map<String, Object> options = new HashMap<>();
        options.put("theme", "technology and human connection");
        options.put("genre", "electronic");
        options.put("language", "en");
        options.put("mood", "optimistic");
        options.put("structure", "verse-chorus-verse-chorus-bridge-chorus");
        options.put("rhymeScheme", "ABAB");
        options.put("syllableCount", "8-6-8-6");
        options.put("verseCount", 2);
        options.put("chorusCount", 1);
        options.put("bridgeCount", 1);
        options.put("wordsPerLine", 6);
        options.put("explicitContent", false);
        options.put("keywords", Arrays.asList("future", "connection", "digital", "dreams"));
        options.put("referenceArtists", Arrays.asList("Daft Punk", "Kraftwerk"));
        
        Map<String, Object> lyrics = client.copilot().generateLyrics(options);
        
        System.out.println("✅ Lyrics generated successfully!");
        System.out.printf("Lyrics ID: %s%n", lyrics.get("id"));
        System.out.printf("Theme: %s%n", lyrics.get("theme"));
        System.out.printf("Structure: %s%n", lyrics.get("structure"));
        System.out.printf("Language: %s%n", lyrics.get("language"));
        
        String text = (String) lyrics.get("text");
        String preview = text.length() > 200 ? text.substring(0, 200) + "..." : text;
        System.out.printf("%nGenerated lyrics preview:%n```%n%s%n```%n", preview);
        
        return lyrics;
    }
    
    private static Map<String, Object> generateHarmonyExample(JewelMusic client, String melodyId) throws Exception {
        System.out.println("\n🎼 Generating AI harmony...");
        
        Map<String, Object> options = new HashMap<>();
        options.put("melodyId", melodyId);
        options.put("style", "jazz");
        options.put("complexity", "complex");
        options.put("voicing", "close");
        options.put("instruments", Arrays.asList("piano", "guitar"));
        options.put("creativity", 0.8);
        
        Map<String, Object> harmony = client.copilot().generateHarmony(options);
        
        System.out.println("✅ Harmony generated successfully!");
        System.out.printf("Harmony ID: %s%n", harmony.get("id"));
        System.out.printf("Reference Melody ID: %s%n", harmony.get("melodyId"));
        System.out.printf("Style: %s%n", harmony.get("style"));
        System.out.printf("Complexity: %s%n", harmony.get("complexity"));
        System.out.printf("Voicing: %s%n", harmony.get("voicing"));
        
        return harmony;
    }
    
    private static Map<String, Object> generateChordProgressionExample(JewelMusic client) throws Exception {
        System.out.println("\n🎹 Generating chord progression...");
        
        Map<String, Object> options = new HashMap<>();
        options.put("key", "C major");
        options.put("style", "pop");
        options.put("complexity", 0.5);
        options.put("length", 8);
        
        Map<String, Object> progression = client.copilot().generateChordProgression(options);
        
        System.out.println("✅ Chord progression generated!");
        System.out.printf("Progression ID: %s%n", progression.get("id"));
        System.out.printf("Key: %s%n", progression.get("key"));
        System.out.printf("Length: %s chords%n", progression.get("length"));
        
        List<String> chords = (List<String>) progression.get("progression");
        System.out.printf("Chords: %s%n", String.join(" - ", chords));
        
        return progression;
    }
    
    private static Map<String, Object> completeSongExample(JewelMusic client) throws Exception {
        System.out.println("\n🎤 Generating complete AI song...");
        
        Map<String, Object> options = new HashMap<>();
        options.put("prompt", "Create an uplifting electronic song about overcoming challenges and finding inner strength");
        options.put("style", "electronic");
        options.put("duration", 180);
        options.put("includeVocals", true);
        options.put("vocalStyle", "female-pop");
        options.put("mixingStyle", "modern");
        options.put("masteringPreset", "streaming");
        options.put("completionType", "full");
        options.put("addIntro", true);
        options.put("addOutro", true);
        options.put("addBridge", true);
        
        Map<String, Object> song = client.copilot().generateCompleteSong(options);
        
        System.out.println("✅ Complete song generated successfully!");
        System.out.printf("Song ID: %s%n", song.get("id"));
        System.out.printf("Title: %s%n", song.get("title"));
        System.out.printf("Duration: %s seconds%n", song.get("duration"));
        System.out.printf("Style: %s%n", song.get("style"));
        System.out.printf("Vocal Style: %s%n", song.get("vocalStyle"));
        
        System.out.println("Components:");
        if (song.containsKey("melodyId") && song.get("melodyId") != null) {
            System.out.printf("  - Melody: %s%n", song.get("melodyId"));
        }
        if (song.containsKey("harmonyId") && song.get("harmonyId") != null) {
            System.out.printf("  - Harmony: %s%n", song.get("harmonyId"));
        }
        if (song.containsKey("lyricsId") && song.get("lyricsId") != null) {
            System.out.printf("  - Lyrics: %s%n", song.get("lyricsId"));
        }
        
        return song;
    }
    
    private static Map<String, Object> styleTransferExample(JewelMusic client, String sourceId) throws Exception {
        System.out.println("\n🔄 Style transfer example...");
        
        Map<String, Object> options = new HashMap<>();
        options.put("sourceId", sourceId);
        options.put("targetStyle", "jazz");
        options.put("intensity", 0.8);
        options.put("preserveStructure", true);
        options.put("preserveTiming", true);
        
        Map<String, Object> styleTransfer = client.copilot().applyStyleTransfer(options);
        
        System.out.println("✅ Style transfer completed!");
        System.out.printf("Original Track ID: %s (electronic)%n", sourceId);
        System.out.printf("Transformed Track ID: %s (jazz)%n", styleTransfer.get("id"));
        System.out.printf("Transfer Intensity: %.1f%n", styleTransfer.get("intensity"));
        
        return styleTransfer;
    }
    
    private static List<Map<String, Object>> getTemplatesExample(JewelMusic client) throws Exception {
        System.out.println("\n📚 Getting available song templates...");
        
        Map<String, Object> query = new HashMap<>();
        query.put("genre", "electronic");
        query.put("mood", "upbeat");
        query.put("duration", 180);
        query.put("style", "modern");
        
        Map<String, Object> response = client.copilot().getTemplates(query);
        List<Map<String, Object>> templates = (List<Map<String, Object>>) response.get("items");
        
        System.out.printf("✅ Found %d templates%n", templates.size());
        
        if (!templates.isEmpty()) {
            System.out.println("Available templates:");
            for (int i = 0; i < Math.min(5, templates.size()); i++) {
                Map<String, Object> template = templates.get(i);
                System.out.printf("  %d. %s (%s)%n", i + 1, template.get("name"), template.get("genre"));
                System.out.printf("     Style: %s | Mood: %s | Duration: %ss%n",
                    template.get("style"), template.get("mood"), template.get("duration"));
            }
            
            if (templates.size() > 5) {
                System.out.printf("     ... and %d more templates%n", templates.size() - 5);
            }
            
            // Use first template for song generation
            Map<String, Object> template = templates.get(0);
            System.out.printf("%nUsing template '%s' for song generation...%n", template.get("name"));
            
            Map<String, Object> songOptions = new HashMap<>();
            songOptions.put("templateId", template.get("id"));
            songOptions.put("prompt", "An energetic track perfect for workout sessions");
            songOptions.put("style", template.get("style"));
            songOptions.put("duration", template.get("duration"));
            songOptions.put("includeVocals", true);
            
            Map<String, Object> songFromTemplate = client.copilot().generateCompleteSong(songOptions);
            
            System.out.println("✅ Song generated from template!");
            System.out.printf("Template-based Song ID: %s%n", songFromTemplate.get("id"));
        }
        
        return templates;
    }
    
    private static void advancedAIWorkflowExample(JewelMusic client) throws Exception {
        System.out.println("\n🚀 Advanced AI Workflow Example");
        System.out.println("===============================");
        
        // Step 1: Create song from text prompt
        System.out.println("📝 Creating song from prompt...");
        String prompt = "A dreamy synthwave track about driving through a neon-lit city at night, feeling nostalgic and hopeful about the future";
        
        Map<String, Object> songOptions = new HashMap<>();
        songOptions.put("prompt", prompt);
        songOptions.put("style", "synthwave");
        songOptions.put("duration", 240);
        songOptions.put("includeVocals", false); // Instrumental
        songOptions.put("energy", "medium");
        songOptions.put("complexity", "high");
        
        Map<String, Object> songFromPrompt = client.copilot().generateCompleteSong(songOptions);
        
        System.out.println("✅ Song created from prompt!");
        System.out.printf("Song ID: %s%n", songFromPrompt.get("id"));
        
        // Step 2: Generate variations concurrently
        System.out.println("\n🔄 Creating variations...");
        
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        CompletableFuture<Map<String, Object>> ambientVariation = CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, Object> options = new HashMap<>();
                options.put("sourceId", songFromPrompt.get("id"));
                options.put("targetStyle", "ambient");
                options.put("intensity", 0.5);
                return client.copilot().applyStyleTransfer(options);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        CompletableFuture<Map<String, Object>> houseVariation = CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, Object> options = new HashMap<>();
                options.put("sourceId", songFromPrompt.get("id"));
                options.put("targetStyle", "house");
                options.put("intensity", 0.8);
                return client.copilot().applyStyleTransfer(options);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        CompletableFuture<Map<String, Object>> orchestralVariation = CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, Object> options = new HashMap<>();
                options.put("sourceId", songFromPrompt.get("id"));
                options.put("targetStyle", "orchestral");
                options.put("intensity", 0.6);
                return client.copilot().applyStyleTransfer(options);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        // Wait for all variations to complete
        CompletableFuture<Void> allVariations = CompletableFuture.allOf(
            ambientVariation, houseVariation, orchestralVariation
        );
        
        allVariations.join();
        
        System.out.println("✅ Created 3 variations");
        
        // Step 3: Add lyrics to the best variation
        Map<String, Object> bestVariation = ambientVariation.get(); // Pick the ambient version
        System.out.println("\n📝 Adding lyrics to ambient variation...");
        
        Map<String, Object> lyricsOptions = new HashMap<>();
        lyricsOptions.put("theme", "nostalgia and future dreams");
        lyricsOptions.put("genre", "ambient");
        lyricsOptions.put("language", "en");
        lyricsOptions.put("mood", "reflective");
        lyricsOptions.put("structure", "verse-chorus-verse-chorus-outro");
        lyricsOptions.put("inspirationText", prompt);
        
        Map<String, Object> lyricsForVariation = client.copilot().generateLyrics(lyricsOptions);
        
        System.out.println("✅ Lyrics generated for variation");
        
        // Step 4: Create final song with vocals
        System.out.println("\n🎤 Creating final version with vocals...");
        
        Map<String, Object> finalSongOptions = new HashMap<>();
        finalSongOptions.put("sourceId", bestVariation.get("id"));
        finalSongOptions.put("lyricsId", lyricsForVariation.get("id"));
        finalSongOptions.put("includeVocals", true);
        finalSongOptions.put("vocalStyle", "ethereal");
        finalSongOptions.put("mixingStyle", "atmospheric");
        finalSongOptions.put("masteringPreset", "streaming");
        
        Map<String, Object> finalSong = client.copilot().generateCompleteSong(finalSongOptions);
        
        System.out.println("✅ Final song with vocals created!");
        System.out.printf("Final song ID: %s%n", finalSong.get("id"));
        if (finalSong.containsKey("downloadUrl")) {
            System.out.printf("Download URL: %s%n", finalSong.get("downloadUrl"));
        }
        
        executor.shutdown();
    }
    
    private static void printGenerationSummary(Map<String, Object> results) {
        System.out.println("\n📋 Generation Summary");
        System.out.println("====================");
        
        System.out.println("Generated assets:");
        
        Map<String, Object> melody = (Map<String, Object>) results.get("melody");
        if (melody != null) {
            System.out.printf("- Melody: %s (preview: %s)%n", 
                melody.get("id"), melody.getOrDefault("previewUrl", "N/A"));
        }
        
        Map<String, Object> harmony = (Map<String, Object>) results.get("harmony");
        if (harmony != null) {
            System.out.printf("- Harmony: %s (preview: %s)%n", 
                harmony.get("id"), harmony.getOrDefault("previewUrl", "N/A"));
        }
        
        Map<String, Object> lyrics = (Map<String, Object>) results.get("lyrics");
        if (lyrics != null) {
            System.out.printf("- Lyrics: %s%n", lyrics.get("id"));
        }
        
        Map<String, Object> song = (Map<String, Object>) results.get("song");
        if (song != null) {
            System.out.printf("- Complete song: %s (download: %s)%n", 
                song.get("id"), song.getOrDefault("downloadUrl", "N/A"));
        }
        
        Map<String, Object> styleVariation = (Map<String, Object>) results.get("styleVariation");
        if (styleVariation != null) {
            System.out.printf("- Style variation: %s (preview: %s)%n", 
                styleVariation.get("id"), styleVariation.getOrDefault("previewUrl", "N/A"));
        }
    }
}