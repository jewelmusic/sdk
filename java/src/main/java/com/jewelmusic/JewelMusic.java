package com.jewelmusic;

import com.jewelmusic.resources.*;

/**
 * Main interface for the JewelMusic SDK.
 * <p>
 * This interface defines the contract for accessing all JewelMusic API resources.
 * The SDK provides comprehensive access to AI-powered music generation, analysis,
 * distribution, and management capabilities.
 *
 * @since 1.0.0
 */
public interface JewelMusic {
    
    /**
     * Gets the Copilot resource for AI-powered music generation.
     * <p>
     * The Copilot resource provides access to advanced AI capabilities including:
     * melody generation, harmony creation, lyrics writing, style transfer,
     * and complete song composition.
     *
     * @return The Copilot resource instance
     */
    CopilotResource copilot();
    
    /**
     * Gets the Analysis resource for music analysis and processing.
     * <p>
     * The Analysis resource provides comprehensive audio analysis including:
     * tempo detection, key analysis, spectral analysis, harmonic analysis,
     * and structural analysis.
     *
     * @return The Analysis resource instance
     */
    AnalysisResource analysis();
    
    /**
     * Gets the Distribution resource for music distribution.
     * <p>
     * The Distribution resource handles music distribution to streaming platforms,
     * release management, platform requirements, and revenue tracking.
     *
     * @return The Distribution resource instance
     */
    DistributionResource distribution();
    
    /**
     * Gets the Transcription resource for audio transcription.
     * <p>
     * The Transcription resource provides AI-powered transcription capabilities
     * including speech-to-text, lyrics extraction, and vocal isolation.
     *
     * @return The Transcription resource instance
     */
    TranscriptionResource transcription();
    
    /**
     * Gets the Tracks resource for track management.
     * <p>
     * The Tracks resource handles track upload, metadata management,
     * collections, search, and track organization.
     *
     * @return The Tracks resource instance
     */
    TracksResource tracks();
    
    /**
     * Gets the Analytics resource for performance analytics.
     * <p>
     * The Analytics resource provides comprehensive analytics including
     * streaming metrics, audience insights, revenue tracking, and custom reports.
     *
     * @return The Analytics resource instance
     */
    AnalyticsResource analytics();
    
    /**
     * Gets the User resource for user account management.
     * <p>
     * The User resource handles profile management, preferences, subscriptions,
     * API keys, and account settings.
     *
     * @return The User resource instance
     */
    UserResource user();
    
    /**
     * Gets the Webhooks resource for webhook management.
     * <p>
     * The Webhooks resource handles webhook registration, event handling,
     * delivery tracking, and signature verification.
     *
     * @return The Webhooks resource instance
     */
    WebhooksResource webhooks();
}