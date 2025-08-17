"""
JewelMusic Python SDK Client

The main client class for interacting with the JewelMusic API.
Provides access to all JewelMusic services including AI copilot,
music analysis, distribution, transcription, and analytics.
"""

import asyncio
from typing import Optional, Dict, Any, Union
from .utils.http_client import HttpClient
from .resources.copilot import CopilotResource
from .resources.analysis import AnalysisResource
from .resources.distribution import DistributionResource
from .resources.transcription import TranscriptionResource
from .resources.tracks import TracksResource
from .resources.analytics import AnalyticsResource
from .resources.user import UserResource
from .resources.webhooks import WebhooksResource


class JewelMusic:
    """
    JewelMusic SDK Client
    
    The main client for interacting with the JewelMusic API.
    Provides access to all JewelMusic services including AI copilot,
    music analysis, distribution, transcription, and more.
    
    Args:
        api_key: Your JewelMusic API key
        environment: API environment ('production' or 'sandbox')
        api_version: API version to use (default: 'v1')
        base_url: Custom API base URL (optional)
        timeout: Request timeout in seconds (default: 30.0)
        max_retries: Maximum number of retry attempts (default: 3)
        retry_delay: Initial retry delay in seconds (default: 1.0)
        user_agent: Custom user agent string (optional)
        
    Example:
        >>> import asyncio
        >>> from jewelmusic_sdk import JewelMusic
        >>> 
        >>> async def main():
        ...     client = JewelMusic(api_key='jml_live_your_api_key_here')
        ...     
        ...     # Upload a track
        ...     with open('song.mp3', 'rb') as f:
        ...         track = await client.tracks.upload(f, {
        ...             'title': 'My Song',
        ...             'artist': 'Artist Name'
        ...         })
        ...     
        ...     # Get AI transcription
        ...     transcription = await client.transcription.create(track.id, {
        ...         'languages': ['en', 'ka'],
        ...         'include_timestamps': True
        ...     })
        ...     
        ...     print(f"Track: {track.title}")
        ...     print(f"Transcription: {transcription.text}")
        >>> 
        >>> asyncio.run(main())
    """
    
    def __init__(
        self,
        api_key: str,
        environment: str = 'production',
        api_version: str = 'v1',
        base_url: Optional[str] = None,
        timeout: float = 30.0,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        user_agent: Optional[str] = None,
        **kwargs
    ):
        """Initialize the JewelMusic client."""
        
        # Validate required parameters
        if not api_key:
            raise ValueError("API key is required")
        
        if not api_key.startswith(('jml_live_', 'jml_test_', 'jml_dev_')):
            raise ValueError("Invalid API key format")
        
        # Set default base URL based on environment
        if base_url is None:
            if environment == 'sandbox':
                base_url = 'https://api-sandbox.jewelmusic.art'
            else:
                base_url = 'https://api.jewelmusic.art'
        
        # Initialize HTTP client
        self._http_client = HttpClient(
            api_key=api_key,
            base_url=base_url,
            api_version=api_version,
            timeout=timeout,
            max_retries=max_retries,
            retry_delay=retry_delay,
            user_agent=user_agent,
            **kwargs
        )
        
        # Initialize resource managers
        self.copilot = CopilotResource(self._http_client)
        self.analysis = AnalysisResource(self._http_client)
        self.distribution = DistributionResource(self._http_client)
        self.transcription = TranscriptionResource(self._http_client)
        self.tracks = TracksResource(self._http_client)
        self.analytics = AnalyticsResource(self._http_client)
        self.user = UserResource(self._http_client)
        self.webhooks = WebhooksResource(self._http_client)
    
    async def ping(self) -> Dict[str, Any]:
        """
        Test the API connection and authentication.
        
        Returns:
            Dict containing success status, timestamp, and API version
            
        Raises:
            AuthenticationError: If the API key is invalid
            NetworkError: If there's a network connectivity issue
            
        Example:
            >>> ping_result = await client.ping()
            >>> print(f"Connected to API v{ping_result['version']}")
        """
        response = await self._http_client.get('/ping')
        return {
            'success': True,
            'timestamp': response['timestamp'],
            'version': response['version']
        }
    
    async def get_profile(self) -> Dict[str, Any]:
        """
        Get the current user's profile and API usage information.
        
        Returns:
            User profile data
            
        Example:
            >>> profile = await client.get_profile()
            >>> print(f"User: {profile['name']}")
            >>> print(f"Plan: {profile['subscription']['plan']}")
        """
        return await self.user.get_profile()
    
    async def get_usage(self) -> Dict[str, Any]:
        """
        Get API usage statistics for the current user.
        
        Returns:
            Usage statistics data
            
        Example:
            >>> usage = await client.get_usage()
            >>> print(f"Requests this month: {usage['current_period']['requests']}")
        """
        return await self.user.get_usage_stats()
    
    async def close(self) -> None:
        """
        Close the HTTP client and cleanup resources.
        
        This should be called when you're done using the client
        to properly cleanup HTTP connections.
        
        Example:
            >>> await client.close()
        """
        await self._http_client.close()
    
    async def __aenter__(self):
        """Async context manager entry."""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()
    
    def __enter__(self):
        """Context manager entry (not recommended for async operations)."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit (not recommended for async operations)."""
        # For sync context manager, we need to run close() in event loop
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # If we're already in an event loop, schedule the close
                loop.create_task(self.close())
            else:
                # If no event loop is running, run it
                loop.run_until_complete(self.close())
        except RuntimeError:
            # If we can't get an event loop, create a new one
            asyncio.run(self.close())


