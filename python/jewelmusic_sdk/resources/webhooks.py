"""
Webhooks Resource for JewelMusic Python SDK

Manages webhook endpoints and delivery configurations with signature verification
utilities for secure webhook handling.
"""

import hmac
import hashlib
import time
import json
from typing import Dict, Any, List, Optional, Union
from .base import PaginatedResource


class WebhooksResource(PaginatedResource):
    """
    Webhooks Resource
    
    Manages webhook endpoints and delivery configurations.
    Provides methods for creating, updating, testing webhooks,
    and utilities for verifying webhook signatures.
    """
    
    def __init__(self, http_client):
        super().__init__(http_client, '/webhooks')
    
    async def list(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get list of webhooks with filtering and pagination.
        
        Args:
            params: Query parameters
            
        Returns:
            Paginated webhooks list
        """
        response = await self.get('', params=params)
        return self.extract_data(response)
    
    async def get(self, webhook_id: str) -> Dict[str, Any]:
        """
        Get a specific webhook by ID.
        
        Args:
            webhook_id: Webhook ID
            
        Returns:
            Webhook details
        """
        self.validate_required({'webhook_id': webhook_id}, ['webhook_id'])
        
        response = await self.get(f'/{webhook_id}')
        return self.extract_data(response)
    
    async def create(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new webhook endpoint.
        
        Args:
            webhook_data: Webhook configuration
            
        Returns:
            Created webhook
        """
        self.validate_required(webhook_data, ['url', 'events'])
        
        response = await self.post('', json_data=webhook_data)
        return self.extract_data(response)
    
    async def update(self, webhook_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing webhook.
        
        Args:
            webhook_id: Webhook ID
            updates: Updates to apply
            
        Returns:
            Updated webhook
        """
        self.validate_required({'webhook_id': webhook_id}, ['webhook_id'])
        
        response = await self.put(f'/{webhook_id}', json_data=updates)
        return self.extract_data(response)
    
    async def delete(self, webhook_id: str) -> Dict[str, Any]:
        """
        Delete a webhook.
        
        Args:
            webhook_id: Webhook ID
            
        Returns:
            Deletion confirmation
        """
        self.validate_required({'webhook_id': webhook_id}, ['webhook_id'])
        
        response = await self.delete(f'/{webhook_id}')
        return self.extract_data(response)
    
    async def test(self, webhook_id: str, event_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Test a webhook by sending a test event.
        
        Args:
            webhook_id: Webhook ID
            event_type: Event type to test with
            
        Returns:
            Test delivery information
        """
        self.validate_required({'webhook_id': webhook_id}, ['webhook_id'])
        
        response = await self.post(f'/{webhook_id}/test', json_data={
            'event_type': event_type or 'webhook.test'
        })
        return self.extract_data(response)
    
    @staticmethod
    def verify_signature(
        payload: Union[str, bytes],
        signature: str,
        secret: str,
        tolerance: int = 300
    ) -> bool:
        """
        Verify webhook signature.
        
        This is a static method that can be used to verify webhook signatures
        without making an API call.
        
        Args:
            payload: Raw request body
            signature: Webhook signature header
            secret: Webhook secret
            tolerance: Time tolerance in seconds (default: 300)
            
        Returns:
            Boolean indicating if signature is valid
        """
        try:
            # Parse signature header (format: "t=timestamp,v1=hash")
            elements = signature.split(',')
            timestamp_element = next((el for el in elements if el.startswith('t=')), None)
            hash_element = next((el for el in elements if el.startswith('v1=')), None)
            
            if not timestamp_element or not hash_element:
                return False
            
            timestamp = int(timestamp_element.split('=')[1])
            received_hash = hash_element.split('=')[1]
            
            # Check timestamp tolerance
            now = int(time.time())
            if abs(now - timestamp) > tolerance:
                return False
            
            # Verify signature
            if isinstance(payload, str):
                payload_bytes = payload.encode('utf-8')
            else:
                payload_bytes = payload
            
            signed_payload = f"{timestamp}.{payload_bytes.decode('utf-8')}"
            expected_hash = hmac.new(
                secret.encode('utf-8'),
                signed_payload.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(received_hash, expected_hash)
        
        except (ValueError, TypeError, AttributeError):
            return False
    
    @staticmethod
    def parse_event(payload: Union[str, bytes]) -> Dict[str, Any]:
        """
        Parse webhook event payload.
        
        This is a static method to safely parse webhook event data.
        
        Args:
            payload: Raw request body
            
        Returns:
            Parsed webhook event
        """
        try:
            if isinstance(payload, bytes):
                payload_str = payload.decode('utf-8')
            else:
                payload_str = payload
            
            return json.loads(payload_str)
        
        except (json.JSONDecodeError, UnicodeDecodeError, AttributeError):
            raise ValueError("Invalid webhook payload format")
    
    @staticmethod
    def create_signature(
        payload: Union[str, bytes],
        secret: str,
        timestamp: Optional[int] = None
    ) -> str:
        """
        Create webhook signature for testing.
        
        This utility method can be used for testing webhook signature verification.
        
        Args:
            payload: Payload to sign
            secret: Webhook secret
            timestamp: Optional timestamp (defaults to current time)
            
        Returns:
            Signature string
        """
        ts = timestamp or int(time.time())
        
        if isinstance(payload, str):
            payload_bytes = payload.encode('utf-8')
        else:
            payload_bytes = payload
        
        signed_payload = f"{ts}.{payload_bytes.decode('utf-8')}"
        
        hash_value = hmac.new(
            secret.encode('utf-8'),
            signed_payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return f"t={ts},v1={hash_value}"