# JewelMusic Python SDK API Reference

This document provides detailed API reference for the JewelMusic Python SDK.

## Table of Contents

- [Client Initialization](#client-initialization)
- [Resources Overview](#resources-overview)
- [Error Handling](#error-handling)
- [Type Hints](#type-hints)

## Client Initialization

### JewelMusicClient

```python
from jewelmusic_sdk import JewelMusicClient

client = JewelMusicClient(api_key: str, **options)
```

#### Configuration Options

```python
client = JewelMusicClient(
    api_key="your-api-key",
    base_url="https://api.jewelmusic.art",  # Optional
    timeout=30.0,                           # Optional, in seconds
    max_retries=3,                          # Optional
    retry_delay=1.0,                        # Optional, in seconds
    user_agent="MyApp/1.0",                 # Optional
    debug=False,                            # Optional
    headers={"Custom-Header": "value"}      # Optional
)
```

## Resources Overview

### Tracks Resource

```python
# Upload track
track = await client.tracks.upload(
    file_path: str,
    filename: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

# Upload with file-like object
with open("audio.mp3", "rb") as f:
    track = await client.tracks.upload(f, "audio.mp3", metadata)

# Get track
track = await client.tracks.get(track_id: str) -> Dict[str, Any]

# List tracks
tracks = await client.tracks.list(
    page: int = 1,
    per_page: int = 20,
    filters: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

# Update track
updated_track = await client.tracks.update(
    track_id: str,
    updates: Dict[str, Any]
) -> Dict[str, Any]

# Delete track
await client.tracks.delete(track_id: str) -> None

# Search tracks
results = await client.tracks.search(
    query: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]
```

### Analysis Resource

```python
# Analyze track
analysis = await client.analysis.analyze(
    track_id: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

# Analyze with specific types
analysis = await client.analysis.analyze_with_options(
    track_id: str,
    analysis_types: List[str] = ["tempo", "key", "mood"],
    detailed_report: bool = False,
    cultural_context: str = "global"
) -> Dict[str, Any]

# Get analysis results
analysis = await client.analysis.get(analysis_id: str) -> Dict[str, Any]

# Get specific analysis components
tempo = await client.analysis.get_tempo_analysis(analysis_id: str)
key = await client.analysis.get_key_analysis(analysis_id: str)
mood = await client.analysis.get_mood_analysis(analysis_id: str)
```

### Copilot Resource (AI Generation)

```python
# Generate melody
melody = await client.copilot.generate_melody(
    style: str,
    genre: str,
    mood: str,
    tempo: int,
    key: str,
    **kwargs
) -> Dict[str, Any]

# Generate lyrics
lyrics = await client.copilot.generate_lyrics(
    theme: str,
    genre: str,
    language: str = "en",
    mood: str = "neutral",
    **kwargs
) -> Dict[str, Any]

# Generate harmony
harmony = await client.copilot.generate_harmony(
    melody_id: Optional[str] = None,
    style: str = "modern",
    complexity: str = "medium",
    **kwargs
) -> Dict[str, Any]

# Generate complete song
song = await client.copilot.generate_complete_song(
    prompt: str,
    style: str,
    duration: int = 180,
    include_vocals: bool = False,
    **kwargs
) -> Dict[str, Any]

# Apply style transfer
styled_track = await client.copilot.apply_style_transfer(
    source_id: str,
    target_style: str,
    intensity: float = 0.5,
    **kwargs
) -> Dict[str, Any]

# Get templates
templates = await client.copilot.get_templates(
    query: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]
```

### Distribution Resource

```python
# Create release
release = await client.distribution.create_release(
    release_data: Dict[str, Any]
) -> Dict[str, Any]

# Submit to platforms
submission = await client.distribution.submit_to_platforms(
    release_id: str,
    submission_data: Dict[str, Any]
) -> Dict[str, Any]

# Get distribution status
status = await client.distribution.get_status(
    release_id: str
) -> Dict[str, Any]

# Validate release
validation = await client.distribution.validate_release(
    release_id: str
) -> Dict[str, Any]

# Get platforms
platforms = await client.distribution.get_platforms() -> List[Dict[str, Any]]
```

### Transcription Resource

```python
# Create transcription
transcription = await client.transcription.create_transcription(
    track_id: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

# Create from file
transcription = await client.transcription.create_from_file(
    file_path: str,
    filename: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

# Get transcription
transcription = await client.transcription.get(
    transcription_id: str
) -> Dict[str, Any]

# Enhance lyrics
enhanced = await client.transcription.enhance_lyrics(
    text: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

# Translate lyrics
translation = await client.transcription.translate_lyrics(
    transcription_id: str,
    target_languages: List[str],
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]
```

### Analytics Resource

```python
# Get streaming analytics
streams = await client.analytics.get_streams(
    query: Dict[str, Any]
) -> Dict[str, Any]

# Get listener demographics
listeners = await client.analytics.get_listeners(
    query: Dict[str, Any]
) -> Dict[str, Any]

# Get track analytics
track_analytics = await client.analytics.get_track_analytics(
    track_id: str,
    query: Dict[str, Any]
) -> Dict[str, Any]

# Setup alert
alert = await client.analytics.setup_alert(
    alert_data: Dict[str, Any]
) -> Dict[str, Any]

# Export data
export = await client.analytics.export_data(
    query: Dict[str, Any],
    options: Dict[str, Any]
) -> Dict[str, Any]

# Get real-time analytics
realtime = await client.analytics.get_realtime_analytics(
    options: Dict[str, Any]
) -> Dict[str, Any]
```

### User Resource

```python
# Get profile
profile = await client.user.get_profile() -> Dict[str, Any]

# Update profile
updated_profile = await client.user.update_profile(
    updates: Dict[str, Any]
) -> Dict[str, Any]

# Get usage stats
usage = await client.user.get_usage_stats(
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

# API key management
api_keys = await client.user.get_api_keys() -> List[Dict[str, Any]]

new_key = await client.user.create_api_key(
    name: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]

await client.user.revoke_api_key(key_id: str) -> None
```

### Webhooks Resource

```python
# Create webhook
webhook = await client.webhooks.create(
    webhook_data: Dict[str, Any]
) -> Dict[str, Any]

# List webhooks
webhooks = await client.webhooks.list() -> List[Dict[str, Any]]

# Get webhook
webhook = await client.webhooks.get(webhook_id: str) -> Dict[str, Any]

# Update webhook
updated_webhook = await client.webhooks.update(
    webhook_id: str,
    updates: Dict[str, Any]
) -> Dict[str, Any]

# Delete webhook
await client.webhooks.delete(webhook_id: str) -> None

# Test webhook
test_result = await client.webhooks.test(webhook_id: str) -> Dict[str, Any]

# Verify signature (utility function)
from jewelmusic_sdk.utils import verify_webhook_signature

is_valid = verify_webhook_signature(
    payload: str,
    signature: str,
    secret: str
) -> bool
```

## Error Handling

### Exception Types

```python
from jewelmusic_sdk.exceptions import (
    JewelMusicError,
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError,
    NetworkError
)

# Base exception
class JewelMusicError(Exception):
    def __init__(self, message: str, status_code: Optional[int] = None,
                 details: Optional[Dict[str, Any]] = None,
                 request_id: Optional[str] = None):
        self.status_code = status_code
        self.details = details
        self.request_id = request_id
        super().__init__(message)

# Specific exceptions
class AuthenticationError(JewelMusicError):
    pass

class ValidationError(JewelMusicError):
    def __init__(self, message: str, field_errors: Dict[str, List[str]], **kwargs):
        self.field_errors = field_errors
        super().__init__(message, **kwargs)

class RateLimitError(JewelMusicError):
    def __init__(self, message: str, retry_after_seconds: int, **kwargs):
        self.retry_after_seconds = retry_after_seconds
        super().__init__(message, **kwargs)
```

### Error Handling Example

```python
try:
    track = await client.tracks.get('invalid-id')
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
    print(f"Request ID: {e.request_id}")
except ValidationError as e:
    print(f"Validation errors: {e.field_errors}")
except NotFoundError as e:
    print(f"Track not found: {e}")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after_seconds} seconds")
    await asyncio.sleep(e.retry_after_seconds)
except NetworkError as e:
    print(f"Network error: {e}")
except JewelMusicError as e:
    print(f"API error: {e} (Status: {e.status_code})")
```

## Type Hints

### Core Types

```python
from typing import Dict, List, Optional, Union, Any, BinaryIO

# Type aliases for common structures
TrackMetadata = Dict[str, Any]
AnalysisOptions = Dict[str, Any]
AnalysisResults = Dict[str, Any]
WebhookData = Dict[str, Any]

# File upload types
FileInput = Union[str, BinaryIO]  # File path or file-like object

# Common response types
ApiResponse = Dict[str, Any]
PaginatedResponse = Dict[str, Any]  # Contains 'items' and 'pagination' keys

# Analysis component types
TempoAnalysis = Dict[str, Any]
KeyAnalysis = Dict[str, Any]
MoodAnalysis = Dict[str, Any]
QualityAnalysis = Dict[str, Any]
```

### Configuration Types

```python
from typing import TypedDict, Optional

class ClientConfig(TypedDict, total=False):
    base_url: str
    timeout: float
    max_retries: int
    retry_delay: float
    user_agent: str
    debug: bool
    headers: Dict[str, str]

class UploadOptions(TypedDict, total=False):
    chunk_size: int
    timeout: float
    progress_callback: callable
```

### Usage Examples with Type Hints

```python
from jewelmusic_sdk import JewelMusicClient
from typing import Dict, Any, Optional

async def upload_and_analyze(
    client: JewelMusicClient,
    file_path: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Upload a track and start analysis."""
    
    # Upload track
    track: Dict[str, Any] = await client.tracks.upload(
        file_path=file_path,
        filename=file_path.split("/")[-1],
        metadata=metadata or {}
    )
    
    # Start analysis
    analysis: Dict[str, Any] = await client.analysis.analyze(
        track_id=track["id"],
        options={
            "analysis_types": ["tempo", "key", "mood"],
            "detailed_report": True
        }
    )
    
    return {
        "track": track,
        "analysis": analysis
    }
```

For more detailed type information, see the type stubs (.pyi files) included with the SDK package.