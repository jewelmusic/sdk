"""
Analysis Resource for JewelMusic Python SDK

Provides comprehensive music analysis including audio quality checking,
structure detection, tempo analysis, and cultural compliance assessment.
"""

from typing import Dict, Any, List, Optional, Union, BinaryIO
from .base import BaseResource


class AnalysisResource(BaseResource):
    """
    Music Analysis Resource
    
    Provides comprehensive audio analysis and quality checking capabilities.
    Analyze audio files for tempo, key, structure, quality, and more.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/analysis')
    
    async def upload_track(
        self,
        file_data: Union[bytes, BinaryIO],
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Upload and analyze an audio track.
        
        Args:
            file_data: Audio file data
            options: Analysis options
            
        Returns:
            Analysis results
        """
        options = options or {}
        
        response = await self.upload(
            '/upload',
            file_data,
            metadata=options
        )
        return self.extract_data(response)
    
    async def get_analysis(self, analysis_id: str) -> Dict[str, Any]:
        """
        Get analysis results by ID.
        
        Args:
            analysis_id: Analysis ID
            
        Returns:
            Analysis results
        """
        self.validate_required({'analysis_id': analysis_id}, ['analysis_id'])
        
        response = await self.get(f'/{analysis_id}')
        return self.extract_data(response)
    
    async def audio_quality_check(
        self,
        file_data: Union[bytes, BinaryIO],
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Perform audio quality analysis.
        
        Args:
            file_data: Audio file data
            options: Quality check options
            
        Returns:
            Quality analysis results
        """
        options = options or {}
        
        response = await self.upload(
            '/quality-check',
            file_data,
            metadata=options
        )
        return self.extract_data(response)