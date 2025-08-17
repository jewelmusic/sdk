/**
 * Webhook Handling Example
 * 
 * This example demonstrates how to set up and handle JewelMusic webhooks:
 * - Creating webhook endpoints
 * - Verifying webhook signatures
 * - Handling different event types
 * - Testing webhooks
 * - Managing webhook deliveries
 */

const { JewelMusic, WebhooksResource } = require('@jewelmusic/sdk');
const express = require('express');
const bodyParser = require('body-parser');

// Webhook configuration
const WEBHOOK_SECRET = 'your_webhook_secret_here';
const WEBHOOK_PORT = 3000;
const WEBHOOK_URL = `https://your-domain.com/webhooks/jewelmusic`;

async function setupWebhooksExample() {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  try {
    console.log('🔗 Setting up JewelMusic webhooks...\n');

    // 1. Create a webhook endpoint
    console.log('📝 Creating webhook...');
    const webhook = await client.webhooks.create({
      url: WEBHOOK_URL,
      events: [
        'track.uploaded',
        'track.processed',
        'track.failed',
        'analysis.completed',
        'transcription.completed',
        'distribution.submitted',
        'distribution.live',
        'distribution.failed',
        'royalty.payment',
        'user.subscription.updated'
      ],
      secret: WEBHOOK_SECRET,
      active: true,
      description: 'Main application webhook endpoint',
      timeout: 30000,
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        maxBackoffDelay: 60000
      }
    });

    console.log('✅ Webhook created!');
    console.log('Webhook ID:', webhook.id);
    console.log('URL:', webhook.url);
    console.log('Events:', webhook.events.join(', '));

    // 2. Test the webhook
    console.log('\n🧪 Testing webhook...');
    const testResult = await client.webhooks.test(webhook.id, 'track.uploaded');
    
    console.log('✅ Webhook test result:');
    console.log('Success:', testResult.success);
    console.log('Response status:', testResult.responseStatus);
    console.log('Response time:', testResult.responseTime + 'ms');

    // 3. Get webhook statistics
    console.log('\n📊 Getting webhook statistics...');
    const stats = await client.webhooks.getStatistics(webhook.id, {
      period: 'last_7_days',
      groupBy: 'day'
    });

    console.log('✅ Webhook statistics:');
    console.log('Total deliveries:', stats.totalDeliveries);
    console.log('Success rate:', (stats.successRate * 100).toFixed(1) + '%');
    console.log('Average response time:', stats.averageResponseTime + 'ms');

    // 4. List all webhooks
    console.log('\n📋 Listing all webhooks...');
    const webhooks = await client.webhooks.list({
      active: true,
      perPage: 10
    });

    console.log('✅ Found', webhooks.pagination.total, 'active webhooks');
    webhooks.items.forEach(wh => {
      console.log(`- ${wh.description || 'Unnamed'}: ${wh.events.length} events`);
    });

    return webhook;

  } catch (error) {
    console.error('\n❌ Error setting up webhooks:', error.message);
    throw error;
  }
}

