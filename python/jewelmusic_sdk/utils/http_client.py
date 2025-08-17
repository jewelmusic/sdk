"""
HTTP Client for JewelMusic Python SDK

Handles all HTTP communication with the JewelMusic API including
authentication, retries, rate limiting, and error handling.
"""

import asyncio
import json
import time
from typing import Optional, Dict, Any, Union, BinaryIO, Tuple
from urllib.parse import urljoin, urlencode
import aiohttp
import aiofiles
from ..exceptions import create_error_from_response, NetworkError, ConfigurationError


class HttpClient:
    """
    HTTP client for JewelMusic API communication.
    
    Handles authentication, request/response processing, retries,
    rate limiting, and error handling for all API requests.
    """
    
    def __init__(
        self,
        api_key: str,
        base_url: str,
        api_version: str = 'v1',
        timeout: float = 30.0,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        user_agent: Optional[str] = None,
        **kwargs
    ):
        """
        Initialize the HTTP client.
        
        Args:
            api_key: JewelMusic API key
            base_url: Base URL for API endpoints
            api_version: API version to use
            timeout: Request timeout in seconds
            max_retries: Maximum retry attempts
            retry_delay: Initial retry delay in seconds
            user_agent: Custom user agent string
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.api_version = api_version
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        
        # Build user agent
        if user_agent is None:
            user_agent = f"JewelMusic-Python-SDK/1.0.0"
        self.user_agent = user_agent
        
        # Default headers
        self.default_headers = {
            'Authorization': f'Bearer {api_key}',
            'User-Agent': user_agent,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        
        # HTTP session (created lazily)
        self._session: Optional[aiohttp.ClientSession] = None
        
        # Rate limiting state
        self._rate_limit_remaining = None
        self._rate_limit_reset = None
        self._rate_limit_limit = None
    
    @property
    def session(self) -> aiohttp.ClientSession:
        """Get or create the HTTP session."""
        if self._session is None or self._session.closed:
            connector = aiohttp.TCPConnector(
                limit=100,  # Connection pool size
                limit_per_host=30,
                ttl_dns_cache=300,
                use_dns_cache=True,
            )
            
            self._session = aiohttp.ClientSession(
                connector=connector,
                timeout=self.timeout,
                headers=self.default_headers,
                raise_for_status=False  # We'll handle status codes manually
            )
        
        return self._session
    
    def _build_url(self, path: str) -> str:
        """Build complete URL from path."""
        if path.startswith('/'):
            path = path[1:]
        
        # Add API version prefix if not already present
        if not path.startswith(f'{self.api_version}/'):
            path = f'{self.api_version}/{path}'
        
        return urljoin(f'{self.base_url}/', path)
    
    async def _handle_rate_limiting(self) -> None:
        """Handle rate limiting by waiting if necessary."""
        if (self._rate_limit_remaining is not None and 
            self._rate_limit_remaining <= 5 and  # Close to limit
            self._rate_limit_reset is not None):
            
            # Calculate wait time
            wait_time = max(0, self._rate_limit_reset - time.time())
            if wait_time > 0:
                await asyncio.sleep(min(wait_time, 60))  # Max 1 minute wait
    
    def _update_rate_limit_info(self, headers: Dict[str, str]) -> None:
        """Update rate limit information from response headers."""
        try:
            if 'X-RateLimit-Remaining' in headers:
                self._rate_limit_remaining = int(headers['X-RateLimit-Remaining'])
            if 'X-RateLimit-Limit' in headers:
                self._rate_limit_limit = int(headers['X-RateLimit-Limit'])
            if 'X-RateLimit-Reset' in headers:
                self._rate_limit_reset = int(headers['X-RateLimit-Reset'])
        except (ValueError, TypeError):
            # Ignore invalid rate limit headers
            pass
    
    async def _make_request(
        self,
        method: str,
        url: str,
        headers: Optional[Dict[str, str]] = None,
        data: Optional[Union[str, bytes, aiohttp.FormData]] = None,
        params: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> aiohttp.ClientResponse:
        """
        Make HTTP request with retries and error handling.
        
        Args:
            method: HTTP method
            url: Request URL
            headers: Additional headers
            data: Request body data
            params: Query parameters
            
        Returns:
            HTTP response
            
        Raises:
            NetworkError: For network-related errors
            Various API errors based on response status
        """
        # Check rate limiting
        await self._handle_rate_limiting()
        
        # Merge headers
        request_headers = self.default_headers.copy()
        if headers:
            request_headers.update(headers)
        
        # Build query string
        if params:
            # Filter out None values
            params = {k: v for k, v in params.items() if v is not None}
            if params:
                url = f"{url}?{urlencode(params, doseq=True)}"
        
        last_exception = None
        
        for attempt in range(self.max_retries + 1):
            try:
                async with self.session.request(
                    method=method,
                    url=url,
                    headers=request_headers,
                    data=data,
                    **kwargs
                ) as response:
                    # Update rate limit info
                    self._update_rate_limit_info(dict(response.headers))
                    
                    # Handle successful responses
                    if 200 <= response.status < 300:
                        return response
                    
                    # Handle rate limiting
                    if response.status == 429:
                        if attempt < self.max_retries:
                            retry_after = response.headers.get('Retry-After')
                            if retry_after:
                                wait_time = min(float(retry_after), 60)
                            else:
                                wait_time = min(self.retry_delay * (2 ** attempt), 60)
                            
                            await asyncio.sleep(wait_time)
                            continue
                    
                    # Handle server errors with retry
                    if response.status >= 500 and attempt < self.max_retries:
                        wait_time = self.retry_delay * (2 ** attempt)
                        await asyncio.sleep(wait_time)
                        continue
                    
                    # Parse error response
                    try:
                        error_data = await response.json()
                    except (json.JSONDecodeError, aiohttp.ContentTypeError):
                        error_data = {
                            'error': {
                                'message': f'HTTP {response.status}: {response.reason}',
                                'details': {}
                            }
                        }
                    
                    # Create and raise appropriate exception
                    raise create_error_from_response(error_data, response.status)
            
            except aiohttp.ClientError as e:
                last_exception = NetworkError(f"Network error: {str(e)}")
                
                if attempt < self.max_retries:
                    wait_time = self.retry_delay * (2 ** attempt)
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    break
            
            except asyncio.TimeoutError:
                last_exception = NetworkError("Request timeout")
                
                if attempt < self.max_retries:
                    wait_time = self.retry_delay * (2 ** attempt)
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    break
        
        # If we get here, all retries failed
        if last_exception:
            raise last_exception
        else:
            raise NetworkError("Request failed after all retries")
    
    async def request(
        self,
        method: str,
        path: str,
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Make a JSON API request.
        
        Args:
            method: HTTP method
            path: API endpoint path
            json_data: JSON request data
            params: Query parameters
            headers: Additional headers
            
        Returns:
            Parsed JSON response data
        """
        url = self._build_url(path)
        
        # Prepare request data
        data = None
        if json_data is not None:
            data = json.dumps(json_data, separators=(',', ':'))
        
        response = await self._make_request(
            method=method,
            url=url,
            headers=headers,
            data=data,
            params=params,
            **kwargs
        )
        
        # Parse JSON response
        try:
            response_data = await response.json()
        except (json.JSONDecodeError, aiohttp.ContentTypeError):
            response_data = {}
        
        return response_data
    
    async def upload_file(
        self,
        path: str,
        file_data: Union[bytes, BinaryIO],
        metadata: Optional[Dict[str, Any]] = None,
        filename: Optional[str] = None,
        content_type: Optional[str] = None,
        progress_callback: Optional[callable] = None
    ) -> Dict[str, Any]:
        """
        Upload a file to the API.
        
        Args:
            path: API endpoint path
            file_data: File data (bytes or file-like object)
            metadata: Additional form data
            filename: Name of the file
            content_type: MIME type of the file
            progress_callback: Optional progress callback function
            
        Returns:
            Parsed JSON response data
        """
        url = self._build_url(path)
        
        # Create multipart form data
        form_data = aiohttp.FormData()
        
        # Add metadata fields
        if metadata:
            for key, value in metadata.items():
                if value is not None:
                    if isinstance(value, (dict, list)):
                        form_data.add_field(key, json.dumps(value))
                    else:
                        form_data.add_field(key, str(value))
        
        # Add file data
        if isinstance(file_data, bytes):
            form_data.add_field(
                'file',
                file_data,
                filename=filename or 'upload',
                content_type=content_type or 'application/octet-stream'
            )
        else:
            # File-like object
            if hasattr(file_data, 'read'):
                content = file_data.read()
                if hasattr(file_data, 'seek'):
                    file_data.seek(0)  # Reset file pointer
                
                form_data.add_field(
                    'file',
                    content,
                    filename=filename or getattr(file_data, 'name', 'upload'),
                    content_type=content_type or 'application/octet-stream'
                )
            else:
                raise ValueError("file_data must be bytes or file-like object")
        
        # Remove Content-Type header for multipart uploads
        headers = self.default_headers.copy()
        headers.pop('Content-Type', None)
        
        response = await self._make_request(
            method='POST',
            url=url,
            headers=headers,
            data=form_data
        )
        
        # Parse JSON response
        try:
            response_data = await response.json()
        except (json.JSONDecodeError, aiohttp.ContentTypeError):
            response_data = {}
        
        return response_data
    
    async def download_file(
        self,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        progress_callback: Optional[callable] = None
    ) -> bytes:
        """
        Download a file from the API.
        
        Args:
            path: API endpoint path
            params: Query parameters
            progress_callback: Optional progress callback function
            
        Returns:
            File content as bytes
        """
        url = self._build_url(path)
        
        response = await self._make_request(
            method='GET',
            url=url,
            params=params
        )
        
        # Read file content
        content = await response.read()
        
        if progress_callback:
            progress_callback(len(content), len(content))
        
        return content
    
    async def get(self, path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Make a GET request."""
        return await self.request('GET', path, params=params)
    
    async def post(
        self,
        path: str,
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make a POST request."""
        return await self.request('POST', path, json_data=json_data, params=params)
    
    async def put(
        self,
        path: str,
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make a PUT request."""
        return await self.request('PUT', path, json_data=json_data, params=params)
    
    async def patch(
        self,
        path: str,
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make a PATCH request."""
        return await self.request('PATCH', path, json_data=json_data, params=params)
    
    async def delete(
        self,
        path: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make a DELETE request."""
        return await self.request('DELETE', path, params=params)
    
    async def close(self) -> None:
        """Close the HTTP session and cleanup resources."""
        if self._session and not self._session.closed:
            await self._session.close()