/**
 * Basic Usage Example for JewelMusic Java SDK
 * 
 * This example demonstrates basic functionality:
 * - Client initialization and authentication
 * - Track upload and management
 * - Music analysis
 * - User profile management
 * - Error handling
 */

import com.jewelmusic.JewelMusic;
import com.jewelmusic.JewelMusicClient;
import com.jewelmusic.exceptions.*;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;

public class BasicUsageExample {
    
    private static final String API_KEY = System.getenv("JEWELMUSIC_API_KEY");
    
    public static void main(String[] args) {
        System.out.println("🎵 JewelMusic Java SDK - Basic Usage Example");
        System.out.println("=============================================");
        
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
            // Run basic usage examples
            runBasicUsageExamples(client);
            
            System.out.println("\n✨ Basic usage examples completed successfully!");
            
        } catch (Exception e) {
            System.err.printf("\n💥 Basic usage examples failed: %s%n", e.getMessage());
            System.exit(1);
        }
    }
    
    private static void runBasicUsageExamples(JewelMusic client) throws Exception {
        // Test connection and get user profile
        testConnection(client);
        
        // Upload and manage tracks
        Map<String, Object> track = uploadAndManageTrack(client);
        
        // Analyze track
        analyzeTrack(client, (String) track.get("id"));
        
        // List and search tracks
        listAndSearchTracks(client);
        
        // Demonstrate error handling
        demonstrateErrorHandling(client);
    }
    
    private static void testConnection(JewelMusic client) {
        System.out.println("\n👤 Testing connection and getting user profile...");
        
        try {
            Map<String, Object> profile = client.user().getProfile();
            System.out.printf("✅ Connected! User: %s%n", profile.get("name"));
            System.out.printf("Plan: %s%n", 
                ((Map<String, Object>) profile.get("subscription")).get("plan"));
            
        } catch (Exception e) {
            System.err.printf("❌ Connection test failed: %s%n", e.getMessage());
            throw new RuntimeException(e);
        }
    }
    
    private static Map<String, Object> uploadAndManageTrack(JewelMusic client) {
        System.out.println("\n📤 Track upload and management...");
        
        try {
            // Check for sample audio file
            File sampleFile = new File("sample-audio.mp3");
            
            if (sampleFile.exists()) {
                System.out.println("📁 Found sample audio file, uploading...");
                
                // Upload track with metadata
                Map<String, String> metadata = new HashMap<>();
                metadata.put("title", "Java SDK Demo Track");
                metadata.put("artist", "SDK Demo Artist");
                metadata.put("album", "Demo Album");
                metadata.put("genre", "Electronic");
                metadata.put("releaseDate", "2025-09-01");
                
                Map<String, Object> track = client.tracks().uploadTrack(sampleFile, "sample-audio.mp3", metadata);
                
                System.out.printf("✅ Track uploaded successfully!%n");
                System.out.printf("Track ID: %s%n", track.get("id"));
                System.out.printf("Title: %s%n", track.get("title"));
                System.out.printf("Artist: %s%n", track.get("artist"));
                System.out.printf("Status: %s%n", track.get("status"));
                
                return track;
                
            } else {
                System.out.println("⚠️  No sample audio file found, using existing track...");
                
                // Get existing tracks
                Map<String, Object> tracksResponse = client.tracks().listTracks(1, 1);
                List<Map<String, Object>> tracks = (List<Map<String, Object>>) tracksResponse.get("items");
                
                if (tracks.isEmpty()) {
                    throw new RuntimeException("No tracks available. Please upload a track first or add sample-audio.mp3");
                }
                
                Map<String, Object> track = tracks.get(0);
                System.out.printf("✅ Using existing track: %s%n", track.get("title"));
                
                return track;
            }
            
        } catch (Exception e) {
            System.err.printf("❌ Track upload/management failed: %s%n", e.getMessage());
            throw new RuntimeException(e);
        }
    }
    
    private static void analyzeTrack(JewelMusic client, String trackId) {
        System.out.println("\n🔍 Analyzing track...");
        
        try {
            Map<String, Object> analysis = client.analysis().analyzeTrack(trackId);
            
            System.out.println("✅ Analysis completed!");
            
            // Extract analysis results
            Map<String, Object> tempo = (Map<String, Object>) analysis.get("tempo");
            if (tempo != null) {
                System.out.printf("🥁 Tempo: %.1f BPM%n", tempo.get("bpm"));
            }
            
            Map<String, Object> key = (Map<String, Object>) analysis.get("key");
            if (key != null) {
                System.out.printf("🎹 Key: %s %s%n", key.get("key"), key.get("mode"));
            }
            
            Map<String, Object> quality = (Map<String, Object>) analysis.get("quality");
            if (quality != null) {
                System.out.printf("📊 Quality Score: %.2f/1.0%n", quality.get("overallScore"));
            }
            
            Map<String, Object> mood = (Map<String, Object>) analysis.get("mood");
            if (mood != null) {
                System.out.printf("😊 Primary Mood: %s%n", mood.get("primary"));
            }
            
        } catch (Exception e) {
            System.err.printf("❌ Track analysis failed: %s%n", e.getMessage());
            // Don't throw here, analysis failure shouldn't stop the example
        }
    }
    
    private static void listAndSearchTracks(JewelMusic client) {
        System.out.println("\n📋 Listing and searching tracks...");
        
        try {
            // List tracks with pagination
            Map<String, Object> response = client.tracks().listTracks(1, 5);
            List<Map<String, Object>> tracks = (List<Map<String, Object>>) response.get("items");
            Map<String, Object> pagination = (Map<String, Object>) response.get("pagination");
            
            System.out.printf("📁 Found %d tracks (showing %d):%n", 
                pagination.get("total"), tracks.size());
                
            for (int i = 0; i < tracks.size(); i++) {
                Map<String, Object> track = tracks.get(i);
                System.out.printf("%d. %s by %s%n", 
                    i + 1, track.get("title"), track.get("artist"));
            }
            
            // Search for tracks
            if (!tracks.isEmpty()) {
                String searchQuery = "demo";
                System.out.printf("\n🔍 Searching for tracks with query: '%s'%n", searchQuery);
                
                Map<String, Object> searchResults = client.tracks().searchTracks(searchQuery);
                List<Map<String, Object>> foundTracks = (List<Map<String, Object>>) searchResults.get("items");
                
                System.out.printf("✅ Found %d tracks matching '%s'%n", foundTracks.size(), searchQuery);
            }
            
        } catch (Exception e) {
            System.err.printf("❌ Track listing/searching failed: %s%n", e.getMessage());
        }
    }
    
    private static void demonstrateErrorHandling(JewelMusic client) {
        System.out.println("\n🛡️  Error Handling Demonstration");
        System.out.println("--------------------------------");
        
        // Test with invalid track ID
        try {
            System.out.println("Testing with invalid track ID...");
            Map<String, Object> track = client.tracks().getTrack("invalid-track-id");
            
        } catch (AuthenticationException e) {
            System.out.printf("✅ Caught AuthenticationException: %s%n", e.getMessage());
            System.out.printf("   Request ID: %s%n", e.getRequestId());
            System.out.printf("   Status Code: %d%n", e.getStatusCode());
            
        } catch (ValidationException e) {
            System.out.printf("✅ Caught ValidationException: %s%n", e.getMessage());
            System.out.printf("   Validation errors: %s%n", e.getFieldErrors());
            
        } catch (NotFoundException e) {
            System.out.printf("✅ Caught NotFoundException: %s%n", e.getMessage());
            
        } catch (RateLimitException e) {
            System.out.printf("✅ Caught RateLimitException: %s%n", e.getMessage());
            System.out.printf("   Retry after: %d seconds%n", e.getRetryAfterSeconds());
            
        } catch (NetworkException e) {
            System.out.printf("✅ Caught NetworkException: %s%n", e.getMessage());
            
        } catch (JewelMusicException e) {
            System.out.printf("✅ Caught JewelMusicException: %s%n", e.getMessage());
            System.out.printf("   Status code: %d%n", e.getStatusCode());
            
        } catch (Exception e) {
            System.out.printf("❌ Unexpected exception: %s%n", e.getMessage());
        }
    }
    
    private static void advancedConfiguration() {
        System.out.println("\n⚙️  Advanced Configuration Example");
        System.out.println("---------------------------------");
        
        // Advanced client configuration
        Map<String, String> customHeaders = new HashMap<>();
        customHeaders.put("X-Custom-Header", "MyApp-1.0");
        
        JewelMusic client = new JewelMusicClient.Builder(API_KEY)
            .baseUrl("https://api.jewelmusic.art")
            .timeout(java.time.Duration.ofSeconds(30))
            .maxRetries(5)
            .userAgent("JavaSDKExample/1.0")
            .additionalHeaders(customHeaders)
            .build();
        
        try {
            // Test the advanced client
            Map<String, Object> profile = client.user().getProfile();
            System.out.printf("✅ Advanced client connected! User: %s%n", profile.get("name"));
            
        } catch (Exception e) {
            System.err.printf("❌ Advanced client test failed: %s%n", e.getMessage());
        }
    }
    
    private static void fileUploadDemo(JewelMusic client) {
        System.out.println("\n📤 File Upload Demonstration");
        System.out.println("----------------------------");
        
        try {
            // Upload from file
            File audioFile = new File("demo-track.mp3");
            if (audioFile.exists()) {
                System.out.println("📁 Uploading from file...");
                
                Map<String, Object> track = client.tracks().uploadTrack(audioFile, "demo-track.mp3");
                System.out.printf("✅ File uploaded: %s%n", track.get("id"));
            }
            
            // Upload with metadata
            Map<String, String> metadata = new HashMap<>();
            metadata.put("title", "Java Upload Demo");
            metadata.put("artist", "Java Developer");
            metadata.put("genre", "Demo");
            
            if (audioFile.exists()) {
                Map<String, Object> trackWithMeta = client.tracks().uploadTrack(
                    audioFile, "demo-track.mp3", metadata);
                System.out.printf("✅ File with metadata uploaded: %s%n", trackWithMeta.get("id"));
            }
            
        } catch (Exception e) {
            System.out.printf("⚠️  File upload demo skipped: %s%n", e.getMessage());
        }
    }
}