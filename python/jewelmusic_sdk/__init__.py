"""
JewelMusic Python SDK

Official Python SDK for the JewelMusic AI-powered music distribution platform.
Provides comprehensive access to JewelMusic's API including AI copilot features,
music analysis, distribution management, transcription services, and analytics.

Example:
    >>> from jewelmusic_sdk import JewelMusic
    >>> client = JewelMusic(api_key='jml_live_your_api_key_here')
    >>> track = await client.tracks.upload(audio_file, metadata)
"""

from .client import JewelMusic
from .exceptions import (
    JewelMusicError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    RateLimitError,
    ServerError,
    NetworkError,
    UnknownError,
)

# Resource classes for advanced usage
from .resources.copilot import CopilotResource
from .resources.analysis import AnalysisResource
from .resources.distribution import DistributionResource
from .resources.transcription import TranscriptionResource
from .resources.tracks import TracksResource
from .resources.analytics import AnalyticsResource
from .resources.user import UserResource
from .resources.webhooks import WebhooksResource

__version__ = "1.0.0"
__author__ = "JewelMusic Team"
__email__ = "developers@jewelmusic.art"
__license__ = "MIT"
__url__ = "https://github.com/jewelmusic/sdk-python"

__all__ = [
    # Main client
    "JewelMusic",
    
    # Exceptions
    "JewelMusicError",
    "AuthenticationError", 
    "AuthorizationError",
    "NotFoundError",
    "ValidationError",
    "RateLimitError",
    "ServerError",
    "NetworkError",
    "UnknownError",
    
    # Resources
    "CopilotResource",
    "AnalysisResource",
    "DistributionResource", 
    "TranscriptionResource",
    "TracksResource",
    "AnalyticsResource",
    "UserResource",
    "WebhooksResource",
]

# Create a convenience function for client creation
def create_client(api_key: str, **kwargs) -> JewelMusic:
    """
    Create a new JewelMusic client instance.
    
    Args:
        api_key: Your JewelMusic API key
        **kwargs: Additional configuration options
        
    Returns:
        JewelMusic client instance
        
    Example:
        >>> client = create_client('jml_live_your_key')
        >>> # or with additional options
        >>> client = create_client(
        ...     'jml_live_your_key',
        ...     environment='production',
        ...     timeout=30.0
        ... )
    """
    return JewelMusic(api_key=api_key, **kwargs)