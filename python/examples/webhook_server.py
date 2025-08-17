#!/usr/bin/env python3
"""
Webhook Server Example for JewelMusic Python SDK

This example demonstrates how to set up and handle JewelMusic webhooks:
- Creating webhook endpoints
- Verifying webhook signatures  
- Handling different event types
- Testing webhooks
- Managing webhook deliveries
"""

import os
import asyncio
import json
import secrets
from datetime import datetime
from typing import Dict, List, Optional, Any
from flask import Flask, request, jsonify
import threading
import signal
import sys

from jewelmusic_sdk import JewelMusic
from jewelmusic_sdk.webhooks import WebhookResource
from jewelmusic_sdk.exceptions import (
    AuthenticationError,
    ValidationError,
    NetworkError
)


class WebhookServer:
    """JewelMusic webhook server implementation."""
    
    def __init__(self, api_key: Optional[str] = None, port: int = 8080):
        """Initialize webhook server."""
        self.api_key = api_key or os.getenv('JEWELMUSIC_API_KEY')
        if not self.api_key:
            raise ValueError("API key required. Set JEWELMUSIC_API_KEY environment variable.")
        
        self.client = JewelMusic(
            api_key=self.api_key,
            environment='sandbox'
        )
        
        self.port = port
        self.webhook_path = '/webhooks/jewelmusic'
        self.webhook_secret = self._generate_webhook_secret()
        self.app = Flask(__name__)
        self.webhook_id = None
        
        # Setup Flask routes
        self._setup_routes()
    
    def _generate_webhook_secret(self) -> str:
        """Generate secure webhook secret."""
        return secrets.token_urlsafe(32)
    
    def _setup_routes(self):
        """Setup Flask application routes."""
        
        @self.app.route('/', methods=['GET'])
        def home():
            """Home page with webhook information."""
            return f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>JewelMusic Webhook Server</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .header {{ color: #333; }}
                    .endpoint {{ background: #f5f5f5; padding: 10px; border-radius: 5px; }}
                    .status {{ color: #28a745; }}
                </style>
            </head>
            <body>
                <h1 class="header">🎵 JewelMusic Webhook Server</h1>
                <p class="status">✅ Server is running and ready to receive webhooks</p>
                
                <h2>Endpoints:</h2>
                <div class="endpoint">
                    <strong>Webhook:</strong> <code>POST {self.webhook_path}</code><br>
                    <strong>Health Check:</strong> <code>GET /health</code>
                </div>

                <h2>Configuration:</h2>
                <ul>
                    <li><strong>Port:</strong> {self.port}</li>
                    <li><strong>Secret:</strong> {self.webhook_secret[:8]}... (truncated)</li>
                    <li><strong>Webhook ID:</strong> {self.webhook_id or 'Not created yet'}</li>
                </ul>

                <h2>Supported Events:</h2>
                <ul>
                    <li>track.uploaded</li>
                    <li>track.processed</li>
                    <li>analysis.completed</li>
                    <li>transcription.completed</li>
                    <li>distribution.live</li>
                    <li>copilot.generation_completed</li>
                </ul>
            </body>
            </html>
            """
        
        @self.app.route('/health', methods=['GET'])
        def health_check():
            """Health check endpoint."""
            return jsonify({
                'status': 'healthy',
                'timestamp': datetime.utcnow().isoformat(),
                'service': 'jewelmusic-webhook-server',
                'version': '1.0.0'
            })
        
        @self.app.route(self.webhook_path, methods=['POST'])
        def handle_webhook():
            """Handle incoming webhooks."""
            try:
                # Get signature from headers
                signature = request.headers.get('X-JewelMusic-Signature')
                if not signature:
                    print("❌ Missing webhook signature")
                    return jsonify({'error': 'Missing signature'}), 401
                
                # Get raw body
                payload = request.get_data()
                
                # Verify signature
                if not WebhookResource.verify_signature(payload, signature, self.webhook_secret):
                    print("❌ Invalid webhook signature")
                    return jsonify({'error': 'Invalid signature'}), 401
                
                # Parse event
                event = WebhookResource.parse_event(payload)
                
                # Log event
                timestamp = datetime.now().strftime("%H:%M:%S")
                print(f"\n[{timestamp}] 📨 Received webhook event: {event['type']}")
                print(f"         Event ID: {event['id']}")
                print(f"         Timestamp: {event['timestamp']}")
                
                # Process event
                self._process_webhook_event(event)
                
                # Respond with success
                return jsonify({
                    'received': True,
                    'event_type': event['type'],
                    'event_id': event['id']
                })
                
            except Exception as e:
                print(f"❌ Error processing webhook: {e}")
                return jsonify({'error': 'Bad Request'}), 400
    
    def _process_webhook_event(self, event: Dict[str, Any]):
        """Process different webhook event types."""
        try:
            event_type = event['type']
            event_data = event['data']
            
            if event_type == 'track.uploaded':
                self._handle_track_uploaded(event_data)
            elif event_type == 'track.processed':
                self._handle_track_processed(event_data)
            elif event_type == 'analysis.completed':
                self._handle_analysis_completed(event_data)
            elif event_type == 'transcription.completed':
                self._handle_transcription_completed(event_data)
            elif event_type == 'distribution.live':
                self._handle_distribution_live(event_data)
            elif event_type == 'copilot.generation_completed':
                self._handle_copilot_generation_completed(event_data)
            else:
                print(f"         ⚠️  Unknown event type: {event_type}")
                
        except Exception as e:
            print(f"❌ Error handling webhook event: {e}")
    
    def _handle_track_uploaded(self, data: Dict[str, Any]):
        """Handle track uploaded event."""
        track = data['track']
        print(f"         🎵 Track uploaded: '{track['title']}' by {track['artist']}")
        print(f"         📁 Track ID: {track['id']}")
        print(f"         ⏱️  Duration: {track['duration']}s")
    
    def _handle_track_processed(self, data: Dict[str, Any]):
        """Handle track processed event."""
        track = data['track']
        print(f"         ✅ Track processed: '{track['title']}'")
        print(f"         📁 Track ID: {track['id']}")
        print(f"         📊 Status: {track['status']}")
    
    def _handle_analysis_completed(self, data: Dict[str, Any]):
        """Handle analysis completed event."""
        analysis = data['analysis']
        print(f"         🔍 Analysis completed: {analysis['id']}")
        
        if 'track_id' in analysis:
            print(f"         🎵 Track ID: {analysis['track_id']}")
        
        if 'tempo' in analysis and 'bpm' in analysis['tempo']:
            print(f"         🥁 Tempo: {analysis['tempo']['bpm']} BPM")
        
        if 'key' in analysis:
            key_data = analysis['key']
            if 'key' in key_data and 'mode' in key_data:
                print(f"         🎹 Key: {key_data['key']} {key_data['mode']}")
    
    def _handle_transcription_completed(self, data: Dict[str, Any]):
        """Handle transcription completed event."""
        transcription = data['transcription']
        print(f"         📝 Transcription completed: {transcription['id']}")
        
        if 'track_id' in transcription:
            print(f"         🎵 Track ID: {transcription['track_id']}")
        
        if 'language' in transcription:
            print(f"         🌐 Language: {transcription['language']}")
        
        if 'text' in transcription:
            preview = transcription['text'][:100]
            if len(transcription['text']) > 100:
                preview += "..."
            print(f"         📄 Text preview: {preview}")
    
    def _handle_distribution_live(self, data: Dict[str, Any]):
        """Handle distribution live event."""
        release = data['release']
        print(f"         🚀 Release is now live: '{release['title']}'")
        print(f"         📁 Release ID: {release['id']}")
        print(f"         🎤 Artist: {release['artist']}")
        
        if 'platforms' in release:
            platforms = ', '.join(release['platforms'])
            print(f"         📱 Platforms: {platforms}")
    
    def _handle_copilot_generation_completed(self, data: Dict[str, Any]):
        """Handle copilot generation completed event."""
        generation = data['generation']
        print(f"         🤖 AI generation completed: {generation['id']}")
        
        if 'type' in generation:
            print(f"         🎯 Type: {generation['type']}")
        
        if 'title' in generation:
            print(f"         📝 Title: {generation['title']}")
        
        if 'style' in generation:
            print(f"         🎨 Style: {generation['style']}")
    
    async def setup_webhook(self) -> Dict[str, Any]:
        """Setup webhook endpoint in JewelMusic."""
        print("🔧 Setting up webhook endpoint...")
        
        try:
            webhook_url = f"http://localhost:{self.port}{self.webhook_path}"
            
            webhook = await self.client.webhooks.create(
                url=webhook_url,
                events=[
                    'track.uploaded',
                    'track.processed',
                    'analysis.completed',
                    'transcription.completed',
                    'distribution.live',
                    'copilot.generation_completed'
                ],
                secret=self.webhook_secret
            )
            
            self.webhook_id = webhook['id']
            
            print("✅ Webhook created successfully!")
            print(f"Webhook ID: {webhook['id']}")
            print(f"URL: {webhook['url']}")
            print(f"Events: {', '.join(webhook['events'])}")
            print(f"Secret: {self.webhook_secret[:8]}...")
            
            return webhook
            
        except Exception as e:
            print(f"⚠️  Failed to setup webhook: {e}")
            print("Continuing with server anyway for demonstration...")
            return {}
    
    def run(self):
        """Run the webhook server."""
        print(f"🎵 JewelMusic Webhook Server")
        print(f"===========================")
        print(f"🔑 Using API key: {self.api_key[:12]}...")
        print(f"🌐 Starting webhook server on port {self.port}")
        
        # Setup webhook endpoint
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            webhook = loop.run_until_complete(self.setup_webhook())
        except Exception as e:
            print(f"Failed to setup webhook: {e}")
        
        print(f"\n🚀 Webhook server listening on http://localhost:{self.port}")
        print(f"📍 Webhook endpoint: http://localhost:{self.port}{self.webhook_path}")
        print(f"🏥 Health check: http://localhost:{self.port}/health")
        print("\nPress Ctrl+C to stop the server")
        
        # Handle graceful shutdown
        def signal_handler(sig, frame):
            print("\n🛑 Shutting down webhook server...")
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        
        # Run Flask app
        self.app.run(
            host='0.0.0.0',
            port=self.port,
            debug=False,
            use_reloader=False
        )


async def manage_webhook_deliveries():
    """Webhook delivery management example."""
    print("📦 Managing webhook deliveries...")
    
    api_key = os.getenv('JEWELMUSIC_API_KEY')
    if not api_key:
        raise ValueError("API key required.")
    
    client = JewelMusic(api_key=api_key, environment='sandbox')
    
    try:
        # Get all webhooks
        webhooks = await client.webhooks.list()
        
        if not webhooks['items']:
            print("No webhooks found")
            return
        
        webhook = webhooks['items'][0]  # Use first webhook
        
        # Get delivery history
        print("📋 Getting delivery history...")
        deliveries = await client.webhooks.get_deliveries(
            webhook['id'],
            page=1,
            per_page=10,
            sort_by='created_at',
            sort_order='desc'
        )
        
        print(f"✅ Found {deliveries['pagination']['total']} deliveries")
        
        # Show recent deliveries
        for delivery in deliveries['items'][:5]:
            print(f"- {delivery['event_type']}: {delivery['status']} ({delivery['response_status']})")
            print(f"  Attempts: {delivery['attempts']}, Last attempt: {delivery['last_attempt_at']}")
        
        # Get failed deliveries
        failed_deliveries = await client.webhooks.get_deliveries(
            webhook['id'],
            status='failed',
            per_page=5
        )
        
        if failed_deliveries['items']:
            print(f"\n❌ Failed deliveries found: {len(failed_deliveries['items'])}")
            
            # Retry failed deliveries
            for delivery in failed_deliveries['items']:
                print(f"🔄 Retrying delivery: {delivery['id']}")
                await client.webhooks.retry_delivery(webhook['id'], delivery['id'])
        
        # Get delivery details
        if deliveries['items']:
            latest_delivery = deliveries['items'][0]
            print("\n📝 Latest delivery details:")
            
            delivery_details = await client.webhooks.get_delivery(
                webhook['id'],
                latest_delivery['id']
            )
            
            print(f"Event type: {delivery_details['event_type']}")
            print(f"Status: {delivery_details['status']}")
            print(f"Response status: {delivery_details['response']['status']}")
            print(f"Response time: {delivery_details['response_time']}ms")
            
    except Exception as e:
        print(f"❌ Error managing webhook deliveries: {e}")


def create_test_signature():
    """Create test signature for development."""
    print("🧪 Testing signature creation and verification...")
    
    test_payload = json.dumps({
        'id': 'evt_test_123',
        'type': 'track.uploaded',
        'timestamp': datetime.utcnow().isoformat(),
        'data': {'track': {'id': 'track_123', 'title': 'Test Song'}}
    }).encode('utf-8')
    
    secret = 'test_webhook_secret'
    
    # Create signature
    signature = WebhookResource.create_signature(test_payload, secret)
    print(f"Test signature created: {signature}")
    
    # Verify signature
    is_valid = WebhookResource.verify_signature(test_payload, signature, secret, tolerance=300)
    print(f"Signature validation: {'✅ Valid' if is_valid else '❌ Invalid'}")
    
    return signature


async def webhook_management_example():
    """Comprehensive webhook management example."""
    print("🔗 JewelMusic Webhook Management Examples")
    print("=========================================")
    
    api_key = os.getenv('JEWELMUSIC_API_KEY')
    if not api_key:
        raise ValueError("API key required.")
    
    client = JewelMusic(api_key=api_key, environment='sandbox')
    
    try:
        # List existing webhooks
        print("📋 Listing existing webhooks...")
        webhooks = await client.webhooks.list()
        print(f"Found {len(webhooks['items'])} existing webhooks:")
        
        for webhook in webhooks['items']:
            print(f"- {webhook['id']}: {webhook['url']}")
            print(f"  Events: {', '.join(webhook['events'])}")
            print(f"  Active: {webhook['active']}")
        
        # Test a webhook if one exists
        if webhooks['items']:
            webhook = webhooks['items'][0]
            print(f"\n🧪 Testing webhook: {webhook['id']}")
            
            test_result = await client.webhooks.test(webhook['id'])
            print(f"✅ Webhook test result:")
            print(f"Success: {test_result['success']}")
            print(f"Response status: {test_result['response_status']}")
            print(f"Response time: {test_result['response_time']}ms")
        
        # Get webhook statistics
        if webhooks['items']:
            webhook = webhooks['items'][0]
            print(f"\n📊 Getting webhook statistics...")
            
            try:
                stats = await client.webhooks.get_statistics(
                    webhook['id'],
                    period='last_7_days',
                    group_by='day'
                )
                
                print(f"✅ Webhook statistics:")
                print(f"Total deliveries: {stats['total_deliveries']}")
                print(f"Success rate: {stats['success_rate'] * 100:.1f}%")
                print(f"Average response time: {stats['average_response_time']}ms")
                
            except Exception as e:
                print(f"⚠️  Statistics not available: {e}")
        
    except Exception as e:
        print(f"❌ Error in webhook management: {e}")


def main():
    """Main function."""
    print("🔗 JewelMusic Webhook Handling Examples")
    print("=======================================\n")
    
    # Check for API key
    if not os.getenv('JEWELMUSIC_API_KEY'):
        print("❌ JEWELMUSIC_API_KEY environment variable not set")
        print("Please set your API key: export JEWELMUSIC_API_KEY=your_key_here")
        return 1
    
    # Get port from environment
    port = int(os.getenv('PORT', 8080))
    
    try:
        # Test signature functionality
        create_test_signature()
        print()
        
        # Run webhook management examples
        asyncio.run(webhook_management_example())
        print()
        
        # Start webhook server
        print("🌐 Starting webhook server...")
        server = WebhookServer(port=port)
        
        print("✅ Webhook handling example setup complete!")
        print("🔧 To test webhooks:")
        print("1. Make sure your webhook URL is publicly accessible")
        print("2. Use ngrok for local testing: ngrok http", port)
        print("3. Update webhook URL in JewelMusic dashboard")
        print("4. Trigger events by uploading tracks or other actions")
        print()
        
        # Run the server (this will block)
        server.run()
        
        return 0
        
    except KeyboardInterrupt:
        print("\n🛑 Webhook server stopped by user")
        return 0
    except Exception as e:
        print(f"\n💥 Webhook handling example failed: {e}")
        return 1


if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)