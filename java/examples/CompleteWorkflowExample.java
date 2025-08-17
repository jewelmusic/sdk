/**
 * Complete Workflow Example for JewelMusic Java SDK
 * 
 * This example demonstrates a comprehensive music production workflow:
 * - Upload and process audio tracks
 * - AI-powered analysis and enhancement
 * - Automated transcription and lyrics enhancement
 * - AI-assisted composition
 * - Release creation and distribution
 * - Analytics and monitoring
 */

import com.jewelmusic.JewelMusic;
import com.jewelmusic.JewelMusicClient;
import com.jewelmusic.exceptions.*;
import java.io.File;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CompleteWorkflowExample {
    
    private static final String API_KEY = System.getenv("JEWELMUSIC_API_KEY");
    private final JewelMusic client;
    
    public CompleteWorkflowExample() {
        if (API_KEY == null || API_KEY.isEmpty()) {
            throw new IllegalStateException("JEWELMUSIC_API_KEY environment variable not set");
        }
        this.client = new JewelMusicClient(API_KEY);
    }
    
    public static void main(String[] args) {
        System.out.println("🎵 JewelMusic Java SDK - Complete Workflow Example");
        System.out.println("===================================================");
        
        // Check for API key
        if (API_KEY == null || API_KEY.isEmpty()) {
            System.err.println("❌ JEWELMUSIC_API_KEY environment variable not set");
            System.out.println("Please set your API key: export JEWELMUSIC_API_KEY=your_key_here");
            System.exit(1);
        }
        
        System.out.printf("🔑 Using API key: %s...%n", API_KEY.substring(0, 12));
        
        try {
            CompleteWorkflowExample workflow = new CompleteWorkflowExample();
            Map<String, Object> results = workflow.runCompleteWorkflow();
            
            System.out.println("\n✨ Complete workflow examples completed successfully!");
            workflow.printWorkflowSummary(results);
            
        } catch (Exception e) {
            System.err.printf("\n💥 Workflow examples failed: %s%n", e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    public Map<String, Object> runCompleteWorkflow() throws Exception {
        System.out.println("🎵 JewelMusic Complete Workflow Example");
        System.out.println("======================================");
        
        Map<String, Object> workflowResults = new HashMap<>();
        
        // Phase 1: Upload and Processing
        Map<String, Object> track = phase1UploadAndProcessing();
        workflowResults.put("track", track);
        
        // Phase 2: AI Analysis
        Map<String, Object> analysis = phase2AIAnalysis(track);
        workflowResults.put("analysis", analysis);
        
        // Phase 3: Transcription and Lyrics
        Map<String, Object> transcription = phase3TranscriptionAndLyrics(track, analysis);
        workflowResults.put("transcription", transcription);
        
        // Phase 4: AI Composition
        Map<String, Object> composition = phase4AIComposition(track, analysis);
        workflowResults.put("composition", composition);
        
        // Phase 5: Release and Distribution
        Map<String, Object> distribution = phase5ReleaseAndDistribution(track, analysis);
        workflowResults.put("distribution", distribution);
        
        // Phase 6: Analytics Setup
        Map<String, Object> analytics = phase6AnalyticsSetup(distribution);
        workflowResults.put("analytics", analytics);
        
        return workflowResults;
    }
    
    private Map<String, Object> phase1UploadAndProcessing() throws Exception {
        System.out.println("\n📤 Phase 1: Track Upload and Processing");
        System.out.println("--------------------------------------");
        
        // Check for sample audio file
        File audioFile = new File("sample-audio.mp3");
        
        if (audioFile.exists()) {
            System.out.println("📁 Found sample audio file, uploading...");
            
            // Upload with metadata
            Map<String, String> metadata = new HashMap<>();
            metadata.put("title", "Workflow Demo Track");
            metadata.put("artist", "SDK Demo Artist");
            metadata.put("album", "Demo Album");
            metadata.put("genre", "Electronic");
            metadata.put("releaseDate", "2025-09-01");
            
            Map<String, Object> track = client.tracks().uploadTrack(audioFile, "sample-audio.mp3", metadata);
            
            System.out.println("✅ Track uploaded successfully!");
            System.out.printf("Track ID: %s%n", track.get("id"));
            System.out.printf("Status: %s%n", track.get("status"));
            
            // Wait for processing
            System.out.println("\n⏳ Waiting for track processing...");
            Map<String, Object> processedTrack = waitForProcessing(track);
            System.out.printf("✅ Track processed: %s%n", processedTrack.get("status"));
            
            return processedTrack;
            
        } else {
            System.out.println("⚠️  No sample audio file found, using existing track...");
            
            // Get an existing track
            Map<String, Object> tracksResponse = client.tracks().listTracks(1, 1);
            List<Map<String, Object>> tracks = (List<Map<String, Object>>) tracksResponse.get("items");
            
            if (tracks.isEmpty()) {
                throw new RuntimeException("No tracks available. Please upload a track first or add sample-audio.mp3");
            }
            
            Map<String, Object> track = tracks.get(0);
            System.out.printf("✅ Using existing track: %s%n", track.get("title"));
            
            return track;
        }
    }
    
    private Map<String, Object> phase2AIAnalysis(Map<String, Object> track) throws Exception {
        System.out.println("\n🔍 Phase 2: AI Analysis and Quality Assessment");
        System.out.println("---------------------------------------------");
        
        // Comprehensive analysis
        Map<String, Object> analysisOptions = new HashMap<>();
        analysisOptions.put("analysisTypes", Arrays.asList("tempo", "key", "structure", "quality", "loudness", "mood"));
        analysisOptions.put("detailedReport", true);
        analysisOptions.put("culturalContext", "global");
        analysisOptions.put("targetPlatforms", Arrays.asList("spotify", "apple-music", "youtube-music"));
        
        Map<String, Object> analysis = client.analysis().analyzeTrackWithOptions(
            (String) track.get("id"), analysisOptions);
        
        System.out.println("✅ Analysis completed!");
        System.out.println("📊 Results:");
        
        Map<String, Object> tempo = (Map<String, Object>) analysis.get("tempo");
        if (tempo != null) {
            System.out.printf("   Tempo: %.1f BPM (confidence: %.2f)%n", 
                tempo.get("bpm"), tempo.get("confidence"));
        }
        
        Map<String, Object> key = (Map<String, Object>) analysis.get("key");
        if (key != null) {
            System.out.printf("   Key: %s %s (confidence: %.2f)%n", 
                key.get("key"), key.get("mode"), key.get("confidence"));
        }
        
        Map<String, Object> quality = (Map<String, Object>) analysis.get("quality");
        if (quality != null) {
            System.out.printf("   Quality Score: %.2f/1.0%n", quality.get("overallScore"));
        }
        
        Map<String, Object> loudness = (Map<String, Object>) analysis.get("loudness");
        if (loudness != null) {
            System.out.printf("   Loudness: %.1f LUFS%n", loudness.get("lufs"));
        }
        
        Map<String, Object> mood = (Map<String, Object>) analysis.get("mood");
        if (mood != null) {
            System.out.printf("   Primary Mood: %s (%s energy)%n", 
                mood.get("primary"), mood.get("energy"));
        }
        
        // Quality recommendations
        if (quality != null && quality.containsKey("recommendations")) {
            List<Map<String, Object>> recommendations = (List<Map<String, Object>>) quality.get("recommendations");
            if (!recommendations.isEmpty()) {
                System.out.println("\n💡 Quality Recommendations:");
                for (Map<String, Object> rec : recommendations) {
                    System.out.printf("   - %s: %s%n", rec.get("type"), rec.get("suggestion"));
                }
            }
        }
        
        return analysis;
    }
    
    private Map<String, Object> phase3TranscriptionAndLyrics(Map<String, Object> track, Map<String, Object> analysis) throws Exception {
        System.out.println("\n📝 Phase 3: Transcription and Lyrics Enhancement");
        System.out.println("-----------------------------------------------");
        
        try {
            // Create transcription
            Map<String, Object> transcriptionOptions = new HashMap<>();
            transcriptionOptions.put("languages", Arrays.asList("en", "auto-detect"));
            transcriptionOptions.put("includeTimestamps", true);
            transcriptionOptions.put("wordLevelTimestamps", true);
            transcriptionOptions.put("speakerDiarization", true);
            transcriptionOptions.put("model", "large");
            
            Map<String, Object> transcription = client.transcription().createTranscription(
                (String) track.get("id"), transcriptionOptions);
            
            System.out.println("✅ Transcription completed!");
            System.out.printf("Language detected: %s%n", transcription.get("language"));
            System.out.printf("Confidence: %.2f%n", transcription.get("confidence"));
            
            String text = (String) transcription.get("text");
            String preview = text.length() > 150 ? text.substring(0, 150) + "..." : text;
            System.out.printf("Text preview: %s%n", preview);
            
            // Enhance lyrics with AI
            Map<String, Object> enhancementOptions = new HashMap<>();
            enhancementOptions.put("improveMeter", true);
            enhancementOptions.put("enhanceRhyming", true);
            enhancementOptions.put("adjustTone", "professional");
            enhancementOptions.put("preserveOriginalMeaning", true);
            
            Map<String, Object> enhancedLyrics = client.transcription().enhanceLyrics(text, enhancementOptions);
            
            System.out.println("✅ Lyrics enhanced!");
            List<String> enhancements = (List<String>) enhancedLyrics.get("enhancements");
            System.out.printf("Enhancements applied: %s%n", String.join(", ", enhancements));
            
            return enhancedLyrics;
            
        } catch (Exception e) {
            System.out.println("⚠️  Transcription not available (instrumental or processing failed)");
            System.out.println("Proceeding with AI-generated lyrics instead...");
            
            // Generate AI lyrics based on mood and style
            Map<String, Object> lyricsOptions = new HashMap<>();
            
            Map<String, Object> mood = (Map<String, Object>) analysis.get("mood");
            String moodPrimary = mood != null ? (String) mood.get("primary") : "uplifting";
            
            Map<String, Object> tempo = (Map<String, Object>) analysis.get("tempo");
            Integer tempoBpm = tempo != null ? ((Number) tempo.get("bpm")).intValue() : 120;
            
            Map<String, Object> key = (Map<String, Object>) analysis.get("key");
            String keyStr = key != null ? 
                String.format("%s %s", key.get("key"), key.get("mode")) : "C major";
            
            lyricsOptions.put("theme", moodPrimary + " electronic music");
            lyricsOptions.put("genre", track.getOrDefault("genre", "electronic"));
            lyricsOptions.put("language", "en");
            lyricsOptions.put("mood", moodPrimary);
            lyricsOptions.put("structure", "verse-chorus-verse-chorus-bridge-chorus");
            lyricsOptions.put("tempo", tempoBpm);
            lyricsOptions.put("key", keyStr);
            
            Map<String, Object> transcription = client.copilot().generateLyrics(lyricsOptions);
            
            System.out.println("✅ AI lyrics generated!");
            System.out.printf("Theme: %s%n", transcription.get("theme"));
            
            String text = (String) transcription.get("text");
            String preview = text.length() > 150 ? text.substring(0, 150) + "..." : text;
            System.out.printf("Text preview: %s%n", preview);
            
            return transcription;
        }
    }
    
    private Map<String, Object> phase4AIComposition(Map<String, Object> track, Map<String, Object> analysis) throws Exception {
        System.out.println("\n🤖 Phase 4: AI-Assisted Composition");
        System.out.println("------------------------------------");
        
        // Extract analysis data
        Map<String, Object> key = (Map<String, Object>) analysis.get("key");
        Map<String, Object> tempo = (Map<String, Object>) analysis.get("tempo");
        Map<String, Object> mood = (Map<String, Object>) analysis.get("mood");
        
        String keyName = key != null ? (String) key.get("key") : "C";
        String keyMode = key != null ? (String) key.get("mode") : "major";
        Integer tempoBpm = tempo != null ? ((Number) tempo.get("bpm")).intValue() : 120;
        String moodPrimary = mood != null ? (String) mood.get("primary") : "uplifting";
        String moodEnergy = mood != null ? (String) mood.get("energy") : "medium";
        
        // Generate composition elements concurrently
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        // Generate harmony
        CompletableFuture<Map<String, Object>> harmonyFuture = CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, Object> harmonyOptions = new HashMap<>();
                harmonyOptions.put("style", track.getOrDefault("genre", "electronic"));
                harmonyOptions.put("key", keyName);
                harmonyOptions.put("mode", keyMode);
                harmonyOptions.put("tempo", tempoBpm);
                harmonyOptions.put("complexity", "medium");
                harmonyOptions.put("voicing", "modern");
                
                return client.copilot().generateHarmony(harmonyOptions);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        // Generate chord progression
        CompletableFuture<Map<String, Object>> chordProgressionFuture = CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, Object> chordOptions = new HashMap<>();
                chordOptions.put("key", keyName + " " + keyMode);
                chordOptions.put("style", track.getOrDefault("genre", "electronic"));
                chordOptions.put("complexity", 0.5);
                chordOptions.put("length", 8);
                
                return client.copilot().generateChordProgression(chordOptions);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        // Generate arrangement suggestions
        CompletableFuture<Map<String, Object>> arrangementFuture = CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, Object> arrangementOptions = new HashMap<>();
                arrangementOptions.put("trackId", track.get("id"));
                arrangementOptions.put("genre", track.getOrDefault("genre", "electronic"));
                arrangementOptions.put("mood", moodPrimary);
                arrangementOptions.put("duration", track.getOrDefault("duration", 180));
                arrangementOptions.put("energy", moodEnergy);
                
                return client.copilot().suggestArrangement(arrangementOptions);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        // Wait for all to complete
        CompletableFuture<Void> allTasks = CompletableFuture.allOf(
            harmonyFuture, chordProgressionFuture, arrangementFuture);
        
        allTasks.join();
        
        Map<String, Object> harmony = harmonyFuture.get();
        Map<String, Object> chordProgression = chordProgressionFuture.get();
        Map<String, Object> arrangement = arrangementFuture.get();
        
        System.out.println("✅ AI composition elements generated!");
        System.out.printf("🎼 Harmony ID: %s%n", harmony.get("id"));
        
        List<String> progression = (List<String>) chordProgression.get("progression");
        System.out.printf("🎹 Chord progression: %s%n", String.join(" - ", progression));
        
        List<String> structure = (List<String>) arrangement.get("structure");
        System.out.printf("🎛️  Suggested arrangement: %s%n", String.join(" → ", structure));
        
        // Create a style variation
        Map<String, Object> styleOptions = new HashMap<>();
        styleOptions.put("sourceId", track.get("id"));
        styleOptions.put("targetStyle", "ambient");
        styleOptions.put("intensity", 0.6);
        styleOptions.put("preserveStructure", true);
        styleOptions.put("preserveTiming", true);
        
        Map<String, Object> styleVariation = client.copilot().applyStyleTransfer(styleOptions);
        
        System.out.println("✅ Style variation created!");
        System.out.printf("🎨 Variation ID: %s%n", styleVariation.get("id"));
        System.out.printf("Applied style: %s%n", styleVariation.get("appliedStyle"));
        
        executor.shutdown();
        
        Map<String, Object> compositionResults = new HashMap<>();
        compositionResults.put("harmony", harmony);
        compositionResults.put("chordProgression", chordProgression);
        compositionResults.put("arrangement", arrangement);
        compositionResults.put("styleVariation", styleVariation);
        
        return compositionResults;
    }
    
    private Map<String, Object> phase5ReleaseAndDistribution(Map<String, Object> track, Map<String, Object> analysis) throws Exception {
        System.out.println("\n📡 Phase 5: Release Creation and Distribution");
        System.out.println("--------------------------------------------");
        
        // Create release
        Map<String, Object> releaseData = new HashMap<>();
        releaseData.put("type", "single");
        releaseData.put("title", track.get("title"));
        releaseData.put("artist", track.get("artist"));
        releaseData.put("releaseDate", "2025-09-01");
        
        Map<String, Object> trackData = new HashMap<>();
        trackData.put("trackId", track.get("id"));
        trackData.put("title", track.get("title"));
        trackData.put("duration", track.getOrDefault("duration", 180));
        trackData.put("isrc", generateMockISRC());
        
        releaseData.put("tracks", Arrays.asList(trackData));
        
        Map<String, Object> artwork = new HashMap<>();
        artwork.put("primary", true);
        artwork.put("type", "cover");
        releaseData.put("artwork", artwork);
        
        // Metadata from analysis
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("genre", track.getOrDefault("genre", "Electronic"));
        
        Map<String, Object> style = (Map<String, Object>) analysis.get("style");
        if (style != null) {
            metadata.put("subgenre", style.get("subgenre"));
        }
        
        Map<String, Object> mood = (Map<String, Object>) analysis.get("mood");
        if (mood != null) {
            metadata.put("mood", mood.get("primary"));
        }
        
        Map<String, Object> tempo = (Map<String, Object>) analysis.get("tempo");
        if (tempo != null) {
            metadata.put("tempo", tempo.get("bpm"));
        }
        
        Map<String, Object> key = (Map<String, Object>) analysis.get("key");
        if (key != null) {
            metadata.put("key", String.format("%s %s", key.get("key"), key.get("mode")));
        }
        
        metadata.put("explicit", false);
        
        Map<String, Object> artistCredit = new HashMap<>();
        artistCredit.put("role", "artist");
        artistCredit.put("name", track.get("artist"));
        
        Map<String, Object> producerCredit = new HashMap<>();
        producerCredit.put("role", "producer");
        producerCredit.put("name", "AI-Assisted Production");
        
        metadata.put("credits", Arrays.asList(artistCredit, producerCredit));
        
        releaseData.put("metadata", metadata);
        releaseData.put("territories", Arrays.asList("worldwide"));
        releaseData.put("platforms", Arrays.asList("spotify", "apple-music", "youtube-music", "soundcloud", "bandcamp"));
        
        Map<String, Object> release = client.distribution().createRelease(releaseData);
        
        System.out.println("✅ Release created!");
        System.out.printf("📦 Release ID: %s%n", release.get("id"));
        System.out.printf("Status: %s%n", release.get("status"));
        
        // Validate release before submission
        Map<String, Object> validation = client.distribution().validateRelease((String) release.get("id"));
        
        System.out.println("\n🔍 Release validation:");
        System.out.printf("Valid: %s%n", validation.get("valid"));
        
        Boolean isValid = (Boolean) validation.get("valid");
        if (!isValid) {
            System.out.println("⚠️  Validation issues:");
            List<Map<String, Object>> issues = (List<Map<String, Object>>) validation.get("issues");
            for (Map<String, Object> issue : issues) {
                System.out.printf("   - %s: %s%n", issue.get("severity"), issue.get("message"));
            }
        }
        
        // Submit for distribution (if valid)
        Map<String, Object> submissionResult = null;
        if (isValid) {
            Map<String, Object> submissionData = new HashMap<>();
            submissionData.put("platforms", Arrays.asList("spotify", "apple-music"));
            submissionData.put("scheduledDate", "2025-09-01T00:00:00Z");
            submissionData.put("expedited", false);
            
            submissionResult = client.distribution().submitToPlatforms((String) release.get("id"), submissionData);
            
            System.out.println("✅ Release submitted for distribution!");
            System.out.printf("Submission ID: %s%n", submissionResult.get("id"));
            System.out.printf("Expected processing time: %s%n", submissionResult.get("estimatedProcessingTime"));
        }
        
        Map<String, Object> distributionResults = new HashMap<>();
        distributionResults.put("release", release);
        distributionResults.put("validation", validation);
        if (submissionResult != null) {
            distributionResults.put("submission", submissionResult);
        }
        
        return distributionResults;
    }
    
    private Map<String, Object> phase6AnalyticsSetup(Map<String, Object> distribution) throws Exception {
        System.out.println("\n📊 Phase 6: Analytics Setup and Monitoring");
        System.out.println("------------------------------------------");
        
        Map<String, Object> release = (Map<String, Object>) distribution.get("release");
        
        // Setup analytics alerts
        Map<String, Object> alertData = new HashMap<>();
        alertData.put("name", "Track Performance Alert");
        alertData.put("releaseId", release.get("id"));
        
        Map<String, Object> condition1 = new HashMap<>();
        condition1.put("metric", "streams");
        condition1.put("operator", "greater_than");
        condition1.put("threshold", 1000);
        condition1.put("period", "day");
        
        Map<String, Object> condition2 = new HashMap<>();
        condition2.put("metric", "completion_rate");
        condition2.put("operator", "less_than");
        condition2.put("threshold", 0.5);
        condition2.put("period", "day");
        
        alertData.put("conditions", Arrays.asList(condition1, condition2));
        
        Map<String, Object> notifications = new HashMap<>();
        notifications.put("email", true);
        notifications.put("webhook", true);
        notifications.put("dashboard", true);
        
        alertData.put("notifications", notifications);
        
        Map<String, Object> alert = client.analytics().setupAlert(alertData);
        
        System.out.println("✅ Analytics alert created!");
        System.out.printf("Alert ID: %s%n", alert.get("id"));
        
        // Try to get initial analytics (if track has existing data)
        try {
            List<Map<String, Object>> tracks = (List<Map<String, Object>>) release.get("tracks");
            String trackId = (String) tracks.get(0).get("trackId");
            
            Map<String, Object> analyticsQuery = new HashMap<>();
            analyticsQuery.put("startDate", "2025-01-01");
            analyticsQuery.put("endDate", "2025-01-31");
            analyticsQuery.put("metrics", Arrays.asList("streams", "listeners", "completion_rate", "skip_rate"));
            analyticsQuery.put("groupBy", "day");
            
            Map<String, Object> initialAnalytics = client.analytics().getTrackAnalytics(trackId, analyticsQuery);
            
            Map<String, Object> summary = (Map<String, Object>) initialAnalytics.get("summary");
            Integer totalStreams = (Integer) summary.get("totalStreams");
            
            if (totalStreams > 0) {
                System.out.println("📈 Initial analytics:");
                System.out.printf("   Total streams: %d%n", summary.get("totalStreams"));
                System.out.printf("   Unique listeners: %d%n", summary.get("uniqueListeners"));
                System.out.printf("   Completion rate: %.1f%%%n", 
                    ((Number) summary.get("completionRate")).doubleValue() * 100);
            }
        } catch (Exception e) {
            System.out.println("⚠️  No analytics data available yet (new track)");
        }
        
        Map<String, Object> analyticsResults = new HashMap<>();
        analyticsResults.put("alert", alert);
        
        return analyticsResults;
    }
    
    private Map<String, Object> waitForProcessing(Map<String, Object> track) throws Exception {
        // Simulate waiting for processing
        String trackId = (String) track.get("id");
        int maxAttempts = 10;
        int attempt = 0;
        
        while (attempt < maxAttempts) {
            Map<String, Object> currentTrack = client.tracks().getTrack(trackId);
            String status = (String) currentTrack.get("status");
            
            if ("processed".equals(status) || "ready".equals(status)) {
                return currentTrack;
            }
            
            if ("failed".equals(status) || "error".equals(status)) {
                throw new RuntimeException("Track processing failed");
            }
            
            attempt++;
            Thread.sleep(2000); // Wait 2 seconds
        }
        
        throw new RuntimeException("Track processing timeout");
    }
    
    private String generateMockISRC() {
        // Generate a mock ISRC code
        long timestamp = System.currentTimeMillis();
        return "US" + String.valueOf(timestamp).substring(5, 13);
    }
    
    private void printWorkflowSummary(Map<String, Object> results) {
        System.out.println("\n✨ Phase 7: Workflow Summary");
        System.out.println("----------------------------");
        
        Map<String, Object> track = (Map<String, Object>) results.get("track");
        Map<String, Object> analysis = (Map<String, Object>) results.get("analysis");
        Map<String, Object> composition = (Map<String, Object>) results.get("composition");
        Map<String, Object> transcription = (Map<String, Object>) results.get("transcription");
        Map<String, Object> distribution = (Map<String, Object>) results.get("distribution");
        Map<String, Object> analytics = (Map<String, Object>) results.get("analytics");
        
        System.out.println("🎉 Workflow completed successfully!");
        System.out.println("\n📋 Summary:");
        
        // Track summary
        System.out.printf("Track: %s by %s (ID: %s)%n", 
            track.get("title"), track.get("artist"), track.get("id"));
        
        // Analysis summary
        if (analysis != null) {
            Map<String, Object> tempo = (Map<String, Object>) analysis.get("tempo");
            Map<String, Object> key = (Map<String, Object>) analysis.get("key");
            Map<String, Object> quality = (Map<String, Object>) analysis.get("quality");
            
            if (tempo != null && key != null && quality != null) {
                System.out.printf("Analysis: %.1f BPM, %s %s, Quality %.2f%n", 
                    tempo.get("bpm"), key.get("key"), key.get("mode"), quality.get("overallScore"));
            }
        }
        
        // Composition summary
        if (composition != null) {
            Map<String, Object> harmony = (Map<String, Object>) composition.get("harmony");
            Map<String, Object> styleVariation = (Map<String, Object>) composition.get("styleVariation");
            
            if (harmony != null && styleVariation != null) {
                System.out.printf("Composition: Harmony %s, Style variation %s%n", 
                    harmony.get("id"), styleVariation.get("id"));
            }
        }
        
        // Distribution summary
        if (distribution != null) {
            Map<String, Object> release = (Map<String, Object>) distribution.get("release");
            Map<String, Object> validation = (Map<String, Object>) distribution.get("validation");
            
            if (release != null && validation != null) {
                System.out.printf("Distribution: Release %s (%s), Valid: %s%n", 
                    release.get("id"), release.get("status"), validation.get("valid"));
            }
        }
        
        System.out.println("\n🚀 Next Steps:");
        System.out.println("1. Monitor distribution status for platform approval");
        System.out.println("2. Track analytics and streaming performance");
        System.out.println("3. Use AI insights for future compositions");
        System.out.println("4. Create variations and remixes using style transfer");
        System.out.println("5. Optimize release strategy based on performance data");
    }
}