"""
Basic Usage Example for JewelMusic Python SDK

This example demonstrates the fundamental features of the JewelMusic Python SDK:
- Client initialization (both async and sync)
- Track upload
- Basic analysis
- Simple distribution setup
- Error handling
"""

import asyncio
import os
from pathlib import Path
from jewelmusic_sdk import JewelMusic, JewelMusicSync
from jewelmusic_sdk import (
    AuthenticationError,
    ValidationError,
    RateLimitError,
    NetworkError
)


async def async_basic_usage():
    """Async example using the recommended async client."""
    
    # Initialize the async client
    client = JewelMusic(
        api_key=os.getenv('JEWELMUSIC_API_KEY'),
        environment='sandbox'  # Use sandbox for testing
    )
    
    try:
        # Test connection
        print('Testing API connection...')
        ping_result = await client.ping()
        print(f'✅ Connected to JewelMusic API v{ping_result["version"]}')
        
        # Check if sample audio file exists
        audio_path = Path(__file__).parent / 'sample-audio.mp3'
        if not audio_path.exists():
            print('⚠️  Sample audio file not found. Please add sample-audio.mp3 to the examples directory.')
            return
        
        print(f'📁 Found audio file: {audio_path}')
        
        # Upload track with metadata
        print('\n📤 Uploading track...')
        
        def progress_callback(loaded, total):
            percentage = (loaded / total) * 100
            print(f'\rUpload progress: {percentage:.1f}%', end='', flush=True)
        
        with open(audio_path, 'rb') as f:
            track = await client.tracks.upload(
                f,
                {
                    'title': 'Sample Song',
                    'artist': 'Sample Artist',
                    'album': 'Sample Album',
                    'genre': 'Electronic',
                    'release_date': '2025-09-01'
                },
                progress_callback=progress_callback
            )
        
        print(f'\n✅ Track uploaded successfully!')
        print(f'Track ID: {track["id"]}')
        print(f'Status: {track["status"]}')
        print(f'Duration: {track["duration"]}s')
        
        # Basic analysis
        print('\n🔍 Analyzing track...')
        with open(audio_path, 'rb') as f:
            analysis = await client.analysis.upload_track(f, {
                'analysis_types': ['tempo', 'key', 'structure'],
                'detailed_report': False
            })
        
        print('✅ Analysis completed!')
        print(f'Tempo: {analysis["tempo"]["bpm"]} BPM')
        print(f'Key: {analysis["key"]["key"]} {analysis["key"]["mode"]}')
        print(f'Structure: {" - ".join(s["type"] for s in analysis["structure"]["sections"])}')
        
        # Get user profile
        print('\n👤 Getting user profile...')
        profile = await client.get_profile()
        print(f'✅ User: {profile["name"]}')
        print(f'Plan: {profile["subscription"]["plan"]}')
        
        # Simple distribution setup (create release)
        print('\n📡 Creating release for distribution...')
        release = await client.distribution.create_release({
            'type': 'single',
            'title': track['title'],
            'artist': track['artist'],
            'release_date': '2025-09-01',
            'tracks': [{
                'track_id': track['id'],
                'title': track['title'],
                'duration': track['duration']
            }],
            'territories': ['US', 'CA', 'GB'],
            'platforms': ['spotify', 'apple-music']
        })
        
        print('✅ Release created!')
        print(f'Release ID: {release["id"]}')
        print(f'Status: {release["status"]}')
        
        print('\n🎉 Async basic usage example completed successfully!')
        
        return {
            'track': track,
            'analysis': analysis,
            'release': release,
            'profile': profile
        }
    
    except AuthenticationError as e:
        print(f'\n❌ Authentication Error: {e.message}')
        print('💡 Make sure your API key is set: export JEWELMUSIC_API_KEY=your_key_here')
    except ValidationError as e:
        print(f'\n❌ Validation Error: {e.message}')
        print(f'💡 Check your input data: {e.validation_errors}')
    except RateLimitError as e:
        print(f'\n❌ Rate Limit Error: {e.message}')
        print(f'💡 Rate limit exceeded. Try again in {e.retry_after} seconds')
    except NetworkError as e:
        print(f'\n❌ Network Error: {e.message}')
        print('💡 Check your internet connection')
    except Exception as e:
        print(f'\n❌ Unexpected Error: {str(e)}')
    
    finally:
        await client.close()


