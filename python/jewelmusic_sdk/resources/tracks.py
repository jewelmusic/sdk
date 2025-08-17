"""
Tracks Resource for JewelMusic Python SDK

Manages track upload, metadata, processing, and organization with support
for various audio formats and batch operations.
"""

from typing import Dict, Any, List, Optional, Union, BinaryIO, Callable
from .base import PaginatedResource


class TracksResource(PaginatedResource):
    """
    Tracks Resource
    
    Manages track upload, metadata, processing, and organization.
    Supports various audio formats, batch operations, and detailed
    tracking of upload and processing status.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/tracks')
    
    async def upload(
        self,
        file_data: Union[bytes, BinaryIO],
        metadata: Dict[str, Any],
        progress_callback: Optional[Callable] = None
    ) -> Dict[str, Any]:
        """
        Upload a track with metadata.
        
        Args:
            file_data: Audio file data
            metadata: Track metadata
            progress_callback: Optional progress callback
            
        Returns:
            Uploaded track information
        """
        self.validate_required(metadata, ['title', 'artist'])
        
        response = await self.upload(
            '/upload',
            file_data,
            metadata=metadata,
            progress_callback=progress_callback
        )
        return self.extract_data(response)
    
    async def list(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get list of tracks with filtering and pagination.
        
        Args:
            params: Filter and pagination parameters
            
        Returns:
            Paginated list of tracks
        """
        response = await self.get('', params=params)
        return self.extract_data(response)
    
    async def get(self, track_id: str) -> Dict[str, Any]:
        """
        Get a specific track by ID.
        
        Args:
            track_id: Track ID
            
        Returns:
            Track details
        """
        self.validate_required({'track_id': track_id}, ['track_id'])
        
        response = await self.get(f'/{track_id}')
        return self.extract_data(response)
    
    async def update(self, track_id: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update track metadata.
        
        Args:
            track_id: Track ID
            metadata: Updated metadata
            
        Returns:
            Updated track
        """
        self.validate_required({'track_id': track_id}, ['track_id'])
        
        response = await self.put(f'/{track_id}', json_data=metadata)
        return self.extract_data(response)
    
    async def delete(self, track_id: str) -> Dict[str, Any]:
        """
        Delete a track.
        
        Args:
            track_id: Track ID
            
        Returns:
            Deletion confirmation
        """
        self.validate_required({'track_id': track_id}, ['track_id'])
        
        response = await self.delete(f'/{track_id}')
        return self.extract_data(response)