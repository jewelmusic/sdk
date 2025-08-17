"""
Copilot Resource for JewelMusic Python SDK

Provides AI-powered music generation and creative assistance including
melody generation, harmony creation, lyrics writing, and complete song composition.
"""

from typing import Dict, Any, List, Optional, Union, BinaryIO
from .base import BaseResource


class CopilotResource(BaseResource):
    """
    AI Copilot Resource
    
    Provides AI-powered music generation and creative assistance.
    Generate melodies, harmonies, lyrics, and complete songs using
    advanced AI models trained on diverse musical styles.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/copilot')
    
    async def generate_melody(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate an AI melody.
        
        Args:
            options: Melody generation options including style, tempo, key, etc.
            
        Returns:
            Generated melody data
            
        Example:
            >>> melody = await client.copilot.generate_melody({
            ...     'style': 'electronic',
            ...     'tempo': 128,
            ...     'key': 'C',
            ...     'duration': 30
            ... })
        """
        self.validate_required(options, ['style'])
        
        response = await self.post('/melody', json_data=options)
        return self.extract_data(response)
    
    async def generate_harmony(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI harmony for a melody.
        
        Args:
            options: Harmony generation options
            
        Returns:
            Generated harmony data
        """
        response = await self.post('/harmony', json_data=options)
        return self.extract_data(response)
    
    async def generate_lyrics(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI lyrics.
        
        Args:
            options: Lyrics generation options
            
        Returns:
            Generated lyrics data
        """
        self.validate_required(options, ['theme'])
        
        response = await self.post('/lyrics', json_data=options)
        return self.extract_data(response)
    
    async def complete_song(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a complete song with AI.
        
        Args:
            options: Song generation options
            
        Returns:
            Complete song data
        """
        response = await self.post('/complete-song', json_data=options)
        return self.extract_data(response)
    
    async def get_templates(self, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Get available song templates.
        
        Args:
            params: Filter parameters
            
        Returns:
            List of song templates
        """
        response = await self.get('/templates', params=params)
        return self.extract_data(response)
    
    async def style_transfer(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Apply style transfer to existing content.
        
        Args:
            options: Style transfer options
            
        Returns:
            Style-transferred content
        """
        self.validate_required(options, ['source_id', 'target_style'])
        
        response = await self.post('/style-transfer', json_data=options)
        return self.extract_data(response)