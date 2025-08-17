"""
Base Resource Class for JewelMusic Python SDK

Provides common functionality for all API resource classes including
request handling, data validation, pagination, and utility methods.
"""

import asyncio
from typing import Any, Dict, List, Optional, Union, BinaryIO, Callable
from ..utils.http_client import HttpClient
from ..exceptions import ValidationError


class BaseResource:
    """
    Base class for all API resource managers.
    
    Provides common functionality including HTTP request methods,
    data validation, pagination handling, and utility functions.
    
    Args:
        http_client: HTTP client instance for making API requests
        base_path: Base API path for this resource (e.g., '/tracks')
    """
    
    def __init__(self, http_client: HttpClient, base_path: str):
        """Initialize the base resource."""
        self.http_client = http_client
        self.base_path = base_path.rstrip('/')
    
    def _build_path(self, path: str = '') -> str:
        """
        Build complete API path for this resource.
        
        Args:
            path: Additional path to append
            
        Returns:
            Complete API path
        """
        if not path:
            return self.base_path
        
        if not path.startswith('/'):
            path = '/' + path
        
        return self.base_path + path
    
    def validate_required(self, data: Dict[str, Any], required_fields: List[str]) -> None:
        """
        Validate that all required fields are present in data.
        
        Args:
            data: Data dictionary to validate
            required_fields: List of required field names
            
        Raises:
            ValidationError: If any required fields are missing
        """
        missing_fields = []
        for field in required_fields:
            if field not in data or data[field] is None:
                missing_fields.append(field)
        
        if missing_fields:
            raise ValidationError(
                f"Missing required fields: {', '.join(missing_fields)}",
                validation_errors={'missing_fields': missing_fields}
            )
    
    def extract_data(self, response: Dict[str, Any]) -> Any:
        """
        Extract data from API response.
        
        Args:
            response: API response dictionary
            
        Returns:
            Response data
        """
        if 'data' in response:
            return response['data']
        return response
    
    def format_file_size(self, size_bytes: int) -> str:
        """
        Format file size in human readable format.
        
        Args:
            size_bytes: Size in bytes
            
        Returns:
            Formatted size string
        """
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"
    
    def format_duration(self, seconds: float) -> str:
        """
        Format duration in human readable format.
        
        Args:
            seconds: Duration in seconds
            
        Returns:
            Formatted duration string (e.g., "3:45")
        """
        minutes = int(seconds // 60)
        seconds = int(seconds % 60)
        return f"{minutes}:{seconds:02d}"
    
    async def poll_for_completion(
        self,
        get_id_func: Callable[[], str],
        get_status_func: Callable[[str], Dict[str, Any]],
        is_complete_func: Callable[[Dict[str, Any]], bool],
        poll_interval: float = 5.0,
        timeout: float = 600.0
    ) -> Dict[str, Any]:
        """
        Poll for operation completion with timeout.
        
        Args:
            get_id_func: Function to get the resource ID
            get_status_func: Function to get resource status
            is_complete_func: Function to check if operation is complete
            poll_interval: Polling interval in seconds
            timeout: Maximum wait time in seconds
            
        Returns:
            Final resource data
            
        Raises:
            TimeoutError: If operation doesn't complete within timeout
        """
        start_time = asyncio.get_event_loop().time()
        
        while True:
            resource_id = get_id_func()
            data = await get_status_func(resource_id)
            
            if is_complete_func(data):
                return data
            
            # Check timeout
            elapsed = asyncio.get_event_loop().time() - start_time
            if elapsed >= timeout:
                raise TimeoutError(
                    f"Operation did not complete within {timeout} seconds"
                )
            
            # Wait before next poll
            await asyncio.sleep(poll_interval)
    
    # HTTP request methods
    
    async def get(self, path: str = '', params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Make a GET request to this resource.
        
        Args:
            path: Additional path (optional)
            params: Query parameters
            
        Returns:
            Response data
        """
        full_path = self._build_path(path)
        return await self.http_client.get(full_path, params=params)
    
    async def post(
        self,
        path: str = '',
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Make a POST request to this resource.
        
        Args:
            path: Additional path (optional)
            json_data: Request body data
            params: Query parameters
            
        Returns:
            Response data
        """
        full_path = self._build_path(path)
        return await self.http_client.post(full_path, json_data=json_data, params=params)
    
    async def put(
        self,
        path: str = '',
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Make a PUT request to this resource.
        
        Args:
            path: Additional path (optional)
            json_data: Request body data
            params: Query parameters
            
        Returns:
            Response data
        """
        full_path = self._build_path(path)
        return await self.http_client.put(full_path, json_data=json_data, params=params)
    
    async def patch(
        self,
        path: str = '',
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Make a PATCH request to this resource.
        
        Args:
            path: Additional path (optional)
            json_data: Request body data
            params: Query parameters
            
        Returns:
            Response data
        """
        full_path = self._build_path(path)
        return await self.http_client.patch(full_path, json_data=json_data, params=params)
    
    async def delete(
        self,
        path: str = '',
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Make a DELETE request to this resource.
        
        Args:
            path: Additional path (optional)
            params: Query parameters
            
        Returns:
            Response data
        """
        full_path = self._build_path(path)
        return await self.http_client.delete(full_path, params=params)
    
    async def upload(
        self,
        path: str,
        file_data: Union[bytes, BinaryIO],
        metadata: Optional[Dict[str, Any]] = None,
        filename: Optional[str] = None,
        content_type: Optional[str] = None,
        progress_callback: Optional[Callable] = None
    ) -> Dict[str, Any]:
        """
        Upload a file to this resource.
        
        Args:
            path: Upload endpoint path
            file_data: File data (bytes or file-like object)
            metadata: Additional form data
            filename: Name of the file
            content_type: MIME type of the file
            progress_callback: Optional progress callback function
            
        Returns:
            Response data
        """
        full_path = self._build_path(path)
        return await self.http_client.upload_file(
            full_path,
            file_data,
            metadata=metadata,
            filename=filename,
            content_type=content_type,
            progress_callback=progress_callback
        )
    
    async def download(
        self,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        progress_callback: Optional[Callable] = None
    ) -> bytes:
        """
        Download a file from this resource.
        
        Args:
            path: Download endpoint path
            params: Query parameters
            progress_callback: Optional progress callback function
            
        Returns:
            File content as bytes
        """
        full_path = self._build_path(path)
        return await self.http_client.download_file(
            full_path,
            params=params,
            progress_callback=progress_callback
        )


class PaginatedResource(BaseResource):
    """
    Base class for resources that support pagination.
    
    Provides additional methods for handling paginated responses
    and automatic pagination traversal.
    """
    
    async def list_all(
        self,
        path: str = '',
        params: Optional[Dict[str, Any]] = None,
        max_pages: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch all items across multiple pages.
        
        Args:
            path: API endpoint path
            params: Query parameters
            max_pages: Maximum number of pages to fetch (None for no limit)
            
        Returns:
            List of all items
        """
        all_items = []
        page = 1
        pages_fetched = 0
        
        while True:
            # Add pagination parameters
            page_params = (params or {}).copy()
            page_params['page'] = page
            
            # Fetch page
            response = await self.get(path, params=page_params)
            data = self.extract_data(response)
            
            # Extract items and pagination info
            items = data.get('items', [])
            pagination = data.get('pagination', {})
            
            all_items.extend(items)
            pages_fetched += 1
            
            # Check if we should continue
            if (not items or  # No more items
                page >= pagination.get('total_pages', 1) or  # Last page
                (max_pages and pages_fetched >= max_pages)):  # Hit max pages
                break
            
            page += 1
        
        return all_items
    
    async def iterate_pages(
        self,
        path: str = '',
        params: Optional[Dict[str, Any]] = None,
        page_size: int = 20
    ):
        """
        Async generator that yields pages of results.
        
        Args:
            path: API endpoint path
            params: Query parameters
            page_size: Number of items per page
            
        Yields:
            Page data dictionaries
        """
        page = 1
        
        while True:
            # Add pagination parameters
            page_params = (params or {}).copy()
            page_params.update({
                'page': page,
                'per_page': page_size
            })
            
            # Fetch page
            response = await self.get(path, params=page_params)
            data = self.extract_data(response)
            
            # Yield page data
            yield data
            
            # Check if we should continue
            pagination = data.get('pagination', {})
            if page >= pagination.get('total_pages', 1):
                break
            
            page += 1
    
    async def iterate_items(
        self,
        path: str = '',
        params: Optional[Dict[str, Any]] = None,
        page_size: int = 20
    ):
        """
        Async generator that yields individual items.
        
        Args:
            path: API endpoint path
            params: Query parameters
            page_size: Number of items per page
            
        Yields:
            Individual item dictionaries
        """
        async for page_data in self.iterate_pages(path, params, page_size):
            items = page_data.get('items', [])
            for item in items:
                yield item