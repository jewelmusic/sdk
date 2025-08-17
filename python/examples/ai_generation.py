#!/usr/bin/env python3
"""
AI Generation Example for JewelMusic Python SDK

This example demonstrates JewelMusic's AI copilot features:
- Melody generation
- Harmony creation  
- Lyrics generation
- Complete song composition
- Style transfer
- Chord progressions
"""

import os
import asyncio
import json
from typing import Dict, List, Optional, Any

from jewelmusic_sdk import JewelMusic
from jewelmusic_sdk.exceptions import (
    AuthenticationError,
    ValidationError,
    RateLimitError,
    NetworkError
)


class AIGenerationExamples:
    """AI Generation examples for JewelMusic SDK."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize with API key."""
        self.api_key = api_key or os.getenv('JEWELMUSIC_API_KEY')
        if not self.api_key:
            raise ValueError("API key required. Set JEWELMUSIC_API_KEY environment variable.")
        
        self.client = JewelMusic(
            api_key=self.api_key,
            environment='sandbox'
        )
    
    async def generate_melody_example(self) -> Dict[str, Any]:
        """Generate AI melody with various parameters."""
        print("🎵 Generating AI melody...")
        
        try:
            melody = await self.client.copilot.generate_melody(
                style='electronic',
                genre='electronic',
                mood='upbeat',
                tempo=128,
                key='C',
                mode='major',
                duration=30,
                instruments=['synthesizer', 'bass', 'piano'],
                complexity='medium',
                energy='high',
                creativity=0.7
            )
            
            print("✅ Melody generated successfully!")
            print(f"Melody ID: {melody['id']}")
            print(f"Style: {melody['style']}")
            print(f"Tempo: {melody['tempo']} BPM")
            print(f"Key: {melody['key']} {melody['mode']}")
            print(f"Duration: {melody['duration']} seconds")
            
            return melody
            
        except Exception as e:
            print(f"❌ Error generating melody: {e}")
            raise
    
    async def generate_lyrics_example(self) -> Dict[str, Any]:
        """Generate AI lyrics with detailed options."""
        print("\n📝 Generating AI lyrics...")
        
        try:
            lyrics = await self.client.copilot.generate_lyrics(
                theme='technology and human connection',
                genre='electronic',
                language='en',
                mood='optimistic',
                structure='verse-chorus-verse-chorus-bridge-chorus',
                rhyme_scheme='ABAB',
                syllable_count='8-6-8-6',
                verse_count=2,
                chorus_count=1,
                bridge_count=1,
                words_per_line=6,
                explicit_content=False,
                keywords=['future', 'connection', 'digital', 'dreams'],
                reference_artists=['Daft Punk', 'Kraftwerk']
            )
            
            print("✅ Lyrics generated successfully!")
            print(f"Lyrics ID: {lyrics['id']}")
            print(f"Theme: {lyrics['theme']}")
            print(f"Structure: {lyrics['structure']}")
            print(f"Language: {lyrics['language']}")
            print("\nGenerated lyrics preview:")
            print("```")
            preview_text = lyrics['text'][:200]
            print(preview_text)
            if len(lyrics['text']) > 200:
                print("...")
            print("```")
            
            return lyrics
            
        except Exception as e:
            print(f"❌ Error generating lyrics: {e}")
            raise
    
    async def generate_harmony_example(self, melody_id: str) -> Dict[str, Any]:
        """Generate harmony for a given melody."""
        print("\n🎼 Generating AI harmony...")
        
        try:
            harmony = await self.client.copilot.generate_harmony(
                melody_id=melody_id,
                style='jazz',
                complexity='complex',
                voicing='close',
                instruments=['piano', 'guitar'],
                creativity=0.8
            )
            
            print("✅ Harmony generated successfully!")
            print(f"Harmony ID: {harmony['id']}")
            print(f"Reference Melody ID: {harmony['melody_id']}")
            print(f"Style: {harmony['style']}")
            print(f"Complexity: {harmony['complexity']}")
            print(f"Voicing: {harmony['voicing']}")
            
            return harmony
            
        except Exception as e:
            print(f"❌ Error generating harmony: {e}")
            raise
    
    async def complete_song_example(self) -> Dict[str, Any]:
        """Generate complete AI song."""
        print("\n🎤 Generating complete AI song...")
        
        try:
            song = await self.client.copilot.complete_song(
                prompt="Create an uplifting electronic song about overcoming challenges and finding inner strength",
                style='electronic',
                duration=180,
                include_vocals=True,
                vocal_style='female-pop',
                mixing_style='modern',
                mastering_preset='streaming',
                completion_type='full',
                add_intro=True,
                add_outro=True,
                add_bridge=True
            )
            
            print("✅ Complete song generated successfully!")
            print(f"Song ID: {song['id']}")
            print(f"Title: {song['title']}")
            print(f"Duration: {song['duration']} seconds")
            print(f"Style: {song['style']}")
            print(f"Vocal Style: {song['vocal_style']}")
            print("Components:")
            if 'melody_id' in song and song['melody_id']:
                print(f"  - Melody: {song['melody_id']}")
            if 'harmony_id' in song and song['harmony_id']:
                print(f"  - Harmony: {song['harmony_id']}")
            if 'lyrics_id' in song and song['lyrics_id']:
                print(f"  - Lyrics: {song['lyrics_id']}")
            
            return song
            
        except Exception as e:
            print(f"❌ Error generating complete song: {e}")
            raise
    
    async def get_templates_example(self) -> List[Dict[str, Any]]:
        """Get available song templates."""
        print("\n📚 Getting available song templates...")
        
        try:
            templates = await self.client.copilot.get_templates(
                genre='electronic',
                mood='upbeat',
                duration=180,
                style='modern'
            )
            
            print(f"✅ Found {len(templates['items'])} templates")
            
            if templates['items']:
                print("Available templates:")
                for i, template in enumerate(templates['items'][:5]):  # Show first 5
                    print(f"  {i+1}. {template['name']} ({template['genre']})")
                    print(f"     Style: {template['style']} | Mood: {template['mood']} | Duration: {template['duration']}s")
                
                if len(templates['items']) > 5:
                    print(f"     ... and {len(templates['items']) - 5} more templates")
                
                # Use first template for song generation
                template = templates['items'][0]
                print(f"\nUsing template '{template['name']}' for song generation...")
                
                song_from_template = await self.client.copilot.complete_song(
                    template_id=template['id'],
                    prompt="An energetic track perfect for workout sessions",
                    style=template['style'],
                    duration=template['duration'],
                    include_vocals=True
                )
                
                print("✅ Song generated from template!")
                print(f"Template-based Song ID: {song_from_template['id']}")
            
            return templates['items']
            
        except Exception as e:
            print(f"❌ Error getting templates: {e}")
            raise
    
    async def style_transfer_example(self, source_id: str) -> Dict[str, Any]:
        """Apply style transfer to existing track."""
        print("\n🔄 Style transfer example...")
        
        try:
            style_transfer = await self.client.copilot.style_transfer(
                source_id=source_id,
                target_style='jazz',
                intensity=0.8,
                preserve_structure=True,
                preserve_timing=True
            )
            
            print("✅ Style transfer completed!")
            print(f"Original Track ID: {source_id} (electronic)")
            print(f"Transformed Track ID: {style_transfer['id']} (jazz)")
            print(f"Transfer Intensity: {style_transfer['intensity']}")
            
            return style_transfer
            
        except Exception as e:
            print(f"❌ Error in style transfer: {e}")
            raise
    
    async def chord_progression_example(self) -> Dict[str, Any]:
        """Generate chord progression."""
        print("\n🎹 Generating chord progression...")
        
        try:
            progression = await self.client.copilot.chord_progression(
                key='C major',
                style='pop',
                complexity=0.5,
                length=8
            )
            
            print("✅ Chord progression generated!")
            print(f"Progression ID: {progression['id']}")
            print(f"Key: {progression['key']}")
            print(f"Length: {progression['length']} chords")
            print(f"Chords: {progression['chord_sequence']}")
            
            return progression
            
        except Exception as e:
            print(f"❌ Error generating chord progression: {e}")
            raise
    
    async def ai_analysis_example(self, track_id: str) -> Optional[Dict[str, Any]]:
        """AI music analysis and suggestions."""
        print("\n🧠 AI music analysis and suggestions...")
        
        try:
            genre_analysis = await self.client.copilot.genre_analysis(
                track_id=track_id,
                target_genre='electronic'
            )
            
            print("✅ Genre analysis completed!")
            print(f"Current Genre: {genre_analysis['current_genre']}")
            print(f"Target Genre: {genre_analysis['target_genre']}")
            print(f"Similarity Score: {genre_analysis['similarity_score']:.2f}")
            print("Suggestions:")
            for suggestion in genre_analysis['suggestions']:
                print(f"  - {suggestion}")
            
            return genre_analysis
            
        except Exception as e:
            print(f"⚠️  Skipping genre analysis (track not found): {e}")
            return None
    
    async def run_all_examples(self) -> Dict[str, Any]:
        """Run all AI generation examples."""
        print("🤖 JewelMusic AI Generation Examples")
        print("====================================")
        
        results = {}
        
        try:
            # Generate melody
            melody = await self.generate_melody_example()
            results['melody'] = melody
            
            # Generate lyrics
            lyrics = await self.generate_lyrics_example()
            results['lyrics'] = lyrics
            
            # Generate harmony for the melody
            harmony = await self.generate_harmony_example(melody['id'])
            results['harmony'] = harmony
            
            # Generate complete song
            song = await self.complete_song_example()
            results['song'] = song
            
            # Get templates
            templates = await self.get_templates_example()
            results['templates'] = templates
            
            # Style transfer (using the melody)
            style_variation = await self.style_transfer_example(melody['id'])
            results['style_variation'] = style_variation
            
            # Chord progression
            progression = await self.chord_progression_example()
            results['chord_progression'] = progression
            
            # AI analysis (try with the generated song)
            analysis = await self.ai_analysis_example(song['id'])
            if analysis:
                results['analysis'] = analysis
            
            print("\n🎉 AI generation examples completed successfully!")
            print("\nGenerated assets:")
            print(f"- Melody: {melody.get('preview_url', melody['id'])}")
            print(f"- Harmony: {harmony.get('preview_url', harmony['id'])}")
            print(f"- Lyrics: {lyrics['id']}")
            print(f"- Complete song: {song.get('download_url', song['id'])}")
            print(f"- Style variation: {style_variation.get('preview_url', style_variation['id'])}")
            
            return results
            
        except AuthenticationError as e:
            print(f"\n❌ Authentication failed: {e}")
            print("💡 Make sure your API key is valid")
            raise
        except ValidationError as e:
            print(f"\n❌ Validation error: {e}")
            print("💡 Check generation parameters")
            raise
        except RateLimitError as e:
            print(f"\n❌ Rate limit exceeded: {e}")
            print(f"💡 Try again in {e.retry_after} seconds")
            raise
        except NetworkError as e:
            print(f"\n❌ Network error: {e}")
            raise
        except Exception as e:
            print(f"\n❌ Unexpected error: {e}")
            raise


