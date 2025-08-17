/**
 * AI Music Generation Example
 * 
 * This example demonstrates JewelMusic's AI copilot features:
 * - Melody generation
 * - Harmony creation
 * - Lyrics generation
 * - Complete song composition
 * - Style transfer
 */

const { JewelMusic } = require('@jewelmusic/sdk');

async function aiGenerationExample() {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  try {
    console.log('🤖 AI Music Generation Example\n');

    // 1. Generate a melody
    console.log('🎵 Generating melody...');
    const melody = await client.copilot.generateMelody({
      style: 'electronic',
      tempo: 128,
      key: 'C',
      mode: 'major',
      duration: 30,
      instruments: ['synthesizer', 'bass'],
      complexity: 'medium',
      energy: 'high'
    });

    console.log('✅ Melody generated!');
    console.log('Melody ID:', melody.id);
    console.log('Duration:', melody.duration + 's');
    console.log('Preview URL:', melody.previewUrl);

    // 2. Generate harmony for the melody
    console.log('\n🎼 Generating harmony...');
    const harmony = await client.copilot.generateHarmony({
      melodyId: melody.id,
      style: 'modern',
      complexity: 'medium',
      voicing: 'close',
      instruments: ['pad', 'strings']
    });

    console.log('✅ Harmony generated!');
    console.log('Harmony ID:', harmony.id);
    console.log('Chord progression:', harmony.chordProgression.join(' - '));

    // 3. Generate lyrics
    console.log('\n✍️ Generating lyrics...');
    const lyrics = await client.copilot.generateLyrics({
      theme: 'dreams and aspirations',
      genre: 'electronic',
      language: 'en',
      mood: 'uplifting',
      structure: 'verse-chorus-verse-chorus-bridge-chorus',
      rhymeScheme: 'ABAB',
      syllableCount: 'flexible'
    });

    console.log('✅ Lyrics generated!');
    console.log('Lyrics ID:', lyrics.id);
    console.log('Structure:', lyrics.structure);
    console.log('\nLyrics preview:');
    console.log('---');
    console.log(lyrics.text.substring(0, 200) + '...');
    console.log('---');

    // 4. Generate chord progression
    console.log('\n🎹 Generating chord progression...');
    const chords = await client.copilot.chordProgression({
      key: 'C',
      mode: 'major',
      style: 'electronic',
      complexity: 'medium',
      length: 8,
      includeExtensions: true
    });

    console.log('✅ Chord progression generated!');
    console.log('Progression:', chords.progression.join(' - '));
    console.log('MIDI file:', chords.midiUrl);

    // 5. Get song templates
    console.log('\n📋 Getting song templates...');
    const templates = await client.copilot.getTemplates({
      genre: 'electronic',
      mood: 'uplifting',
      duration: 'medium'
    });

    console.log('✅ Found', templates.length, 'templates');
    console.log('Popular template:', templates[0].name);
    console.log('Structure:', templates[0].structure.join(' - '));

    // 6. Complete song generation
    console.log('\n🎶 Generating complete song...');
    const song = await client.copilot.completeSong({
      melodyId: melody.id,
      harmonyId: harmony.id,
      lyricsId: lyrics.id,
      templateId: templates[0].id,
      style: 'electronic',
      duration: 180,
      includeVocals: true,
      vocalStyle: 'synthetic',
      mixingStyle: 'modern',
      masteringPreset: 'streaming'
    });

    console.log('✅ Complete song generated!');
    console.log('Song ID:', song.id);
    console.log('Duration:', song.duration + 's');
    console.log('Download URL:', song.downloadUrl);
    console.log('Stems available:', song.stems.length);

    // 7. Style transfer example
    console.log('\n🎨 Applying style transfer...');
    const styleTransfer = await client.copilot.styleTransfer({
      sourceId: melody.id,
      targetStyle: 'ambient',
      intensity: 0.7,
      preserveStructure: true,
      preserveTiming: true
    });

    console.log('✅ Style transfer completed!');
    console.log('New variation ID:', styleTransfer.id);
    console.log('Style applied:', styleTransfer.appliedStyle);

    // 8. Suggest arrangement
    console.log('\n🎛️ Getting arrangement suggestions...');
    const arrangement = await client.copilot.suggestArrangement({
      songId: song.id,
      genre: 'electronic',
      duration: 180,
      energy: 'high',
      includeBreakdown: true,
      includeBridge: true
    });

    console.log('✅ Arrangement suggested!');
    console.log('Suggested structure:', arrangement.structure.join(' - '));
    console.log('Key moments:', arrangement.keyMoments.map(m => m.type).join(', '));

    // 9. Genre analysis
    console.log('\n🏷️ Analyzing genre characteristics...');
    const genreAnalysis = await client.copilot.genreAnalysis({
      songId: song.id,
      includeSubgenres: true,
      includeInfluences: true,
      confidenceThreshold: 0.7
    });

    console.log('✅ Genre analysis completed!');
    console.log('Primary genre:', genreAnalysis.primaryGenre);
    console.log('Subgenres:', genreAnalysis.subgenres.join(', '));
    console.log('Influences:', genreAnalysis.influences.slice(0, 3).join(', '));

    // 10. Mood matching
    console.log('\n😊 Analyzing mood characteristics...');
    const moodAnalysis = await client.copilot.moodMatching({
      songId: song.id,
      targetMoods: ['uplifting', 'energetic', 'hopeful'],
      includeEmotionalArc: true
    });

    console.log('✅ Mood analysis completed!');
    console.log('Primary mood:', moodAnalysis.primaryMood);
    console.log('Mood score:', moodAnalysis.moodScore);
    console.log('Emotional arc:', moodAnalysis.emotionalArc.map(e => e.mood).join(' → '));

    console.log('\n🎉 AI generation example completed successfully!');
    console.log('\nGenerated assets:');
    console.log('- Melody:', melody.previewUrl);
    console.log('- Harmony:', harmony.previewUrl);
    console.log('- Lyrics:', lyrics.id);
    console.log('- Complete song:', song.downloadUrl);
    console.log('- Style variation:', styleTransfer.previewUrl);

    return {
      melody,
      harmony,
      lyrics,
      chords,
      song,
      styleTransfer,
      arrangement,
      genreAnalysis,
      moodAnalysis
    };

  } catch (error) {
    console.error('\n❌ Error in AI generation:', error.message);
    
    if (error.name === 'ValidationError') {
      console.log('💡 Check generation parameters:', error.details);
    } else if (error.name === 'RateLimitError') {
      console.log('💡 AI generation rate limit reached. Try again in', error.retryAfter, 'seconds');
    }
    
    throw error;
  }
}

