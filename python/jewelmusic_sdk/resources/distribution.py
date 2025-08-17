"""
Distribution Resource for JewelMusic Python SDK

Manages music distribution to streaming platforms including release creation,
platform submission, status tracking, and takedown management.
"""

from typing import Dict, Any, List, Optional
from .base import PaginatedResource


class DistributionResource(PaginatedResource):
    """
    Distribution Resource
    
    Manages music distribution to 150+ streaming platforms.
    Create releases, submit to platforms, track status, and manage takedowns.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/distribution')
    
    async def create_release(self, release_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new release for distribution.
        
        Args:
            release_data: Release information and configuration
            
        Returns:
            Created release data
        """
        self.validate_required(release_data, ['type', 'title', 'artist', 'tracks'])
        
        response = await self.post('/releases', json_data=release_data)
        return self.extract_data(response)
    
    async def get_releases(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get list of releases with filtering and pagination.
        
        Args:
            params: Filter and pagination parameters
            
        Returns:
            Paginated list of releases
        """
        response = await self.get('/releases', params=params)
        return self.extract_data(response)
    
    async def get_release(self, release_id: str) -> Dict[str, Any]:
        """
        Get a specific release by ID.
        
        Args:
            release_id: Release ID
            
        Returns:
            Release details
        """
        self.validate_required({'release_id': release_id}, ['release_id'])
        
        response = await self.get(f'/releases/{release_id}')
        return self.extract_data(response)
    
    async def submit_to_platforms(
        self,
        release_id: str,
        options: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Submit release to streaming platforms.
        
        Args:
            release_id: Release ID
            options: Submission options
            
        Returns:
            Submission results
        """
        self.validate_required({'release_id': release_id}, ['release_id'])
        self.validate_required(options, ['platforms'])
        
        response = await self.post(f'/releases/{release_id}/submit', json_data=options)
        return self.extract_data(response)