async def advanced_ai_workflow():
    """Advanced AI workflow example."""
    print("\n🚀 Advanced AI Workflow Example")
    print("===============================")
    
    api_key = os.getenv('JEWELMUSIC_API_KEY')
    if not api_key:
        raise ValueError("API key required. Set JEWELMUSIC_API_KEY environment variable.")
    
    client = JewelMusic(api_key=api_key, environment='sandbox')
    
    try:
        # Step 1: Create song from text prompt
        print("📝 Creating song from prompt...")
        prompt = "A dreamy synthwave track about driving through a neon-lit city at night, feeling nostalgic and hopeful about the future"
        
        song_from_prompt = await client.copilot.complete_song(
            prompt=prompt,
            style='synthwave',
            duration=240,
            include_vocals=False,  # Instrumental
            energy='medium',
            complexity='high'
        )
        
        print("✅ Song created from prompt!")
        print(f"Song ID: {song_from_prompt['id']}")
        
        # Step 2: Generate variations
        print("\n🔄 Creating variations...")
        
        # Create variations concurrently
        variation_tasks = [
            client.copilot.style_transfer(
                source_id=song_from_prompt['id'],
                target_style='ambient',
                intensity=0.5
            ),
            client.copilot.style_transfer(
                source_id=song_from_prompt['id'],
                target_style='house',
                intensity=0.8
            ),
            client.copilot.style_transfer(
                source_id=song_from_prompt['id'],
                target_style='orchestral',
                intensity=0.6
            )
        ]
        
        variations = await asyncio.gather(*variation_tasks)
        print(f"✅ Created {len(variations)} variations")
        
        # Step 3: Add lyrics to the best variation
        best_variation = variations[0]  # Pick the ambient version
        print("\n📝 Adding lyrics to ambient variation...")
        
        lyrics_for_variation = await client.copilot.generate_lyrics(
            theme='nostalgia and future dreams',
            genre='ambient',
            language='en',
            mood='reflective',
            structure='verse-chorus-verse-chorus-outro',
            inspiration_text=prompt
        )
        
        print("✅ Lyrics generated for variation")
        
        # Step 4: Create final song with vocals
        print("\n🎤 Creating final version with vocals...")
        final_song = await client.copilot.complete_song(
            source_id=best_variation['id'],
            lyrics_id=lyrics_for_variation['id'],
            include_vocals=True,
            vocal_style='ethereal',
            mixing_style='atmospheric',
            mastering_preset='streaming'
        )
        
        print("✅ Final song with vocals created!")
        print(f"Final song ID: {final_song['id']}")
        print(f"Download URL: {final_song.get('download_url', 'N/A')}")
        
        return {
            'original_song': song_from_prompt,
            'variations': variations,
            'lyrics': lyrics_for_variation,
            'final_song': final_song
        }
        
    except Exception as e:
        print(f"\n❌ Error in advanced AI workflow: {e}")
        raise


async def main():
    """Main function to run all examples."""
    print("🎵 JewelMusic AI Generation Examples")
    print("=====================================\n")
    
    # Check for API key
    if not os.getenv('JEWELMUSIC_API_KEY'):
        print("❌ JEWELMUSIC_API_KEY environment variable not set")
        print("Please set your API key: export JEWELMUSIC_API_KEY=your_key_here")
        return 1
    
    try:
        # Run basic examples
        examples = AIGenerationExamples()
        basic_results = await examples.run_all_examples()
        
        print("\n" + "="*50)
        
        # Run advanced workflow
        advanced_results = await advanced_ai_workflow()
        
        print("\n✨ All AI generation examples completed successfully!")
        print("\nResults summary:")
        print(f"- Basic examples: {len(basic_results)} components generated")
        print(f"- Advanced workflow: {len(advanced_results)} assets created")
        
        return 0
        
    except KeyboardInterrupt:
        print("\n🛑 Examples interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 AI generation examples failed: {e}")
        return 1


if __name__ == '__main__':
    exit_code = asyncio.run(main())
    exit(exit_code)