// Express webhook server
function createWebhookServer() {
  const app = express();

  // Use raw body parser for webhook signature verification
  app.use('/webhooks/jewelmusic', bodyParser.raw({ type: 'application/json' }));
  app.use(bodyParser.json());

  // Webhook endpoint
  app.post('/webhooks/jewelmusic', (req, res) => {
    try {
      // Get signature from headers
      const signature = req.headers['x-jewelmusic-signature'];
      
      if (!signature) {
        console.log('❌ Missing webhook signature');
        return res.status(401).send('Missing signature');
      }

      // Verify signature
      const isValid = WebhooksResource.verifySignature(
        req.body,
        signature,
        WEBHOOK_SECRET,
        300 // 5 minute tolerance
      );

      if (!isValid) {
        console.log('❌ Invalid webhook signature');
        return res.status(401).send('Invalid signature');
      }

      // Parse the event
      const event = WebhooksResource.parseEvent(req.body);
      
      console.log(`📨 Received webhook: ${event.type}`);
      console.log('Event ID:', event.id);
      console.log('Timestamp:', event.timestamp);

      // Handle different event types
      handleWebhookEvent(event);

      // Respond with 200 to acknowledge receipt
      res.status(200).send('OK');

    } catch (error) {
      console.error('❌ Error processing webhook:', error.message);
      res.status(400).send('Bad Request');
    }
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Start server
  const server = app.listen(WEBHOOK_PORT, () => {
    console.log(`🌐 Webhook server running on port ${WEBHOOK_PORT}`);
    console.log(`Webhook URL: http://localhost:${WEBHOOK_PORT}/webhooks/jewelmusic`);
  });

  return server;
}

// Event handler function
async function handleWebhookEvent(event) {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  try {
    switch (event.type) {
      case 'track.uploaded':
        console.log('🎵 Track uploaded:', event.data.track.title);
        console.log('Artist:', event.data.track.artist);
        console.log('Duration:', event.data.track.duration + 's');
        
        // Automatically start analysis
        console.log('🔍 Starting automatic analysis...');
        await client.analysis.uploadTrack(event.data.track.fileUrl, {
          analysisTypes: ['tempo', 'key', 'structure', 'quality'],
          detailedReport: true
        });
        break;

      case 'track.processed':
        console.log('✅ Track processing completed:', event.data.track.title);
        console.log('Status:', event.data.track.status);
        
        // Start transcription if it's a vocal track
        if (event.data.track.hasVocals) {
          console.log('🎤 Starting transcription...');
          await client.transcription.create(event.data.track.id, {
            languages: ['en'],
            includeTimestamps: true,
            speakerDiarization: true
          });
        }
        break;

      case 'track.failed':
        console.log('❌ Track processing failed:', event.data.track.title);
        console.log('Error:', event.data.error.message);
        console.log('Retry available:', event.data.error.retryable);
        break;

      case 'analysis.completed':
        console.log('🔍 Analysis completed for track:', event.data.track.title);
        console.log('Tempo:', event.data.analysis.tempo.bpm + ' BPM');
        console.log('Key:', event.data.analysis.key.key + ' ' + event.data.analysis.key.mode);
        console.log('Quality score:', event.data.analysis.quality.overallScore);
        
        // Send quality alerts if needed
        if (event.data.analysis.quality.overallScore < 0.7) {
          console.log('⚠️ Low quality score detected - consider remastering');
        }
        break;

      case 'transcription.completed':
        console.log('📝 Transcription completed for track:', event.data.track.title);
        console.log('Language detected:', event.data.transcription.language);
        console.log('Confidence:', event.data.transcription.confidence);
        console.log('Text preview:', event.data.transcription.text.substring(0, 100) + '...');
        
        // Automatically enhance lyrics
        console.log('✨ Enhancing lyrics...');
        await client.transcription.enhanceLyrics(
          event.data.transcription.text,
          {
            improveMeter: true,
            enhanceRhyming: true,
            adjustTone: 'professional'
          }
        );
        break;

      case 'distribution.submitted':
        console.log('📡 Distribution submitted for release:', event.data.release.title);
        console.log('Platforms:', event.data.submission.platforms.join(', '));
        console.log('Expected live date:', event.data.submission.expectedLiveDate);
        break;

      case 'distribution.live':
        console.log('🎉 Release is now live:', event.data.release.title);
        console.log('Platforms:', event.data.platforms.map(p => p.name).join(', '));
        console.log('Links:', event.data.platforms.map(p => p.url).join('\n'));
        
        // Start analytics tracking
        console.log('📊 Starting analytics tracking...');
        break;

      case 'distribution.failed':
        console.log('❌ Distribution failed for release:', event.data.release.title);
        console.log('Failed platforms:', event.data.failures.map(f => f.platform).join(', '));
        console.log('Reasons:', event.data.failures.map(f => f.reason).join(', '));
        break;

      case 'royalty.payment':
        console.log('💰 Royalty payment received');
        console.log('Amount:', event.data.payment.amount + ' ' + event.data.payment.currency);
        console.log('Period:', event.data.payment.period);
        console.log('Platform:', event.data.payment.platform);
        break;

      case 'user.subscription.updated':
        console.log('📋 Subscription updated');
        console.log('New plan:', event.data.subscription.plan);
        console.log('Status:', event.data.subscription.status);
        console.log('Next billing:', event.data.subscription.nextBillingDate);
        break;

      default:
        console.log('🔔 Unhandled event type:', event.type);
        console.log('Data:', JSON.stringify(event.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error handling webhook event:', error.message);
  }
}

// Webhook management functions
async function manageWebhookDeliveries() {
  const client = new JewelMusic({
    apiKey: process.env.JEWELMUSIC_API_KEY,
    environment: 'sandbox'
  });

  try {
    console.log('📦 Managing webhook deliveries...\n');

    // Get all webhooks
    const webhooks = await client.webhooks.list();
    const webhook = webhooks.items[0]; // Use first webhook

    if (!webhook) {
      console.log('No webhooks found');
      return;
    }

    // Get delivery history
    console.log('📋 Getting delivery history...');
    const deliveries = await client.webhooks.getDeliveries(webhook.id, {
      page: 1,
      perPage: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    console.log('✅ Found', deliveries.pagination.total, 'deliveries');

    // Show recent deliveries
    deliveries.items.slice(0, 5).forEach(delivery => {
      console.log(`- ${delivery.eventType}: ${delivery.status} (${delivery.responseStatus})`);
      console.log(`  Attempts: ${delivery.attempts}, Last attempt: ${delivery.lastAttemptAt}`);
    });

    // Get failed deliveries
    const failedDeliveries = await client.webhooks.getDeliveries(webhook.id, {
      status: 'failed',
      perPage: 5
    });

    if (failedDeliveries.items.length > 0) {
      console.log('\n❌ Failed deliveries found:', failedDeliveries.items.length);
      
      // Retry failed deliveries
      for (const delivery of failedDeliveries.items) {
        console.log(`🔄 Retrying delivery: ${delivery.id}`);
        await client.webhooks.retryDelivery(webhook.id, delivery.id);
      }
    }

    // Get delivery details
    if (deliveries.items.length > 0) {
      const latestDelivery = deliveries.items[0];
      console.log('\n📝 Latest delivery details:');
      
      const deliveryDetails = await client.webhooks.getDelivery(
        webhook.id, 
        latestDelivery.id
      );
      
      console.log('Event type:', deliveryDetails.eventType);
      console.log('Status:', deliveryDetails.status);
      console.log('Response status:', deliveryDetails.response.status);
      console.log('Response time:', deliveryDetails.responseTime + 'ms');
      console.log('Response body:', deliveryDetails.response.body.substring(0, 100));
    }

  } catch (error) {
    console.error('\n❌ Error managing webhook deliveries:', error.message);
    throw error;
  }
}

// Example of creating test signature for development
function createTestSignature(payload, secret, timestamp) {
  const signature = WebhooksResource.createSignature(payload, secret, timestamp);
  console.log('Test signature created:', signature);
  
  // Verify it works
  const isValid = WebhooksResource.verifySignature(payload, signature, secret, 300);
  console.log('Signature validation:', isValid ? '✅ Valid' : '❌ Invalid');
  
  return signature;
}

// Run webhook examples
if (require.main === module) {
  console.log('🔗 JewelMusic Webhook Handling Examples\n');

  // Create and test signature
  const testPayload = JSON.stringify({
    id: 'evt_test_123',
    type: 'track.uploaded',
    timestamp: new Date().toISOString(),
    data: { track: { id: 'track_123', title: 'Test Song' } }
  });

  console.log('🧪 Testing signature creation and verification...');
  createTestSignature(testPayload, WEBHOOK_SECRET);

  // Setup webhooks
  setupWebhooksExample()
    .then((webhook) => {
      console.log('\n📦 Managing webhook deliveries...');
      return manageWebhookDeliveries();
    })
    .then(() => {
      console.log('\n🌐 Starting webhook server...');
      const server = createWebhookServer();
      
      console.log('\n✅ Webhook handling example setup complete!');
      console.log('🔧 To test webhooks:');
      console.log('1. Make sure your webhook URL is publicly accessible');
      console.log('2. Update WEBHOOK_URL with your actual domain');
      console.log('3. Use ngrok for local testing: ngrok http 3000');
      console.log('4. Trigger events by uploading tracks or other actions');
      
      // Graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down webhook server...');
        server.close(() => {
          console.log('✅ Server closed');
          process.exit(0);
        });
      });
    })
    .catch((error) => {
      console.error('\n💥 Webhook handling example failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  setupWebhooksExample,
  createWebhookServer,
  handleWebhookEvent,
  manageWebhookDeliveries,
  createTestSignature
};