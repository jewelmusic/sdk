"""
Resource modules for the JewelMusic Python SDK.

Each resource provides access to specific API functionality:
- copilot: AI music generation and creative assistance
- analysis: Audio analysis and quality checking  
- distribution: Music distribution to streaming platforms
- transcription: AI transcription and lyrics processing
- tracks: Track upload and management
- analytics: Streaming analytics and royalty tracking
- user: User profile and account management
- webhooks: Webhook configuration and management
"""

from .base import BaseResource
from .copilot import CopilotResource
from .analysis import AnalysisResource
from .distribution import DistributionResource
from .transcription import TranscriptionResource
from .tracks import TracksResource
from .analytics import AnalyticsResource
from .user import UserResource
from .webhooks import WebhooksResource

__all__ = [
    'BaseResource',
    'CopilotResource',
    'AnalysisResource', 
    'DistributionResource',
    'TranscriptionResource',
    'TracksResource',
    'AnalyticsResource',
    'UserResource',
    'WebhooksResource',
]