def sync_basic_usage():
    """Synchronous example using the sync wrapper."""
    
    print('\n' + '='*50)
    print('SYNCHRONOUS EXAMPLE')
    print('='*50)
    
    # Initialize the sync client
    client = JewelMusicSync(
        api_key=os.getenv('JEWELMUSIC_API_KEY'),
        environment='sandbox'
    )
    
    try:
        # Test connection
        print('Testing API connection (sync)...')
        ping_result = client.ping()
        print(f'✅ Connected to JewelMusic API v{ping_result["version"]}')
        
        # Get user profile
        print('\n👤 Getting user profile (sync)...')
        profile = client.get_profile()
        print(f'✅ User: {profile["name"]}')
        print(f'Plan: {profile["subscription"]["plan"]}')
        
        # List tracks
        print('\n📋 Listing tracks (sync)...')
        tracks = client.tracks.list({'per_page': 5})
        print(f'✅ Found {tracks["pagination"]["total"]} tracks')
        
        for track in tracks["items"][:3]:
            print(f'- {track["title"]} by {track["artist"]}')
        
        print('\n🎉 Sync basic usage example completed successfully!')
        
        return {
            'profile': profile,
            'tracks': tracks
        }
    
    except Exception as e:
        print(f'\n❌ Error in sync example: {str(e)}')
    
    finally:
        client.close()


async def context_manager_example():
    """Example using async context manager."""
    
    print('\n' + '='*50)
    print('CONTEXT MANAGER EXAMPLE')
    print('='*50)
    
    # Using async context manager (recommended)
    async with JewelMusic(
        api_key=os.getenv('JEWELMUSIC_API_KEY'),
        environment='sandbox'
    ) as client:
        
        print('🔗 Client connected with context manager')
        
        # Test connection
        ping_result = await client.ping()
        print(f'✅ API v{ping_result["version"]} ready')
        
        # Get usage stats
        usage = await client.get_usage()
        print(f'📊 API calls this month: {usage["current_period"]["requests"]}')
        print(f'📊 Data transferred: {usage["current_period"]["data_transfer"]}')
        
        print('✅ Context manager example completed!')
    
    # Client is automatically closed when exiting the context


async def error_handling_example():
    """Comprehensive error handling example."""
    
    print('\n' + '='*50)
    print('ERROR HANDLING EXAMPLE')
    print('='*50)
    
    # Test with invalid API key
    try:
        client = JewelMusic(
            api_key='invalid_key',
            environment='sandbox'
        )
        
        await client.ping()
        
    except AuthenticationError as e:
        print(f'✅ Caught authentication error: {e.message}')
        print(f'   Request ID: {e.request_id}')
        print(f'   Status Code: {e.status_code}')
    
    except Exception as e:
        print(f'❌ Unexpected error: {str(e)}')
    
    finally:
        await client.close()
    
    # Test with invalid data
    try:
        client = JewelMusic(
            api_key=os.getenv('JEWELMUSIC_API_KEY'),
            environment='sandbox'
        )
        
        # Try to upload without required fields
        with open(__file__, 'rb') as f:  # Use this Python file as dummy data
            await client.tracks.upload(f, {})  # Missing required fields
    
    except ValidationError as e:
        print(f'✅ Caught validation error: {e.message}')
        print(f'   Validation errors: {e.validation_errors}')
    
    except Exception as e:
        print(f'❌ Unexpected error: {str(e)}')
    
    finally:
        await client.close()


async def main():
    """Main function to run all examples."""
    
    print('🎵 JewelMusic Python SDK - Basic Usage Examples\n')
    
    # Check for API key
    api_key = os.getenv('JEWELMUSIC_API_KEY')
    if not api_key:
        print('❌ JEWELMUSIC_API_KEY environment variable not set')
        print('Please set your API key: export JEWELMUSIC_API_KEY=your_key_here')
        return
    
    print(f'🔑 Using API key: {api_key[:12]}...')
    
    try:
        # Run async example
        await async_basic_usage()
        
        # Run sync example
        sync_basic_usage()
        
        # Run context manager example
        await context_manager_example()
        
        # Run error handling example
        await error_handling_example()
        
        print('\n✨ All examples completed successfully!')
        print('\nNext steps:')
        print('- Check out ai_generation.py for AI music creation')
        print('- See webhook_server.py for webhook handling')
        print('- Look at batch_operations.py for bulk operations')
    
    except KeyboardInterrupt:
        print('\n\n⏹️  Examples interrupted by user')
    except Exception as e:
        print(f'\n💥 Examples failed: {str(e)}')


if __name__ == '__main__':
    # Run the async main function
    asyncio.run(main())