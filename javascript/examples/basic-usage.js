/**
 * Basic Usage Example
 * 
 * This example demonstrates the fundamental features of the JewelMusic SDK:
 * - Client initialization
 * - Track upload
 * - Basic analysis
 * - Simple distribution setup
 */

const { JewelMusic } = require('@jewelmusic/sdk');
const fs = require('fs');
const path = require('path');

async function basicUsageExample() {
  // Initialize the client
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox' // Use sandbox for testing
  });

  try {
    // Test connection
    console.log('Testing API connection...');
    const ping = await client.ping();
    console.log('✅ Connected to JewelMusic API v' + ping.version);

    // Load audio file
    const audioPath = path.join(__dirname, 'sample-audio.mp3');
    if (!fs.existsSync(audioPath)) {
      console.log('⚠️  Sample audio file not found. Please add sample-audio.mp3 to the examples directory.');
      return;
    }

    const audioFile = fs.readFileSync(audioPath);
    console.log('📁 Loaded audio file:', audioPath);

    // Upload track with metadata
    console.log('\n📤 Uploading track...');
    const track = await client.tracks.upload(audioFile, {
      title: 'Sample Song',
      artist: 'Sample Artist',
      album: 'Sample Album',
      genre: 'Electronic',
      releaseDate: '2025-09-01'
    }, {
      onProgress: (progress) => {
        process.stdout.write(`\rUpload progress: ${progress.percentage}%`);
      }
    });

    console.log('\n✅ Track uploaded successfully!');
    console.log('Track ID:', track.id);
    console.log('Status:', track.status);
    console.log('Duration:', track.duration + 's');

    // Wait for track processing
    console.log('\n⏳ Waiting for track processing...');
    const processedTrack = await client.tracks.waitForProcessing(track.id);
    console.log('✅ Track processed:', processedTrack.status);

    // Basic analysis
    console.log('\n🔍 Analyzing track...');
    const analysis = await client.analysis.uploadTrack(audioFile, {
      analysisTypes: ['tempo', 'key', 'structure'],
      detailedReport: false
    });

    console.log('✅ Analysis completed!');
    console.log('Tempo:', analysis.tempo.bpm + ' BPM');
    console.log('Key:', analysis.key.key + ' ' + analysis.key.mode);
    console.log('Structure:', analysis.structure.sections.map(s => s.type).join(' - '));

    // Get user profile
    console.log('\n👤 Getting user profile...');
    const profile = await client.user.getProfile();
    console.log('✅ User:', profile.name);
    console.log('Plan:', profile.subscription.plan);

    // Simple distribution setup (create release)
    console.log('\n📡 Creating release for distribution...');
    const release = await client.distribution.createRelease({
      type: 'single',
      title: track.title,
      artist: track.artist,
      releaseDate: '2025-09-01',
      tracks: [{
        trackId: track.id,
        title: track.title,
        duration: track.duration
      }],
      territories: ['US', 'CA', 'GB'],
      platforms: ['spotify', 'apple-music']
    });

    console.log('✅ Release created!');
    console.log('Release ID:', release.id);
    console.log('Status:', release.status);

    console.log('\n🎉 Basic usage example completed successfully!');
    console.log('\nNext steps:');
    console.log('- Check out advanced-features.js for more capabilities');
    console.log('- See ai-generation.js for AI music creation');
    console.log('- Look at webhook-handling.js for real-time notifications');

    return {
      track,
      analysis,
      release,
      profile
    };

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    // Handle specific error types
    if (error.name === 'AuthenticationError') {
      console.log('💡 Make sure your API key is set: export JEWELMUSIC_API_KEY=your_key_here');
    } else if (error.name === 'ValidationError') {
      console.log('💡 Check your input data:', error.details);
    } else if (error.name === 'RateLimitError') {
      console.log('💡 Rate limit exceeded. Try again in', error.retryAfter, 'seconds');
    }
    
    throw error;
  }
}

// Run the example
if (require.main === module) {
  basicUsageExample()
    .then((result) => {
      console.log('\n✨ Example completed successfully!');
    })
    .catch((error) => {
      console.error('\n💥 Example failed:', error.message);
      process.exit(1);
    });
}

module.exports = { basicUsageExample };