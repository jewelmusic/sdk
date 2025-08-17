"""
Analytics Resource for JewelMusic Python SDK

Provides comprehensive streaming analytics, royalty tracking, geographic insights,
and performance metrics across all platforms.
"""

from typing import Dict, Any, List, Optional
from .base import BaseResource


class AnalyticsResource(BaseResource):
    """
    Analytics Resource
    
    Provides comprehensive analytics and royalty tracking capabilities.
    Access streaming data, revenue information, geographic insights,
    and performance metrics across all platforms.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/analytics')
    
    async def get_streams(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get streaming analytics data.
        
        Args:
            query: Analytics query parameters
            
        Returns:
            Streaming analytics data
        """
        self.validate_required(query, ['start_date', 'end_date'])
        
        response = await self.get('/streams', params=query)
        return self.extract_data(response)
    
    async def get_royalty_reports(
        self,
        start_date: str,
        end_date: str,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Get royalty reports for a specific period.
        
        Args:
            start_date: Start date for the report
            end_date: End date for the report
            options: Report options
            
        Returns:
            Royalty report data
        """
        self.validate_required(
            {'start_date': start_date, 'end_date': end_date},
            ['start_date', 'end_date']
        )
        
        params = {
            'start_date': start_date,
            'end_date': end_date,
            **(options or {})
        }
        
        response = await self.get('/royalties/reports', params=params)
        return self.extract_data(response)
    
    async def get_insights(self, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get AI-generated analytics insights.
        
        Args:
            options: Insight options
            
        Returns:
            AI-generated insights
        """
        response = await self.get('/insights', params=options)
        return self.extract_data(response)