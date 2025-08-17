/**
 * Complete Workflow Example
 * 
 * This example demonstrates a comprehensive music production workflow using JewelMusic:
 * - Upload and process audio tracks
 * - AI-powered analysis and enhancement
 * - Automated transcription and lyrics enhancement
 * - AI-assisted composition
 * - Release creation and distribution
 * - Analytics and monitoring
 */

const { JewelMusic } = require('@jewelmusic/sdk');
const fs = require('fs');
const path = require('path');

async function completeWorkflowExample() {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  try {
    console.log('🎵 JewelMusic Complete Workflow Example');
    console.log('======================================\n');

    // Phase 1: Track Upload and Processing
    console.log('📤 Phase 1: Track Upload and Processing');
    console.log('--------------------------------------');

    const audioPath = path.join(__dirname, 'sample-audio.mp3');
    let track;

    if (fs.existsSync(audioPath)) {
      console.log('📁 Found sample audio file, uploading...');
      
      const audioFile = fs.readFileSync(audioPath);
      track = await client.tracks.upload(audioFile, {
        title: 'Workflow Demo Track',
        artist: 'SDK Demo Artist',
        album: 'Demo Album',
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

      // Wait for processing
      console.log('\n⏳ Waiting for track processing...');
      const processedTrack = await client.tracks.waitForProcessing(track.id);
      console.log('✅ Track processed:', processedTrack.status);

    } else {
      console.log('⚠️  No sample audio file found, using existing track...');
      
      // Get an existing track
      const tracks = await client.tracks.list({ page: 1, perPage: 1 });
      if (tracks.items.length === 0) {
        throw new Error('No tracks available for demonstration. Please upload a track first or add sample-audio.mp3');
      }
      
      track = tracks.items[0];
      console.log('✅ Using existing track:', track.title);
    }

    // Phase 2: AI Analysis and Quality Assessment
    console.log('\n🔍 Phase 2: AI Analysis and Quality Assessment');
    console.log('---------------------------------------------');

    // Comprehensive analysis
    const analysis = await client.analysis.uploadTrack(audioPath || null, {
      trackId: track.id,
      analysisTypes: ['tempo', 'key', 'structure', 'quality', 'loudness', 'mood'],
      detailedReport: true,
      culturalContext: 'global',
      targetPlatforms: ['spotify', 'apple-music', 'youtube-music']
    });

    console.log('✅ Analysis completed!');
    console.log('📊 Results:');
    console.log(`   Tempo: ${analysis.tempo.bpm} BPM (confidence: ${analysis.tempo.confidence})`);
    console.log(`   Key: ${analysis.key.key} ${analysis.key.mode} (confidence: ${analysis.key.confidence})`);
    console.log(`   Quality Score: ${analysis.quality.overallScore}/1.0`);
    console.log(`   Loudness: ${analysis.loudness.lufs} LUFS`);
    console.log(`   Primary Mood: ${analysis.mood.primary} (${analysis.mood.energy} energy)`);

    // Quality recommendations
    if (analysis.quality.recommendations) {
      console.log('\n💡 Quality Recommendations:');
      analysis.quality.recommendations.forEach(rec => {
        console.log(`   - ${rec.type}: ${rec.suggestion}`);
      });
    }

    // Phase 3: Transcription and Lyrics Enhancement
    console.log('\n📝 Phase 3: Transcription and Lyrics Enhancement');
    console.log('-----------------------------------------------');

    let transcription;
    try {
      // Create transcription
      transcription = await client.transcription.create(track.id, {
        languages: ['en', 'auto-detect'],
        includeTimestamps: true,
        wordLevelTimestamps: true,
        speakerDiarization: true,
        model: 'large'
      });

      console.log('✅ Transcription completed!');
      console.log('Language detected:', transcription.language);
      console.log('Confidence:', transcription.confidence);
      console.log('Text preview:', transcription.text.substring(0, 150) + '...');

      // Enhance lyrics with AI
      const enhancedLyrics = await client.transcription.enhanceLyrics(
        transcription.text,
        {
          improveMeter: true,
          enhanceRhyming: true,
          adjustTone: 'professional',
          preserveOriginalMeaning: true
        }
      );

      console.log('✅ Lyrics enhanced!');
      console.log('Enhancements applied:', enhancedLyrics.enhancements.join(', '));

    } catch (error) {
      console.log('⚠️  Transcription not available for this track (instrumental or processing failed)');
      console.log('Proceeding with AI-generated lyrics instead...');

      // Generate AI lyrics based on the mood and style
      transcription = await client.copilot.generateLyrics({
        theme: `${analysis.mood.primary} electronic music`,
        genre: track.genre || 'electronic',
        language: 'en',
        mood: analysis.mood.primary,
        structure: 'verse-chorus-verse-chorus-bridge-chorus',
        tempo: analysis.tempo.bpm,
        key: `${analysis.key.key} ${analysis.key.mode}`
      });

      console.log('✅ AI lyrics generated!');
      console.log('Theme:', transcription.theme);
      console.log('Text preview:', transcription.text.substring(0, 150) + '...');
    }

    // Phase 4: AI-Assisted Composition
    console.log('\n🤖 Phase 4: AI-Assisted Composition');
    console.log('------------------------------------');

    // Generate complementary elements
    const compositionElements = await Promise.all([
      // Generate harmony
      client.copilot.generateHarmony({
        style: track.genre || 'electronic',
        key: analysis.key.key,
        mode: analysis.key.mode,
        tempo: analysis.tempo.bpm,
        complexity: 'medium',
        voicing: 'modern'
      }),

      // Generate chord progression
      client.copilot.chordProgression({
        key: analysis.key.key,
        mode: analysis.key.mode,
        style: track.genre || 'electronic',
        complexity: 'medium',
        length: 8
      }),

      // Generate arrangement suggestions
      client.copilot.suggestArrangement({
        trackId: track.id,
        genre: track.genre || 'electronic',
        mood: analysis.mood.primary,
        duration: track.duration,
        energy: analysis.mood.energy
      })
    ]);

    const [harmony, chordProgression, arrangement] = compositionElements;

    console.log('✅ AI composition elements generated!');
    console.log('🎼 Harmony ID:', harmony.id);
    console.log('🎹 Chord progression:', chordProgression.progression.join(' - '));
    console.log('🎛️  Suggested arrangement:', arrangement.structure.join(' → '));

    // Create a remix or variation
    const styleVariation = await client.copilot.styleTransfer({
      sourceId: track.id,
      targetStyle: 'ambient',
      intensity: 0.6,
      preserveStructure: true,
      preserveTiming: true
    });

    console.log('✅ Style variation created!');
    console.log('🎨 Variation ID:', styleVariation.id);
    console.log('Applied style:', styleVariation.appliedStyle);

    // Phase 5: Release Creation and Distribution
    console.log('\n📡 Phase 5: Release Creation and Distribution');
    console.log('--------------------------------------------');

    // Create release
    const release = await client.distribution.createRelease({
      type: 'single',
      title: track.title,
      artist: track.artist,
      releaseDate: '2025-09-01',
      tracks: [{
        trackId: track.id,
        title: track.title,
        duration: track.duration,
        isrc: `US${Date.now().toString().slice(-8)}` // Generate mock ISRC
      }],
      artwork: {
        primary: true,
        type: 'cover',
        // In real scenario, you'd upload artwork
      },
      metadata: {
        genre: track.genre,
        subgenre: analysis.style?.subgenre,
        mood: analysis.mood.primary,
        tempo: analysis.tempo.bpm,
        key: `${analysis.key.key} ${analysis.key.mode}`,
        explicit: false,
        credits: [
          { role: 'artist', name: track.artist },
          { role: 'producer', name: 'AI-Assisted Production' }
        ]
      },
      territories: ['worldwide'],
      platforms: ['spotify', 'apple-music', 'youtube-music', 'soundcloud', 'bandcamp']
    });

    console.log('✅ Release created!');
    console.log('📦 Release ID:', release.id);
    console.log('Status:', release.status);

    // Validate release before submission
    const validation = await client.distribution.validateRelease(release.id);
    console.log('\n🔍 Release validation:');
    console.log('Valid:', validation.valid);
    
    if (!validation.valid) {
      console.log('⚠️  Validation issues:');
      validation.issues.forEach(issue => {
        console.log(`   - ${issue.severity}: ${issue.message}`);
      });
    }

    // Submit for distribution (if valid)
    if (validation.valid) {
      const submission = await client.distribution.submitToPlatforms(release.id, {
        platforms: ['spotify', 'apple-music'],
        scheduledDate: '2025-09-01T00:00:00Z',
        expedited: false
      });

      console.log('✅ Release submitted for distribution!');
      console.log('Submission ID:', submission.id);
      console.log('Expected processing time:', submission.estimatedProcessingTime);
    }

    // Phase 6: Analytics Setup and Monitoring
    console.log('\n📊 Phase 6: Analytics Setup and Monitoring');
    console.log('------------------------------------------');

    // Setup analytics alerts
    const alert = await client.analytics.setupAlert({
      name: 'Track Performance Alert',
      releaseId: release.id,
      conditions: [
        {
          metric: 'streams',
          operator: 'greater_than',
          threshold: 1000,
          period: 'day'
        },
        {
          metric: 'completion_rate',
          operator: 'less_than',
          threshold: 0.5,
          period: 'day'
        }
      ],
      notifications: {
        email: true,
        webhook: true,
        dashboard: true
      }
    });

    console.log('✅ Analytics alert created!');
    console.log('Alert ID:', alert.id);

    // Get initial analytics (if track has existing data)
    try {
      const initialAnalytics = await client.analytics.getTrackAnalytics(track.id, {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        metrics: ['streams', 'listeners', 'completion_rate', 'skip_rate'],
        groupBy: 'day'
      });

      if (initialAnalytics.summary.totalStreams > 0) {
        console.log('📈 Initial analytics:');
        console.log('   Total streams:', initialAnalytics.summary.totalStreams);
        console.log('   Unique listeners:', initialAnalytics.summary.uniqueListeners);
        console.log('   Completion rate:', (initialAnalytics.summary.completionRate * 100).toFixed(1) + '%');
      }
    } catch (error) {
      console.log('⚠️  No analytics data available yet (new track)');
    }

    // Phase 7: Workflow Summary and Next Steps
    console.log('\n✨ Phase 7: Workflow Summary');
    console.log('----------------------------');

    const workflowSummary = {
      track: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        status: track.status
      },
      analysis: {
        tempo: analysis.tempo.bpm,
        key: `${analysis.key.key} ${analysis.key.mode}`,
        quality: analysis.quality.overallScore,
        mood: analysis.mood.primary
      },
      composition: {
        harmonyId: harmony.id,
        chordProgression: chordProgression.progression.slice(0, 4).join(' - '),
        styleVariationId: styleVariation.id
      },
      transcription: {
        id: transcription.id,
        language: transcription.language,
        hasEnhancements: !!transcription.enhancements
      },
      release: {
        id: release.id,
        status: release.status,
        platforms: release.platforms.length,
        valid: validation.valid
      },
      analytics: {
        alertId: alert.id,
        monitoring: true
      }
    };

    console.log('🎉 Workflow completed successfully!');
    console.log('\n📋 Summary:');
    console.log(JSON.stringify(workflowSummary, null, 2));

    console.log('\n🚀 Next Steps:');
    console.log('1. Monitor distribution status for platform approval');
    console.log('2. Track analytics and streaming performance');
    console.log('3. Use AI insights for future compositions');
    console.log('4. Create variations and remixes using style transfer');
    console.log('5. Optimize release strategy based on performance data');

    return workflowSummary;

  } catch (error) {
    console.error('\n❌ Workflow error:', error.message);
    
    if (error.name === 'AuthenticationError') {
      console.log('💡 Make sure your API key is set: export JEWELMUSIC_API_KEY=your_key_here');
    } else if (error.name === 'ValidationError') {
      console.log('💡 Check input data:', error.details);
    } else if (error.name === 'RateLimitError') {
      console.log('💡 API rate limit exceeded. Try again in', error.retryAfter, 'seconds');
    }
    
    throw error;
  }
}

// Batch processing example
async function batchProcessingExample() {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  console.log('\n⚡ Batch Processing Example');
  console.log('==========================');

  try {
    // Get multiple tracks for batch processing
    const tracks = await client.tracks.list({ page: 1, perPage: 5 });
    
    if (tracks.items.length === 0) {
      console.log('⚠️  No tracks available for batch processing');
      return;
    }

    console.log(`📁 Processing ${tracks.items.length} tracks in batch...`);

    // Batch analyze all tracks
    const batchAnalyses = await Promise.all(
      tracks.items.map(async (track, index) => {
        try {
          console.log(`🔍 Analyzing track ${index + 1}/${tracks.items.length}: ${track.title}`);
          
          const analysis = await client.analysis.analyzeTrack(track.id, {
            analysisTypes: ['tempo', 'key', 'mood'],
            detailedReport: false
          });

          return {
            trackId: track.id,
            title: track.title,
            analysis,
            success: true
          };
        } catch (error) {
          return {
            trackId: track.id,
            title: track.title,
            error: error.message,
            success: false
          };
        }
      })
    );

    // Summary of batch processing
    const successful = batchAnalyses.filter(r => r.success);
    const failed = batchAnalyses.filter(r => !r.success);

    console.log('\n📊 Batch Processing Results:');
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (successful.length > 0) {
      console.log('\n🎵 Analysis Results:');
      successful.forEach(result => {
        console.log(`- ${result.title}:`);
        console.log(`  Tempo: ${result.analysis.tempo.bpm} BPM`);
        console.log(`  Key: ${result.analysis.key.key} ${result.analysis.key.mode}`);
        console.log(`  Mood: ${result.analysis.mood.primary}`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ Failed Analyses:');
      failed.forEach(result => {
        console.log(`- ${result.title}: ${result.error}`);
      });
    }

    return batchAnalyses;

  } catch (error) {
    console.error('❌ Batch processing error:', error.message);
    throw error;
  }
}

// Performance monitoring example
async function performanceMonitoringExample() {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  console.log('\n📈 Performance Monitoring Example');
  console.log('=================================');

  try {
    // Get streaming analytics
    const streamingData = await client.analytics.getStreams({
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      groupBy: 'day',
      platforms: ['spotify', 'apple-music'],
      metrics: ['streams', 'listeners', 'revenue']
    });

    console.log('📊 Streaming Performance:');
    console.log(`Total Streams: ${streamingData.summary.totalStreams}`);
    console.log(`Unique Listeners: ${streamingData.summary.uniqueListeners}`);
    console.log(`Revenue: $${streamingData.summary.totalRevenue}`);

    // Get audience demographics
    const audience = await client.analytics.getAudienceAnalytics({
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      groupBy: 'country'
    });

    console.log('\n🌍 Top Countries:');
    audience.demographics.countries.slice(0, 5).forEach(country => {
      console.log(`- ${country.name}: ${country.streams} streams (${country.percentage}%)`);
    });

    // Get real-time analytics
    const realtime = await client.analytics.getRealtimeAnalytics({
      period: 'last_24_hours',
      updateInterval: 300000 // 5 minutes
    });

    console.log('\n⚡ Real-time Data (Last 24h):');
    console.log(`Current streams: ${realtime.currentStreams}`);
    console.log(`Active listeners: ${realtime.activeListeners}`);
    console.log(`Trending platforms: ${realtime.trendingPlatforms.join(', ')}`);

  } catch (error) {
    console.log('⚠️  Analytics data not available or insufficient data');
  }
}

// Run the complete workflow
if (require.main === module) {
  console.log('🎵 JewelMusic Complete Workflow Example\n');
  
  // Check for API key
  if (!process.env.JEWELMUSIC_API_KEY) {
    console.error('❌ JEWELMUSIC_API_KEY environment variable not set');
    console.log('Please set your API key: export JEWELMUSIC_API_KEY=your_key_here');
    process.exit(1);
  }

  completeWorkflowExample()
    .then(() => {
      console.log('\n' + '='.repeat(50));
      return batchProcessingExample();
    })
    .then(() => {
      console.log('\n' + '='.repeat(50));
      return performanceMonitoringExample();
    })
    .then(() => {
      console.log('\n✨ All workflow examples completed successfully!');
      console.log('\nFor more examples, check out:');
      console.log('- basic-usage.js - Basic SDK functionality');
      console.log('- ai-generation.js - AI music generation');
      console.log('- webhook-handling.js - Real-time event handling');
    })
    .catch((error) => {
      console.error('\n💥 Workflow examples failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  completeWorkflowExample,
  batchProcessingExample,
  performanceMonitoringExample
};