# JewelMusic Python SDK

The official Python SDK for the JewelMusic AI-powered music distribution platform. This SDK provides comprehensive access to JewelMusic's API, including AI copilot features, music analysis, distribution management, transcription services, and analytics.

[![PyPI version](https://badge.fury.io/py/jewelmusic-sdk.svg)](https://badge.fury.io/py/jewelmusic-sdk)
[![Python](https://img.shields.io/pypi/pyversions/jewelmusic-sdk.svg)](https://pypi.org/project/jewelmusic-sdk/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🤖 **AI Copilot**: Generate melodies, harmonies, lyrics, and complete songs
- 🎵 **Music Analysis**: Advanced audio quality checking, structure detection, and cultural compliance
- 📡 **Distribution**: Manage releases across 150+ streaming platforms
- 🎤 **Transcription**: AI transcription with 150+ language support and speaker diarization
- 📊 **Analytics**: Comprehensive streaming data, royalty tracking, and performance insights
- 👤 **User Management**: Profile, preferences, API keys, and account management
- 🔗 **Webhooks**: Real-time event notifications with signature verification
- ⚡ **Async Support**: Full async/await support with optional synchronous interface

## Installation

### pip
```bash
pip install jewelmusic-sdk
```

### Poetry
```bash
poetry add jewelmusic-sdk
```

### Conda
```bash
conda install -c conda-forge jewelmusic-sdk
```

## Quick Start

### Async Usage (Recommended)

```python
import asyncio
from jewelmusic_sdk import JewelMusic

async def main():
    # Initialize the client
    client = JewelMusic(
        api_key='jml_live_your_api_key_here',
        environment='production'
    )
    
    try:
        # Upload and analyze a track
        with open('song.mp3', 'rb') as f:
            track = await client.tracks.upload(f, {
                'title': 'My Song',
                'artist': 'Artist Name',
                'album': 'Album Name',
                'genre': 'Electronic'
            })
        
        # Get AI analysis
        with open('song.mp3', 'rb') as f:
            analysis = await client.analysis.upload_track(f, {
                'analysis_types': ['tempo', 'key', 'structure', 'quality'],
                'detailed_report': True
            })
        
        # Generate transcription
        transcription = await client.transcription.create(track['id'], {
            'languages': ['en'],
            'include_timestamps': True,
            'speaker_diarization': True
        })
        
        print(f"Track uploaded: {track['id']}")
        print(f"Analysis completed: {analysis['summary']}")
        print(f"Transcription ready: {transcription['text']}")
    
    finally:
        await client.close()

# Run the async function
asyncio.run(main())
```

### Synchronous Usage

```python
from jewelmusic_sdk import JewelMusicSync

# Initialize the synchronous client
client = JewelMusicSync(
    api_key='jml_live_your_api_key_here',
    environment='production'
)

try:
    # Upload track (synchronous)
    with open('song.mp3', 'rb') as f:
        track = client.tracks.upload(f, {
            'title': 'My Song',
            'artist': 'Artist Name'
        })
    
    print(f"Track uploaded: {track['id']}")

finally:
    client.close()
```

### Context Manager Usage

```python
import asyncio
from jewelmusic_sdk import JewelMusic

async def main():
    async with JewelMusic(api_key='your_key') as client:
        # Client will be automatically closed
        track = await client.tracks.upload(audio_file, metadata)
        return track

asyncio.run(main())
```

## Authentication

### API Key Setup

1. Sign up at [JewelMusic](https://jewelmusic.art)
2. Navigate to your dashboard and generate an API key
3. Use the appropriate key for your environment:
   - Production: `jml_live_*`
   - Sandbox: `jml_test_*`
   - Development: `jml_dev_*`

### Environment Configuration

```python
from jewelmusic_sdk import JewelMusic

# Production
client = JewelMusic(
    api_key='jml_live_your_key_here',
    environment='production'
)

# Sandbox (for testing)
client = JewelMusic(
    api_key='jml_test_your_key_here',
    environment='sandbox'
)
```

### Advanced Configuration

```python
import logging
from jewelmusic_sdk import JewelMusic

# Configure logging
logging.basicConfig(level=logging.INFO)

client = JewelMusic(
    api_key='your_api_key',
    environment='production',
    api_version='v1',
    timeout=30.0,
    max_retries=3,
    retry_delay=1.0,
    user_agent='MyApp/1.0.0'
)
```

## Core Features

### AI Copilot

Generate music content with AI assistance:

```python
import asyncio
from jewelmusic_sdk import JewelMusic

async def ai_generation_example():
    async with JewelMusic(api_key='your_key') as client:
        # Generate a melody
        melody = await client.copilot.generate_melody({
            'style': 'electronic',
            'tempo': 128,
            'key': 'C',
            'duration': 30,
            'instruments': ['synthesizer', 'bass']
        })
        
        # Generate lyrics
        lyrics = await client.copilot.generate_lyrics({
            'theme': 'love',
            'genre': 'pop',
            'language': 'en',
            'mood': 'uplifting',
            'structure': 'verse-chorus-verse-chorus-bridge-chorus'
        })
        
        # Complete song generation
        song = await client.copilot.complete_song({
            'prompt': 'An uplifting electronic song about overcoming challenges',
            'style': 'electronic',
            'duration': 180,
            'include_vocals': True
        })
        
        return {
            'melody': melody,
            'lyrics': lyrics,
            'song': song
        }

asyncio.run(ai_generation_example())
```

### Music Analysis

Comprehensive audio analysis and quality checking:

```python
async def analysis_example():
    async with JewelMusic(api_key='your_key') as client:
        # Upload and analyze audio
        with open('song.mp3', 'rb') as f:
            analysis = await client.analysis.upload_track(f, {
                'analysis_types': ['tempo', 'key', 'structure', 'quality', 'loudness'],
                'detailed_report': True,
                'cultural_context': 'global',
                'target_platforms': ['spotify', 'apple-music']
            })
        
        # Audio quality check
        with open('song.mp3', 'rb') as f:
            quality = await client.analysis.audio_quality_check(f, {
                'check_clipping': True,
                'check_phase_issues': True,
                'check_dynamic_range': True,
                'target_loudness': -14  # LUFS
            })
        
        print(f"Tempo: {analysis['tempo']['bpm']} BPM")
        print(f"Key: {analysis['key']['key']} {analysis['key']['mode']}")
        print(f"Quality Score: {quality['overall_score']}")
```

### Distribution Management

Manage releases across streaming platforms:

```python
async def distribution_example():
    async with JewelMusic(api_key='your_key') as client:
        # Create a release
        release = await client.distribution.create_release({
            'type': 'single',
            'title': 'My Song',
            'artist': 'Artist Name',
            'release_date': '2025-09-01',
            'tracks': [
                {
                    'track_id': 'track_123',
                    'title': 'My Song',
                    'duration': 210,
                    'isrc': 'US1234567890'
                }
            ],
            'territories': ['worldwide'],
            'platforms': ['spotify', 'apple-music', 'youtube-music']
        })
        
        # Submit to platforms
        await client.distribution.submit_to_platforms(release['id'], {
            'platforms': ['spotify', 'apple-music'],
            'scheduled_date': '2025-09-01T00:00:00Z'
        })
        
        print(f"Release created: {release['id']}")
```

### Transcription Services

AI-powered transcription with multi-language support:

```python
async def transcription_example():
    async with JewelMusic(api_key='your_key') as client:
        # Create transcription from file
        with open('song.mp3', 'rb') as f:
            transcription = await client.transcription.create(
                file_data=f,
                options={
                    'languages': ['en', 'es', 'fr'],
                    'include_timestamps': True,
                    'word_level_timestamps': True,
                    'speaker_diarization': True,
                    'model': 'large'
                }
            )
        
        # Translate lyrics
        translation = await client.transcription.translate_lyrics(
            transcription['id'],
            ['es', 'fr', 'de']
        )
        
        print(f"Original: {transcription['text']}")
        print(f"Translations: {translation}")
```

### Analytics & Reporting

Comprehensive streaming analytics and royalty tracking:

```python
async def analytics_example():
    async with JewelMusic(api_key='your_key') as client:
        # Get streaming data
        streams = await client.analytics.get_streams({
            'start_date': '2025-01-01',
            'end_date': '2025-01-31',
            'group_by': 'day',
            'platforms': ['spotify', 'apple-music'],
            'metrics': ['streams', 'listeners', 'revenue']
        })
        
        # Royalty reports
        royalties = await client.analytics.get_royalty_reports(
            '2025-01-01',
            '2025-01-31',
            {
                'currency': 'USD',
                'include_pending': True,
                'group_by': 'platform'
            }
        )
        
        # AI insights
        insights = await client.analytics.get_insights({
            'period': 'last_30_days',
            'include_recommendations': True
        })
        
        print(f"Total streams: {streams['summary']['total_streams']}")
        print(f"Revenue: ${royalties['total_revenue']}")
```

### Track Management

Upload, organize, and manage your music library:

```python
async def track_management_example():
    async with JewelMusic(api_key='your_key') as client:
        # Upload with progress tracking
        def progress_callback(loaded, total):
            percentage = (loaded / total) * 100
            print(f"Upload progress: {percentage:.1f}%")
        
        with open('song.mp3', 'rb') as f:
            track = await client.tracks.upload(
                f,
                {
                    'title': 'My Song',
                    'artist': 'Artist Name',
                    'album': 'My Album',
                    'genre': 'Electronic',
                    'release_date': '2025-09-01'
                },
                progress_callback=progress_callback
            )
        
        # Get track details
        track_details = await client.tracks.get(track['id'])
        
        # Update metadata
        updated = await client.tracks.update(track['id'], {
            'title': 'Updated Title',
            'genre': 'Ambient'
        })
        
        print(f"Track uploaded: {track['id']}")
```

## Error Handling

The SDK provides comprehensive error handling with specific exception types:

```python
import asyncio
from jewelmusic_sdk import (
    JewelMusic, 
    AuthenticationError, 
    ValidationError, 
    RateLimitError, 
    NetworkError
)

async def error_handling_example():
    async with JewelMusic(api_key='your_key') as client:
        try:
            with open('song.mp3', 'rb') as f:
                track = await client.tracks.upload(f, metadata)
        
        except AuthenticationError as e:
            print(f"Invalid API key: {e.message}")
        except ValidationError as e:
            print(f"Validation failed: {e.details}")
            print(f"Validation errors: {e.validation_errors}")
        except RateLimitError as e:
            print(f"Rate limit exceeded. Retry after: {e.retry_after}s")
        except NetworkError as e:
            print(f"Network error: {e.message}")
        except Exception as e:
            print(f"Unknown error: {e}")

asyncio.run(error_handling_example())
```

## Webhooks

Set up webhooks to receive real-time notifications:

```python
import asyncio
from jewelmusic_sdk import JewelMusic
from jewelmusic_sdk.resources.webhooks import WebhooksResource

async def webhook_setup():
    async with JewelMusic(api_key='your_key') as client:
        # Create webhook
        webhook = await client.webhooks.create({
            'url': 'https://myapp.com/webhooks/jewelmusic',
            'events': [
                'track.uploaded',
                'track.processed',
                'analysis.completed',
                'distribution.released'
            ],
            'secret': 'my_webhook_secret_123'
        })
        
        print(f"Webhook created: {webhook['id']}")

# Verify webhook signatures in your web server
def handle_webhook(request_body, signature_header, secret):
    """Handle incoming webhook with signature verification."""
    
    # Verify signature
    is_valid = WebhooksResource.verify_signature(
        request_body,
        signature_header,
        secret
    )
    
    if not is_valid:
        raise ValueError("Invalid webhook signature")
    
    # Parse event
    event = WebhooksResource.parse_event(request_body)
    
    # Handle different event types
    if event['type'] == 'track.uploaded':
        print(f"Track uploaded: {event['data']['track']['title']}")
    elif event['type'] == 'analysis.completed':
        print(f"Analysis completed: {event['data']['analysis']['id']}")
    
    return event

asyncio.run(webhook_setup())
```

## Pagination

Handle paginated responses efficiently:

```python
async def pagination_example():
    async with JewelMusic(api_key='your_key') as client:
        # Method 1: Manual pagination
        page = 1
        all_tracks = []
        
        while True:
            response = await client.tracks.list({
                'page': page,
                'per_page': 20
            })
            
            tracks = response['items']
            all_tracks.extend(tracks)
            
            if page >= response['pagination']['total_pages']:
                break
            page += 1
        
        # Method 2: Iterator (if using PaginatedResource)
        async for track in client.tracks.iterate_items():
            print(f"Track: {track['title']}")
        
        # Method 3: Get all at once
        all_tracks = await client.tracks.list_all(max_pages=10)
        
        print(f"Total tracks: {len(all_tracks)}")
```

## Type Hints

The SDK includes comprehensive type hints for better development experience:

```python
from typing import Dict, Any, List, Optional
from jewelmusic_sdk import JewelMusic

async def typed_example():
    client: JewelMusic = JewelMusic(api_key='your_key')
    
    track_metadata: Dict[str, Any] = {
        'title': 'My Song',
        'artist': 'Artist Name'
    }
    
    try:
        with open('song.mp3', 'rb') as f:
            track: Dict[str, Any] = await client.tracks.upload(f, track_metadata)
        
        track_id: str = track['id']
        track_title: str = track['title']
        
        print(f"Uploaded: {track_title} ({track_id})")
    
    finally:
        await client.close()
```

## Configuration

### Environment Variables

You can configure the SDK using environment variables:

```bash
export JEWELMUSIC_API_KEY=jml_live_your_key_here
export JEWELMUSIC_ENVIRONMENT=production
export JEWELMUSIC_API_VERSION=v1
```

```python
import os
from jewelmusic_sdk import JewelMusic

# SDK will automatically use environment variables
client = JewelMusic(
    api_key=os.getenv('JEWELMUSIC_API_KEY'),
    environment=os.getenv('JEWELMUSIC_ENVIRONMENT', 'production')
)
```

### Logging

Configure logging to debug SDK behavior:

```python
import logging
from jewelmusic_sdk import JewelMusic

# Enable debug logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# The SDK will log HTTP requests, retries, and other debug information
client = JewelMusic(api_key='your_key')
```

## Examples

See the [examples](examples/) directory for complete working examples:

- [basic_usage.py](examples/basic_usage.py) - Basic SDK usage patterns
- [ai_generation.py](examples/ai_generation.py) - AI music generation
- [webhook_server.py](examples/webhook_server.py) - Webhook handling server
- [batch_operations.py](examples/batch_operations.py) - Batch upload and processing
- [async_patterns.py](examples/async_patterns.py) - Advanced async patterns

## API Reference

### Client Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api_key` | `str` | *required* | Your JewelMusic API key |
| `environment` | `str` | `'production'` | API environment |
| `api_version` | `str` | `'v1'` | API version |
| `base_url` | `str` | `None` | Custom API base URL |
| `timeout` | `float` | `30.0` | Request timeout in seconds |
| `max_retries` | `int` | `3` | Maximum retry attempts |
| `retry_delay` | `float` | `1.0` | Initial retry delay in seconds |

### Resource Methods

#### Copilot
- `generate_melody(options)` - Generate AI melody
- `generate_harmony(options)` - Generate AI harmony
- `generate_lyrics(options)` - Generate AI lyrics
- `complete_song(options)` - Generate complete song
- `get_templates(params)` - Get song templates

#### Analysis
- `upload_track(file_data, options)` - Upload and analyze audio
- `get_analysis(analysis_id)` - Get analysis results
- `audio_quality_check(file_data, options)` - Check audio quality

#### Distribution
- `create_release(release_data)` - Create new release
- `get_releases(params)` - List releases
- `get_release(release_id)` - Get release details
- `submit_to_platforms(release_id, options)` - Submit to platforms

#### Transcription
- `create(track_id, file_data, options)` - Create transcription
- `get_transcription(transcription_id)` - Get transcription
- `translate_lyrics(transcription_id, languages)` - Translate lyrics

#### Tracks
- `upload(file_data, metadata, progress_callback)` - Upload track
- `list(params)` - List tracks
- `get(track_id)` - Get track details
- `update(track_id, metadata)` - Update track
- `delete(track_id)` - Delete track

#### Analytics
- `get_streams(query)` - Get streaming data
- `get_royalty_reports(start_date, end_date, options)` - Get royalty reports
- `get_insights(options)` - Get AI insights

#### User
- `get_profile()` - Get user profile
- `update_profile(updates)` - Update profile
- `get_preferences()` - Get preferences
- `update_preferences(preferences)` - Update preferences
- `get_api_keys()` - List API keys
- `create_api_key(name, permissions)` - Create API key
- `get_usage_stats(options)` - Get usage statistics

#### Webhooks
- `list(params)` - List webhooks
- `create(webhook_data)` - Create webhook
- `get(webhook_id)` - Get webhook details
- `update(webhook_id, updates)` - Update webhook
- `delete(webhook_id)` - Delete webhook
- `test(webhook_id, event_type)` - Test webhook
- `verify_signature(payload, signature, secret)` - Verify signature (static)
- `parse_event(payload)` - Parse webhook event (static)

## Requirements

- Python 3.8+
- aiohttp >= 3.8.0
- aiofiles >= 0.8.0

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/jewelmusic/sdk-python.git
cd sdk-python

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run tests with coverage
pytest --cov=jewelmusic_sdk

# Run type checking
mypy jewelmusic_sdk

# Format code
black jewelmusic_sdk tests examples
isort jewelmusic_sdk tests examples
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_client.py

# Run with verbose output
pytest -v

# Run async tests only
pytest -k "async"

# Run integration tests (requires API key)
pytest tests/integration/ --api-key=your_test_key
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [support@jewelmusic.art](mailto:support@jewelmusic.art)
- 💬 Discord: [JewelMusic Community](https://discord.gg/jewelmusic)
- 📖 Documentation: [docs.jewelmusic.art](https://docs.jewelmusic.art)
- 🐛 Issues: [GitHub Issues](https://github.com/jewelmusic/sdk-python/issues)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes in each version.

---

**JewelMusic Python SDK** - Empowering musicians with AI-powered tools for creation, analysis, and distribution.