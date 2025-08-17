"""
Transcription Resource for JewelMusic Python SDK

Provides AI transcription with 150+ language support, speaker diarization,
lyrics enhancement, and translation capabilities.
"""

from typing import Dict, Any, List, Optional, Union, BinaryIO
from .base import BaseResource


class TranscriptionResource(BaseResource):
    """
    AI Transcription Resource
    
    Provides AI-powered transcription services with support for 150+ languages,
    speaker diarization, timing synchronization, and lyrics enhancement.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/transcription')
    
    async def create(
        self,
        track_id: Optional[str] = None,
        file_data: Optional[Union[bytes, BinaryIO]] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a new transcription.
        
        Args:
            track_id: Existing track ID (optional)
            file_data: Audio file data (optional)
            options: Transcription options
            
        Returns:
            Transcription results
        """
        if not track_id and not file_data:
            raise ValueError("Either track_id or file_data must be provided")
        
        options = options or {}
        
        if file_data:
            response = await self.upload('/create', file_data, metadata=options)
        else:
            options['track_id'] = track_id
            response = await self.post('/create', json_data=options)
        
        return self.extract_data(response)
    
    async def get_transcription(self, transcription_id: str) -> Dict[str, Any]:
        """
        Get transcription by ID.
        
        Args:
            transcription_id: Transcription ID
            
        Returns:
            Transcription data
        """
        self.validate_required({'transcription_id': transcription_id}, ['transcription_id'])
        
        response = await self.get(f'/{transcription_id}')
        return self.extract_data(response)
    
    async def translate_lyrics(
        self,
        transcription_id: str,
        target_languages: List[str]
    ) -> Dict[str, Any]:
        """
        Translate lyrics to target languages.
        
        Args:
            transcription_id: Transcription ID
            target_languages: List of target language codes
            
        Returns:
            Translation results
        """
        self.validate_required({'transcription_id': transcription_id}, ['transcription_id'])
        self.validate_required({'target_languages': target_languages}, ['target_languages'])
        
        response = await self.post(
            f'/{transcription_id}/translate',
            json_data={'target_languages': target_languages}
        )
        return self.extract_data(response)