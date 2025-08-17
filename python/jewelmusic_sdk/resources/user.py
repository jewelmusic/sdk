"""
User Resource for JewelMusic Python SDK

Manages user profile, preferences, API keys, and account settings.
"""

from typing import Dict, Any, List, Optional, Union, BinaryIO
from .base import BaseResource


class UserResource(BaseResource):
    """
    User Resource
    
    Manages user profile, preferences, API keys, and account settings.
    Provides access to personal information, usage statistics, and
    account management functionality.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/user')
    
    async def get_profile(self) -> Dict[str, Any]:
        """
        Get user profile information.
        
        Returns:
            User profile data
        """
        response = await self.get('/profile')
        return self.extract_data(response)
    
    async def update_profile(self, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user profile information.
        
        Args:
            updates: Profile updates to apply
            
        Returns:
            Updated profile
        """
        response = await self.put('/profile', json_data=updates)
        return self.extract_data(response)
    
    async def get_preferences(self) -> Dict[str, Any]:
        """
        Get user preferences and settings.
        
        Returns:
            User preferences
        """
        response = await self.get('/preferences')
        return self.extract_data(response)
    
    async def update_preferences(self, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user preferences and settings.
        
        Args:
            preferences: Preference updates to apply
            
        Returns:
            Updated preferences
        """
        response = await self.put('/preferences', json_data=preferences)
        return self.extract_data(response)
    
    async def get_api_keys(self) -> List[Dict[str, Any]]:
        """
        Get list of user's API keys.
        
        Returns:
            List of API keys
        """
        response = await self.get('/api-keys')
        return self.extract_data(response)
    
    async def create_api_key(self, name: str, permissions: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new API key.
        
        Args:
            name: Name for the API key
            permissions: Permissions to grant to the key
            
        Returns:
            Created API key information
        """
        self.validate_required({'name': name}, ['name'])
        self.validate_required(permissions, ['scopes'])
        
        response = await self.post('/api-keys', json_data={
            'name': name,
            **permissions
        })
        return self.extract_data(response)
    
    async def get_usage_stats(self, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get detailed API usage statistics.
        
        Args:
            options: Usage query options
            
        Returns:
            Usage statistics
        """
        response = await self.get('/usage', params=options)
        return self.extract_data(response)