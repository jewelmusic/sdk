#!/usr/bin/env python3
"""
Complete Workflow Example for JewelMusic Python SDK

This example demonstrates a comprehensive music production workflow:
- Upload and process audio tracks
- AI-powered analysis and enhancement
- Automated transcription and lyrics enhancement
- AI-assisted composition
- Release creation and distribution
- Analytics and monitoring
"""

import os
import asyncio
import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta

from jewelmusic_sdk import JewelMusic
from jewelmusic_sdk.exceptions import (
    AuthenticationError,
    ValidationError,
    RateLimitError,
    NetworkError,
    NotFoundError
)


class CompleteWorkflow:
    """Complete music production workflow using JewelMusic SDK."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize workflow with API key."""
        self.api_key = api_key or os.getenv('JEWELMUSIC_API_KEY')
        if not self.api_key:
            raise ValueError("API key required. Set JEWELMUSIC_API_KEY environment variable.")
        
        self.client = JewelMusic(
            api_key=self.api_key,
            environment='sandbox'
        )
    
    async def phase_1_upload_and_processing(self) -> Dict[str, Any]:
        """Phase 1: Track Upload and Processing."""
        print("📤 Phase 1: Track Upload and Processing")
        print("--------------------------------------")
        
        # Check for sample audio file
        audio_path = Path(__file__).parent / 'sample-audio.mp3'
        
        if audio_path.exists():
            print("📁 Found sample audio file, uploading...")
            
            # Upload with progress tracking
            with open(audio_path, 'rb') as audio_file:
                track = await self.client.tracks.upload(
                    file=audio_file,
                    metadata={
                        'title': 'Workflow Demo Track',
                        'artist': 'SDK Demo Artist',
                        'album': 'Demo Album',
                        'genre': 'Electronic',
                        'release_date': '2025-09-01'
                    },
                    progress_callback=lambda progress: print(f"\rUpload progress: {progress['percentage']:.1f}%", end='')
                )
            
            print("\n✅ Track uploaded successfully!")
            print(f"Track ID: {track['id']}")
            print(f"Status: {track['status']}")
            
            # Wait for processing
            print("\n⏳ Waiting for track processing...")
            processed_track = await self.client.tracks.wait_for_processing(track['id'])
            print(f"✅ Track processed: {processed_track['status']}")
            
        else:
            print("⚠️  No sample audio file found, using existing track...")
            
            # Get an existing track
            tracks = await self.client.tracks.list(page=1, per_page=1)
            if not tracks['items']:
                raise ValueError("No tracks available for demonstration. Please upload a track first or add sample-audio.mp3")
            
            track = tracks['items'][0]
            print(f"✅ Using existing track: {track['title']}")
        
        return track
    
    async def phase_2_ai_analysis(self, track: Dict[str, Any]) -> Dict[str, Any]:
        """Phase 2: AI Analysis and Quality Assessment."""
        print("\n🔍 Phase 2: AI Analysis and Quality Assessment")
        print("---------------------------------------------")
        
        # Comprehensive analysis
        analysis = await self.client.analysis.analyze_track(
            track_id=track['id'],
            options={
                'analysis_types': ['tempo', 'key', 'structure', 'quality', 'loudness', 'mood'],
                'detailed_report': True,
                'cultural_context': 'global',
                'target_platforms': ['spotify', 'apple-music', 'youtube-music']
            }
        )
        
        print("✅ Analysis completed!")
        print("📊 Results:")
        print(f"   Tempo: {analysis['tempo']['bpm']} BPM (confidence: {analysis['tempo']['confidence']})")
        print(f"   Key: {analysis['key']['key']} {analysis['key']['mode']} (confidence: {analysis['key']['confidence']})")
        print(f"   Quality Score: {analysis['quality']['overall_score']}/1.0")
        print(f"   Loudness: {analysis['loudness']['lufs']} LUFS")
        print(f"   Primary Mood: {analysis['mood']['primary']} ({analysis['mood']['energy']} energy)")
        
        # Quality recommendations
        if 'recommendations' in analysis['quality']:
            print("\n💡 Quality Recommendations:")
            for rec in analysis['quality']['recommendations']:
                print(f"   - {rec['type']}: {rec['suggestion']}")
        
        return analysis
    
    async def phase_3_transcription_and_lyrics(self, track: Dict[str, Any]) -> Dict[str, Any]:
        """Phase 3: Transcription and Lyrics Enhancement."""
        print("\n📝 Phase 3: Transcription and Lyrics Enhancement")
        print("-----------------------------------------------")
        
        try:
            # Create transcription
            transcription = await self.client.transcription.create(
                track_id=track['id'],
                options={
                    'languages': ['en', 'auto-detect'],
                    'include_timestamps': True,
                    'word_level_timestamps': True,
                    'speaker_diarization': True,
                    'model': 'large'
                }
            )
            
            print("✅ Transcription completed!")
            print(f"Language detected: {transcription['language']}")
            print(f"Confidence: {transcription['confidence']}")
            print(f"Text preview: {transcription['text'][:150]}...")
            
            # Enhance lyrics with AI
            enhanced_lyrics = await self.client.transcription.enhance_lyrics(
                text=transcription['text'],
                options={
                    'improve_meter': True,
                    'enhance_rhyming': True,
                    'adjust_tone': 'professional',
                    'preserve_original_meaning': True
                }
            )
            
            print("✅ Lyrics enhanced!")
            print(f"Enhancements applied: {', '.join(enhanced_lyrics['enhancements'])}")
            
            return enhanced_lyrics
            
        except (NotFoundError, ValidationError) as e:
            print("⚠️  Transcription not available for this track (instrumental or processing failed)")
            print("Proceeding with AI-generated lyrics instead...")
            
            # Get track analysis for context
            analysis = await self.client.analysis.get_analysis(track['id'])
            
            # Generate AI lyrics based on mood and style
            transcription = await self.client.copilot.generate_lyrics(
                theme=f"{analysis.get('mood', {}).get('primary', 'uplifting')} electronic music",
                genre=track.get('genre', 'electronic'),
                language='en',
                mood=analysis.get('mood', {}).get('primary', 'uplifting'),
                structure='verse-chorus-verse-chorus-bridge-chorus',
                tempo=analysis.get('tempo', {}).get('bpm', 120),
                key=f"{analysis.get('key', {}).get('key', 'C')} {analysis.get('key', {}).get('mode', 'major')}"
            )
            
            print("✅ AI lyrics generated!")
            print(f"Theme: {transcription['theme']}")
            print(f"Text preview: {transcription['text'][:150]}...")
            
            return transcription
    
    async def phase_4_ai_composition(self, track: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Phase 4: AI-Assisted Composition."""
        print("\n🤖 Phase 4: AI-Assisted Composition")
        print("------------------------------------")
        
        # Generate complementary elements concurrently
        composition_tasks = [
            # Generate harmony
            self.client.copilot.generate_harmony(
                style=track.get('genre', 'electronic'),
                key=analysis['key']['key'],
                mode=analysis['key']['mode'],
                tempo=analysis['tempo']['bpm'],
                complexity='medium',
                voicing='modern'
            ),
            
            # Generate chord progression
            self.client.copilot.chord_progression(
                key=analysis['key']['key'],
                mode=analysis['key']['mode'],
                style=track.get('genre', 'electronic'),
                complexity='medium',
                length=8
            ),
            
            # Generate arrangement suggestions
            self.client.copilot.suggest_arrangement(
                track_id=track['id'],
                genre=track.get('genre', 'electronic'),
                mood=analysis.get('mood', {}).get('primary', 'uplifting'),
                duration=track.get('duration', 180),
                energy=analysis.get('mood', {}).get('energy', 'medium')
            )
        ]
        
        harmony, chord_progression, arrangement = await asyncio.gather(*composition_tasks)
        
        print("✅ AI composition elements generated!")
        print(f"🎼 Harmony ID: {harmony['id']}")
        print(f"🎹 Chord progression: {' - '.join(chord_progression['progression'])}")
        print(f"🎛️  Suggested arrangement: {' → '.join(arrangement['structure'])}")
        
        # Create a style variation
        style_variation = await self.client.copilot.style_transfer(
            source_id=track['id'],
            target_style='ambient',
            intensity=0.6,
            preserve_structure=True,
            preserve_timing=True
        )
        
        print("✅ Style variation created!")
        print(f"🎨 Variation ID: {style_variation['id']}")
        print(f"Applied style: {style_variation['applied_style']}")
        
        return {
            'harmony': harmony,
            'chord_progression': chord_progression,
            'arrangement': arrangement,
            'style_variation': style_variation
        }
    
    async def phase_5_release_and_distribution(self, track: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Phase 5: Release Creation and Distribution."""
        print("\n📡 Phase 5: Release Creation and Distribution")
        print("--------------------------------------------")
        
        # Create release
        release = await self.client.distribution.create_release(
            type='single',
            title=track['title'],
            artist=track['artist'],
            release_date='2025-09-01',
            tracks=[{
                'track_id': track['id'],
                'title': track['title'],
                'duration': track.get('duration', 180),
                'isrc': f"US{str(int(datetime.now().timestamp()))[-8:]}"  # Generate mock ISRC
            }],
            artwork={
                'primary': True,
                'type': 'cover'
                # In real scenario, you'd upload artwork
            },
            metadata={
                'genre': track.get('genre'),
                'subgenre': analysis.get('style', {}).get('subgenre'),
                'mood': analysis.get('mood', {}).get('primary'),
                'tempo': analysis['tempo']['bpm'],
                'key': f"{analysis['key']['key']} {analysis['key']['mode']}",
                'explicit': False,
                'credits': [
                    {'role': 'artist', 'name': track['artist']},
                    {'role': 'producer', 'name': 'AI-Assisted Production'}
                ]
            },
            territories=['worldwide'],
            platforms=['spotify', 'apple-music', 'youtube-music', 'soundcloud', 'bandcamp']
        )
        
        print("✅ Release created!")
        print(f"📦 Release ID: {release['id']}")
        print(f"Status: {release['status']}")
        
        # Validate release before submission
        validation = await self.client.distribution.validate_release(release['id'])
        print("\n🔍 Release validation:")
        print(f"Valid: {validation['valid']}")
        
        if not validation['valid']:
            print("⚠️  Validation issues:")
            for issue in validation['issues']:
                print(f"   - {issue['severity']}: {issue['message']}")
        
        # Submit for distribution (if valid)
        if validation['valid']:
            submission = await self.client.distribution.submit_to_platforms(
                release_id=release['id'],
                platforms=['spotify', 'apple-music'],
                scheduled_date='2025-09-01T00:00:00Z',
                expedited=False
            )
            
            print("✅ Release submitted for distribution!")
            print(f"Submission ID: {submission['id']}")
            print(f"Expected processing time: {submission['estimated_processing_time']}")
        
        return {'release': release, 'validation': validation}
    
    async def phase_6_analytics_setup(self, release: Dict[str, Any]) -> Dict[str, Any]:
        """Phase 6: Analytics Setup and Monitoring."""
        print("\n📊 Phase 6: Analytics Setup and Monitoring")
        print("------------------------------------------")
        
        # Setup analytics alerts
        alert = await self.client.analytics.setup_alert(
            name='Track Performance Alert',
            release_id=release['id'],
            conditions=[
                {
                    'metric': 'streams',
                    'operator': 'greater_than',
                    'threshold': 1000,
                    'period': 'day'
                },
                {
                    'metric': 'completion_rate',
                    'operator': 'less_than',
                    'threshold': 0.5,
                    'period': 'day'
                }
            ],
            notifications={
                'email': True,
                'webhook': True,
                'dashboard': True
            }
        )
        
        print("✅ Analytics alert created!")
        print(f"Alert ID: {alert['id']}")
        
        # Get initial analytics (if track has existing data)
        try:
            initial_analytics = await self.client.analytics.get_track_analytics(
                track_id=release['tracks'][0]['track_id'],
                start_date='2025-01-01',
                end_date='2025-01-31',
                metrics=['streams', 'listeners', 'completion_rate', 'skip_rate'],
                group_by='day'
            )
            
            if initial_analytics['summary']['total_streams'] > 0:
                print("📈 Initial analytics:")
                print(f"   Total streams: {initial_analytics['summary']['total_streams']}")
                print(f"   Unique listeners: {initial_analytics['summary']['unique_listeners']}")
                print(f"   Completion rate: {initial_analytics['summary']['completion_rate'] * 100:.1f}%")
                
        except Exception:
            print("⚠️  No analytics data available yet (new track)")
        
        return {'alert': alert}
    
    async def run_complete_workflow(self) -> Dict[str, Any]:
        """Run the complete workflow."""
        print("🎵 JewelMusic Complete Workflow Example")
        print("======================================")
        
        try:
            # Phase 1: Upload and Processing
            track = await self.phase_1_upload_and_processing()
            
            # Phase 2: AI Analysis
            analysis = await self.phase_2_ai_analysis(track)
            
            # Phase 3: Transcription and Lyrics
            transcription = await self.phase_3_transcription_and_lyrics(track)
            
            # Phase 4: AI Composition
            composition = await self.phase_4_ai_composition(track, analysis)
            
            # Phase 5: Release and Distribution
            distribution = await self.phase_5_release_and_distribution(track, analysis)
            
            # Phase 6: Analytics Setup
            analytics = await self.phase_6_analytics_setup(distribution['release'])
            
            # Workflow Summary
            print("\n✨ Phase 7: Workflow Summary")
            print("----------------------------")
            
            workflow_summary = {
                'track': {
                    'id': track['id'],
                    'title': track['title'],
                    'artist': track['artist'],
                    'duration': track.get('duration'),
                    'status': track['status']
                },
                'analysis': {
                    'tempo': analysis['tempo']['bpm'],
                    'key': f"{analysis['key']['key']} {analysis['key']['mode']}",
                    'quality': analysis['quality']['overall_score'],
                    'mood': analysis.get('mood', {}).get('primary')
                },
                'composition': {
                    'harmony_id': composition['harmony']['id'],
                    'chord_progression': ' - '.join(composition['chord_progression']['progression'][:4]),
                    'style_variation_id': composition['style_variation']['id']
                },
                'transcription': {
                    'id': transcription['id'],
                    'language': transcription.get('language'),
                    'has_enhancements': bool(transcription.get('enhancements'))
                },
                'release': {
                    'id': distribution['release']['id'],
                    'status': distribution['release']['status'],
                    'platforms': len(distribution['release']['platforms']),
                    'valid': distribution['validation']['valid']
                },
                'analytics': {
                    'alert_id': analytics['alert']['id'],
                    'monitoring': True
                }
            }
            
            print("🎉 Workflow completed successfully!")
            print("\n📋 Summary:")
            print(json.dumps(workflow_summary, indent=2))
            
            print("\n🚀 Next Steps:")
            print("1. Monitor distribution status for platform approval")
            print("2. Track analytics and streaming performance")
            print("3. Use AI insights for future compositions")
            print("4. Create variations and remixes using style transfer")
            print("5. Optimize release strategy based on performance data")
            
            return workflow_summary
            
        except AuthenticationError as e:
            print(f"\n❌ Authentication failed: {e}")
            print("💡 Make sure your API key is set: export JEWELMUSIC_API_KEY=your_key_here")
            raise
        except ValidationError as e:
            print(f"\n❌ Validation error: {e}")
            print("💡 Check input data")
            raise
        except RateLimitError as e:
            print(f"\n❌ Rate limit exceeded: {e}")
            print(f"💡 Try again in {e.retry_after} seconds")
            raise
        except Exception as e:
            print(f"\n❌ Workflow error: {e}")
            raise


async def batch_processing_example():
    """Batch processing example."""
    print("\n⚡ Batch Processing Example")
    print("==========================")
    
    api_key = os.getenv('JEWELMUSIC_API_KEY')
    if not api_key:
        raise ValueError("API key required.")
    
    client = JewelMusic(api_key=api_key, environment='sandbox')
    
    try:
        # Get multiple tracks for batch processing
        tracks = await client.tracks.list(page=1, per_page=5)
        
        if not tracks['items']:
            print("⚠️  No tracks available for batch processing")
            return []
        
        print(f"📁 Processing {len(tracks['items'])} tracks in batch...")
        
        # Create analysis tasks for all tracks
        analysis_tasks = []
        for i, track in enumerate(tracks['items']):
            print(f"🔍 Queuing analysis for track {i+1}/{len(tracks['items'])}: {track['title']}")
            
            task = asyncio.create_task(
                client.analysis.analyze_track(
                    track_id=track['id'],
                    options={
                        'analysis_types': ['tempo', 'key', 'mood'],
                        'detailed_report': False
                    }
                ),
                name=f"analysis_{track['id']}"
            )
            analysis_tasks.append((track, task))
        
        # Process all analyses concurrently
        results = []
        for track, task in analysis_tasks:
            try:
                analysis = await task
                results.append({
                    'track_id': track['id'],
                    'title': track['title'],
                    'analysis': analysis,
                    'success': True
                })
            except Exception as e:
                results.append({
                    'track_id': track['id'],
                    'title': track['title'],
                    'error': str(e),
                    'success': False
                })
        
        # Summary of batch processing
        successful = [r for r in results if r['success']]
        failed = [r for r in results if not r['success']]
        
        print("\n📊 Batch Processing Results:")
        print(f"✅ Successful: {len(successful)}")
        print(f"❌ Failed: {len(failed)}")
        
        if successful:
            print("\n🎵 Analysis Results:")
            for result in successful:
                analysis = result['analysis']
                print(f"- {result['title']}:")
                print(f"  Tempo: {analysis['tempo']['bpm']} BPM")
                print(f"  Key: {analysis['key']['key']} {analysis['key']['mode']}")
                print(f"  Mood: {analysis.get('mood', {}).get('primary', 'N/A')}")
        
        if failed:
            print("\n❌ Failed Analyses:")
            for result in failed:
                print(f"- {result['title']}: {result['error']}")
        
        return results
        
    except Exception as e:
        print(f"❌ Batch processing error: {e}")
        raise


async def performance_monitoring_example():
    """Performance monitoring example."""
    print("\n📈 Performance Monitoring Example")
    print("=================================")
    
    api_key = os.getenv('JEWELMUSIC_API_KEY')
    if not api_key:
        raise ValueError("API key required.")
    
    client = JewelMusic(api_key=api_key, environment='sandbox')
    
    try:
        # Get streaming analytics
        streaming_data = await client.analytics.get_streams(
            start_date='2025-01-01',
            end_date='2025-01-31',
            group_by='day',
            platforms=['spotify', 'apple-music'],
            metrics=['streams', 'listeners', 'revenue']
        )
        
        print("📊 Streaming Performance:")
        print(f"Total Streams: {streaming_data['summary']['total_streams']}")
        print(f"Unique Listeners: {streaming_data['summary']['unique_listeners']}")
        print(f"Revenue: ${streaming_data['summary']['total_revenue']}")
        
        # Get audience demographics
        audience = await client.analytics.get_audience_analytics(
            start_date='2025-01-01',
            end_date='2025-01-31',
            group_by='country'
        )
        
        print("\n🌍 Top Countries:")
        for country in audience['demographics']['countries'][:5]:
            print(f"- {country['name']}: {country['streams']} streams ({country['percentage']}%)")
        
        # Get real-time analytics
        realtime = await client.analytics.get_realtime_analytics(
            period='last_24_hours',
            update_interval=300000  # 5 minutes
        )
        
        print("\n⚡ Real-time Data (Last 24h):")
        print(f"Current streams: {realtime['current_streams']}")
        print(f"Active listeners: {realtime['active_listeners']}")
        print(f"Trending platforms: {', '.join(realtime['trending_platforms'])}")
        
    except Exception:
        print("⚠️  Analytics data not available or insufficient data")


async def main():
    """Main function to run all examples."""
    print("🎵 JewelMusic Complete Workflow Examples")
    print("========================================\n")
    
    # Check for API key
    if not os.getenv('JEWELMUSIC_API_KEY'):
        print("❌ JEWELMUSIC_API_KEY environment variable not set")
        print("Please set your API key: export JEWELMUSIC_API_KEY=your_key_here")
        return 1
    
    try:
        # Run complete workflow
        workflow = CompleteWorkflow()
        workflow_results = await workflow.run_complete_workflow()
        
        print("\n" + "="*50)
        
        # Run batch processing example
        batch_results = await batch_processing_example()
        
        print("\n" + "="*50)
        
        # Run performance monitoring example
        await performance_monitoring_example()
        
        print("\n✨ All workflow examples completed successfully!")
        print("\nFor more examples, check out:")
        print("- basic_usage.py - Basic SDK functionality")
        print("- ai_generation.py - AI music generation")
        print("- webhook_server.py - Real-time event handling")
        
        return 0
        
    except KeyboardInterrupt:
        print("\n🛑 Examples interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Workflow examples failed: {e}")
        return 1


if __name__ == '__main__':
    exit_code = asyncio.run(main())
    exit(exit_code)