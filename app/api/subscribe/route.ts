import { NextRequest, NextResponse } from 'next/server';
import type { SubscribeFormData, SubscribeFormErrors } from '@/lib/types';

const COMMUNICATION_FREQUENCIES = ['weekly', 'biweekly', 'urgent_only'];
const WOULD_SHARE_OPTIONS = ['yes', 'maybe', 'no'];

function validate(body: Partial<SubscribeFormData>): SubscribeFormErrors {
    const errors: SubscribeFormErrors = {};

    if (!body.email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.email = 'Email must be a valid email address';
    } else if (body.email.length > 255) {
        errors.email = 'The email must not be greater than 255 characters.';
    }

    if (!body.phone) {
        errors.phone = 'Mobile phone number is required';
    } else if (body.phone.length > 20) {
        errors.phone = 'The phone must not be greater than 20 characters.';
    }

    if (!body.communication_frequency) {
        errors.communication_frequency = 'Please select a communication frequency';
    } else if (!COMMUNICATION_FREQUENCIES.includes(body.communication_frequency)) {
        errors.communication_frequency = 'Invalid communication frequency selected';
    }

    if (!body.discovery_source) {
        errors.discovery_source = 'Please select where you discovered GGR';
    } else if (body.discovery_source.length > 100) {
        errors.discovery_source = 'The discovery source must not be greater than 100 characters.';
    }

    if (body.discovery_source_other && body.discovery_source_other.length > 255) {
        errors.discovery_source_other = 'The discovery source other must not be greater than 255 characters.';
    }

    if (!body.preferred_platform) {
        errors.preferred_platform = 'Please select your preferred platform';
    } else if (body.preferred_platform.length > 100) {
        errors.preferred_platform = 'The preferred platform must not be greater than 100 characters.';
    }

    const rating = Number(body.satisfaction_rating);
    if (!body.satisfaction_rating) {
        errors.satisfaction_rating = 'Please rate your satisfaction';
    } else if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        errors.satisfaction_rating = 'Rating must be between 1 and 5';
    }

    if (!body.content_preferences || body.content_preferences.length < 1) {
        errors.content_preferences = 'Please select at least one content type';
    }

    if (body.content_preferences_other && body.content_preferences_other.length > 255) {
        errors.content_preferences_other = 'The content preferences other must not be greater than 255 characters.';
    }

    if (!body.would_share) {
        errors.would_share = 'Please indicate if you would share content';
    } else if (!WOULD_SHARE_OPTIONS.includes(body.would_share)) {
        errors.would_share = 'Invalid selection for sharing preference';
    }

    if (!body.consent_agreed) {
        errors.consent_agreed = 'You must agree to the terms to continue';
    }

    return errors;
}

function formatCommunicationFrequency(frequency: string): string {
    switch (frequency) {
        case 'weekly':
            return 'Weekly Updates';
        case 'biweekly':
            return 'Bi-weekly Updates';
        case 'urgent_only':
            return 'Urgent Only';
        default:
            return frequency;
    }
}

function ucwords(value: string): string {
    return value
        .split(' ')
        .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
        .join(' ');
}

function formatDiscoverySource(source: string): string {
    switch (source) {
        case 'instagram':
            return 'Instagram';
        case 'youtube':
            return 'YouTube';
        case 'live_event___performance':
            return 'Live event / performance';
        case 'friend_or_word_of_mouth':
            return 'Friend or word of mouth';
        case 'search__google__etc.':
            return 'Search (Google, etc.)';
        case 'other':
            return 'Other';
        default:
            return ucwords(source.replace(/_/g, ' '));
    }
}

function formatPreferredPlatform(platform: string): string {
    switch (platform) {
        case 'instagram':
            return 'Instagram';
        case 'tiktok':
            return 'TikTok';
        case 'youtube':
            return 'YouTube';
        case 'facebook':
            return 'Facebook';
        case 'x__formally_twitter_':
            return 'X (Formally Twitter)';
        case 'short_form_video__reels___tiktok___shorts_':
            return 'Short-form video';
        case 'long_form_video__youtube_':
            return 'Long-form video';
        case 'live_streams':
            return 'Live Streams';
        default:
            return ucwords(platform.replace(/_/g, ' '));
    }
}

function formatContentPreference(preference: string): string {
    switch (preference) {
        case 'behind_the_scenes_footage':
            return 'Behind-the-scenes footage';
        case 'exclusive_interviews_with_talent':
            return 'Exclusive interviews with talent';
        case 'giveaways_and_contests':
            return 'Giveaways and contests';
        case 'event_highlights_and_recaps':
            return 'Event highlights and recaps';
        case 'upcoming_schedule_previews':
            return 'Upcoming schedule previews';
        case 'fan_spotlights_and_interactions':
            return 'Fan spotlights and interactions';
        case 'other':
            return 'Other';
        default:
            return ucwords(preference.replace(/_/g, ' '));
    }
}

export async function POST(request: NextRequest) {
    const body = (await request.json()) as Partial<SubscribeFormData>;

    const errors = validate(body);
    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors }, { status: 422 });
    }

    const data = body as SubscribeFormData;

    const webhookUrl = process.env.GOOGLE_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error('Google Apps Script webhook URL not configured');
        return NextResponse.json(
            { error: 'We encountered an issue processing your subscription. Please try again later.' },
            { status: 500 }
        );
    }

    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        '';

    const payload = {
        timestamp: new Date().toISOString(),
        email: data.email,
        phone: data.phone,
        communication_frequency: formatCommunicationFrequency(data.communication_frequency),
        discovery_source: formatDiscoverySource(data.discovery_source),
        discovery_source_other: data.discovery_source_other ?? '',
        preferred_platform: formatPreferredPlatform(data.preferred_platform),
        satisfaction_rating: data.satisfaction_rating,
        content_preferences: data.content_preferences.map((pref) => formatContentPreference(pref)).join(', '),
        content_preferences_other: data.content_preferences_other ?? '',
        would_share: data.would_share[0].toUpperCase() + data.would_share.slice(1),
        consent_agreed: data.consent_agreed ? 'Yes' : 'No',
        ip_address: ip,
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            throw new Error(`Google Apps Script returned error: ${await response.text()}`);
        }

        const result = await response.json();

        if (result?.result === 'error') {
            throw new Error(result.error ?? 'Unknown error from Google Sheets');
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for subscribing! You will receive updates based on your preferences.',
        });
    } catch (error) {
        console.error('Failed to send subscription to Google Sheets', error);
        return NextResponse.json(
            { error: 'We encountered an issue processing your subscription. Please try again later.' },
            { status: 500 }
        );
    }
}