# Convenience function for creating clients
def create_client(api_key: str, **kwargs) -> JewelMusic:
    """
    Create a new JewelMusic client instance.
    
    This is a convenience function that creates a new client with the provided configuration.
    
    Args:
        api_key: Your JewelMusic API key
        **kwargs: Additional configuration options
        
    Returns:
        A new JewelMusic client instance
        
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


# Synchronous wrapper class for backwards compatibility
class JewelMusicSync:
    """
    Synchronous wrapper for the JewelMusic client.
    
    This class provides a synchronous interface to the JewelMusic API
    by automatically handling the async/await calls internally.
    
    Note: Using the async client directly is recommended for better performance.
    
    Example:
        >>> from jewelmusic_sdk import JewelMusicSync
        >>> client = JewelMusicSync(api_key='jml_live_your_key')
        >>> track = client.tracks.upload(audio_file, metadata)
    """
    
    def __init__(self, *args, **kwargs):
        self._async_client = JewelMusic(*args, **kwargs)
        self._loop = None
    
    def _run_async(self, coro):
        """Run an async coroutine and return the result."""
        try:
            # Try to get the current event loop
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # If we're in an async context, we can't use run_until_complete
                raise RuntimeError(
                    "Cannot use sync client within an async context. "
                    "Use the async JewelMusic client instead."
                )
            return loop.run_until_complete(coro)
        except RuntimeError:
            # No event loop is running, create a new one
            return asyncio.run(coro)
    
    def ping(self):
        """Sync version of ping()."""
        return self._run_async(self._async_client.ping())
    
    def get_profile(self):
        """Sync version of get_profile()."""
        return self._run_async(self._async_client.get_profile())
    
    def get_usage(self):
        """Sync version of get_usage()."""
        return self._run_async(self._async_client.get_usage())
    
    def close(self):
        """Sync version of close()."""
        return self._run_async(self._async_client.close())
    
    def __getattr__(self, name):
        """
        Proxy attribute access to create sync wrappers for resources.
        
        This allows accessing resources like client.tracks, client.analysis, etc.
        and automatically wraps their methods to be synchronous.
        """
        attr = getattr(self._async_client, name)
        if hasattr(attr, '__class__') and hasattr(attr.__class__, '__name__'):
            # This is likely a resource class, create a sync wrapper
            return SyncResourceWrapper(attr, self._run_async)
        return attr
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


class SyncResourceWrapper:
    """Wrapper to make resource methods synchronous."""
    
    def __init__(self, async_resource, run_async_func):
        self._async_resource = async_resource
        self._run_async = run_async_func
    
    def __getattr__(self, name):
        attr = getattr(self._async_resource, name)
        if asyncio.iscoroutinefunction(attr):
            # If it's an async method, wrap it to be sync
            def sync_wrapper(*args, **kwargs):
                return self._run_async(attr(*args, **kwargs))
            return sync_wrapper
        return attr