// Advanced AI workflow example
async function advancedAIWorkflow() {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  try {
    console.log('\n🚀 Advanced AI Workflow Example\n');

    // Step 1: Create a song based on a text prompt
    console.log('📝 Creating song from prompt...');
    const prompt = "A dreamy synthwave track about driving through a neon-lit city at night, feeling nostalgic and hopeful about the future";
    
    const songFromPrompt = await client.copilot.completeSong({
      prompt: prompt,
      style: 'synthwave',
      duration: 240,
      includeVocals: false, // Instrumental
      energy: 'medium',
      complexity: 'high'
    });

    console.log('✅ Song created from prompt!');
    console.log('Song ID:', songFromPrompt.id);

    // Step 2: Generate variations
    console.log('\n🔄 Creating variations...');
    const variations = await Promise.all([
      client.copilot.styleTransfer({
        sourceId: songFromPrompt.id,
        targetStyle: 'ambient',
        intensity: 0.5
      }),
      client.copilot.styleTransfer({
        sourceId: songFromPrompt.id,
        targetStyle: 'house',
        intensity: 0.8
      }),
      client.copilot.styleTransfer({
        sourceId: songFromPrompt.id,
        targetStyle: 'orchestral',
        intensity: 0.6
      })
    ]);

    console.log('✅ Created', variations.length, 'variations');

    // Step 3: Add lyrics to the best variation
    const bestVariation = variations[0]; // Pick the ambient version
    console.log('\n📝 Adding lyrics to ambient variation...');
    
    const lyricsForVariation = await client.copilot.generateLyrics({
      theme: 'nostalgia and future dreams',
      genre: 'ambient',
      language: 'en',
      mood: 'reflective',
      structure: 'verse-chorus-verse-chorus-outro',
      inspirationText: prompt
    });

    console.log('✅ Lyrics generated for variation');

    // Step 4: Create final song with vocals
    console.log('\n🎤 Creating final version with vocals...');
    const finalSong = await client.copilot.completeSong({
      sourceId: bestVariation.id,
      lyricsId: lyricsForVariation.id,
      includeVocals: true,
      vocalStyle: 'ethereal',
      mixingStyle: 'atmospheric',
      masteringPreset: 'streaming'
    });

    console.log('✅ Final song with vocals created!');
    console.log('Final song ID:', finalSong.id);
    console.log('Download URL:', finalSong.downloadUrl);

    return {
      originalSong: songFromPrompt,
      variations,
      lyrics: lyricsForVariation,
      finalSong
    };

  } catch (error) {
    console.error('\n❌ Error in advanced AI workflow:', error.message);
    throw error;
  }
}

// Run examples
if (require.main === module) {
  console.log('🎵 JewelMusic AI Generation Examples\n');
  
  aiGenerationExample()
    .then(() => {
      console.log('\n' + '='.repeat(50));
      return advancedAIWorkflow();
    })
    .then(() => {
      console.log('\n✨ All AI generation examples completed successfully!');
    })
    .catch((error) => {
      console.error('\n💥 AI generation examples failed:', error.message);
      process.exit(1);
    });
}

module.exports = { 
  aiGenerationExample, 
  advancedAIWorkflow 
};